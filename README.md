# Campuslands AI Academy — Landing + Automatización (Retos 3 y 4)

Rediseño completo de la landing de **Campuslands AI Academy** con narrativa espacial (*«De la Ignición a la Órbita»*), 4 experiencias interactivas nativas, persistencia de solicitudes, aviso automático por **Telegram vía n8n** y **Panel de Administración (`/admin`)** con trazabilidad completa de estado, notas e historial de auditoría.

## Stack técnico

- **Frontend y API:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **Tipografía e identidad:** Únicamente **Poppins** (`next/font/google`), paleta oficial (`#050507`, `#7026E8`, `#9636FF`, `#B783FF`, `#FFFFFF`, `#DCD6EA`, `#8E8998`) y activos oficiales de marca (`public/brand/`).
- **Persistencia dual:**
  - En local (sin `DATABASE_URL`): **SQLite** nativo de Node (`node:sqlite`, archivo `data/leads.sqlite`).
  - En producción (con `DATABASE_URL`): **PostgreSQL** (`pg`, tablas `leads`, `lead_notes` y `lead_history` creadas automáticamente al iniciar).
- **Automatización:** Webhook `POST` hacia **n8n** (`n8n/flujo_n8n_telegram.json`) con validación previa y envío a **Telegram Bot API**.

---

## Cómo correr el proyecto en local

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   Copia `.env.example` a `.env.local` y ajusta los valores de acceso:
   ```bash
   cp .env.example .env.local
   ```
   Variables principales:
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: credenciales del administrador principal.
   - `ADMIN_SECONDARY_EMAIL`, `ADMIN_SECONDARY_PASSWORD`, `ADMIN_SECONDARY_NAME`: segundo administrador para auditar cambios por usuario.
   - `SESSION_SECRET`: cadena aleatoria (≥ 32 caracteres) para firmar la cookie `HttpOnly`.
   - `N8N_WEBHOOK_URL`: URL del webhook de n8n (ej. `http://localhost:5678/webhook/ai-academy-registro`).
   - `DATABASE_URL`: cadena de conexión PostgreSQL (opcional en local; recomendada en Vercel).

3. **Ejecutar en desarrollo o producción:**
   ```bash
   npm run dev
   # o para producción:
   npm run build && npm run start
   ```
   - Landing: `http://localhost:3000`
   - Panel de seguimiento: `http://localhost:3000/admin`

---

## Cómo conectar n8n y Telegram

1. Levanta n8n localmente (opcional con Docker):
   ```bash
   TELEGRAM_CHAT_ID=TU_CHAT_ID docker compose -f docker-compose.n8n.yml up -d
   ```
2. Abre `http://localhost:5678`, importa el archivo [`n8n/flujo_n8n_telegram.json`](n8n/flujo_n8n_telegram.json).
3. En el nodo **Enviar Aviso Telegram**, selecciona/crea tu credencial de Bot de Telegram (`@BotFather`) y verifica la variable `TELEGRAM_CHAT_ID` (o escribe tu chat ID en la configuración de n8n).
4. Activa el flujo en n8n y copia la **Production URL** del nodo Webhook en `N8N_WEBHOOK_URL` dentro de `.env.local` (o en las Environment Variables de Vercel si n8n está público).

---

## Verificación automática (E2E)

Con el servidor corriendo o compilado:
```bash
node scripts/verify_e2e.mjs
```
Valida automáticamente vista móvil `375px`, las 4 piezas interactivas, rechazo de registros inválidos (sin crear registro ni disparar webhook), creación de registro válido + disparo de webhook, inicio de sesión en `/admin` y actualización de estado + nota + persistencia del historial de auditoría.
