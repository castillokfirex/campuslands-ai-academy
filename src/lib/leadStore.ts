import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Pool } from "pg";
import type { ProgramOption } from "@/data/academyContent";
import type {
  LeadHistoryEntry,
  LeadNote,
  LeadRecord,
  LeadStatus,
  ValidatedLeadInput,
} from "./validation";

export interface LeadStore {
  createLead(input: ValidatedLeadInput): Promise<LeadRecord>;
  markTelegramNotified(id: string): Promise<void>;
  listLeads(filterStatus?: string, search?: string): Promise<LeadRecord[]>;
  getLeadById(id: string): Promise<LeadRecord | null>;
  updateLeadFollowUp(params: {
    id: string;
    estado?: LeadStatus;
    nota?: string;
    actorName: string;
    actorEmail: string;
  }): Promise<LeadRecord | null>;
}

interface SqliteStatementSync {
  run(...params: unknown[]): unknown;
  get(...params: unknown[]): Record<string, unknown> | undefined;
  all(...params: unknown[]): Record<string, unknown>[];
}

interface SqliteDatabaseSync {
  exec(sql: string): void;
  prepare(sql: string): SqliteStatementSync;
}

function getSqliteDbPath(): string {
  const custom = process.env.SQLITE_DB_PATH?.trim();
  if (custom) return custom;
  if (process.env.VERCEL === "1") {
    return "/tmp/campuslands_leads.sqlite";
  }
  return path.join(process.cwd(), "data", "leads.sqlite");
}

function loadSqliteModule(): { DatabaseSync: new (p: string) => SqliteDatabaseSync } {
  const builtin = (
    process as unknown as {
      getBuiltinModule?: (id: string) => unknown;
    }
  ).getBuiltinModule?.("node:sqlite");
  if (builtin) {
    return builtin as { DatabaseSync: new (p: string) => SqliteDatabaseSync };
  }
  throw new Error("node:sqlite is unavailable in this Node runtime");
}

function rowToLead(
  row: Record<string, unknown>,
  notes: LeadNote[],
  history: LeadHistoryEntry[]
): LeadRecord {
  return {
    id: String(row.id),
    nombre: String(row.nombre),
    correo: String(row.correo),
    telefono: row.telefono ? String(row.telefono) : null,
    programa: String(row.programa) as ProgramOption,
    estado: String(row.estado) as LeadStatus,
    notas: notes,
    historial: history,
    telegramNotified: Boolean(row.telegram_notified),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
  };
}

class SqliteLeadStore implements LeadStore {
  private db: SqliteDatabaseSync;

  constructor() {
    const dbPath = getSqliteDbPath();
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    const { DatabaseSync } = loadSqliteModule();
    this.db = new DatabaseSync(dbPath);
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS leads (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        correo TEXT NOT NULL,
        telefono TEXT,
        programa TEXT NOT NULL,
        estado TEXT NOT NULL,
        telegram_notified INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS lead_notes (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        contenido TEXT NOT NULL,
        autor TEXT NOT NULL,
        fecha TEXT NOT NULL,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS lead_history (
        id TEXT PRIMARY KEY,
        lead_id TEXT NOT NULL,
        accion TEXT NOT NULL,
        campo TEXT,
        valor_anterior TEXT,
        valor_nuevo TEXT,
        detalle TEXT,
        usuario TEXT NOT NULL,
        fecha TEXT NOT NULL,
        FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
      );
    `);
  }

  private getChildren(leadId: string): {
    notes: LeadNote[];
    history: LeadHistoryEntry[];
  } {
    const noteRows = this.db
      .prepare(
        `SELECT id, contenido, autor, fecha FROM lead_notes WHERE lead_id = ? ORDER BY fecha DESC`
      )
      .all(leadId);
    const histRows = this.db
      .prepare(
        `SELECT id, accion, campo, valor_anterior, valor_nuevo, detalle, usuario, fecha FROM lead_history WHERE lead_id = ? ORDER BY fecha DESC`
      )
      .all(leadId);

    return {
      notes: noteRows.map((r) => ({
        id: String(r.id),
        contenido: String(r.contenido),
        autor: String(r.autor),
        fecha: String(r.fecha),
      })),
      history: histRows.map((r) => ({
        id: String(r.id),
        accion: String(r.accion),
        campo: r.campo ? String(r.campo) : undefined,
        valorAnterior: r.valor_anterior ? String(r.valor_anterior) : null,
        valorNuevo: r.valor_nuevo ? String(r.valor_nuevo) : null,
        detalle: r.detalle ? String(r.detalle) : undefined,
        usuario: String(r.usuario),
        fecha: String(r.fecha),
      })),
    };
  }

  async createLead(input: ValidatedLeadInput): Promise<LeadRecord> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const histId = crypto.randomUUID();

    this.db
      .prepare(
        `INSERT INTO leads (id, nombre, correo, telefono, programa, estado, telegram_notified, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 'Nuevo', 0, ?, ?)`
      )
      .run(id, input.nombre, input.correo, input.telefono, input.programa, now, now);

    this.db
      .prepare(
        `INSERT INTO lead_history (id, lead_id, accion, campo, valor_anterior, valor_nuevo, detalle, usuario, fecha)
         VALUES (?, ?, 'Registro creado desde la landing', 'estado', NULL, 'Nuevo', ?, 'Formulario Web', ?)`
      )
      .run(histId, id, `Programa: ${input.programa}`, now);

    return (await this.getLeadById(id))!;
  }

  async markTelegramNotified(id: string): Promise<void> {
    this.db
      .prepare(`UPDATE leads SET telegram_notified = 1 WHERE id = ?`)
      .run(id);
  }

  async listLeads(filterStatus?: string, search?: string): Promise<LeadRecord[]> {
    const rows = this.db
      .prepare(`SELECT * FROM leads ORDER BY created_at DESC`)
      .all();
    const s = search?.trim().toLowerCase() || "";
    const filtered = rows.filter((r) => {
      if (filterStatus && filterStatus !== "Todos" && r.estado !== filterStatus) {
        return false;
      }
      if (s) {
        const hay = `${r.nombre} ${r.correo} ${r.programa} ${r.telefono || ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });

    return filtered.map((r) => {
      const { notes, history } = this.getChildren(String(r.id));
      return rowToLead(r, notes, history);
    });
  }

  async getLeadById(id: string): Promise<LeadRecord | null> {
    const row = this.db.prepare(`SELECT * FROM leads WHERE id = ?`).get(id);
    if (!row) return null;
    const { notes, history } = this.getChildren(id);
    return rowToLead(row, notes, history);
  }

  async updateLeadFollowUp(params: {
    id: string;
    estado?: LeadStatus;
    nota?: string;
    actorName: string;
    actorEmail: string;
  }): Promise<LeadRecord | null> {
    const existing = await this.getLeadById(params.id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const actor = `${params.actorName} (${params.actorEmail})`;
    const nextEstado = params.estado ?? existing.estado;
    const trimmedNote = params.nota?.trim() || "";

    if (params.estado && params.estado !== existing.estado) {
      this.db
        .prepare(`UPDATE leads SET estado = ?, updated_at = ? WHERE id = ?`)
        .run(params.estado, now, params.id);
      this.db
        .prepare(
          `INSERT INTO lead_history (id, lead_id, accion, campo, valor_anterior, valor_nuevo, detalle, usuario, fecha)
           VALUES (?, ?, 'Cambio de estado', 'estado', ?, ?, ?, ?, ?)`
        )
        .run(
          crypto.randomUUID(),
          params.id,
          existing.estado,
          params.estado,
          `Estado actualizado de ${existing.estado} a ${params.estado}`,
          actor,
          now
        );
    }

    if (trimmedNote) {
      this.db
        .prepare(
          `INSERT INTO lead_notes (id, lead_id, contenido, autor, fecha) VALUES (?, ?, ?, ?, ?)`
        )
        .run(crypto.randomUUID(), params.id, trimmedNote, actor, now);
      this.db
        .prepare(`UPDATE leads SET updated_at = ? WHERE id = ?`)
        .run(now, params.id);
      this.db
        .prepare(
          `INSERT INTO lead_history (id, lead_id, accion, campo, valor_anterior, valor_nuevo, detalle, usuario, fecha)
           VALUES (?, ?, 'Nota añadida', 'nota', NULL, ?, ?, ?, ?)`
        )
        .run(
          crypto.randomUUID(),
          params.id,
          trimmedNote,
          `Nota agregada mientras el estado es ${nextEstado}`,
          actor,
          now
        );
    }

    return this.getLeadById(params.id);
  }
}

class PgLeadStore implements LeadStore {
  private pool: Pool;
  private initPromise: Promise<void> | null = null;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: connectionString.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    });
  }

  private async ensureSchema(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = (async () => {
        await this.pool.query(`
          CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            nombre TEXT NOT NULL,
            correo TEXT NOT NULL,
            telefono TEXT,
            programa TEXT NOT NULL,
            estado TEXT NOT NULL,
            telegram_notified BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
          );
          CREATE TABLE IF NOT EXISTS lead_notes (
            id TEXT PRIMARY KEY,
            lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
            contenido TEXT NOT NULL,
            autor TEXT NOT NULL,
            fecha TEXT NOT NULL
          );
          CREATE TABLE IF NOT EXISTS lead_history (
            id TEXT PRIMARY KEY,
            lead_id TEXT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
            accion TEXT NOT NULL,
            campo TEXT,
            valor_anterior TEXT,
            valor_nuevo TEXT,
            detalle TEXT,
            usuario TEXT NOT NULL,
            fecha TEXT NOT NULL
          );
        `);
      })();
    }
    await this.initPromise;
  }

  private async getChildren(leadId: string): Promise<{
    notes: LeadNote[];
    history: LeadHistoryEntry[];
  }> {
    const [noteRes, histRes] = await Promise.all([
      this.pool.query(
        `SELECT id, contenido, autor, fecha FROM lead_notes WHERE lead_id = $1 ORDER BY fecha DESC`,
        [leadId]
      ),
      this.pool.query(
        `SELECT id, accion, campo, valor_anterior, valor_nuevo, detalle, usuario, fecha FROM lead_history WHERE lead_id = $1 ORDER BY fecha DESC`,
        [leadId]
      ),
    ]);

    return {
      notes: noteRes.rows.map((r) => ({
        id: String(r.id),
        contenido: String(r.contenido),
        autor: String(r.autor),
        fecha: String(r.fecha),
      })),
      history: histRes.rows.map((r) => ({
        id: String(r.id),
        accion: String(r.accion),
        campo: r.campo ? String(r.campo) : undefined,
        valorAnterior: r.valor_anterior ? String(r.valor_anterior) : null,
        valorNuevo: r.valor_nuevo ? String(r.valor_nuevo) : null,
        detalle: r.detalle ? String(r.detalle) : undefined,
        usuario: String(r.usuario),
        fecha: String(r.fecha),
      })),
    };
  }

  async createLead(input: ValidatedLeadInput): Promise<LeadRecord> {
    await this.ensureSchema();
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await this.pool.query(
      `INSERT INTO leads (id, nombre, correo, telefono, programa, estado, telegram_notified, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'Nuevo', FALSE, $6, $7)`,
      [id, input.nombre, input.correo, input.telefono, input.programa, now, now]
    );

    await this.pool.query(
      `INSERT INTO lead_history (id, lead_id, accion, campo, valor_anterior, valor_nuevo, detalle, usuario, fecha)
       VALUES ($1, $2, 'Registro creado desde la landing', 'estado', NULL, 'Nuevo', $3, 'Formulario Web', $4)`,
      [crypto.randomUUID(), id, `Programa: ${input.programa}`, now]
    );

    return (await this.getLeadById(id))!;
  }

  async markTelegramNotified(id: string): Promise<void> {
    await this.ensureSchema();
    await this.pool.query(
      `UPDATE leads SET telegram_notified = TRUE WHERE id = $1`,
      [id]
    );
  }

  async listLeads(filterStatus?: string, search?: string): Promise<LeadRecord[]> {
    await this.ensureSchema();
    const res = await this.pool.query(
      `SELECT * FROM leads ORDER BY created_at DESC`
    );
    const s = search?.trim().toLowerCase() || "";
    const filtered = res.rows.filter((r) => {
      if (filterStatus && filterStatus !== "Todos" && r.estado !== filterStatus) {
        return false;
      }
      if (s) {
        const hay = `${r.nombre} ${r.correo} ${r.programa} ${r.telefono || ""}`.toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });

    return Promise.all(
      filtered.map(async (r) => {
        const { notes, history } = await this.getChildren(String(r.id));
        return rowToLead(r, notes, history);
      })
    );
  }

  async getLeadById(id: string): Promise<LeadRecord | null> {
    await this.ensureSchema();
    const res = await this.pool.query(`SELECT * FROM leads WHERE id = $1`, [id]);
    if (res.rows.length === 0) return null;
    const { notes, history } = await this.getChildren(id);
    return rowToLead(res.rows[0], notes, history);
  }

  async updateLeadFollowUp(params: {
    id: string;
    estado?: LeadStatus;
    nota?: string;
    actorName: string;
    actorEmail: string;
  }): Promise<LeadRecord | null> {
    await this.ensureSchema();
    const existing = await this.getLeadById(params.id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const actor = `${params.actorName} (${params.actorEmail})`;
    const nextEstado = params.estado ?? existing.estado;
    const trimmedNote = params.nota?.trim() || "";

    if (params.estado && params.estado !== existing.estado) {
      await this.pool.query(
        `UPDATE leads SET estado = $1, updated_at = $2 WHERE id = $3`,
        [params.estado, now, params.id]
      );
      await this.pool.query(
        `INSERT INTO lead_history (id, lead_id, accion, campo, valor_anterior, valor_nuevo, detalle, usuario, fecha)
         VALUES ($1, $2, 'Cambio de estado', 'estado', $3, $4, $5, $6, $7)`,
        [
          crypto.randomUUID(),
          params.id,
          existing.estado,
          params.estado,
          `Estado actualizado de ${existing.estado} a ${params.estado}`,
          actor,
          now,
        ]
      );
    }

    if (trimmedNote) {
      await this.pool.query(
        `INSERT INTO lead_notes (id, lead_id, contenido, autor, fecha) VALUES ($1, $2, $3, $4, $5)`,
        [crypto.randomUUID(), params.id, trimmedNote, actor, now]
      );
      await this.pool.query(
        `UPDATE leads SET updated_at = $1 WHERE id = $2`,
        [now, params.id]
      );
      await this.pool.query(
        `INSERT INTO lead_history (id, lead_id, accion, campo, valor_anterior, valor_nuevo, detalle, usuario, fecha)
         VALUES ($1, $2, 'Nota añadida', 'nota', NULL, $3, $4, $5, $6)`,
        [
          crypto.randomUUID(),
          params.id,
          trimmedNote,
          `Nota agregada mientras el estado es ${nextEstado}`,
          actor,
          now,
        ]
      );
    }

    return this.getLeadById(params.id);
  }
}

const globalForStore = globalThis as unknown as {
  __aiAcademyLeadStore?: LeadStore;
};

export function getLeadStore(): LeadStore {
  if (!globalForStore.__aiAcademyLeadStore) {
    const pgUrl = process.env.DATABASE_URL?.trim();
    globalForStore.__aiAcademyLeadStore = pgUrl
      ? new PgLeadStore(pgUrl)
      : new SqliteLeadStore();
  }
  return globalForStore.__aiAcademyLeadStore;
}
