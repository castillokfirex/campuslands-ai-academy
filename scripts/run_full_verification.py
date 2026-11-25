import http.server
import json
import os
import subprocess
import sys
import threading
import time
import urllib.request
from pathlib import Path
from playwright.sync_api import sync_playwright

PROJ = Path(r"C:\Users\kevic\.gemini\antigravity\scratch\campuslands-ai-academy")
SHOTS = PROJ / "verification_shots"
SHOTS.mkdir(exist_ok=True)
DB_TEST_PATH = PROJ / "data" / "e2e_test.sqlite"
if DB_TEST_PATH.exists():
    DB_TEST_PATH.unlink()

PORT = 3010
BASE_URL = f"http://127.0.0.1:{PORT}"
WEBHOOK_PORT = 4099
webhook_payloads = []


class MockHookHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length).decode("utf-8")
        webhook_payloads.append(json.loads(raw))
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

    def log_message(self, format, *args):
        pass


hook_server = http.server.HTTPServer(("127.0.0.1", WEBHOOK_PORT), MockHookHandler)
hook_thread = threading.Thread(target=hook_server.serve_forever, daemon=True)
hook_thread.start()

env = os.environ.copy()
env["N8N_WEBHOOK_URL"] = f"http://127.0.0.1:{WEBHOOK_PORT}/webhook"
env["SQLITE_DB_PATH"] = str(DB_TEST_PATH)
env["ADMIN_EMAIL"] = "admin@aiacademy.local"
env["ADMIN_PASSWORD"] = "Campuslands2026!"
env["ADMIN_NAME"] = "Kevin Castillo"
env["NODE_ENV"] = "production"

proc = subprocess.Popen(
    ["npm.cmd", "run", "start", "--", "-p", str(PORT)],
    cwd=str(PROJ),
    env=env,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
)

try:
    ready = False
    for _ in range(45):
        try:
            with urllib.request.urlopen(BASE_URL, timeout=2) as r:
                if r.status == 200:
                    ready = True
                    break
        except Exception:
            time.sleep(0.5)
    if not ready:
        out, _ = proc.communicate(timeout=3)
        raise RuntimeError(f"Server failed to start:\n{out}")

    print("Next.js production server ready on", BASE_URL)

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(viewport={"width": 375, "height": 812})
        page = ctx.new_page()

        console_errors = []
        page_errors = []
        page.on("console", lambda m: console_errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        page.goto(BASE_URL, wait_until="networkidle")
        page.evaluate("() => document.fonts.ready")

        metrics = page.evaluate("""() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
            title: document.title,
            hasIAWrong: document.body.innerText.includes('IA Academy')
        })""")
        print("Mobile 375px metrics:", metrics)
        assert metrics["scrollWidth"] <= metrics["innerWidth"], f"Overflow: {metrics}"
        assert not metrics["hasIAWrong"], "Found 'IA Academy' in rendered DOM!"

        page.screenshot(path=str(SHOTS / "landing_mobile_375.png"), full_page=False)

        # Piece 1: Hero role tabs
        page.get_by_role("tab", name="Líder de equipo").click()
        page.get_by_text("Asistentes por rol y flujos automáticos conectados").wait_for()

        # Piece 4: Tool Constellation
        page.get_by_role("button", name="NotebookLM").click()
        page.get_by_text("Tu asistente basado en tus propios documentos").wait_for()

        # Piece 3: Plan Recommender
        page.get_by_role("button", name="Solo yo (individual)").click()
        page.get_by_role("button", name="A mi ritmo 24/7").click()
        page.get_by_text("Nebula · Pregrabado (Órbita)").wait_for()

        # Piece 2: Scroll tracker
        page.evaluate("() => window.scrollTo(0, document.body.scrollHeight * 0.6)")
        page.wait_for_timeout(250)
        orbit_text = page.get_by_text("% órbita").inner_text()
        print("Scroll tracker:", orbit_text)

        # Test invalid submission (must block DB + webhook)
        page.locator("#lead-nombre").fill("Prueba Inválida")
        page.locator("#lead-correo").fill("correo-sin-arroba")
        page.get_by_role("button", name="Enviar solicitud").click()
        page.get_by_text("Ingresa un correo electrónico válido.").wait_for()
        page.screenshot(path=str(SHOTS / "landing_invalid_form.png"), full_page=False)

        bad_res = page.request.post(
            f"{BASE_URL}/api/leads",
            data={"nombre": "A", "correo": "malo", "programa": "NoExiste"},
        )
        assert bad_res.status == 400, f"Expected 400, got {bad_res.status}"
        assert len(webhook_payloads) == 0, "Webhook fired on invalid submission!"
        print("Invalid submission rejection PASSED (0 webhooks, 400 API)")

        # Test valid submission
        page.locator("#lead-nombre").fill("Valentina Gómez")
        page.locator("#lead-correo").fill("valentina.gomez@empresa-santander.co")
        page.locator("#lead-programa").select_option("Liftoff (12 horas)")
        page.locator("#lead-telefono").fill("+57 315 800 1234")
        page.get_by_role("button", name="Enviar solicitud").click()
        page.get_by_text("¡Recibimos tu solicitud, Valentina Gómez!").wait_for()
        page.wait_for_timeout(300)
        page.screenshot(path=str(SHOTS / "landing_confirmed.png"), full_page=False)

        assert len(webhook_payloads) == 1, f"Expected 1 webhook, got {len(webhook_payloads)}"
        print("Webhook payload verified:", webhook_payloads[0])

        # Test Admin redirect + login + state/note update + reload persistence
        page.goto(f"{BASE_URL}/admin", wait_until="networkidle")
        assert "/admin/login" in page.url, f"Expected redirect to login, got {page.url}"

        page.locator("#admin-email").fill("admin@aiacademy.local")
        page.locator("#admin-password").fill("Campuslands2026!")
        page.get_by_role("button", name="Ingresar al panel").click()
        page.wait_for_url("**/admin")

        page.get_by_text("Valentina Gómez").first.wait_for()
        page.get_by_role("button", name="Gestionar").first.click()
        page.locator("#edit-estado").select_option("Contactado")
        note = "Llamada inicial realizada; interesada en grupo de 8 personas para enero."
        page.locator("#new-nota").fill(note)
        page.get_by_role("button", name="Guardar seguimiento").click()
        page.get_by_text("Seguimiento actualizado").wait_for()

        page.reload(wait_until="networkidle")
        page.get_by_role("button", name="Gestionar").first.click()
        assert page.locator("#edit-estado").input_value() == "Contactado"
        page.get_by_text(note).first.wait_for()
        page.get_by_text("Estado actualizado de Nuevo a Contactado").wait_for()
        page.get_by_text("Kevin Castillo").first.wait_for()

        # Desktop shots
        page.set_viewport_size({"width": 1440, "height": 900})
        page.screenshot(path=str(SHOTS / "admin_audit_drawer.png"), full_page=False)
        page.goto(BASE_URL, wait_until="networkidle")
        page.screenshot(path=str(SHOTS / "landing_desktop.png"), full_page=False)

        assert len(console_errors) == 0, f"Console errors: {console_errors}"
        assert len(page_errors) == 0, f"Page errors: {page_errors}"
        print("ALL E2E CHECKS PASSED WITH 0 CONSOLE ERRORS!")
        browser.close()
finally:
    subprocess.run(
        ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    hook_server.shutdown()
    time.sleep(0.5)
    for suffix in ["", "-wal", "-shm"]:
        fp = Path(str(DB_TEST_PATH) + suffix)
        if fp.exists():
            try:
                fp.unlink()
            except Exception:
                pass
