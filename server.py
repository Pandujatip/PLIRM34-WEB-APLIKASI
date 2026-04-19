from __future__ import annotations

import argparse
import csv
import hashlib
import hmac
import io
import json
import os
import secrets
import sqlite3
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from http.cookies import SimpleCookie
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse
from urllib.request import urlopen


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

ROLE_EDITABLE = {
    "admin": {"negatif-list", "sparepart", "service", "bom", "spb", "users"},
    "organik": {"negatif-list"},
    "team": {"service"},
}

MASTER_REFERENCE_URLS = {
    "negatif-list": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRt_ysTFRHmKVY3-hlFDgBYex-BExU0cdFnuBaWOPqxKAo6mqavGhtZeKdTkvvFXsm-uvcOt2QVLHHC/pub?output=csv",
    "carbon-brush": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfKUBfJ2IEybsMUaBoZnPeTgqCdPwuGnoXPtFuLfRzydveC6cBMYobCistT3GNdm2kS7xIKUgVkAVb/pub?output=csv",
}

DEFAULT_AREAS = [
    ("tuban-3", "Tuban 3", "Tuban 3", 1),
    ("tuban-4", "Tuban 4", "Tuban 4", 2),
    ("tuban-34", "Tuban 34", "Tuban 34", 3),
]

DEFAULT_INSPECTION_TEMPLATES = [
    ("service", "Electrical", "Electrical Room", "Inspeksi Electrical Room", json.dumps({
        "fields": ["panelDoorCondition", "floorCleanliness", "roomTemperature", "battery", "transformer"]
    }, ensure_ascii=False)),
    ("service", "Electrical", "Motor MV", "Inspeksi Motor MV", json.dumps({
        "fields": ["vibrationDe", "vibrationNde", "windingTemperature", "bearingCondition", "motorCurrent"]
    }, ensure_ascii=False)),
    ("service", "Electrical", "Motor MV (Carbon Brush)", "Inspeksi Carbon Brush", json.dumps({
        "fields": ["measurements", "replacement", "megger", "pic"]
    }, ensure_ascii=False)),
    ("service", "Electrical", "EH/CA", "Inspeksi EH/CA", json.dumps({
        "fields": ["systemPressure", "fluidLevel", "filterCondition", "leakCondition", "unitCondition"]
    }, ensure_ascii=False)),
    ("service", "Instrument", "Instrument", "Inspeksi Instrument", json.dumps({
        "fields": ["sensorCondition", "findingPhoto"]
    }, ensure_ascii=False)),
    ("service", "DCS", "DCS", "Inspeksi DCS", json.dumps({
        "fields": ["equipmentFunction", "environmentCleanliness"]
    }, ensure_ascii=False)),
    ("negatif-list", "Negatif List", "Pending Work", "Monitoring Negatif List", json.dumps({
        "fields": ["equipment", "damageDescription", "followUpPlan", "foundDate", "pendingMark", "workStatus", "category", "area"]
    }, ensure_ascii=False)),
]

FALLBACK_EQUIPMENT_REFERENCES = {
    "negatif-list": [
        "Motor Raw Mill 1A",
        "Coal Feeder FT-02",
        "Operator Station CCR-03",
        "Temperature Scanner Kiln",
        "Panel MCC Finish Mill",
        "Server Historian HS-01",
    ],
    "carbon-brush": [
        "343RM1 - ABB",
        "344RM1 - ABB",
    ],
}


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

            CREATE TABLE IF NOT EXISTS areas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT NOT NULL UNIQUE,
                name TEXT NOT NULL,
                plant TEXT NOT NULL,
                sort_order INTEGER NOT NULL DEFAULT 0,
                is_active INTEGER NOT NULL DEFAULT 1
            );

            CREATE TABLE IF NOT EXISTS inspection_templates (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module_name TEXT NOT NULL,
                inspection_type TEXT NOT NULL,
                inspection_subtype TEXT NOT NULL,
                title TEXT NOT NULL,
                definition_json TEXT NOT NULL,
                is_active INTEGER NOT NULL DEFAULT 1,
                UNIQUE(module_name, inspection_type, inspection_subtype)
            );

            CREATE TABLE IF NOT EXISTS equipment_reference (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source_group TEXT NOT NULL,
                equipment_code TEXT NOT NULL,
                equipment_name TEXT NOT NULL,
                category TEXT NOT NULL DEFAULT '',
                area TEXT NOT NULL DEFAULT '',
                plant TEXT NOT NULL DEFAULT '',
                source_url TEXT NOT NULL DEFAULT '',
                metadata_json TEXT NOT NULL DEFAULT '{}',
                is_active INTEGER NOT NULL DEFAULT 1,
                updated_at TEXT NOT NULL,
                UNIQUE(source_group, equipment_code, equipment_name)
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
                created_by_user_id INTEGER,
                updated_by_user_id INTEGER,
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
                created_by_user_id INTEGER,
                updated_by_user_id INTEGER,
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
                created_by_user_id INTEGER,
                updated_by_user_id INTEGER,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS bom_items (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                meta TEXT NOT NULL,
                item_photo TEXT NOT NULL,
                nameplate_photo TEXT NOT NULL,
                created_by_user_id INTEGER,
                updated_by_user_id INTEGER,
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
                created_by_user_id INTEGER,
                updated_by_user_id INTEGER,
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

        seed_master_data(connection)
        migrate_snapshot_state(connection)
        ensure_audit_columns(connection)


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


def list_users_for_backup() -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT username, password_hash, role, created_at FROM users ORDER BY lower(username)"
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


def save_state(resource_key: str, payload: list, user_id: int | None = None) -> None:
    with get_connection() as connection:
        replace_resource_items(connection, resource_key, payload, user_id=user_id)
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


def get_item_by_id(resource_key: str, item_id: str) -> dict | None:
    resource_config = RESOURCE_TABLES[resource_key]
    with get_connection() as connection:
        row = connection.execute(
            f"SELECT * FROM {resource_config['table']} WHERE id = ?",
            (item_id,),
        ).fetchone()
    return deserialize_resource_item(resource_key, row) if row else None


def list_items(resource_key: str) -> list[dict]:
    return load_resource_items(resource_key)


def create_or_update_item(resource_key: str, item: dict, user_id: int) -> dict:
    if not item.get("id"):
        raise ValueError("ID item wajib ada")

    resource_config = RESOURCE_TABLES[resource_key]
    table = resource_config["table"]
    columns = resource_config["columns"]
    placeholders = ", ".join(["?"] * (len(columns) + 3))
    insert_columns = ", ".join(columns + ["created_by_user_id", "updated_by_user_id", "updated_at"])
    update_assignments = ", ".join([f"{column} = excluded.{column}" for column in columns[1:]])

    with get_connection() as connection:
        existing = connection.execute(
            f"SELECT created_by_user_id FROM {table} WHERE id = ?",
            (item["id"],),
        ).fetchone()
        created_by_user_id = existing["created_by_user_id"] if existing else user_id
        row = serialize_resource_item(resource_key, item) + (created_by_user_id, user_id, utc_now().isoformat())
        connection.execute(
            f"""
            INSERT INTO {table} ({insert_columns}) VALUES ({placeholders})
            ON CONFLICT(id) DO UPDATE SET
                {update_assignments},
                updated_by_user_id = excluded.updated_by_user_id,
                updated_at = excluded.updated_at
            """,
            row,
        )
        refresh_snapshot(connection, resource_key)

    saved_item = get_item_by_id(resource_key, str(item["id"]))
    if not saved_item:
        raise ValueError("Gagal menyimpan item")
    return saved_item


def delete_item(resource_key: str, item_id: str) -> bool:
    resource_config = RESOURCE_TABLES[resource_key]
    with get_connection() as connection:
        cursor = connection.execute(
            f"DELETE FROM {resource_config['table']} WHERE id = ?",
            (item_id,),
        )
        deleted = cursor.rowcount > 0
        if deleted:
            refresh_snapshot(connection, resource_key)
    return deleted


def refresh_snapshot(connection: sqlite3.Connection, resource_key: str) -> None:
    items = [
        deserialize_resource_item(resource_key, row)
        for row in connection.execute(
            f"SELECT * FROM {RESOURCE_TABLES[resource_key]['table']} ORDER BY updated_at DESC, rowid DESC"
        ).fetchall()
    ]
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
            json.dumps(items, ensure_ascii=False),
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
        )

    if resource_key == "bom":
        return (
            str(item.get("id", "")),
            str(item.get("name", "")),
            str(item.get("description", "")),
            str(item.get("meta", "")),
            str(item.get("itemPhoto", "")),
            str(item.get("nameplatePhoto", "")),
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


def replace_resource_items(connection: sqlite3.Connection, resource_key: str, items: list, user_id: int | None = None) -> None:
    resource_config = RESOURCE_TABLES[resource_key]
    table = resource_config["table"]
    columns = resource_config["columns"]
    placeholders = ", ".join(["?"] * (len(columns) + 3))
    insert_columns = ", ".join(columns + ["created_by_user_id", "updated_by_user_id", "updated_at"])

    connection.execute(f"DELETE FROM {table}")
    if not items:
        return

    rows = [serialize_resource_item(resource_key, item) + (user_id, user_id, utc_now().isoformat()) for item in items]
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


def ensure_audit_columns(connection: sqlite3.Connection) -> None:
    for resource_config in RESOURCE_TABLES.values():
        table = resource_config["table"]
        columns = {
            row["name"]
            for row in connection.execute(f"PRAGMA table_info({table})").fetchall()
        }
        if "created_by_user_id" not in columns:
            connection.execute(f"ALTER TABLE {table} ADD COLUMN created_by_user_id INTEGER")
        if "updated_by_user_id" not in columns:
            connection.execute(f"ALTER TABLE {table} ADD COLUMN updated_by_user_id INTEGER")


def can_edit_resource(role: str, resource_key: str) -> bool:
    return resource_key in ROLE_EDITABLE.get(role, set())


def seed_master_data(connection: sqlite3.Connection) -> None:
    for code, name, plant, sort_order in DEFAULT_AREAS:
        connection.execute(
            """
            INSERT INTO areas (code, name, plant, sort_order, is_active)
            VALUES (?, ?, ?, ?, 1)
            ON CONFLICT(code) DO UPDATE SET
                name = excluded.name,
                plant = excluded.plant,
                sort_order = excluded.sort_order,
                is_active = 1
            """,
            (code, name, plant, sort_order),
        )

    for module_name, inspection_type, inspection_subtype, title, definition_json in DEFAULT_INSPECTION_TEMPLATES:
        connection.execute(
            """
            INSERT INTO inspection_templates (module_name, inspection_type, inspection_subtype, title, definition_json, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
            ON CONFLICT(module_name, inspection_type, inspection_subtype) DO UPDATE SET
                title = excluded.title,
                definition_json = excluded.definition_json,
                is_active = 1
            """,
            (module_name, inspection_type, inspection_subtype, title, definition_json),
        )

    for source_group in MASTER_REFERENCE_URLS:
        existing = connection.execute(
            "SELECT COUNT(*) AS total FROM equipment_reference WHERE source_group = ?",
            (source_group,),
        ).fetchone()
        if existing and int(existing["total"]) > 0:
            continue
        import_equipment_reference_group(connection, source_group)


def import_equipment_reference_group(connection: sqlite3.Connection, source_group: str) -> None:
    imported_rows = fetch_remote_equipment_references(source_group)
    if not imported_rows:
        imported_rows = [
            {
                "equipment_code": name.split(" ")[0],
                "equipment_name": name,
                "category": "",
                "area": "",
                "plant": "",
                "metadata_json": "{}",
            }
            for name in FALLBACK_EQUIPMENT_REFERENCES.get(source_group, [])
        ]

    for row in imported_rows:
        connection.execute(
            """
            INSERT INTO equipment_reference (
                source_group, equipment_code, equipment_name, category, area, plant, source_url, metadata_json, is_active, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
            ON CONFLICT(source_group, equipment_code, equipment_name) DO UPDATE SET
                category = excluded.category,
                area = excluded.area,
                plant = excluded.plant,
                source_url = excluded.source_url,
                metadata_json = excluded.metadata_json,
                is_active = 1,
                updated_at = excluded.updated_at
            """,
            (
                source_group,
                row["equipment_code"],
                row["equipment_name"],
                row["category"],
                row["area"],
                row["plant"],
                MASTER_REFERENCE_URLS.get(source_group, ""),
                row["metadata_json"],
                utc_now().isoformat(),
            ),
        )


def fetch_remote_equipment_references(source_group: str) -> list[dict]:
    url = MASTER_REFERENCE_URLS.get(source_group)
    if not url:
        return []

    try:
        with urlopen(url, timeout=8) as response:
            csv_text = response.read().decode("utf-8", errors="ignore")
    except Exception:
        return []

    reader = csv.reader(io.StringIO(csv_text))
    rows = list(reader)
    if len(rows) < 2:
        return []

    headers = [header.strip().lower() for header in rows[0]]
    equipment_index = detect_reference_column(headers, ["equipment", "nama equipment", "equipment name", "tag"])
    if equipment_index < 0:
        equipment_index = 0
    area_index = detect_reference_column(headers, ["area"])
    plant_index = detect_reference_column(headers, ["plant"])
    category_index = detect_reference_column(headers, ["category", "kategori"])

    imported_rows: list[dict] = []
    for raw_row in rows[1:]:
        if equipment_index >= len(raw_row):
            continue
        equipment_name = raw_row[equipment_index].strip()
        if not equipment_name:
            continue
        imported_rows.append(
            {
                "equipment_code": equipment_name.split(" ")[0],
                "equipment_name": equipment_name,
                "category": raw_row[category_index].strip() if category_index >= 0 and category_index < len(raw_row) else "",
                "area": raw_row[area_index].strip() if area_index >= 0 and area_index < len(raw_row) else "",
                "plant": raw_row[plant_index].strip() if plant_index >= 0 and plant_index < len(raw_row) else "",
                "metadata_json": "{}",
            }
        )
    return imported_rows


def detect_reference_column(headers: list[str], candidates: list[str]) -> int:
    for index, header in enumerate(headers):
        if header in candidates:
            return index
    return -1


def list_areas() -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT code, name, plant, sort_order FROM areas WHERE is_active = 1 ORDER BY sort_order, name"
        ).fetchall()
    return [dict(row) for row in rows]


def list_inspection_templates() -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT module_name, inspection_type, inspection_subtype, title, definition_json
            FROM inspection_templates
            WHERE is_active = 1
            ORDER BY module_name, inspection_type, inspection_subtype
            """
        ).fetchall()
    templates = []
    for row in rows:
        try:
            definition = json.loads(row["definition_json"])
        except json.JSONDecodeError:
            definition = {}
        templates.append(
            {
                "moduleName": row["module_name"],
                "inspectionType": row["inspection_type"],
                "inspectionSubtype": row["inspection_subtype"],
                "title": row["title"],
                "definition": definition,
            }
        )
    return templates


def list_equipment_references(source_group: str | None = None) -> list[dict]:
    query = """
        SELECT source_group, equipment_code, equipment_name, category, area, plant, source_url, metadata_json
        FROM equipment_reference
        WHERE is_active = 1
    """
    params: tuple = ()
    if source_group:
        query += " AND source_group = ?"
        params = (source_group,)
    query += " ORDER BY source_group, equipment_name"

    with get_connection() as connection:
        rows = connection.execute(query, params).fetchall()

    references = []
    for row in rows:
        try:
            metadata = json.loads(row["metadata_json"])
        except json.JSONDecodeError:
            metadata = {}
        references.append(
            {
                "sourceGroup": row["source_group"],
                "equipmentCode": row["equipment_code"],
                "equipmentName": row["equipment_name"],
                "category": row["category"],
                "area": row["area"],
                "plant": row["plant"],
                "sourceUrl": row["source_url"],
                "metadata": metadata,
            }
        )
    return references


def build_backup_payload() -> dict:
    return {
        "meta": {
            "generatedAt": utc_now().isoformat(),
            "app": "PLIRM34",
            "version": 1,
        },
        "users": list_users_for_backup(),
        "areas": list_areas(),
        "inspectionTemplates": list_inspection_templates(),
        "equipmentReferences": list_equipment_references(),
        "data": get_state_snapshot(),
    }


def restore_backup_payload(payload: dict) -> None:
    with get_connection() as connection:
        connection.execute("DELETE FROM sessions")
        users = payload.get("users", [])
        if isinstance(users, list):
            connection.execute("DELETE FROM users")
            for user in users:
                connection.execute(
                    """
                    INSERT INTO users (username, password_hash, role, created_at)
                    VALUES (?, ?, ?, ?)
                    """,
                    (
                        str(user.get("username", "")),
                        str(user.get("password_hash", "")),
                        str(user.get("role", "team")),
                        str(user.get("created_at", utc_now().isoformat())),
                    ),
                )

        areas = payload.get("areas", [])
        if isinstance(areas, list):
            connection.execute("DELETE FROM areas")
            for index, area in enumerate(areas, start=1):
                connection.execute(
                    """
                    INSERT INTO areas (code, name, plant, sort_order, is_active)
                    VALUES (?, ?, ?, ?, 1)
                    """,
                    (
                        str(area.get("code", f"area-{index}")),
                        str(area.get("name", "")),
                        str(area.get("plant", "")),
                        int(area.get("sort_order", area.get("sortOrder", index))),
                    ),
                )

        templates = payload.get("inspectionTemplates", [])
        if isinstance(templates, list):
            connection.execute("DELETE FROM inspection_templates")
            for template in templates:
                connection.execute(
                    """
                    INSERT INTO inspection_templates (module_name, inspection_type, inspection_subtype, title, definition_json, is_active)
                    VALUES (?, ?, ?, ?, ?, 1)
                    """,
                    (
                        str(template.get("moduleName", "")),
                        str(template.get("inspectionType", "")),
                        str(template.get("inspectionSubtype", "")),
                        str(template.get("title", "")),
                        json.dumps(template.get("definition", {}), ensure_ascii=False),
                    ),
                )

        equipment_references = payload.get("equipmentReferences", [])
        if isinstance(equipment_references, list):
            connection.execute("DELETE FROM equipment_reference")
            for reference in equipment_references:
                connection.execute(
                    """
                    INSERT INTO equipment_reference (
                        source_group, equipment_code, equipment_name, category, area, plant, source_url, metadata_json, is_active, updated_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
                    """,
                    (
                        str(reference.get("sourceGroup", "")),
                        str(reference.get("equipmentCode", "")),
                        str(reference.get("equipmentName", "")),
                        str(reference.get("category", "")),
                        str(reference.get("area", "")),
                        str(reference.get("plant", "")),
                        str(reference.get("sourceUrl", "")),
                        json.dumps(reference.get("metadata", {}), ensure_ascii=False),
                        utc_now().isoformat(),
                    ),
                )

        data = payload.get("data", {})
        for resource_key in STATE_KEYS:
            items = data.get(STATE_KEYS[resource_key], data.get(resource_key.replace("-", "_"), []))
            if isinstance(items, list):
                replace_resource_items(connection, resource_key, items)
                refresh_snapshot(connection, resource_key)


def export_resource_csv(resource_key: str) -> str:
    items = list_items(resource_key)
    buffer = io.StringIO()
    if resource_key == "negatif-list":
        writer = csv.writer(buffer)
        writer.writerow(["Equipment", "Deskripsi Kerusakan", "Rencana Tindak Lanjut", "Tanggal Temuan", "Mark", "Status", "Kategori", "Area"])
        for item in items:
            writer.writerow([item["equipment"], item["damageDescription"], item["followUpPlan"], item["foundDate"], item["pendingMark"], item["workStatus"], item["category"], item["area"]])
        return buffer.getvalue()
    if resource_key == "sparepart":
        writer = csv.writer(buffer)
        writer.writerow(["Kode", "Nama", "Kategori", "Lokasi", "Qty", "Kondisi"])
        for item in items:
            writer.writerow([item["code"], item["name"], item["category"], item["location"], item["qty"], item["condition"]])
        return buffer.getvalue()
    if resource_key == "service":
        writer = csv.writer(buffer)
        writer.writerow(["Tipe", "Sub Menu", "Form", "Equipment", "Deskripsi", "Detail"])
        for item in items:
            writer.writerow([item["type"], item["subtype"], item["formType"], item["equipmentName"], item["description"], item["detail"]])
        return buffer.getvalue()
    if resource_key == "bom":
        writer = csv.writer(buffer)
        writer.writerow(["Nama", "Deskripsi", "Meta", "Foto Barang", "Foto Nameplate"])
        for item in items:
            writer.writerow([item["name"], item["description"], item["meta"], item["itemPhoto"], item["nameplatePhoto"]])
        return buffer.getvalue()
    if resource_key == "spb":
        writer = csv.writer(buffer)
        writer.writerow(["Jenis Ajuan", "Type Ajuan", "No Notifikasi", "No Order", "No Reservasi", "No Material", "Deskripsi", "Qty", "Harga", "Status"])
        for item in items:
            writer.writerow([item["requestType"], item["requestSubtype"], item["notificationNo"], item["orderNo"], item["reservationNo"], item["materialNo"], item["materialDescription"], item["qty"], item["price"], item["status"]])
        return buffer.getvalue()
    raise ValueError("Resource export tidak dikenal")


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

        if parsed.path == "/api/masters":
            self._handle_masters_get(parsed.query)
            return

        if parsed.path.startswith("/api/reports/export/"):
            self._handle_export_report(parsed.path)
            return

        if parsed.path == "/api/admin/backup":
            self._handle_backup_get()
            return

        if parsed.path.startswith("/api/items/"):
            self._handle_items_get(parsed.path)
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
        if parsed.path == "/api/admin/restore":
            self._handle_restore_post()
            return

        if parsed.path.startswith("/api/items/"):
            self._handle_items_post(parsed.path)
            return

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
        if parsed.path.startswith("/api/items/"):
            self._handle_items_put(parsed.path)
            return

        if parsed.path.startswith("/api/sync/"):
            resource_key = parsed.path.rsplit("/", 1)[-1]
            self._handle_sync(resource_key)
            return

        if parsed.path.startswith("/api/users/") and parsed.path.endswith("/role"):
            username = parsed.path.removeprefix("/api/users/").removesuffix("/role").strip("/")
            self._handle_update_user_role(username)
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Endpoint tidak ditemukan")

    def do_DELETE(self):
        parsed = urlparse(self.path)
        if parsed.path.startswith("/api/items/"):
            self._handle_items_delete(parsed.path)
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

    def _send_text(self, body_text: str, *, status: HTTPStatus = HTTPStatus.OK, content_type: str = "text/plain; charset=utf-8", extra_headers: dict | None = None):
        body = body_text.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Cache-Control", "no-store")
        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)
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

    def _parse_item_route(self, path: str) -> tuple[str | None, str | None]:
        parts = [part for part in path.split("/") if part]
        if len(parts) < 3 or parts[0] != "api" or parts[1] != "items":
            return None, None
        resource_key = parts[2]
        item_id = unquote(parts[3]) if len(parts) > 3 else None
        return resource_key, item_id

    def _require_edit_access(self, user: dict, resource_key: str) -> bool:
        if can_edit_resource(user["role"], resource_key):
            return True
        self._send_json({"error": "Akses edit tidak diizinkan untuk modul ini"}, status=HTTPStatus.FORBIDDEN)
        return False

    def _handle_masters_get(self, query: str):
        user = self._require_user()
        if not user:
            return
        params = parse_qs(query or "")
        source_group = params.get("source_group", [None])[0]
        self._send_json(
            {
                "areas": list_areas(),
                "inspectionTemplates": list_inspection_templates(),
                "equipmentReferences": list_equipment_references(source_group),
            }
        )

    def _handle_export_report(self, path: str):
        user = self._require_user()
        if not user:
            return
        resource_key = path.rsplit("/", 1)[-1]
        if resource_key not in RESOURCE_TABLES:
            self._send_json({"error": "Resource export tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
            return
        csv_text = export_resource_csv(resource_key)
        self._send_text(
            csv_text,
            content_type="text/csv; charset=utf-8",
            extra_headers={"Content-Disposition": f'attachment; filename="{resource_key}.csv"'},
        )

    def _handle_backup_get(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        self._send_json(build_backup_payload())

    def _handle_restore_post(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        try:
            payload = self._parse_json_body()
        except json.JSONDecodeError:
            return
        backup = payload.get("backup")
        if not isinstance(backup, dict):
            self._send_json({"error": "Payload backup harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            return
        restore_backup_payload(backup)
        self._send_json({"ok": True})

    def _handle_items_get(self, path: str):
        user = self._require_user()
        if not user:
            return
        resource_key, item_id = self._parse_item_route(path)
        if resource_key not in RESOURCE_TABLES:
            self._send_json({"error": "Resource item tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
            return
        if item_id:
            item = get_item_by_id(resource_key, item_id)
            if not item:
                self._send_json({"error": "Item tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
                return
            self._send_json({"item": item})
            return
        self._send_json({"items": list_items(resource_key)})

    def _handle_items_post(self, path: str):
        user = self._require_user()
        if not user:
            return
        resource_key, item_id = self._parse_item_route(path)
        if resource_key not in RESOURCE_TABLES or item_id:
            self._send_json({"error": "Endpoint create item tidak valid"}, status=HTTPStatus.NOT_FOUND)
            return
        if not self._require_edit_access(user, resource_key):
            return

        try:
            payload = self._parse_json_body()
        except json.JSONDecodeError:
            return

        item = payload.get("item")
        if not isinstance(item, dict):
            self._send_json({"error": "Payload item harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            return

        try:
            saved_item = create_or_update_item(resource_key, item, user["id"])
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return
        self._send_json({"ok": True, "item": saved_item}, status=HTTPStatus.CREATED)

    def _handle_items_put(self, path: str):
        user = self._require_user()
        if not user:
            return
        resource_key, item_id = self._parse_item_route(path)
        if resource_key not in RESOURCE_TABLES or not item_id:
            self._send_json({"error": "Endpoint update item tidak valid"}, status=HTTPStatus.NOT_FOUND)
            return
        if not self._require_edit_access(user, resource_key):
            return

        try:
            payload = self._parse_json_body()
        except json.JSONDecodeError:
            return

        item = payload.get("item")
        if not isinstance(item, dict):
            self._send_json({"error": "Payload item harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            return
        item["id"] = item_id

        try:
            saved_item = create_or_update_item(resource_key, item, user["id"])
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return
        self._send_json({"ok": True, "item": saved_item})

    def _handle_items_delete(self, path: str):
        user = self._require_user()
        if not user:
            return
        resource_key, item_id = self._parse_item_route(path)
        if resource_key not in RESOURCE_TABLES or not item_id:
            self._send_json({"error": "Endpoint hapus item tidak valid"}, status=HTTPStatus.NOT_FOUND)
            return
        if not self._require_edit_access(user, resource_key):
            return
        deleted = delete_item(resource_key, item_id)
        if not deleted:
            self._send_json({"error": "Item tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
            return
        self._send_json({"ok": True, "id": item_id})

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

        if not self._require_edit_access(user, resource_key):
            return

        save_state(resource_key, items, user["id"])
        self._send_json({"ok": True, "resource": resource_key, "count": len(items)})

    def _handle_update_user_role(self, username: str):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
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
