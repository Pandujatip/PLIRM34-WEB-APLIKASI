from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import os
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse


ROOT_DIR = Path(__file__).resolve().parent
DB_PATH = ROOT_DIR / "plirm34.db"
SESSION_COOKIE_NAME = "plirm34_session"
SESSION_DURATION_DAYS = 7
STATE_KEYS = {
    "negatif-list": "negatif_list",
    "sparepart": "sparepart",
    "service": "service",
    "bom": "bom",
    "spb": "spb",
}

RESOURCE_TABLES = {
    "negatif-list": {
        "table": "negatif_list_items",
        "columns": [
            "id",
            "equipment",
            "damage_description",
            "follow_up_plan",
            "found_date",
            "pending_mark",
            "work_status",
            "category",
            "area",
        ],
        "payload_keys": [
            "id",
            "equipment",
            "damageDescription",
            "followUpPlan",
            "foundDate",
            "pendingMark",
            "workStatus",
            "category",
            "area",
        ],
    },
    "sparepart": {
        "table": "sparepart_items",
        "columns": [
            "id",
            "code",
            "name",
            "category",
            "location",
            "qty",
            "condition",
        ],
        "payload_keys": [
            "id",
            "code",
            "name",
            "category",
            "location",
            "qty",
            "condition",
        ],
    },
    "service": {
        "table": "service_items",
        "columns": [
            "id",
            "type",
            "subtype",
            "form_type",
            "equipment_name",
            "description",
            "detail",
            "payload_json",
        ],
        "payload_keys": [
            "id",
            "type",
            "subtype",
            "formType",
            "equipmentName",
            "description",
            "detail",
            "payload",
        ],
    },
    "bom": {
        "table": "bom_items",
        "columns": [
            "id",
            "name",
            "description",
            "meta",
            "item_photo",
            "nameplate_photo",
        ],
        "payload_keys": [
            "id",
            "name",
            "description",
            "meta",
            "itemPhoto",
            "nameplatePhoto",
        ],
    },
    "spb": {
        "table": "spb_items",
        "columns": [
            "id",
            "request_type",
            "request_subtype",
            "notification_no",
            "order_no",
            "reservation_no",
            "material_no",
            "material_description",
            "qty",
            "price",
            "status",
        ],
        "payload_keys": [
            "id",
            "requestType",
            "requestSubtype",
            "notificationNo",
            "orderNo",
            "reservationNo",
            "materialNo",
            "materialDescription",
            "qty",
            "price",
            "status",
        ],
    },
}

DEFAULT_USERS = [
    ("admin.plirm34", "admin123", "admin"),
    ("organik.plirm34", "organik123", "organik"),
    ("team.plirm34", "team123", "team"),
]


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def hash_password(password: str, salt: str | None = None) -> str:
    salt_value = salt or secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt_value.encode("utf-8"),
        120_000,
    ).hex()
    return f"{salt_value}${digest}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        salt, stored_hash = encoded.split("$", 1)
    except ValueError:
        return False

    candidate = hash_password(password, salt).split("$", 1)[1]
    return hmac.compare_digest(candidate, stored_hash)


def get_connection() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    with get_connection() as connection:
        connection.executescript(
            """
            PRAGMA journal_mode=WAL;

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('admin', 'organik', 'team')),
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id INTEGER NOT NULL,
                expires_at TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS app_state (
                resource TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS negatif_list_items (
                id TEXT PRIMARY KEY,
                equipment TEXT NOT NULL,
                damage_description TEXT NOT NULL,
                follow_up_plan TEXT NOT NULL,
                found_date TEXT NOT NULL,
                pending_mark TEXT NOT NULL,
                work_status TEXT NOT NULL,
                category TEXT NOT NULL,
                area TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sparepart_items (
                id TEXT PRIMARY KEY,
                code TEXT NOT NULL,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                location TEXT NOT NULL,
                qty TEXT NOT NULL,
                condition TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS service_items (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                subtype TEXT NOT NULL,
                form_type TEXT NOT NULL,
                equipment_name TEXT NOT NULL,
                description TEXT NOT NULL,
                detail TEXT NOT NULL,
                payload_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS bom_items (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                meta TEXT NOT NULL,
                item_photo TEXT NOT NULL,
                nameplate_photo TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS spb_items (
                id TEXT PRIMARY KEY,
                request_type TEXT NOT NULL,
                request_subtype TEXT NOT NULL,
                notification_no TEXT NOT NULL,
                order_no TEXT NOT NULL,
                reservation_no TEXT NOT NULL,
                material_no TEXT NOT NULL,
                material_description TEXT NOT NULL,
                qty TEXT NOT NULL,
                price TEXT NOT NULL,
                status TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );
            """
        )

        for username, password, role in DEFAULT_USERS:
            existing = connection.execute(
                "SELECT 1 FROM users WHERE username = ?",
                (username,),
            ).fetchone()
            if not existing:
                connection.execute(
                    """
                    INSERT INTO users (username, password_hash, role, created_at)
                    VALUES (?, ?, ?, ?)
                    """,
                    (username, hash_password(password), role, utc_now().isoformat()),
                )

        for resource in STATE_KEYS.values():
            connection.execute(
                """
                INSERT INTO app_state (resource, payload, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(resource) DO NOTHING
                """,
                (resource, "[]", utc_now().isoformat()),
            )

        migrate_snapshot_state(connection)


def get_user_by_username(username: str) -> sqlite3.Row | None:
    with get_connection() as connection:
        return connection.execute(
            "SELECT id, username, password_hash, role, created_at FROM users WHERE lower(username) = lower(?)",
            (username,),
        ).fetchone()


def create_user(username: str, password: str, role: str = "team") -> dict:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO users (username, password_hash, role, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (username, hash_password(password), role, utc_now().isoformat()),
        )
        user_id = cursor.lastrowid
        row = connection.execute(
            "SELECT id, username, role, created_at FROM users WHERE id = ?",
            (user_id,),
        ).fetchone()
    return dict(row)


def list_users() -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT id, username, role, created_at FROM users ORDER BY lower(username)"
        ).fetchall()
    return [dict(row) for row in rows]


def count_admin_users() -> int:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT COUNT(*) AS total FROM users WHERE role = 'admin'"
        ).fetchone()
    return int(row["total"]) if row else 0


def update_user_role(username: str, role: str) -> dict | None:
    with get_connection() as connection:
        existing = connection.execute(
            "SELECT id, username, role, created_at FROM users WHERE lower(username) = lower(?)",
            (username,),
        ).fetchone()
        if not existing:
            return None

        connection.execute(
            "UPDATE users SET role = ? WHERE id = ?",
            (role, existing["id"]),
        )
        row = connection.execute(
            "SELECT id, username, role, created_at FROM users WHERE id = ?",
            (existing["id"],),
        ).fetchone()
    return dict(row) if row else None


def create_session(user_id: int) -> tuple[str, str]:
    token = secrets.token_urlsafe(32)
    expires_at = (utc_now() + timedelta(days=SESSION_DURATION_DAYS)).isoformat()
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO sessions (token, user_id, expires_at, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (token, user_id, expires_at, utc_now().isoformat()),
        )
    return token, expires_at


def delete_session(token: str) -> None:
    with get_connection() as connection:
        connection.execute("DELETE FROM sessions WHERE token = ?", (token,))


def get_user_from_session(token: str | None) -> dict | None:
    if not token:
        return None

    with get_connection() as connection:
        row = connection.execute(
            """
            SELECT users.id, users.username, users.role, sessions.expires_at
            FROM sessions
            JOIN users ON users.id = sessions.user_id
            WHERE sessions.token = ?
            """,
            (token,),
        ).fetchone()

    if not row:
        return None

    expires_at = datetime.fromisoformat(row["expires_at"])
    if expires_at <= utc_now():
        delete_session(token)
        return None

    return {
        "id": row["id"],
        "username": row["username"],
        "role": row["role"],
    }


def get_state_snapshot() -> dict:
    return {
        "negatif_list": load_resource_items("negatif-list"),
        "sparepart": load_resource_items("sparepart"),
        "service": load_resource_items("service"),
        "bom": load_resource_items("bom"),
        "spb": load_resource_items("spb"),
    }


def save_state(resource_key: str, payload: list) -> None:
    with get_connection() as connection:
        replace_resource_items(connection, resource_key, payload)
        connection.execute(
            """
            INSERT INTO app_state (resource, payload, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(resource) DO UPDATE SET
                payload = excluded.payload,
                updated_at = excluded.updated_at
            """,
            (
                STATE_KEYS[resource_key],
                json.dumps(payload, ensure_ascii=False),
                utc_now().isoformat(),
            ),
        )


def serialize_resource_item(resource_key: str, item: dict) -> tuple:
    if resource_key == "service":
        return (
            str(item.get("id", "")),
            str(item.get("type", "")),
            str(item.get("subtype", "")),
            str(item.get("formType", "")),
            str(item.get("equipmentName", "")),
            str(item.get("description", "")),
            str(item.get("detail", "")),
            json.dumps(item.get("payload", {}), ensure_ascii=False),
            utc_now().isoformat(),
        )

    if resource_key == "negatif-list":
        return (
            str(item.get("id", "")),
            str(item.get("equipment", "")),
            str(item.get("damageDescription", "")),
            str(item.get("followUpPlan", "")),
            str(item.get("foundDate", "")),
            str(item.get("pendingMark", "")),
            str(item.get("workStatus", "")),
            str(item.get("category", "")),
            str(item.get("area", "")),
            utc_now().isoformat(),
        )

    if resource_key == "sparepart":
        return (
            str(item.get("id", "")),
            str(item.get("code", "")),
            str(item.get("name", "")),
            str(item.get("category", "")),
            str(item.get("location", "")),
            str(item.get("qty", "")),
            str(item.get("condition", "")),
            utc_now().isoformat(),
        )

    if resource_key == "bom":
        return (
            str(item.get("id", "")),
            str(item.get("name", "")),
            str(item.get("description", "")),
            str(item.get("meta", "")),
            str(item.get("itemPhoto", "")),
            str(item.get("nameplatePhoto", "")),
            utc_now().isoformat(),
        )

    if resource_key == "spb":
        return (
            str(item.get("id", "")),
            str(item.get("requestType", "")),
            str(item.get("requestSubtype", "")),
            str(item.get("notificationNo", "")),
            str(item.get("orderNo", "")),
            str(item.get("reservationNo", "")),
            str(item.get("materialNo", "")),
            str(item.get("materialDescription", "")),
            str(item.get("qty", "")),
            str(item.get("price", "")),
            str(item.get("status", "")),
            utc_now().isoformat(),
        )

    raise ValueError(f"Resource tidak dikenal: {resource_key}")


def deserialize_resource_item(resource_key: str, row: sqlite3.Row) -> dict:
    if resource_key == "service":
        try:
            payload = json.loads(row["payload_json"])
        except json.JSONDecodeError:
            payload = {}
        return {
            "id": row["id"],
            "type": row["type"],
            "subtype": row["subtype"],
            "formType": row["form_type"],
            "equipmentName": row["equipment_name"],
            "description": row["description"],
            "detail": row["detail"],
            "payload": payload,
        }

    if resource_key == "negatif-list":
        return {
            "id": row["id"],
            "equipment": row["equipment"],
            "damageDescription": row["damage_description"],
            "followUpPlan": row["follow_up_plan"],
            "foundDate": row["found_date"],
            "pendingMark": row["pending_mark"],
            "workStatus": row["work_status"],
            "category": row["category"],
            "area": row["area"],
        }

    if resource_key == "sparepart":
        return {
            "id": row["id"],
            "code": row["code"],
            "name": row["name"],
            "category": row["category"],
            "location": row["location"],
            "qty": row["qty"],
            "condition": row["condition"],
        }

    if resource_key == "bom":
        return {
            "id": row["id"],
            "name": row["name"],
            "description": row["description"],
            "meta": row["meta"],
            "itemPhoto": row["item_photo"],
            "nameplatePhoto": row["nameplate_photo"],
        }

    if resource_key == "spb":
        return {
            "id": row["id"],
            "requestType": row["request_type"],
            "requestSubtype": row["request_subtype"],
            "notificationNo": row["notification_no"],
            "orderNo": row["order_no"],
            "reservationNo": row["reservation_no"],
            "materialNo": row["material_no"],
            "materialDescription": row["material_description"],
            "qty": row["qty"],
            "price": row["price"],
            "status": row["status"],
        }

    raise ValueError(f"Resource tidak dikenal: {resource_key}")


def replace_resource_items(connection: sqlite3.Connection, resource_key: str, items: list) -> None:
    resource_config = RESOURCE_TABLES[resource_key]
    table = resource_config["table"]
    columns = resource_config["columns"]
    placeholders = ", ".join(["?"] * (len(columns) + 1))
    insert_columns = ", ".join(columns + ["updated_at"])

    connection.execute(f"DELETE FROM {table}")
    if not items:
        return

    rows = [serialize_resource_item(resource_key, item) for item in items]
    connection.executemany(
        f"INSERT INTO {table} ({insert_columns}) VALUES ({placeholders})",
        rows,
    )


def load_resource_items(resource_key: str) -> list[dict]:
    resource_config = RESOURCE_TABLES[resource_key]
    with get_connection() as connection:
        rows = connection.execute(
            f"SELECT * FROM {resource_config['table']} ORDER BY updated_at DESC, rowid DESC"
        ).fetchall()
    return [deserialize_resource_item(resource_key, row) for row in rows]


def migrate_snapshot_state(connection: sqlite3.Connection) -> None:
    for resource_key, resource_name in STATE_KEYS.items():
        table = RESOURCE_TABLES[resource_key]["table"]
        table_has_rows = connection.execute(
            f"SELECT 1 FROM {table} LIMIT 1"
        ).fetchone()
        if table_has_rows:
            continue

        snapshot_row = connection.execute(
            "SELECT payload FROM app_state WHERE resource = ?",
            (resource_name,),
        ).fetchone()
        if not snapshot_row:
            continue

        try:
            items = json.loads(snapshot_row["payload"])
        except json.JSONDecodeError:
            items = []

        if isinstance(items, list) and items:
            replace_resource_items(connection, resource_key, items)


class PLIRMRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT_DIR), **kwargs)

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self._send_json_headers()
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/health":
            self._send_json({"ok": True, "timestamp": utc_now().isoformat()})
            return

        if parsed.path == "/api/auth/me":
            user = self._require_user(optional=True)
            self._send_json({"user": user})
            return

        if parsed.path == "/api/bootstrap":
            user = self._require_user()
            if not user:
                return
            self._send_json(
                {
                    "user": user,
                    "data": get_state_snapshot(),
                    "users": list_users() if user["role"] == "admin" else [],
                }
            )
            return

        if parsed.path == "/api/users":
            user = self._require_user()
            if not user:
                return
            if user["role"] != "admin":
                self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
                return
            self._send_json({"users": list_users()})
            return

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/auth/login":
            self._handle_login()
            return

        if parsed.path == "/api/auth/signup":
            self._handle_signup()
            return

        if parsed.path == "/api/auth/logout":
            self._handle_logout()
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Endpoint tidak ditemukan")

    def do_PUT(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/sync/"):
            resource_key = parsed.path.rsplit("/", 1)[-1]
            self._handle_sync(resource_key)
            return

        if parsed.path.startswith("/api/users/") and parsed.path.endswith("/role"):
            username = parsed.path.removeprefix("/api/users/").removesuffix("/role").strip("/")
            self._handle_update_user_role(username)
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Endpoint tidak ditemukan")

    def log_message(self, format: str, *args):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {self.address_string()} - {format % args}")

    def _parse_json_body(self) -> dict:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0

        raw = self.rfile.read(length) if length > 0 else b"{}"
        if not raw:
            return {}
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            self._send_json({"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            raise

    def _send_json_headers(self, *, extra_headers: dict | None = None):
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)

    def _send_json(self, payload: dict, *, status: HTTPStatus = HTTPStatus.OK, extra_headers: dict | None = None):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self._send_json_headers(extra_headers=extra_headers)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_session_cookie(self) -> str | None:
        cookie_header = self.headers.get("Cookie", "")
        if not cookie_header:
            return None

        cookies = SimpleCookie()
        cookies.load(cookie_header)
        if SESSION_COOKIE_NAME not in cookies:
            return None
        return cookies[SESSION_COOKIE_NAME].value

    def _build_session_cookie(self, token: str, *, expires_days: int = SESSION_DURATION_DAYS) -> str:
        expires = (datetime.utcnow() + timedelta(days=expires_days)).strftime("%a, %d %b %Y %H:%M:%S GMT")
        return f"{SESSION_COOKIE_NAME}={token}; Path=/; HttpOnly; SameSite=Lax; Expires={expires}"

    def _clear_session_cookie(self) -> str:
        return f"{SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"

    def _require_user(self, *, optional: bool = False) -> dict | None:
        token = self._read_session_cookie()
        user = get_user_from_session(token)
        if user or optional:
            return user
        self._send_json({"error": "Autentikasi diperlukan"}, status=HTTPStatus.UNAUTHORIZED)
        return None

    def _handle_login(self):
        try:
            payload = self._parse_json_body()
        except json.JSONDecodeError:
            return

        username = str(payload.get("username", "")).strip()
        password = str(payload.get("password", ""))
        if not username or not password:
            self._send_json({"error": "Username dan password wajib diisi"}, status=HTTPStatus.BAD_REQUEST)
            return

        user = get_user_by_username(username)
        if not user or not verify_password(password, user["password_hash"]):
            self._send_json({"error": "Username atau password tidak cocok"}, status=HTTPStatus.UNAUTHORIZED)
            return

        token, _expires_at = create_session(user["id"])
        self._send_json(
            {"user": {"id": user["id"], "username": user["username"], "role": user["role"]}},
            extra_headers={"Set-Cookie": self._build_session_cookie(token)},
        )

    def _handle_signup(self):
        try:
            payload = self._parse_json_body()
        except json.JSONDecodeError:
            return

        username = str(payload.get("username", "")).strip()
        password = str(payload.get("password", ""))
        if not username or not password:
            self._send_json({"error": "Username dan password wajib diisi"}, status=HTTPStatus.BAD_REQUEST)
            return

        if get_user_by_username(username):
            self._send_json({"error": "Username sudah terdaftar"}, status=HTTPStatus.CONFLICT)
            return

        user = create_user(username, password, "team")
        token, _expires_at = create_session(user["id"])
        self._send_json(
            {"user": {"id": user["id"], "username": user["username"], "role": user["role"]}},
            status=HTTPStatus.CREATED,
            extra_headers={"Set-Cookie": self._build_session_cookie(token)},
        )

    def _handle_logout(self):
        token = self._read_session_cookie()
        if token:
            delete_session(token)
        self._send_json({"ok": True}, extra_headers={"Set-Cookie": self._clear_session_cookie()})

    def _handle_sync(self, resource_key: str):
        user = self._require_user()
        if not user:
            return

        if resource_key not in STATE_KEYS:
            self._send_json({"error": "Resource sync tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
            return

        try:
            payload = self._parse_json_body()
        except json.JSONDecodeError:
            return

        items = payload.get("items")
        if not isinstance(items, list):
            self._send_json({"error": "Payload items harus berupa array"}, status=HTTPStatus.BAD_REQUEST)
            return

        save_state(resource_key, items)
        self._send_json({"ok": True, "resource": resource_key, "count": len(items)})

    def _handle_update_user_role(self, username: str):
        user = self._require_user()
        if not user:
            return
        if user["role"] != "admin":
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        if not username:
            self._send_json({"error": "Username tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            return

        try:
            payload = self._parse_json_body()
        except json.JSONDecodeError:
            return

        next_role = str(payload.get("role", "")).strip()
        if next_role not in {"admin", "organik", "team"}:
            self._send_json({"error": "Role tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            return

        target_user = get_user_by_username(username)
        if not target_user:
            self._send_json({"error": "User tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
            return

        if target_user["role"] == "admin" and next_role != "admin" and count_admin_users() <= 1:
            self._send_json(
                {"error": "Minimal harus ada satu akun admin aktif"},
                status=HTTPStatus.BAD_REQUEST,
            )
            return

        updated_user = update_user_role(username, next_role)
        self._send_json({"ok": True, "user": updated_user, "users": list_users()})


def main():
    parser = argparse.ArgumentParser(description="PLIRM34 backend server")
    parser.add_argument("--host", default="127.0.0.1", help="Host binding, default 127.0.0.1")
    parser.add_argument("--port", default=8000, type=int, help="Port server, default 8000")
    args = parser.parse_args()

    init_db()
    os.chdir(ROOT_DIR)
    server = ThreadingHTTPServer((args.host, args.port), PLIRMRequestHandler)
    print(f"PLIRM34 backend running at http://{args.host}:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
