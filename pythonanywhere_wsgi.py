from __future__ import annotations

import base64
import json
import mimetypes
from datetime import datetime, timedelta
from http import HTTPStatus
from http.cookies import SimpleCookie
from pathlib import Path
from typing import Callable
from urllib.parse import parse_qs, unquote, urlparse

import server as core
from server import (
    RESOURCE_TABLES,
    SESSION_COOKIE_NAME,
    SESSION_DURATION_DAYS,
    STATE_KEYS,
    build_backup_payload,
    build_service_summary,
    can_edit_resource,
    count_admin_users,
    create_or_update_item,
    create_or_update_service_item_atomic,
    create_session,
    create_user,
    delete_item,
    delete_master_record,
    delete_session,
    export_resource_excel,
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
    public_static_cache_control,
    restore_backup_payload,
    resolve_authenticated_media_path,
    resolve_public_static_path,
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


def require_bot_token(environ: dict, start_response: Callable) -> bool:
    headers = {
        "X-PLIRM34-Bot-Token": str(environ.get("HTTP_X_PLIRM34_BOT_TOKEN", "") or ""),
    }
    if core.verify_whatsapp_bot_token(headers):
        return True
    json_response(start_response, {"error": "Token bot tidak valid"}, status=HTTPStatus.UNAUTHORIZED)
    return False


def serve_file(start_response: Callable, candidate: Path, *, cache_control: str, head_only: bool = False):
    content_type, _ = mimetypes.guess_type(str(candidate))
    body = b"" if head_only else candidate.read_bytes()
    start_response(
        f"{HTTPStatus.OK.value} {HTTPStatus.OK.phrase}",
        [
            ("Content-Type", content_type or "application/octet-stream"),
            ("Content-Length", str(candidate.stat().st_size)),
            ("Cache-Control", cache_control),
            ("X-Content-Type-Options", "nosniff"),
        ],
    )
    return [body]


def serve_static(environ: dict, start_response: Callable, path: str):
    method = str(environ.get("REQUEST_METHOD", "GET") or "GET").upper()
    if method not in {"GET", "HEAD"}:
        return json_response(start_response, {"error": "Method tidak diizinkan"}, status=HTTPStatus.METHOD_NOT_ALLOWED)

    public_file = resolve_public_static_path(path)
    if public_file:
        query = str(environ.get("QUERY_STRING", "") or "")
        request_target = f"{path}?{query}" if query else path
        return serve_file(
            start_response,
            public_file,
            cache_control=public_static_cache_control(request_target),
            head_only=method == "HEAD",
        )

    media_file = resolve_authenticated_media_path(path)
    if media_file:
        user = require_user(environ, start_response)
        if not user:
            return []
        return serve_file(start_response, media_file, cache_control="private, max-age=300", head_only=method == "HEAD")

    return json_response(start_response, {"error": "File tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)


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
        params = parse_qs(query or "")
        requested_scope = str(params.get("scope", ["full"])[0] or "full").strip().lower()
        user_agent = str(environ.get("HTTP_USER_AGENT", "") or "")
        if "scope" not in params and "PLIRM34-Native-Android" in user_agent:
            return json_response(start_response, core.build_native_legacy_bootstrap_payload(user))
        return json_response(start_response, core.build_bootstrap_payload(user, requested_scope))

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
                "sparepartReferences": core.list_sparepart_references(),
                "appSettings": list_app_settings(),
            },
        )

    if path.startswith("/api/reports/export/") and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        resource_key = path.rsplit("/", 1)[-1]
        if resource_key == "inspection-calendar":
            params = parse_qs(query or "")
            start_date = str(params.get("start", [""])[0] or "").strip()
            end_date = str(params.get("end", [""])[0] or "").strip()
            try:
                excel_text = core.export_inspection_calendar_excel(start_date, end_date)
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return text_response(
                start_response,
                excel_text,
                content_type="application/vnd.ms-excel; charset=utf-8",
                headers=[("Content-Disposition", f'attachment; filename="inspeksi-plirm34-{start_date}-sd-{end_date}.xls"')],
            )
        if resource_key not in RESOURCE_TABLES:
            return json_response(start_response, {"error": "Resource export tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
        return text_response(
            start_response,
            export_resource_excel(resource_key),
            content_type="application/vnd.ms-excel; charset=utf-8",
            headers=[("Content-Disposition", f'attachment; filename="{resource_key}.xls"')],
        )

    if path == "/api/reports/service-summary" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        return json_response(start_response, build_service_summary())

    if path == "/api/inspection-schedule/realizations" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        params = parse_qs(query or "")
        try:
            items = core.list_inspection_schedule_realizations(
                str(params.get("start", [""])[0] or "").strip() or None,
                str(params.get("end", [""])[0] or "").strip() or None,
            )
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        return json_response(start_response, {"items": items})

    if path == "/api/carbon-brush-stock" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        params = parse_qs(query or "")
        try:
            log_limit = int(params.get("limit", ["50"])[0] or 50)
        except ValueError:
            log_limit = 50
        try:
            alert_limit = int(params.get("alertLimit", ["10"])[0] or 10)
        except ValueError:
            alert_limit = 10
        return json_response(start_response, {
            "items": core.list_carbon_brush_stock_items(),
            "logs": core.list_carbon_brush_stock_logs(log_limit),
            "alerts": core.list_carbon_brush_alert_summary(alert_limit),
            "botAlerts": core.list_carbon_brush_alert_summary(alert_limit, bot_only=True),
            "alertSettings": core.get_carbon_brush_alert_settings(),
        })

    if path == "/api/admin/whatsapp-bot" and method == "GET":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        setting = core.get_whatsapp_bot_setting()
        core.write_whatsapp_bot_runtime_config(setting)
        return json_response(start_response, {
            "settings": core.public_whatsapp_bot_setting(setting),
            "status": core.read_whatsapp_bot_status(),
        })

    if path == "/api/bot/whatsapp/negatif-list/open" and method == "GET":
        if not require_bot_token(environ, start_response):
            return []
        params = parse_qs(query or "")
        try:
            limit = int(params.get("limit", ["20"])[0])
        except ValueError:
            limit = 20
        return json_response(start_response, {"items": core.list_open_negatif_items_for_bot(limit)})

    if path == "/api/bot/whatsapp/inspection-today" and method == "GET":
        if not require_bot_token(environ, start_response):
            return []
        return json_response(start_response, {"items": core.get_today_inspection_schedule_for_bot()})

    if path == "/api/bot/whatsapp/carbon-brush-alerts" and method == "GET":
        if not require_bot_token(environ, start_response):
            return []
        params = parse_qs(query or "")
        try:
            limit = int(params.get("limit", ["10"])[0])
        except ValueError:
            limit = 10
        alert_settings = core.get_carbon_brush_alert_settings()
        return json_response(start_response, {
            "items": core.list_carbon_brush_alerts_for_bot(limit),
            "thresholdDays": int(alert_settings.get("criticalDays", 7)),
        })

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

    if path == "/api/inspection-schedule/realization" and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        try:
            item = core.save_inspection_schedule_realization(payload, user)
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        log_activity(
            actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]),
            action="save-realization", resource="inspection-schedule", target_id=item["scheduleKey"],
            target_label=item["plannedTitle"], detail={"plannedDate": item["plannedDate"], "realizedDate": item["realizedDate"]},
        )
        return json_response(start_response, {"item": item})

    if path == "/api/carbon-brush-stock/movement" and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not require_edit_access(start_response, user, "service"):
            return []
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        try:
            movement = core.save_manual_carbon_brush_stock_movement(payload, user)
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        if not movement.get("noOp"):
            log_activity(
                actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]),
                action="stock-movement", resource="carbon-brush-stock",
                target_id=str(payload.get("stockKey", "")), target_label=str(payload.get("stockKey", "")), detail=movement,
            )
        return json_response(start_response, {
            "ok": True,
            "movement": movement,
            "items": core.list_carbon_brush_stock_items(),
            "logs": core.list_carbon_brush_stock_logs(50),
            "alerts": core.list_carbon_brush_alert_summary(10),
            "botAlerts": core.list_carbon_brush_alert_summary(10, bot_only=True),
            "alertSettings": core.get_carbon_brush_alert_settings(),
        }, status=HTTPStatus.CREATED)

    if path in {"/api/admin/whatsapp-bot", "/api/admin/whatsapp-bot/reset-token"} and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        if path.endswith("/reset-token"):
            setting = core.reset_whatsapp_bot_token()
            action = "reset-token"
        else:
            payload = parse_json_body(environ)
            if payload is None:
                return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            try:
                setting = core.save_whatsapp_bot_setting(payload)
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            action = "save"
        log_activity(
            actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]),
            action=action, resource="whatsapp-bot", target_label="Setting WhatsApp Bot",
        )
        response = {"ok": True, "settings": core.public_whatsapp_bot_setting(setting)}
        if not path.endswith("/reset-token"):
            response["status"] = core.read_whatsapp_bot_status()
        return json_response(start_response, response)

    if path in {"/api/bot/whatsapp/negatif-list", "/api/bot/whatsapp/negatif-list/close"} and method == "POST":
        if not require_bot_token(environ, start_response):
            return []
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        try:
            if path.endswith("/close"):
                item, duplicate = core.close_negatif_item_from_bot(payload)
            else:
                item, duplicate = core.create_negatif_item_from_bot(payload)
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        return json_response(
            start_response,
            {"ok": True, "item": item, "duplicate": duplicate},
            status=HTTPStatus.OK if duplicate else HTTPStatus.CREATED,
        )

    if path == "/api/admin/import-sparepart-master" and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        source_url = str(payload.get("sourceUrl", "") or "").strip()
        try:
            result = core.import_sparepart_references_from_url(source_url)
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        except Exception:
            return json_response(start_response, {"error": "Gagal mengambil CSV Master Sparepart dari link sumber"}, status=HTTPStatus.BAD_GATEWAY)
        log_activity(
            actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]),
            action="import", resource="master:sparepart-references", target_label="Import Master Sparepart",
            detail={"imported": result.get("imported", 0), "skipped": result.get("skipped", 0), "sourceUrl": source_url},
        )
        return json_response(start_response, {"ok": True, **result}, status=HTTPStatus.CREATED)

    if path in {
        "/api/admin/import-mso-motor-latest",
        "/api/admin/upload-mso-motor",
        "/api/admin/import-mso-motor-scrape",
        "/api/admin/reset-mso-motor",
    } and method == "POST":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        payload = parse_json_body(environ)
        if payload is None:
            return json_response(start_response, {"error": "Body JSON tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        try:
            if path.endswith("/import-mso-motor-latest"):
                result = core.import_mso_motor_from_latest_file(int(user["id"]))
                action = "import"
                target_label = "Import MSO Motor"
            elif path.endswith("/upload-mso-motor"):
                file_name = str(payload.get("fileName", "") or "").strip()
                file_data = str(payload.get("fileData", "") or "")
                if not file_name or not file_data:
                    raise ValueError("Nama dan isi file CSV wajib diisi")
                try:
                    file_bytes = base64.b64decode(file_data.encode("ascii"), validate=True)
                except Exception as error:
                    raise ValueError("Format upload CSV tidak valid") from error
                result = core.save_uploaded_mso_motor_file(file_name, file_bytes)
                action = "upload"
                target_label = "Upload CSV MSO Motor"
            elif path.endswith("/import-mso-motor-scrape"):
                rows = payload.get("items")
                source_name = str(payload.get("sourceName", "MSO Browser Sync") or "MSO Browser Sync").strip()
                if not isinstance(rows, list) or not rows:
                    raise ValueError("Data scrape MSO kosong")
                items = core.build_mso_motor_import_items_from_rows(rows, source_name)
                result = core.import_mso_motor_items(items, int(user["id"]))
                sync_settings = core.get_app_setting_value("mso_motor_sync", core.DEFAULT_APP_SETTINGS["mso_motor_sync"])
                core.save_app_setting_value("mso_motor_sync", {
                    **sync_settings,
                    "lastImportedFile": source_name,
                    "lastImportedAt": utc_now().isoformat(),
                    "lastImportedCount": result["imported"],
                })
                result = {**result, "sourceName": source_name}
                action = "import"
                target_label = "Import MSO Motor browser sync"
            else:
                result = core.reset_mso_motor_items()
                sync_settings = core.get_app_setting_value("mso_motor_sync", core.DEFAULT_APP_SETTINGS["mso_motor_sync"])
                core.save_app_setting_value("mso_motor_sync", {
                    **sync_settings,
                    "lastImportedFile": "",
                    "lastImportedAt": "",
                    "lastImportedCount": 0,
                })
                action = "delete"
                target_label = "Reset data Motor MSO"
        except ValueError as error:
            return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        log_activity(
            actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]),
            action=action, resource="service", target_label=target_label, detail=result,
        )
        response_status = HTTPStatus.OK if path.endswith("/reset-mso-motor") else HTTPStatus.CREATED
        return json_response(start_response, {"ok": True, **result}, status=response_status)

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
            params = parse_qs(query or "")
            if resource_key == "service":
                compact = str(params.get("compact", [""])[0] or "").strip().lower() in {"1", "true", "yes"}
                try:
                    requested_limit = int(params.get("limit", ["0"])[0] or 0)
                except ValueError:
                    requested_limit = 0
                if compact or requested_limit > 0:
                    limit = min(requested_limit, 1000) if requested_limit > 0 else None
                    return json_response(start_response, {"items": core.list_service_items_compact(limit=limit)})
            if resource_key == "negatif-list":
                status = str(params.get("status", [""])[0] or "").strip()
                compact = str(params.get("compact", [""])[0] or "").strip().lower() in {"1", "true", "yes"}
                try:
                    requested_limit = int(params.get("limit", ["0"])[0] or 0)
                except ValueError:
                    requested_limit = 0
                if status or compact or requested_limit > 0:
                    limit = min(requested_limit, 1000) if requested_limit > 0 else None
                    return json_response(start_response, {
                        "items": core.list_negatif_list_items_filtered(status=status, limit=limit, compact=compact),
                    })
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
            carbon_brush_stock_result = None
            try:
                if resource_key == "service":
                    existing_item, saved_item, carbon_brush_stock_result = create_or_update_service_item_atomic(item, user)
                else:
                    saved_item = create_or_update_item(resource_key, item, user["id"])
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            label = saved_item.get("equipment") or saved_item.get("equipmentName") or saved_item.get("name") or saved_item.get("materialDescription") or saved_item.get("code") or saved_item.get("id")
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="update" if existing_item else "create", resource=resource_key, target_id=str(saved_item.get("id", "")), target_label=str(label or ""))
            response = {"ok": True, "item": saved_item}
            if carbon_brush_stock_result:
                response["carbonBrushStock"] = carbon_brush_stock_result
            return json_response(start_response, response, status=HTTPStatus.CREATED)
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
            carbon_brush_stock_result = None
            try:
                if resource_key == "service":
                    existing_item, saved_item, carbon_brush_stock_result = create_or_update_service_item_atomic(item, user)
                else:
                    saved_item = create_or_update_item(resource_key, item, user["id"])
            except ValueError as error:
                return json_response(start_response, {"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            label = saved_item.get("equipment") or saved_item.get("equipmentName") or saved_item.get("name") or saved_item.get("materialDescription") or saved_item.get("code") or saved_item.get("id")
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="update" if existing_item else "create", resource=resource_key, target_id=str(saved_item.get("id", "")), target_label=str(label or ""))
            response = {"ok": True, "item": saved_item}
            if carbon_brush_stock_result:
                response["carbonBrushStock"] = carbon_brush_stock_result
            return json_response(start_response, response)
        if method == "DELETE":
            if not item_id:
                return json_response(start_response, {"error": "Endpoint hapus item tidak valid"}, status=HTTPStatus.NOT_FOUND)
            if not require_edit_access(start_response, user, resource_key):
                return []
            if resource_key == "service" and str(user["role"]) == "team":
                return json_response(start_response, {"error": "Role team tidak diizinkan menghapus data service"}, status=HTTPStatus.FORBIDDEN)
            carbon_brush_stock_result = None
            if resource_key == "service":
                existing_item, carbon_brush_stock_result = core.delete_service_item_atomic(item_id, user)
                deleted = existing_item is not None
            else:
                existing_item = get_item_by_id(resource_key, item_id)
                deleted = delete_item(resource_key, item_id)
            if not deleted:
                return json_response(start_response, {"error": "Item tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
            label = ""
            if existing_item:
                label = existing_item.get("equipment") or existing_item.get("equipmentName") or existing_item.get("name") or existing_item.get("materialDescription") or existing_item.get("code") or item_id
            log_activity(actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]), action="delete", resource=resource_key, target_id=str(item_id), target_label=str(label or item_id))
            response = {"ok": True, "id": item_id}
            if carbon_brush_stock_result:
                response["carbonBrushStock"] = carbon_brush_stock_result
            return json_response(start_response, response)

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

    if path.startswith("/api/users/") and method == "DELETE":
        user = require_user(environ, start_response)
        if not user:
            return []
        if not can_edit_resource(user["role"], "users"):
            return json_response(start_response, {"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
        username = unquote(path.removeprefix("/api/users/")).strip("/")
        if not username:
            return json_response(start_response, {"error": "Username tidak valid"}, status=HTTPStatus.BAD_REQUEST)
        target_user = get_user_by_username(username)
        if not target_user:
            return json_response(start_response, {"error": "User tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
        if target_user["role"] == "admin" and count_admin_users() <= 1:
            return json_response(start_response, {"error": "Minimal harus ada satu akun admin aktif"}, status=HTTPStatus.BAD_REQUEST)
        deleted_user = core.delete_user_account(username)
        if deleted_user:
            log_activity(
                actor_user_id=int(user["id"]), actor_username=str(user["username"]), actor_role=str(user["role"]),
                action="delete-user", resource="users", target_id=str(deleted_user["id"]),
                target_label=str(deleted_user["username"]),
            )
        return json_response(start_response, {"ok": True, "user": deleted_user, "users": list_users()})

    return json_response(start_response, {"error": "Endpoint tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)


application = app
