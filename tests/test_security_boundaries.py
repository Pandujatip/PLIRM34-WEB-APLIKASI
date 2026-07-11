from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import threading
import unittest
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen


PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

import server


class StaticBoundaryTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.httpd = server.ThreadingHTTPServer(("127.0.0.1", 0), server.PLIRMRequestHandler)
        cls.thread = threading.Thread(target=cls.httpd.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.httpd.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.httpd.shutdown()
        cls.httpd.server_close()
        cls.thread.join(timeout=5)

    def request_status(self, path: str, method: str = "GET") -> int:
        try:
            request = Request(f"{self.base_url}{path}", method=method)
            with urlopen(request, timeout=5) as response:
                response.read()
                return response.status
        except HTTPError as error:
            error.read()
            return error.code

    def request_headers(self, path: str, method: str = "GET"):
        request = Request(f"{self.base_url}{path}", method=method)
        with urlopen(request, timeout=5) as response:
            response.read()
            return response.headers

    def test_public_shell_assets_are_available(self):
        self.assertEqual(self.request_status("/"), 200)
        self.assertEqual(self.request_status("/index.html"), 200)
        self.assertEqual(self.request_status("/styles.css"), 200)
        self.assertEqual(self.request_status("/app.bootstrap.js"), 200)
        self.assertEqual(self.request_status("/service-worker.js"), 200)

    def test_sensitive_and_source_files_are_not_static(self):
        for path in (
            "/plirm34.db",
            "/whatsapp-bot-runtime.json",
            "/whatsapp-bot-status.json",
            "/server.py",
            "/pythonanywhere_wsgi.py",
            "/native-android/plirm34-debug.keystore",
            "/.git/config",
            "/pwa-icons/%2e%2e/server.py",
        ):
            with self.subTest(path=path):
                self.assertEqual(self.request_status(path), 404)

    def test_head_cannot_probe_sensitive_files(self):
        self.assertEqual(self.request_status("/styles.css", method="HEAD"), 200)
        self.assertEqual(self.request_status("/plirm34.db", method="HEAD"), 404)
        self.assertEqual(self.request_status("/whatsapp-bot-runtime.json", method="HEAD"), 404)

    def test_shell_revalidates_while_versioned_assets_are_immutable(self):
        shell_headers = self.request_headers("/")
        worker_headers = self.request_headers("/service-worker.js")
        versioned_headers = self.request_headers("/app.bootstrap.js?v=20260711-02")
        self.assertEqual(shell_headers.get("Cache-Control"), "no-cache, no-store, must-revalidate")
        self.assertEqual(worker_headers.get("Cache-Control"), "no-cache, no-store, must-revalidate")
        self.assertEqual(versioned_headers.get("Cache-Control"), "public, max-age=31536000, immutable")

    def test_private_data_directory_is_outside_application_root(self):
        with self.assertRaises(ValueError):
            server.DATA_DIR.relative_to(server.ROOT_DIR)


class WsgiEntrypointTests(unittest.TestCase):
    def test_wsgi_imports_and_applies_static_allowlist(self):
        script = r"""
import io
import json
import pythonanywhere_wsgi as wsgi

def request(path):
    captured = {}
    def start_response(status, headers):
        captured["status"] = int(status.split(" ", 1)[0])
        captured["headers"] = dict(headers)
    environ = {
        "REQUEST_METHOD": "GET",
        "PATH_INFO": path,
        "QUERY_STRING": "",
        "CONTENT_LENGTH": "0",
        "wsgi.input": io.BytesIO(b""),
    }
    body = b"".join(wsgi.application(environ, start_response))
    return captured["status"], captured["headers"], body

checks = {
    "/": request("/")[0],
    "/styles.css": request("/styles.css")[0],
    "/server.py": request("/server.py")[0],
    "/plirm34.db": request("/plirm34.db")[0],
    "/whatsapp-bot-runtime.json": request("/whatsapp-bot-runtime.json")[0],
}
print(json.dumps(checks, sort_keys=True))
if checks != {
    "/": 200,
    "/styles.css": 200,
    "/server.py": 404,
    "/plirm34.db": 404,
    "/whatsapp-bot-runtime.json": 404,
}:
    raise SystemExit(1)
"""
        with tempfile.TemporaryDirectory() as temporary_directory:
            data_dir = Path(temporary_directory)
            (data_dir / "plirm34.db").touch()
            (data_dir / "whatsapp-bot-runtime.json").write_text("{}", encoding="utf-8")
            environment = os.environ.copy()
            environment["PLIRM34_DATA_DIR"] = str(data_dir)
            environment["PLIRM34_SKIP_LEGACY_MIGRATION"] = "1"
            result = subprocess.run(
                [sys.executable, "-c", script],
                cwd=PROJECT_ROOT,
                env=environment,
                capture_output=True,
                text=True,
                timeout=30,
                check=False,
            )
        self.assertEqual(result.returncode, 0, msg=f"stdout:\n{result.stdout}\nstderr:\n{result.stderr}")


if __name__ == "__main__":
    unittest.main()
