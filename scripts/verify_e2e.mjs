import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = Number(process.env.TEST_PORT || 3010);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const WEBHOOK_PORT = 4099;

const webhookPayloads = [];
const hookServer = http.createServer((req, res) => {
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      webhookPayloads.push(JSON.parse(body));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

async function run() {
  await new Promise((resolve) => hookServer.listen(WEBHOOK_PORT, "127.0.0.1", resolve));
  console.log(`Mock n8n webhook listening on http://127.0.0.1:${WEBHOOK_PORT}`);

  const browser = await chromium.launch();
  const consoleErrors = [];
  const pageErrors = [];

  try {
    // 1. Mobile 375px layout & Interactive Pieces check
    const ctx = await browser.newContext({ viewport: { width: 375, height: 812 } });
    const page = await ctx.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => pageErrors.push(String(err)));

    await page.goto(BASE_URL, { waitUntil: "networkidle" });

    const scrollMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      title: document.title,
      bodyTextLen: document.body.innerText.length,
    }));
    console.log("Mobile 375px metrics:", scrollMetrics);
    if (scrollMetrics.scrollWidth > scrollMetrics.innerWidth) {
      throw new Error(
        `Horizontal overflow detected on 375px: ${scrollMetrics.scrollWidth} > ${scrollMetrics.innerWidth}`
      );
    }

    // Check Piece 1: Hero role tabs
    await page.getByRole("tab", { name: "Líder de equipo" }).click();
    await page.getByText("Asistentes por rol y flujos automáticos conectados").waitFor();

    // Check Piece 4: Tool Constellation interaction
    await page.getByRole("button", { name: /NotebookLM/i }).click();
    await page.getByText("Tu asistente basado en tus propios documentos").waitFor();

    // Check Piece 3: Plan Recommender
    await page.getByRole("button", { name: "Solo yo (individual)" }).click();
    await page.getByRole("button", { name: "A mi ritmo 24/7" }).click();
    await page.getByText(/Nebula · Pregrabado/i).first().waitFor();

    // Check Piece 2: Scroll tracker moves above 0%
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.6));
    await page.waitForTimeout(200);
    const orbitText = await page.getByText(/% órbita/i).innerText();
    console.log("Scroll tracker text after scroll:", orbitText);

    // 2. Test INVALID lead submission (must show error, 0 webhook calls, 0 DB insert)
    await page.locator("#lead-nombre").fill("Prueba Inválida");
    await page.locator("#lead-correo").fill("correo-sin-arroba");
    await page.getByRole("button", { name: /Enviar solicitud/i }).click();
    await page.getByText(/Ingresa un correo electrónico válido/i).waitFor();

    // Also test direct POST to /api/leads with invalid required payload
    const badRes = await page.request.post(`${BASE_URL}/api/leads`, {
      data: { nombre: "A", correo: "malo", programa: "NoExiste" },
    });
    if (badRes.status() !== 400) {
      throw new Error(`Expected 400 on invalid /api/leads POST, got ${badRes.status()}`);
    }
    if (webhookPayloads.length !== 0) {
      throw new Error("Webhook fired on invalid submission!");
    }
    console.log("Invalid submission check PASSED (400 returned, 0 webhooks fired)");

    // 3. Test VALID lead submission from landing form
    await page.locator("#lead-nombre").fill("Valentina Gómez");
    await page.locator("#lead-correo").fill("valentina.gomez@empresa-santander.co");
    await page.locator("#lead-programa").selectOption("Liftoff (12 horas)");
    await page.locator("#lead-telefono").fill("+57 315 800 1234");
    await page.getByRole("button", { name: /Enviar solicitud/i }).click();

    await page.getByText(/¡Recibimos tu solicitud, Valentina Gómez!/i).waitFor();
    await page.waitForTimeout(300);

    if (webhookPayloads.length !== 1) {
      throw new Error(`Expected 1 webhook payload, got ${webhookPayloads.length}`);
    }
    console.log("Webhook payload received:", webhookPayloads[0]);
    if (webhookPayloads[0].nombre !== "Valentina Gómez") {
      throw new Error("Webhook payload nombre mismatch");
    }

    // 4. Test Admin Login, Update status to Contactado + note, reload and verify persistence + history
    await page.goto(`${BASE_URL}/admin`, { waitUntil: "networkidle" });
    if (!page.url().includes("/admin/login")) {
      throw new Error(`Unauthenticated /admin should redirect to /admin/login, got ${page.url()}`);
    }

    await page.locator("#admin-email").fill(process.env.ADMIN_EMAIL || "admin@aiacademy.local");
    await page.locator("#admin-password").fill(process.env.ADMIN_PASSWORD || "Campuslands2026!");
    await page.getByRole("button", { name: /Ingresar al panel/i }).click();
    await page.waitForURL("**/admin");

    await page.getByText("Valentina Gómez").first().waitFor();
    await page.getByRole("button", { name: "Gestionar" }).first().click();

    await page.locator("#edit-estado").selectOption("Contactado");
    const noteContent = "Llamada inicial realizada; interesada en grupo de 8 personas para enero.";
    await page.locator("#new-nota").fill(noteContent);
    await page.getByRole("button", { name: /Guardar seguimiento/i }).click();
    await page.getByText(/Seguimiento actualizado/i).waitFor();

    // Reload page and reopen lead to confirm DB persistence & audit history
    await page.reload({ waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Gestionar" }).first().click();
    const currentStatus = await page.locator("#edit-estado").inputValue();
    if (currentStatus !== "Contactado") {
      throw new Error(`Expected Contactado after reload, got ${currentStatus}`);
    }
    await page.getByText(noteContent).first().waitFor();
    await page.getByText(/Estado actualizado de Nuevo a Contactado/i).waitFor();
    await page.getByText(/Kevin Castillo/i).first().waitFor();

    // Capture verification screenshot for visual review
    const shotDir = path.join(process.cwd(), "verification_shots");
    fs.mkdirSync(shotDir, { recursive: true });
    await page.screenshot({ path: path.join(shotDir, "admin_detail_375.png"), fullPage: false });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(shotDir, "landing_hero_1440.png"), fullPage: false });

    if (consoleErrors.length > 0 || pageErrors.length > 0) {
      throw new Error(`Console/page errors detected: ${JSON.stringify({ consoleErrors, pageErrors })}`);
    }
    console.log("ALL E2E CHECKS PASSED CLEANLY!");
  } finally {
    await browser.close();
    hookServer.close();
  }
}

run().catch((err) => {
  console.error("E2E FAILED:", err);
  process.exit(1);
});
