from __future__ import annotations

import json
import mimetypes
from datetime import datetime, timedelta
from http import HTTPStatus
from http.cookies import SimpleCookie
from pathlib import Path
from typing import Callable
from urllib.parse import parse_qs, unquote, urlparse

from server import (
    RESOURCE_TABLES,
    ROOT_DIR,
    SESSION_COOKIE_NAME,
    SESSION_DURATION_DAYS,
    STATE_KEYS,
    build_backup_payload,
    build_service_summary,
    can_edit_resource,
    count_admin_users,
    create_or_update_item,
    create_session,
    create_user,
    delete_item,
    delete_master_record,
    delete_session,
    export_resource_csv,
    get_item_by_id,
    get_state_snapshot,
    get_user_by_username,
    get_user_from_session,
    import_carbon_brush_from_url,
    import_negatif_list_from_url,
    import_resource_csv,
    init_db,
    list_activity_logs,
    list_items,
    list_master_records,
    list_users,
    log_activity,
    restore_backup_payload,
    save_master_record,
    save_state,
    update_user_role,
    utc_now,
    verify_password,
)


init_db()


def json_response(start_response: Callable, payload: dict, status: HTTPStatus = HTTPStatus.OK, headers: list[tuple[str, str]] | None = None):
    body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    response_headers = [
        ("Content-Type", "application/json; charset=utf-8"),
        ("Cache-Control", "no-store"),
        ("Content-Length", str(len(body))),
    ]
    if headers:
        response_headers.extend(headers)
    start_response(f"{status.value} {status.phrase}", response_headers)
    return [body]


def text_response(start_response: Callable, body_text: str, status: HTTPStatus = HTTPStatus.OK, content_type: str = "text/plain; charset=utf-8", headers: list[tuple[str, str]] | None = None):
    body = body_text.encode("utf-8")
    response_headers = [
        ("Content-Type", content_type),
        ("Cache-Control", "no-store"),
        ("Content-Length", str(len(body))),
    ]
    if headers:
        response_headers.extend(headers)
    start_response(f"{status.value} {status.phrase}", response_headers)
    return [body]


def parse_json_body(environ: dict) -> dict | None:
    try:
        length = int(environ.get("CONTENT_LENGTH") or "0")
    except ValueError:
        length = 0
    raw = environ["wsgi.input"].read(length) if length > 0 else b"{}"
    if not raw:
        raw = b"{}"
    try:
        return json.loads(raw.decode("utf-8"))
    except json.JSONDecodeError:
        return None


def read_session_cookie(environ: dict) -> str | None:
    cookie_header = environ.get("HTTP_COOKIE", "")
    if not cookie_header:
        return None
    cookies = SimpleCookie()
    cookies.load(cookie_header)
    if SESSION_COOKIE_NAME not in cookies:
        return None
    return cookies[SESSION_COOKIE_NAME].value


def build_session_cookie(token: str, expires_days: int = SESSION_DURATION_DAYS) -> str:
    expires = (datetime.utcnow() + timedelta(days=expires_days)).strftime("%a, %d %b %Y %H:%M:%S GMT")
    return f"{SESSION_COOKIE_NAME}={token}; Path=/; HttpOnly; SameSite=Lax; Expires={expires}"


def clear_session_cookie() -> str:
    return f"{SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"


def require_user(environ: dict, start_response: Callable, optional: bool = False) -> dict | None:
    token = read_session_cookie(environ)
    user = get_user_from_session(token)
    if user or optional:
        return user
    json_response(start_response, {"error": "Autentikasi diperlukan"}, status=HTTPStatus.UNAUTHORIZED)
    return None


def require_edit_access(start_response: Callable, user: dict, resource_key: str) -> bool:
    if can_edit_resource(user["role"], resource_key):
        return True
    json_response(start_response, {"error": "Akses edit tidak diizinkan untuk modul ini"}, status=HTTPStatus.FORBIDDEN)
    return False


def serve_static(environ: dict, start_response: Callable, path: str):
    relative = "index.html" if path in {"", "/"} else path.lstrip("/")
    candidate = (ROOT_DIR / relative).resolve()
    try:
        candidate.relative_to(ROOT_DIR.resolve())
    except ValueError:
        return json_response(start_response, {"error": "File tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
    if not candidate.exists() or not candidate.is_file():
        return json_response(start_response, {"error": "File tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
    content_type, _ = mimetypes.guess_type(str(candidate))
    body = candidate.read_bytes()
    start_response(
        f"{HTTPStatus.OK.value} {HTTPStatus.OK.phrase}",
        [
            ("Content-Type", content_type or "application/octet-stream"),
            ("Content-Length", str(len(body))),
        ],
    )
    return [body]


def app(environ: dict, start_response: Callable):
    method = environ.get("REQUEST_METHOD", "GET").upper()
    raw_path = environ.get("PATH_INFO", "/")
    parsed = urlparse(raw_path)
    path = parsed.path or "/"
    query = environ.get("QUERY_STRING", "")

    if not path.startswith("/api/"):
      return serve_static(environ, start_response, path)

    if method == "OPTIONS":
        start_response("204 No Content", [("Content-Length", "0"), ("Cache-Control", "no-store")])
        return [b""]

    if path == "/api/health" and method == "GET":
        return json_response(start_response, {"ok": True, "timestamp": utc_now().isoformat()})

    if path == "/api/auth/me" and method == "GET":
        user = require_user(environ, start_response, optional=True)
        return json_response(start_response, {"user": user})

    if path == "/api/bootstrap" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        return json_response(
            start_response,
            {
                "user": user,
                "data": get_state_snapshot(),
                "users": list_users() if user["role"] == "admin" else [],
            },
        )

    if path == "/api/masters" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        params = parse_qs(query or "")
        source_group = params.get("source_group", [None])[0]
        from server import list_areas, list_inspection_templates, list_equipment_references, list_app_settings
        return json_response(
            start_response,
            {
                "areas": list_areas(),
                "inspectionTemplates": list_inspection_templates(),
                "equipmentReferences": list_equipment_references(source_group),
                "appSettings": list_app_settings(),
            },
        )

    if path.startswith("/api/reports/export/") and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        resource_key = path.rsplit("/", 1)[-1]
        if resource_key not in RESOURCE_TABLES:
            return json_response(start_response, {"error": "Resource export tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
        return text_response(
            start_response,
            export_resource_csv(resource_key),
            content_type="text/csv; charset=utf-8",
            headers=[("Content-Disposition", f'attachment; filename="{resource_key}.csv"')],
        )

    if path == "/api/reports/service-summary" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        return json_response(start_response, build_service_summary())

    if path == "/api/admin/backup" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        return json_response(start_response, build_backup_payload())

    if path == "/api/admin/activity-logs" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        params = parse_qs(query or "")
        try:
            limit = int(params.get("limit", ["300"])[0])
        except ValueError:
            return json_response(start_response, {"error": "Parameter limit tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        return json_response(start_response, {"items": list_activity_logs(limit)})

    if path == "/api/users" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        if user["role"] != "admin":
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        return json_response(start_response, {"users": list_users()})

    if path == "/api/auth/login" and method == "POST":
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        username = str(payload.get("username", "")).strip()
        password = str(payload.get("password", ""))
        if not username or not password:
            return json_response(start_response, {"error": "Username dan password wajib diisi"}, status=HTTPStatus.BAD_REQUEST)
        user = get_user_by_username(username)
        if not user or not verify_password(password, user["password_hash"]):
            return json_response(start_response, {"error": "Username atau password tidak cocok"}, status=HTTPStatus.UNAUTHORIZED)
        token, _ = create_session(user["id"])
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="login",
            resource="auth",
            target_id=str(user["id"]),
            target_label=str(user["username"]),
        )
        return json_response(
            start_response,
            {"user": {"id": user["id"], "username": user["username"], "role": user["role"]}},
            headers=[("Set-Cookie", build_session_cookie(token))],
        )

    if path == "/api/auth/signup" and method == "POST":
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        username = str(payload.get("username", "")).strip()
        password = str(payload.get("password", ""))
        if not username or not password:
            return json_response(start_response, {"error": "Username dan password wajib diisi"}, status=HTTPStatus.BAD_REQUEST)
        if get_user_by_username(username):
            return json_response(start_response, {"error": "Username sudah terdaftar"}, status=HTTPStatus.CONFLICT)
        user = create_user(username, password, "team")
        token, _ = create_session(user["id"])
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="signup",
            resource="auth",
            target_id=str(user["id"]),
            target_label=str(user["username"]),
        )
        return json_response(
            start_response,
            {"user": {"id": user["id"], "username": user["username"], "role": user["role"]}},
            status=HTTPStatus.CREATED,
            headers=[("Set-Cookie", build_session_cookie(token))],
        )

    if path == "/api/auth/logout" and method == "POST":
        token = read_session_cookie(environ)
        user = get_user_from_session(token)
        if token:
            delete_session(token)
        if user:
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="logout",
                resource="auth",
                target_id=str(user["id"]),
                target_label=str(user["username"]),
            )
        return json_response(start_response, {"ok": True}, headers=[("Set-Cookie", clear_session_cookie())])

    if path == "/api/admin/restore" and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        backup = payload.get("backup")
        if not isinstance(backup, dict):
            return json_response(start_response, {"error": "Payload backup harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
        restore_backup_payload(backup)
        log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="restore", resource="backup", target_label="Restore backup aplikasi")
        return json_response(start_response, {"ok": True})

    if path.startswith("/api/admin/masters/"):
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        remainder = path.removeprefix("/api/admin/masters/").strip("/")
        if method == "GET":
            try:
                return json_response(start_response, {"items": list_master_records(remainder)})
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.NOT_FOUND)
        if method == "POST":
            payload = parse_json_body(environ)
            if payload is None:
                return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            item = payload.get("item")
            if not isinstance(item, dict):
                return json_response(start_response, {"error": "Payload item harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            try:
                saved_item = save_master_record(remainder, item)
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            label = saved_item.get("title") or saved_item.get("equipmentName") or saved_item.get("name") or saved_item.get("code") or saved_item.get("settingKey") or item.get("settingKey") or remainder
            identifier = saved_item.get("settingKey") or saved_item.get("equipmentName") or saved_item.get("code") or label
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="save", resource=f"master:{remainder}", target_id=str(identifier or ""), target_label=str(label or ""))
            return json_response(start_response, {"ok": True, "item": saved_item})
        if method == "DELETE":
            parts = remainder.split("/", 1)
            if len(parts) != 2:
                return json_response(start_response, {"error": "Endpoint hapus master tidak valid"}, status=HTTPStatus.NOT_FOUND)
            resource_name, identifier = parts[0], unquote(parts[1])
            try:
                deleted = delete_master_record(resource_name, identifier)
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            if not deleted:
                return json_response(start_response, {"error": "Master data tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="delete", resource=f"master:{resource_name}", target_id=str(identifier), target_label=str(identifier))
            return json_response(start_response, {"ok": True})

    if path.startswith("/api/admin/import/") and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        resource_name = path.removeprefix("/api/admin/import/").strip("/")
        if resource_name not in RESOURCE_TABLES:
            return json_response(start_response, {"error": "Resource import tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        csv_text = str(payload.get("csvText", "") or "")
        mode = str(payload.get("mode", "replace") or "replace")
        if not csv_text.strip():
            return json_response(start_response, {"error": "Isi CSV wajib diisi"}, status=HTTPStatus.BAD_REQUEST)
        try:
            result = import_resource_csv(resource_name, csv_text, mode, int(user["id"]))
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="import", resource=resource_name, target_label=f"Import CSV {resource_name}", detail={"mode": mode, "imported": result.get("imported", 0)})
        return json_response(start_response, {"ok": True, **result}, status=HTTPStatus.CREATED)

    if path == "/api/admin/import-carbon-brush" and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        from server import MASTER_REFERENCE_URLS
        source_url = str(payload.get("sourceUrl") or MASTER_REFERENCE_URLS["carbon-brush"]).strip()
        mode = str(payload.get("mode", "append") or "append")
        try:
            result = import_carbon_brush_from_url(source_url, mode, int(user["id"]))
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        except Exception:
            return json_response(start_response, {"error": "Gagal mengambil data carbon brush dari link sumber"}, status=HTTPStatus.BAD_GATEWAY)
        log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="import", resource="service", target_label="Import carbon brush", detail={"mode": mode, "imported": result.get("imported", 0), "sourceUrl": source_url})
        return json_response(start_response, {"ok": True, **result}, status=HTTPStatus.CREATED)

    if path == "/api/admin/import-negatif-list" and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        from server import MASTER_REFERENCE_URLS
        source_url = str(payload.get("sourceUrl") or MASTER_REFERENCE_URLS["negatif-list-import"]).strip()
        mode = str(payload.get("mode", "replace") or "replace")
        try:
            result = import_negatif_list_from_url(source_url, mode, int(user["id"]))
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        except Exception:
            return json_response(start_response, {"error": "Gagal mengambil data negatif list dari link sumber"}, status=HTTPStatus.BAD_GATEWAY)
        log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="import", resource="negatif-list", target_label="Import negatif list", detail={"mode": mode, "imported": result.get("imported", 0), "sourceUrl": source_url})
        return json_response(start_response, {"ok": True, **result}, status=HTTPStatus.CREATED)

    if path.startswith("/api/items/"):
        user = require_user(environ, start_response)
        if not user:
            return []
        parts = [part for part in path.split("/") if part]
        if len(parts) < 3:
            return json_response(start_response, {"error": "Route item tidak valid"}, status=HTTPStatus.NOT_FOUND)
        resource_key = parts[2]
        item_id = unquote(parts[3]) if len(parts) > 3 else None
        if resource_key not in RESOURCE_TABLES:
            return json_response(start_response, {"error": "Resource item tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
        if method == "GET":
            if item_id:
                item = get_item_by_id(resource_key, item_id)
                if not item:
                    return json_response(start_response, {"error": "Item tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
                return json_response(start_response, {"item": item})
            return json_response(start_response, {"items": list_items(resource_key)})
        if method == "POST":
            if item_id:
                return json_response(start_response, {"error": "Endpoint create item tidak valid"}, status=HTTPStatus.NOT_FOUND)
            if not require_edit_access(start_response, user, resource_key):
                return []
            payload = parse_json_body(environ)
            if payload is None:
                return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            item = payload.get("item")
            if not isinstance(item, dict):
                return json_response(start_response, {"error": "Payload item harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            existing_item = get_item_by_id(resource_key, str(item.get("id", ""))) if item.get("id") else None
            try:
                saved_item = create_or_update_item(resource_key, item, user["id"])
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            label = saved_item.get("equipment") or saved_item.get("equipmentName") or saved_item.get("name") or saved_item.get("materialDescription") or saved_item.get("code") or saved_item.get("id")
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="update" if existing_item else "create", resource=resource_key, target_id=str(saved_item.get("id", "")), target_label=str(label or ""))
            return json_response(start_response, {"ok": True, "item": saved_item}, status=HTTPStatus.CREATED)
        if method == "PUT":
            if not item_id:
                return json_response(start_response, {"error": "Endpoint update item tidak valid"}, status=HTTPStatus.NOT_FOUND)
            if not require_edit_access(start_response, user, resource_key):
                return []
            payload = parse_json_body(environ)
            if payload is None:
                return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            item = payload.get("item")
            if not isinstance(item, dict):
                return json_response(start_response, {"error": "Payload item harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            existing_item = get_item_by_id(resource_key, item_id)
            item["id"] = item_id
            try:
                saved_item = create_or_update_item(resource_key, item, user["id"])
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            label = saved_item.get("equipment") or saved_item.get("equipmentName") or saved_item.get("name") or saved_item.get("materialDescription") or saved_item.get("code") or saved_item.get("id")
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="update" if existing_item else "create", resource=resource_key, target_id=str(saved_item.get("id", "")), target_label=str(label or ""))
            return json_response(start_response, {"ok": True, "item": saved_item})
        if method == "DELETE":
            if not item_id:
                return json_response(start_response, {"error": "Endpoint hapus item tidak valid"}, status=HTTPStatus.NOT_FOUND)
            if not require_edit_access(start_response, user, resource_key):
                return []
            existing_item = get_item_by_id(resource_key, item_id)
            deleted = delete_item(resource_key, item_id)
            if not deleted:
                return json_response(start_response, {"error": "Item tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
            label = ""
            if existing_item:
                label = existing_item.get("equipment") or existing_item.get("equipmentName") or existing_item.get("name") or existing_item.get("materialDescription") or existing_item.get("code") or item_id
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="delete", resource=resource_key, target_id=str(item_id), target_label=str(label or item_id))
            return json_response(start_response, {"ok": True, "id": item_id})

    if path.startswith("/api/sync/") and method == "PUT":
        user = require_user(environ, start_response)
        if not user:
            return []
        resource_key = path.removeprefix("/api/sync/").strip("/")
        if resource_key not in STATE_KEYS:
            return json_response(start_response, {"error": "Resource sync tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        items = payload.get("items")
        if not isinstance(items, list):
            return json_response(start_response, {"error": "Payload items harus berupa array"}, status=HTTPStatus.BAD_REQUEST)
        if not require_edit_access(start_response, user, resource_key):
            return []
        save_state(resource_key, items, user["id"])
        log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="sync", resource=resource_key, target_label=f"Sync {resource_key}", detail={"count": len(items)})
        return json_response(start_response, {"ok": True, "resource": resource_key, "count": len(items)})

    if path.startswith("/api/users/") and path.endswith("/role") and method == "PUT":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        username = unquote(path.removeprefix("/api/users/").removesuffix("/role")).strip("/")
        if not username:
            return json_response(start_response, {"error": "Username tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        next_role = str(payload.get("role", "")).strip()
        if next_role not in {"admin", "organik", "team"}:
            return json_response(start_response, {"error": "Role tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        target_user = get_user_by_username(username)
        if not target_user:
            return json_response(start_response, {"error": "User tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
        if target_user["role"] == "admin" and next_role != "admin" and count_admin_users() <= 1:
            return json_response(start_response, {"error": "Minimal harus ada satu akun admin aktif"}, status=HTTPStatus.BAD_REQUEST)
        updated_user = update_user_role(username, next_role)
        if updated_user:
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="change-role", resource="users", target_id=str(updated_user["id"]), target_label=f"{updated_user['username']} -> {updated_user['role']}")
        return json_response(start_response, {"ok": True, "user": updated_user, "users": list_users()})

    return json_response(start_response, {"error": "Endpoint tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)


application = app
