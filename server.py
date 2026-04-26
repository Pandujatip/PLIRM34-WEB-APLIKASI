from __future__ import annotations

import argparse
import base64
import csv
import hashlib
import hmac
import html
import io
import json
import os
import re
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
JAKARTA_TIMEZONE = timezone(timedelta(hours=7))
CALENDAR_FEED_URL = "https://calendar.google.com/calendar/ical/adenairdrop%40gmail.com/public/basic.ics"
CALENDAR_CACHE_TTL_SECONDS = 600
MAX_JSON_BODY_BYTES = 2 * 1024 * 1024
MAX_ADMIN_IMPORT_BODY_BYTES = 6 * 1024 * 1024
MAX_BACKUP_BODY_BYTES = 12 * 1024 * 1024
MAX_MSO_UPLOAD_BODY_BYTES = 24 * 1024 * 1024
MAX_MSO_SCRAPE_BODY_BYTES = 3 * 1024 * 1024
STATE_KEYS = {
    "negatif-list": "negatif_list",
    "sparepart": "sparepart",
    "service": "service",
    "bom": "bom",
    "bom-motor": "bom_motor",
    "spb": "spb",
}
BOOTSTRAP_SCOPES = {
    "full": list(STATE_KEYS.keys()),
    "dashboard": ["negatif-list", "service", "spb"],
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
            "extra_photo",
            "long_text",
            "qty",
        ],
        "payload_keys": [
            "id",
            "equipment",
            "part",
            "note",
            "itemPhoto",
            "nameplatePhoto",
            "extraPhoto",
            "longText",
            "qty",
        ],
    },
    "bom-motor": {
        "table": "bom_motor_items",
        "columns": [
            "id",
            "inspection_date",
            "equipment",
            "manufacture",
            "power",
            "ampere",
            "voltage",
            "speed",
            "frame",
            "serial_number",
            "nameplate_photo",
            "connection_photo",
            "motor_photo",
            "note",
            "long_text",
        ],
        "payload_keys": [
            "id",
            "inspectionDate",
            "equipment",
            "manufacture",
            "power",
            "ampere",
            "voltage",
            "speed",
            "frame",
            "serialNumber",
            "nameplatePhoto",
            "connectionPhoto",
            "motorPhoto",
            "note",
            "longText",
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
            "year_label",
            "quarter_label",
            "spb_type",
            "stock_no",
            "mrp",
            "total_ece",
            "note",
            "pr_no",
            "po_no",
            "delivery_date",
        ],
        "payload_keys": [
            "id",
            "year",
            "quarter",
            "spbType",
            "notificationNo",
            "orderNo",
            "reservationNo",
            "stockNo",
            "materialDescription",
            "qty",
            "mrp",
            "totalEce",
            "note",
            "prNo",
            "poNo",
            "deliveryDate",
        ],
    },
}

IMPORT_FIELD_ALIASES = {
    "negatif-list": {
        "id": ["id"],
        "equipment": ["equipment"],
        "damageDescription": ["damageDescription", "deskripsiKerusakan", "deskripsi kerusakan"],
        "followUpPlan": ["followUpPlan", "deskripsiRencanaTindakLanjut", "deskripsi rencana tindak lanjut"],
        "foundDate": ["foundDate", "tanggalTemuan", "tanggal temuan"],
        "pendingMark": ["pendingMark", "mark"],
        "workStatus": ["workStatus", "status"],
        "category": ["category", "kategori"],
        "area": ["area"],
    },
    "sparepart": {
        "id": ["id"],
        "code": ["code", "kode"],
        "name": ["name", "nama"],
        "category": ["category", "kategori"],
        "location": ["location", "lokasi"],
        "qty": ["qty", "jumlah"],
        "condition": ["condition", "kondisi"],
    },
    "service": {
        "id": ["id"],
        "type": ["type", "inspectionType", "inspection type"],
        "subtype": ["subtype", "inspectionSubtype", "inspection subtype"],
        "formType": ["formType", "form type"],
        "equipmentName": ["equipmentName", "equipment"],
        "description": ["description", "deskripsi"],
        "detail": ["detail", "keterangan"],
        "payload": ["payload", "payloadJson", "payload json"],
    },
    "bom": {
        "id": ["id"],
        "equipment": ["equipment", "name", "nama"],
        "part": ["part", "description", "deskripsi"],
        "qty": ["qty", "jumlah"],
        "note": ["note", "meta", "keterangan"],
        "longText": ["longText", "long text"],
        "itemPhoto": ["itemPhoto", "item photo", "fotoBarang", "foto barang", "foto barang "],
        "nameplatePhoto": ["nameplatePhoto", "nameplate photo", "fotoNameplate", "foto nameplate", "foto nameplate "],
        "extraPhoto": ["extraPhoto", "extra photo", "fotoLain", "foto lain", "foto lain "],
    },
    "bom-motor": {
        "id": ["id"],
        "inspectionDate": ["inspectionDate", "tanggal"],
        "equipment": ["equipment"],
        "manufacture": ["manufacture", "manufacturer", "merk", "merek"],
        "power": ["power"],
        "ampere": ["ampere", "arus"],
        "voltage": ["voltage", "tegangan"],
        "speed": ["speed", "rpm", "kecepatan"],
        "frame": ["frame"],
        "serialNumber": ["serialNumber", "serial nr.", "serial nr", "serial number"],
        "nameplatePhoto": ["nameplatePhoto", "foto nameplate"],
        "connectionPhoto": ["connectionPhoto", "foto koneksi"],
        "motorPhoto": ["motorPhoto", "foto motor"],
        "note": ["note", "keterangan"],
        "longText": ["longText", "long text"],
    },
    "spb": {
        "id": ["id"],
        "year": ["year", "tahun", "TAHUN"],
        "quarter": ["quarter", "QUARTER"],
        "spbType": ["spbType", "type", "TYPE", "requestType", "jenisAjuan", "jenis ajuan"],
        "notificationNo": ["notificationNo", "notif", "NOTIF", "noNotifikasi", "no notifikasi"],
        "orderNo": ["orderNo", "order", "ORDER", "noOrder", "no order"],
        "reservationNo": ["reservationNo", "reservasi", "RESERVASI", "noReservasi", "no reservasi"],
        "stockNo": ["stockNo", "noStock", "no stock", "NO STOCK", "materialNo", "noMaterial", "no material"],
        "materialDescription": ["materialDescription", "deskripsiMaterial", "deskripsi material"],
        "qty": ["qty", "qtyPembelian", "qty pembelian"],
        "mrp": ["mrp", "MRP", "requestSubtype", "typeAjuan", "type ajuan"],
        "totalEce": ["totalEce", "total ece", "TOTAL ECE", "price", "hargaEcer", "harga ecer"],
        "note": ["note", "keterangan", "KETERANGAN", "status"],
        "prNo": ["prNo", "pr", "PR"],
        "poNo": ["poNo", "po", "PO"],
        "deliveryDate": ["deliveryDate", "delivDate", "deliv date", "DELIV DATE"],
    },
}

DEFAULT_USERS = [
    ("admin.plirm34", "admin123", "admin"),
    ("organik.plirm34", "organik123", "organik"),
    ("team.plirm34", "team123", "team"),
]

ROLE_EDITABLE = {
    "admin": {"negatif-list", "sparepart", "service", "bom", "bom-motor", "spb", "users"},
    "organik": {"negatif-list", "service"},
    "team": {"service"},
}

MASTER_REFERENCE_URLS = {
    "negatif-list": "https://docs.google.com/spreadsheets/d/e/2PACX-1vRt_ysTFRHmKVY3-hlFDgBYex-BExU0cdFnuBaWOPqxKAo6mqavGhtZeKdTkvvFXsm-uvcOt2QVLHHC/pub?output=csv",
    "carbon-brush": "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfKUBfJ2IEybsMUaBoZnPeTgqCdPwuGnoXPtFuLfRzydveC6cBMYobCistT3GNdm2kS7xIKUgVkAVb/pub?output=csv",
    "dcs-service": "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4f9-NuVnXVz24mPVlXP_b7rEbVGbutbSnspudmS8qztvXBEMY-Jw6moGdWWNEAHkYS68ohM2jM1E_/pub?gid=1968615039&single=true&output=csv",
    "service-mcc": "https://docs.google.com/spreadsheets/d/e/2PACX-1vS4f9-NuVnXVz24mPVlXP_b7rEbVGbutbSnspudmS8qztvXBEMY-Jw6moGdWWNEAHkYS68ohM2jM1E_/pub?gid=899226500&single=true&output=csv",
    "negatif-list-import": "https://docs.google.com/spreadsheets/d/e/2PACX-1vR6Qcrp5kjtkeRJ1IFRhHA9XLSkBmeSyo4kf8VJKyokBWJefXJmCQdBXHBTkN0DZlpvNDAbKFqzOw70/pub?output=csv",
}

CARBON_BRUSH_MEASUREMENT_ROWS = list("ABCDEFGHI")
CARBON_BRUSH_MEASUREMENT_COLUMNS = [str(index) for index in range(1, 10)]
CARBON_BRUSH_MEASUREMENT_KEYS = [
    f"{row}{column}" for row in CARBON_BRUSH_MEASUREMENT_ROWS for column in CARBON_BRUSH_MEASUREMENT_COLUMNS
]

DEFAULT_AREAS = [
    ("tuban-3", "Tuban 3", "Tuban 3", 1),
    ("tuban-4", "Tuban 4", "Tuban 4", 2),
    ("tuban-34", "Tuban 34", "Tuban 34", 3),
]

DEFAULT_INSPECTION_TEMPLATES = [
    ("service", "Electrical", "Electrical Room", "Inspeksi Electrical Room", json.dumps({
        "fields": ["panelDoorCondition", "floorCleanliness", "roomTemperature", "battery", "transformer"]
    }, ensure_ascii=False)),
    ("service", "Electrical", "Motor MSO", "Inspeksi Motor MSO", json.dumps({
        "fields": ["vibrationDe", "vibrationNde", "windingTemperature", "bearingCondition", "motorCurrent"]
    }, ensure_ascii=False)),
    ("service", "Electrical", "Motor MV (Carbon Brush)", "Inspeksi Carbon Brush", json.dumps({
        "fields": ["measurements", "replacement", "megger", "pic"]
    }, ensure_ascii=False)),
    ("service", "Electrical", "MCC", "Inspeksi MCC", json.dumps({
        "fields": ["testFunction", "visualCondition", "partCleanliness", "findingPhoto"]
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

DEFAULT_APP_SETTINGS = {
    "carbon_brush_thresholds": {
        "tuban3": {
            "low": 30,
            "high": 34,
        },
        "tuban4": {
            "low": 35,
            "high": 38,
        },
    },
    "electrical_room_references": {
        "items": ["ER17", "ER23C", "ER24"],
    },
    "electrical_room_thresholds": {
        "batteryChargeLow": 120,
        "batteryChargeHigh": 130,
        "batteryCellLow": 11.5,
        "batteryCellHigh": 12.8,
        "transformerWindingLow": 45,
        "transformerWindingHigh": 85,
        "transformerOilLow": 40,
        "transformerOilHigh": 70,
    },
    "mso_motor_sync": {
        "directory": "/opt/plirm34/imports/mso-motor",
        "pattern": "mso-motor-inspections-*.csv",
        "lastImportedFile": "",
        "lastImportedAt": "",
        "lastImportedCount": 0,
    },
}

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
    "electrical-room": [
        "ER17",
        "ER23C",
        "ER24",
    ],
    "dcs-service": [
        "Operator Station CCR-03",
        "Server Historian HS-01",
    ],
    "service-mcc": [
        "Panel MCC Finish Mill",
    ],
}

CALENDAR_CACHE = {
    "fetched_at": None,
    "payload": {
        "calendarName": "PMS PLIRM34",
        "timezone": "Asia/Jakarta",
        "today": [],
        "tomorrow": [],
        "history": [],
    },
}


class RequestBodyTooLarge(ValueError):
    pass


def format_byte_size(value: int) -> str:
    value_float = float(max(int(value or 0), 0))
    for unit in ("B", "KB", "MB", "GB"):
        if value_float < 1024 or unit == "GB":
            if unit == "B":
                return f"{int(value_float)} {unit}"
            return f"{value_float:.1f} {unit}"
        value_float /= 1024
    return f"{value_float:.1f} GB"


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def jakarta_now() -> datetime:
    return datetime.now(JAKARTA_TIMEZONE)


def add_months(source: datetime, months: int) -> datetime:
    month_index = source.month - 1 + months
    year = source.year + month_index // 12
    month = month_index % 12 + 1
    month_lengths = [
        31,
        29 if year % 4 == 0 and (year % 100 != 0 or year % 400 == 0) else 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ]
    day = min(source.day, month_lengths[month - 1])
    return source.replace(year=year, month=month, day=day)


def unfold_ics_lines(text: str) -> list[str]:
    lines: list[str] = []
    for raw_line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n"):
        if not raw_line:
            lines.append("")
            continue
        if raw_line.startswith((" ", "\t")) and lines:
            lines[-1] += raw_line[1:]
            continue
        lines.append(raw_line)
    return lines


def parse_ics_content_line(line: str) -> tuple[str, dict[str, str], str]:
    name_part, _, value = line.partition(":")
    tokens = name_part.split(";")
    name = tokens[0].upper()
    params: dict[str, str] = {}
    for token in tokens[1:]:
        param_name, _, param_value = token.partition("=")
        if param_name:
            params[param_name.upper()] = param_value
    return name, params, value


def parse_ics_datetime(raw_value: str, params: dict[str, str]) -> tuple[datetime | None, bool]:
    value = str(raw_value or "").strip()
    if not value:
        return None, False

    value_type = params.get("VALUE", "").upper()
    if value_type == "DATE" or len(value) == 8:
        try:
            parsed = datetime.strptime(value, "%Y%m%d")
            return parsed.replace(tzinfo=JAKARTA_TIMEZONE), True
        except ValueError:
            return None, True

    fmt = "%Y%m%dT%H%M%S" if len(value.rstrip("Z")) >= 15 else "%Y%m%dT%H%M"
    try:
        if value.endswith("Z"):
            parsed = datetime.strptime(value, f"{fmt}Z").replace(tzinfo=timezone.utc)
            return parsed.astimezone(JAKARTA_TIMEZONE), False
        parsed = datetime.strptime(value, fmt)
        return parsed.replace(tzinfo=JAKARTA_TIMEZONE), False
    except ValueError:
        return None, False


def parse_ics_rrule(value: str) -> dict[str, str]:
    rule: dict[str, str] = {}
    for part in str(value or "").split(";"):
        key, _, item_value = part.partition("=")
        if key:
            rule[key.upper()] = item_value
    return rule


def expand_calendar_event(raw_event: dict[str, object], target_dates: set[str]) -> list[dict[str, object]]:
    start_at = raw_event.get("startAt")
    if not isinstance(start_at, datetime):
        return []

    target_dates_sorted = sorted(target_dates)
    range_start = datetime.fromisoformat(f"{target_dates_sorted[0]}T00:00:00+07:00")
    range_end = datetime.fromisoformat(f"{target_dates_sorted[-1]}T23:59:59+07:00")
    rrule = raw_event.get("rrule") or {}
    if not isinstance(rrule, dict) or not rrule.get("FREQ"):
        if range_start <= start_at <= range_end or start_at.date().isoformat() in target_dates:
            return [raw_event]
        return []

    frequency = str(rrule.get("FREQ", "")).upper()
    if frequency not in {"DAILY", "WEEKLY", "MONTHLY"}:
        if start_at.date().isoformat() in target_dates:
            return [raw_event]
        return []

    interval = max(1, int(rrule.get("INTERVAL", "1") or "1"))
    count_limit = int(rrule.get("COUNT", "0") or "0")
    until_value = str(rrule.get("UNTIL", "") or "").strip()
    until_at = None
    if until_value:
        until_at, _ = parse_ics_datetime(until_value, {})

    results: list[dict[str, object]] = []
    occurrence = start_at
    iterations = 0
    emitted = 0
    while iterations < 512 and occurrence <= range_end:
        iterations += 1
        if until_at and occurrence > until_at:
            break
        if count_limit and emitted >= count_limit:
            break
        if occurrence >= range_start and occurrence.date().isoformat() in target_dates:
            event_copy = dict(raw_event)
            event_copy["startAt"] = occurrence
            results.append(event_copy)
        emitted += 1
        if frequency == "DAILY":
            occurrence += timedelta(days=interval)
        elif frequency == "WEEKLY":
            occurrence += timedelta(days=7 * interval)
        else:
            occurrence = add_months(occurrence, interval)
    return results


def build_calendar_schedule() -> dict[str, object]:
    now = jakarta_now()
    if (
        isinstance(CALENDAR_CACHE.get("fetched_at"), datetime)
        and (now - CALENDAR_CACHE["fetched_at"]).total_seconds() < CALENDAR_CACHE_TTL_SECONDS
    ):
        return CALENDAR_CACHE["payload"]

    schedule = {
        "calendarName": "PMS PLIRM34",
        "timezone": "Asia/Jakarta",
        "today": [],
        "tomorrow": [],
        "history": [],
    }

    target_today = now.date().isoformat()
    target_tomorrow = (now.date() + timedelta(days=1)).isoformat()
    history_start_date = now.date() - timedelta(days=90)
    target_dates = {
        (history_start_date + timedelta(days=index)).isoformat()
        for index in range((now.date() - history_start_date).days + 2)
    }

    try:
        with urlopen(CALENDAR_FEED_URL, timeout=10) as response:
            ics_text = response.read().decode("utf-8", errors="replace")
    except Exception:
        CALENDAR_CACHE["fetched_at"] = now
        CALENDAR_CACHE["payload"] = schedule
        return schedule

    events: list[dict[str, object]] = []
    recurring_exceptions: dict[str, set[str]] = {}
    current_event: dict[str, object] | None = None

    for line in unfold_ics_lines(ics_text):
        if line == "BEGIN:VEVENT":
            current_event = {}
            continue
        if line == "END:VEVENT":
            if current_event:
                start_at = current_event.get("DTSTART_VALUE")
                start_params = current_event.get("DTSTART_PARAMS", {})
                parsed_start, is_all_day = parse_ics_datetime(
                    str(start_at or ""),
                    start_params if isinstance(start_params, dict) else {},
                )
                if parsed_start:
                    uid = str(current_event.get("UID", "") or "")
                    recurrence_id_value = current_event.get("RECURRENCE_ID_VALUE")
                    recurrence_id_params = current_event.get("RECURRENCE_ID_PARAMS", {})
                    recurrence_id, _ = parse_ics_datetime(
                        str(recurrence_id_value or ""),
                        recurrence_id_params if isinstance(recurrence_id_params, dict) else {},
                    )
                    if uid and recurrence_id:
                        recurring_exceptions.setdefault(uid, set()).add(recurrence_id.date().isoformat())
                    raw_event = {
                        "uid": uid,
                        "summary": str(current_event.get("SUMMARY", "") or "Jadwal inspeksi"),
                        "location": str(current_event.get("LOCATION", "") or ""),
                        "description": str(current_event.get("DESCRIPTION", "") or ""),
                        "startAt": parsed_start,
                        "allDay": is_all_day,
                        "rrule": parse_ics_rrule(str(current_event.get("RRULE", "") or "")),
                        "recurrenceId": recurrence_id,
                    }
                    if recurrence_id:
                        if parsed_start.date().isoformat() in target_dates:
                            events.append(raw_event)
                    else:
                        events.extend(expand_calendar_event(raw_event, target_dates))
            current_event = None
            continue

        name, params, value = parse_ics_content_line(line)
        if current_event is None:
            if name == "X-WR-CALNAME" and value:
                schedule["calendarName"] = value
            if name == "X-WR-TIMEZONE" and value:
                schedule["timezone"] = value
            continue

        if name == "DTSTART":
            current_event["DTSTART_VALUE"] = value
            current_event["DTSTART_PARAMS"] = params
        elif name == "RECURRENCE-ID":
            current_event["RECURRENCE_ID_VALUE"] = value
            current_event["RECURRENCE_ID_PARAMS"] = params
        elif name in {"SUMMARY", "LOCATION", "DESCRIPTION", "RRULE", "UID"}:
            current_event[name] = value.replace("\\n", "\n").strip()

    filtered_events: list[dict[str, object]] = []
    for event in events:
        uid = str(event.get("uid", "") or "")
        recurrence_id = event.get("recurrenceId")
        start_at = event.get("startAt")
        if recurrence_id:
            filtered_events.append(event)
            continue
        if isinstance(start_at, datetime) and uid and start_at.date().isoformat() in recurring_exceptions.get(uid, set()):
            continue
        filtered_events.append(event)

    filtered_events.sort(key=lambda item: item["startAt"])
    for event in filtered_events:
        start_at = event.get("startAt")
        if not isinstance(start_at, datetime):
            continue
        entry = {
            "summary": event.get("summary") or "Jadwal inspeksi",
            "location": event.get("location") or "",
            "description": event.get("description") or "",
            "date": start_at.date().isoformat(),
            "timeLabel": "Seharian" if event.get("allDay") else start_at.strftime("%H:%M"),
            "allDay": bool(event.get("allDay")),
        }
        if entry["date"] == target_today:
            schedule["today"].append(entry)
        elif entry["date"] == target_tomorrow:
            schedule["tomorrow"].append(entry)
        elif history_start_date.isoformat() <= entry["date"] < target_today:
            schedule["history"].append(entry)

    schedule["history"].sort(key=lambda item: item["date"], reverse=True)
    schedule["history"] = schedule["history"][:30]

    CALENDAR_CACHE["fetched_at"] = now
    CALENDAR_CACHE["payload"] = schedule
    return schedule


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


def checkpoint_connection(connection: sqlite3.Connection) -> None:
    try:
        connection.execute("PRAGMA wal_checkpoint(FULL)")
    except sqlite3.DatabaseError:
        pass


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

            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                actor_user_id INTEGER,
                actor_username TEXT NOT NULL,
                actor_role TEXT NOT NULL,
                action TEXT NOT NULL,
                resource TEXT NOT NULL,
                target_id TEXT NOT NULL DEFAULT '',
                target_label TEXT NOT NULL DEFAULT '',
                detail_json TEXT NOT NULL DEFAULT '{}',
                created_at TEXT NOT NULL,
                FOREIGN KEY (actor_user_id) REFERENCES users (id) ON DELETE SET NULL
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

            CREATE TABLE IF NOT EXISTS app_settings (
                setting_key TEXT PRIMARY KEY,
                value_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
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

            CREATE TABLE IF NOT EXISTS service_electrical_room_details (
                service_id TEXT PRIMARY KEY,
                panel_door_condition TEXT NOT NULL DEFAULT '',
                floor_cleanliness TEXT NOT NULL DEFAULT '',
                room_temperature TEXT NOT NULL DEFAULT '',
                battery_vdc TEXT NOT NULL DEFAULT '',
                battery_ampere TEXT NOT NULL DEFAULT '',
                battery_total_vdc TEXT NOT NULL DEFAULT '',
                battery_json TEXT NOT NULL DEFAULT '{}',
                transformer_equipment TEXT NOT NULL DEFAULT '',
                transformer_winding_temperature TEXT NOT NULL DEFAULT '',
                transformer_oil_temperature TEXT NOT NULL DEFAULT '',
                transformer_oil_level TEXT NOT NULL DEFAULT '',
                transformer_silica_gel TEXT NOT NULL DEFAULT '',
                finding_photo_name TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (service_id) REFERENCES service_items (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS service_motor_mv_details (
                service_id TEXT PRIMARY KEY,
                vibration_de TEXT NOT NULL DEFAULT '',
                vibration_nde TEXT NOT NULL DEFAULT '',
                winding_temperature TEXT NOT NULL DEFAULT '',
                bearing_condition TEXT NOT NULL DEFAULT '',
                motor_current TEXT NOT NULL DEFAULT '',
                source_name TEXT NOT NULL DEFAULT '',
                insp_id TEXT NOT NULL DEFAULT '',
                id_amtrans TEXT NOT NULL DEFAULT '',
                condition_label TEXT NOT NULL DEFAULT '',
                creator_name TEXT NOT NULL DEFAULT '',
                equipment_desc TEXT NOT NULL DEFAULT '',
                photo_url TEXT NOT NULL DEFAULT '',
                temperatur_ds TEXT NOT NULL DEFAULT '',
                temperatur_nds TEXT NOT NULL DEFAULT '',
                mplant TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (service_id) REFERENCES service_items (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS service_motor_mv_carbon_brush_details (
                service_id TEXT PRIMARY KEY,
                plant TEXT NOT NULL DEFAULT '',
                location TEXT NOT NULL DEFAULT '',
                equipment_category TEXT NOT NULL DEFAULT '',
                replacement_count TEXT NOT NULL DEFAULT '',
                megger_value TEXT NOT NULL DEFAULT '',
                pic TEXT NOT NULL DEFAULT '',
                measurements_json TEXT NOT NULL DEFAULT '{}',
                stats_json TEXT NOT NULL DEFAULT '{}',
                FOREIGN KEY (service_id) REFERENCES service_items (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS service_mcc_details (
                service_id TEXT PRIMARY KEY,
                test_function TEXT NOT NULL DEFAULT '',
                visual_condition TEXT NOT NULL DEFAULT '',
                part_cleanliness TEXT NOT NULL DEFAULT '',
                finding_photo_name TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (service_id) REFERENCES service_items (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS service_ehca_details (
                service_id TEXT PRIMARY KEY,
                system_pressure TEXT NOT NULL DEFAULT '',
                fluid_level TEXT NOT NULL DEFAULT '',
                filter_condition TEXT NOT NULL DEFAULT '',
                leak_condition TEXT NOT NULL DEFAULT '',
                unit_condition TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (service_id) REFERENCES service_items (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS service_instrument_details (
                service_id TEXT PRIMARY KEY,
                sensor_condition TEXT NOT NULL DEFAULT '',
                finding_photo_name TEXT NOT NULL DEFAULT '',
                finding_photo_data TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (service_id) REFERENCES service_items (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS service_dcs_details (
                service_id TEXT PRIMARY KEY,
                equipment_function TEXT NOT NULL DEFAULT '',
                environment_cleanliness TEXT NOT NULL DEFAULT '',
                FOREIGN KEY (service_id) REFERENCES service_items (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS bom_items (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                meta TEXT NOT NULL,
                item_photo TEXT NOT NULL,
                nameplate_photo TEXT NOT NULL,
                extra_photo TEXT NOT NULL DEFAULT '',
                long_text TEXT NOT NULL DEFAULT '',
                qty TEXT NOT NULL DEFAULT '',
                created_by_user_id INTEGER,
                updated_by_user_id INTEGER,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS bom_motor_items (
                id TEXT PRIMARY KEY,
                inspection_date TEXT NOT NULL,
                equipment TEXT NOT NULL,
                manufacture TEXT NOT NULL,
                power TEXT NOT NULL,
                ampere TEXT NOT NULL,
                voltage TEXT NOT NULL,
                speed TEXT NOT NULL,
                frame TEXT NOT NULL,
                serial_number TEXT NOT NULL,
                nameplate_photo TEXT NOT NULL,
                connection_photo TEXT NOT NULL,
                motor_photo TEXT NOT NULL,
                note TEXT NOT NULL,
                long_text TEXT NOT NULL,
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
                year_label TEXT NOT NULL,
                quarter_label TEXT NOT NULL,
                spb_type TEXT NOT NULL,
                stock_no TEXT NOT NULL,
                mrp TEXT NOT NULL,
                total_ece TEXT NOT NULL,
                note TEXT NOT NULL,
                pr_no TEXT NOT NULL,
                po_no TEXT NOT NULL,
                delivery_date TEXT NOT NULL,
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
        ensure_audit_columns(connection)
        ensure_bom_columns(connection)
        ensure_spb_columns(connection)
        ensure_service_motor_mv_columns(connection)
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


def list_users_for_backup() -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT username, password_hash, role, created_at FROM users ORDER BY lower(username)"
        ).fetchall()
    return [dict(row) for row in rows]


def truncate_log_label(value: str, max_length: int = 140) -> str:
    text = str(value or "").strip()
    if len(text) <= max_length:
        return text
    return f"{text[:max_length - 3]}..."


def log_activity(
    *,
    actor_user_id: int | None,
    actor_username: str,
    actor_role: str,
    action: str,
    resource: str,
    target_id: str = "",
    target_label: str = "",
    detail: dict | None = None,
) -> None:
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO activity_logs (
                actor_user_id, actor_username, actor_role, action, resource,
                target_id, target_label, detail_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                actor_user_id,
                actor_username or "-",
                actor_role or "-",
                action,
                resource,
                str(target_id or ""),
                truncate_log_label(target_label),
                json.dumps(detail if isinstance(detail, dict) else {}, ensure_ascii=False),
                utc_now().isoformat(),
            ),
        )
        checkpoint_connection(connection)


def list_activity_logs(limit: int = 300) -> list[dict]:
    safe_limit = max(1, min(int(limit or 300), 1000))
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT id, actor_user_id, actor_username, actor_role, action, resource,
                   target_id, target_label, detail_json, created_at
            FROM activity_logs
            ORDER BY id DESC
            LIMIT ?
            """,
            (safe_limit,),
        ).fetchall()
    items = []
    for row in rows:
        try:
            detail = json.loads(row["detail_json"])
        except json.JSONDecodeError:
            detail = {}
        items.append(
            {
                "id": row["id"],
                "actorUserId": row["actor_user_id"],
                "actorUsername": row["actor_username"],
                "actorRole": row["actor_role"],
                "action": row["action"],
                "resource": row["resource"],
                "targetId": row["target_id"],
                "targetLabel": row["target_label"],
                "detail": detail if isinstance(detail, dict) else {},
                "createdAt": row["created_at"],
            }
        )
    return items


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


def delete_user_account(username: str) -> dict | None:
    with get_connection() as connection:
        existing = connection.execute(
            "SELECT id, username, role, created_at FROM users WHERE lower(username) = lower(?)",
            (username,),
        ).fetchone()
        if not existing:
            return None

        connection.execute("DELETE FROM sessions WHERE user_id = ?", (existing["id"],))
        connection.execute("DELETE FROM users WHERE id = ?", (existing["id"],))
    return dict(existing)


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


def build_service_list_payload(payload: dict) -> dict:
    if not isinstance(payload, dict):
        return {}

    compact_payload: dict[str, object] = {}
    for key, value in payload.items():
        if key == "findingPhotoData":
            compact_payload[key] = ""
            continue
        if key == "findingPhotos":
            if isinstance(value, list):
                compact_payload[key] = [
                    {
                        "name": str(entry.get("name", "") or "").strip(),
                        "data": "",
                    }
                    for entry in value
                    if isinstance(entry, dict) and str(entry.get("name", "") or "").strip()
                ]
            else:
                compact_payload[key] = []
            continue
        compact_payload[key] = value

    return compact_payload


def get_state_snapshot(resource_keys: list[str] | None = None) -> dict:
    selected_keys = [
        resource_key
        for resource_key in (resource_keys or list(STATE_KEYS.keys()))
        if resource_key in STATE_KEYS
    ]
    snapshot: dict[str, list[dict]] = {}
    for resource_key in selected_keys:
        snapshot_key = STATE_KEYS[resource_key]
        snapshot[snapshot_key] = load_resource_items(resource_key, include_media=(resource_key != "service"))
    return snapshot


def get_resource_counts(resource_keys: list[str] | None = None) -> dict[str, int]:
    selected_keys = [
        resource_key
        for resource_key in (resource_keys or list(STATE_KEYS.keys()))
        if resource_key in RESOURCE_TABLES
    ]
    counts = {resource_key: 0 for resource_key in selected_keys}
    if not selected_keys:
        return counts

    with get_connection() as connection:
        for resource_key in selected_keys:
            table_name = RESOURCE_TABLES[resource_key]["table"]
            row = connection.execute(f"SELECT COUNT(*) AS total FROM {table_name}").fetchone()
            counts[resource_key] = int(row["total"] or 0) if row else 0
    return counts


def build_bootstrap_payload(user: dict, scope: str = "full") -> dict:
    resolved_scope = scope if scope in BOOTSTRAP_SCOPES else "full"
    resource_keys = BOOTSTRAP_SCOPES[resolved_scope]
    return {
        "user": user,
        "data": get_state_snapshot(resource_keys),
        "calendar": build_calendar_schedule(),
        "users": list_users() if user["role"] == "admin" else [],
        "resourceCounts": get_resource_counts(),
        "loadedResources": resource_keys,
        "scope": resolved_scope,
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
        checkpoint_connection(connection)


def get_item_by_id(resource_key: str, item_id: str) -> dict | None:
    resource_config = RESOURCE_TABLES[resource_key]
    with get_connection() as connection:
        row = connection.execute(
            f"SELECT * FROM {resource_config['table']} WHERE id = ?",
            (item_id,),
        ).fetchone()
    return deserialize_resource_item(resource_key, row) if row else None


def list_items(resource_key: str) -> list[dict]:
    return load_resource_items(resource_key, include_media=(resource_key != "service"))


def create_or_update_item(resource_key: str, item: dict, user_id: int) -> dict:
    if not item.get("id"):
        raise ValueError("ID item wajib ada")

    with get_connection() as connection:
        upsert_resource_item(connection, resource_key, item, user_id)
        refresh_snapshot(connection, resource_key)
        checkpoint_connection(connection)

    saved_item = get_item_by_id(resource_key, str(item["id"]))
    if not saved_item:
        raise ValueError("Gagal menyimpan item")
    return saved_item


def upsert_resource_item(connection: sqlite3.Connection, resource_key: str, item: dict, user_id: int) -> None:
    if not item.get("id"):
        raise ValueError("ID item wajib ada")

    resource_config = RESOURCE_TABLES[resource_key]
    table = resource_config["table"]
    columns = resource_config["columns"]
    placeholders = ", ".join(["?"] * (len(columns) + 3))
    insert_columns = ", ".join(columns + ["created_by_user_id", "updated_by_user_id", "updated_at"])
    update_assignments = ", ".join([f"{column} = excluded.{column}" for column in columns[1:]])

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
    if resource_key == "service":
        sync_service_detail_tables(connection, item)


def generate_import_id(resource_key: str) -> str:
    prefix = resource_key.replace("-", "")[:6]
    return f"{prefix}-{datetime.now().strftime('%Y%m%d%H%M%S%f')}-{secrets.token_hex(2)}"


def normalize_import_headers(fieldnames: list[str] | None) -> dict[str, str]:
    mapping: dict[str, str] = {}
    if not fieldnames:
        return mapping
    for header in fieldnames:
        normalized = str(header or "").strip()
        if normalized:
            mapping[normalized.casefold()] = normalized
    return mapping


def resolve_import_value(row: dict, header_map: dict[str, str], aliases: list[str]) -> str:
    for alias in aliases:
        actual = header_map.get(alias.casefold())
        if actual and actual in row:
            return str(row.get(actual, "")).strip()
    return ""


def parse_csv_import_items(resource_key: str, csv_text: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(csv_text))
    header_map = normalize_import_headers(reader.fieldnames)
    aliases = IMPORT_FIELD_ALIASES[resource_key]
    items: list[dict] = []

    for row in reader:
        if not any(str(value or "").strip() for value in row.values()):
            continue

        item: dict[str, object] = {}
        for payload_key, payload_aliases in aliases.items():
            raw_value = resolve_import_value(row, header_map, payload_aliases)
            if payload_key == "payload":
                if raw_value:
                    try:
                        item[payload_key] = json.loads(raw_value)
                    except json.JSONDecodeError as exc:
                        raise ValueError(f"Payload JSON service tidak valid: {exc.msg}") from exc
                else:
                    item[payload_key] = {}
                continue
            item[payload_key] = raw_value

        if not str(item.get("id", "")).strip():
            item["id"] = generate_import_id(resource_key)
        items.append(item)

    return items


def import_resource_csv(resource_key: str, csv_text: str, mode: str, user_id: int) -> dict:
    if mode not in {"replace", "append"}:
        raise ValueError("Mode import harus replace atau append")

    items = parse_csv_import_items(resource_key, csv_text)
    if not items:
        raise ValueError("CSV tidak berisi data yang bisa diimport")

    if mode == "replace":
        with get_connection() as connection:
            replace_resource_items(connection, resource_key, items, user_id=user_id)
            refresh_snapshot(connection, resource_key)
        return {"imported": len(items), "mode": mode}

    imported = 0
    for item in items:
        create_or_update_item(resource_key, item, user_id)
        imported += 1
    return {"imported": imported, "mode": mode}


def import_carbon_brush_from_url(source_url: str, mode: str, user_id: int) -> dict:
    csv_text = fetch_remote_text(normalize_google_sheet_csv_url(source_url))
    items = build_carbon_brush_import_items(csv_text)
    if not items:
        raise ValueError("CSV carbon brush tidak berisi data yang bisa diimport")

    if mode not in {"replace", "append"}:
        raise ValueError("Mode import harus replace atau append")

    if mode == "replace":
        existing_items = [
            item for item in load_resource_items("service")
            if item.get("formType") != "service-motor-mv-carbon-brush"
        ]
        existing_items.extend(items)
        save_state("service", existing_items, user_id=user_id)
        return {"imported": len(items), "mode": mode}

    imported = 0
    for item in items:
        create_or_update_item("service", item, user_id)
        imported += 1
    return {"imported": imported, "mode": mode}


def parse_mso_datetime(raw_value: str) -> str:
    raw = str(raw_value or "").strip()
    if not raw:
        return utc_now().isoformat()
    for fmt in ("%d/%m/%Y %H:%M:%S", "%d/%m/%Y %H:%M", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(raw, fmt).isoformat()
        except ValueError:
            continue
    return utc_now().isoformat()


def read_text_with_fallbacks(file_path: Path) -> str:
    last_error: UnicodeDecodeError | None = None
    for encoding in ("utf-8-sig", "utf-8", "latin-1"):
        try:
            return file_path.read_text(encoding=encoding)
        except UnicodeDecodeError as exc:
            last_error = exc
    if last_error:
        raise ValueError("File CSV tidak dapat dibaca dengan encoding umum")
    return file_path.read_text()


def extract_mso_motor_measurements(row: dict) -> dict:
    data = {
        "temperatureDs": str(row.get("temperaturDs") or "").strip(),
        "temperatureNds": str(row.get("temperaturNds") or "").strip(),
        "geDsVertBefore": str(row.get("geDsVertBefore") or "").strip(),
        "geDsHorBefore": str(row.get("geDsHorBefore") or "").strip(),
        "geDsAxialBefore": str(row.get("geDsAxialBefore") or "").strip(),
        "vibrasiDsVertBefore": str(row.get("vibrasiDsVertBefore") or "").strip(),
        "vibrasiDsHorBefore": str(row.get("vibrasiDsHorBefore") or "").strip(),
        "vibrasiDsAxialBefore": str(row.get("vibrasiDsAxialBefore") or "").strip(),
        "geNdsVertBefore": str(row.get("geNdsVertBefore") or "").strip(),
        "geNdsHorBefore": str(row.get("geNdsHorBefore") or "").strip(),
        "geNdsAxialBefore": str(row.get("geNdsAxialBefore") or "").strip(),
        "vibrasiNdsVertBefore": str(row.get("vibrasiNdsVertBefore") or "").strip(),
        "vibrasiNdsHorBefore": str(row.get("vibrasiNdsHorBefore") or "").strip(),
        "vibrasiNdsAxialBefore": str(row.get("vibrasiNdsAxialBefore") or "").strip(),
        "regreaseDe": str(row.get("regreaseDe") or "").strip(),
        "regreaseNde": str(row.get("regreaseNde") or "").strip(),
        "geDsVertAfter": str(row.get("geDsVertAfter") or "").strip(),
        "geDsHorAfter": str(row.get("geDsHorAfter") or "").strip(),
        "geDsAxialAfter": str(row.get("geDsAxialAfter") or "").strip(),
        "vibrasiDsVertAfter": str(row.get("vibrasiDsVertAfter") or "").strip(),
        "vibrasiDsHorAfter": str(row.get("vibrasiDsHorAfter") or "").strip(),
        "vibrasiDsAxialAfter": str(row.get("vibrasiDsAxialAfter") or "").strip(),
        "geNdsVertAfter": str(row.get("geNdsVertAfter") or "").strip(),
        "geNdsHorAfter": str(row.get("geNdsHorAfter") or "").strip(),
        "geNdsAxialAfter": str(row.get("geNdsAxialAfter") or "").strip(),
        "vibrasiNdsVertAfter": str(row.get("vibrasiNdsVertAfter") or "").strip(),
        "vibrasiNdsHorAfter": str(row.get("vibrasiNdsHorAfter") or "").strip(),
        "vibrasiNdsAxialAfter": str(row.get("vibrasiNdsAxialAfter") or "").strip(),
        "kelengkapanMotor": str(row.get("kelengkapanMotor") or "").strip(),
        "inspectionNote": str(row.get("inspectionNote") or row.get("keterangan") or "").strip(),
    }
    return data


def build_mso_motor_import_items(csv_text: str, source_name: str = "") -> list[dict]:
    reader = csv.DictReader(io.StringIO(csv_text))
    items: list[dict] = []

    for row in reader:
        insp_id = str(row.get("inspId", "") or "").strip()
        equipment_name = str(row.get("equptName", "") or "").strip().upper()
        if not insp_id or not equipment_name:
            continue

        inspection_date = parse_mso_datetime(str(row.get("tgl", "") or ""))
        condition = str(row.get("condition", "") or "").strip().upper()
        description = str(row.get("descr", "") or "").strip()
        equipment_desc = str(row.get("equipmentDesc", "") or "").strip()
        temperatur_ds = str(row.get("temperaturDs", "") or "").strip()
        temperatur_nds = str(row.get("temperaturNds", "") or "").strip()
        creator = str(row.get("creator", "") or "").strip()
        photo_url = str(row.get("photoPath", "") or "").strip()
        id_amtrans = str(row.get("idAmtrans", "") or "").strip()
        mplant = str(row.get("mplant", "") or "").strip()
        measurements = extract_mso_motor_measurements(row)
        detail_parts = [
            f"Condition: {condition or '-'}",
            f"Temp DS: {temperatur_ds or '-'}",
            f"Temp NDS: {temperatur_nds or '-'}",
            f"InspID: {insp_id}",
        ]
        if creator:
            detail_parts.append(f"PIC: {creator}")

        items.append(
            {
                "id": f"service-mso-motor-{insp_id}",
                "type": "Electrical",
                "subtype": "Motor MSO",
                "formType": "service-motor-mso",
                "equipmentName": equipment_name,
                "description": description or equipment_desc or "-",
                "detail": " | ".join(detail_parts),
                "payload": {
                    "inspectionDate": inspection_date,
                    "source": "MSO",
                    "sourceType": "mso-motor-sync",
                    "sourceFile": source_name,
                    "inspId": insp_id,
                    "idAmtrans": id_amtrans,
                    "condition": condition,
                    "equipmentDesc": equipment_desc,
                    "creator": creator,
                    "mplant": mplant,
                    "temperaturDs": temperatur_ds,
                    "temperaturNds": temperatur_nds,
                    "photoUrl": photo_url,
                    "descriptionRaw": description,
                    **measurements,
                    "vibrationDe": "",
                    "vibrationNde": "",
                    "windingTemperature": "",
                    "bearingCondition": "",
                    "motorCurrent": "",
                },
            }
        )

    return items


def build_mso_motor_import_items_from_rows(rows: list[dict], source_name: str = "") -> list[dict]:
    items: list[dict] = []
    for raw_row in rows:
        if not isinstance(raw_row, dict):
            continue
        insp_id = str(raw_row.get("inspId") or "").strip()
        if not insp_id:
            continue
        inspection_date_raw = str(raw_row.get("tgl") or raw_row.get("inspectionDate") or "").strip()
        inspection_date = parse_mso_datetime(inspection_date_raw)
        equipment_name = str(raw_row.get("equptName") or raw_row.get("equipmentName") or "-").strip() or "-"
        equipment_desc = str(raw_row.get("equipmentDesc") or "").strip()
        condition = str(raw_row.get("condition") or "-").strip() or "-"
        descr = str(raw_row.get("descr") or raw_row.get("description") or "").strip()
        temperatur_ds = str(raw_row.get("temperaturDs") or "").strip()
        temperatur_nds = str(raw_row.get("temperaturNds") or "").strip()
        creator = str(raw_row.get("creator") or "").strip()
        id_amtrans = str(raw_row.get("idAmtrans") or "").strip()
        photo_url = str(raw_row.get("photoPath") or raw_row.get("photoUrl") or "").strip()
        mplant = str(raw_row.get("mplant") or "").strip()
        measurements = extract_mso_motor_measurements(raw_row)
        detail_parts = [
            f"Condition: {condition}",
            f"Temp DS: {temperatur_ds or '-'}",
            f"Temp NDS: {temperatur_nds or '-'}",
            f"InspID: {insp_id}",
        ]
        if creator:
            detail_parts.append(f"PIC: {creator}")
        items.append(
            {
                "id": f"service-mso-motor-{insp_id}",
                "type": "Electrical",
                "subtype": "Motor MSO",
                "formType": "service-motor-mso",
                "equipmentName": equipment_name,
                "description": descr or equipment_desc or f"Inspection {condition}",
                "detail": " | ".join(detail_parts),
                "payload": {
                    "inspectionDate": inspection_date,
                    "source": "MSO",
                    "sourceType": "mso-motor-sync",
                    "sourceName": source_name or "MSO Browser Sync",
                    "inspId": insp_id,
                    "idAmtrans": id_amtrans,
                    "condition": condition,
                    "equipmentDesc": equipment_desc,
                    "creator": creator,
                    "mplant": mplant,
                    "temperaturDs": temperatur_ds,
                    "temperaturNds": temperatur_nds,
                    "photoUrl": photo_url,
                    "descriptionRaw": descr,
                    **measurements,
                    "vibrationDe": "",
                    "vibrationNde": "",
                    "windingTemperature": "",
                    "bearingCondition": "",
                    "motorCurrent": "",
                },
            }
        )
    return items


def import_mso_motor_items(items: list[dict], user_id: int) -> dict:
    if not items:
        raise ValueError("CSV MSO motor tidak berisi data yang bisa diimport")

    with get_connection() as connection:
        existing_ids = {
            str(row["id"])
            for row in connection.execute("SELECT id FROM service_items").fetchall()
        }
        created = 0
        updated = 0
        for item in items:
            if item["id"] in existing_ids:
                updated += 1
            else:
                created += 1
                existing_ids.add(item["id"])
            upsert_resource_item(connection, "service", item, user_id)
        refresh_snapshot(connection, "service")
        checkpoint_connection(connection)
    return {"imported": len(items), "created": created, "updated": updated, "mode": "append"}


def import_mso_motor_from_latest_file(user_id: int) -> dict:
    sync_settings = get_app_setting_value("mso_motor_sync", DEFAULT_APP_SETTINGS["mso_motor_sync"])
    directory = Path(str(sync_settings.get("directory") or DEFAULT_APP_SETTINGS["mso_motor_sync"]["directory"]).strip())
    pattern = str(sync_settings.get("pattern") or DEFAULT_APP_SETTINGS["mso_motor_sync"]["pattern"]).strip()
    if not directory.exists() or not directory.is_dir():
        raise ValueError(f"Folder sinkronisasi MSO tidak ditemukan: {directory}")
    if not pattern:
        raise ValueError("Pattern file MSO belum diatur")

    latest_files = sorted(directory.glob(pattern), key=lambda path: path.stat().st_mtime, reverse=True)
    if not latest_files:
        raise ValueError(f"Tidak ada file CSV yang cocok dengan pattern {pattern} di folder {directory}")

    latest_file = latest_files[0]
    csv_text = read_text_with_fallbacks(latest_file)
    items = build_mso_motor_import_items(csv_text, latest_file.name)
    result = import_mso_motor_items(items, user_id)
    updated_settings = {
        **sync_settings,
        "directory": str(directory),
        "pattern": pattern,
        "lastImportedFile": latest_file.name,
        "lastImportedAt": utc_now().isoformat(),
        "lastImportedCount": result["imported"],
    }
    save_app_setting_value("mso_motor_sync", updated_settings)
    return {
        **result,
        "fileName": latest_file.name,
        "directory": str(directory),
        "pattern": pattern,
    }


def reset_mso_motor_items() -> dict:
    with get_connection() as connection:
        service_ids = [
            str(row["id"])
            for row in connection.execute(
                "SELECT id FROM service_items WHERE form_type = ?",
                ("service-motor-mso",),
            ).fetchall()
        ]
        if not service_ids:
            refresh_snapshot(connection, "service")
            checkpoint_connection(connection)
            return {"deleted": 0}

        placeholders = ", ".join(["?"] * len(service_ids))
        connection.execute(
            f"DELETE FROM service_motor_mv_details WHERE service_id IN ({placeholders})",
            service_ids,
        )
        cursor = connection.execute(
            f"DELETE FROM service_items WHERE id IN ({placeholders})",
            service_ids,
        )
        deleted = int(cursor.rowcount or 0)
        refresh_snapshot(connection, "service")
        checkpoint_connection(connection)
    return {"deleted": deleted}


def sanitize_upload_filename(filename: str, default_name: str = "mso-motor-upload.csv") -> str:
    candidate = os.path.basename(str(filename or "").replace("\\", "/")).strip()
    if not candidate:
        candidate = default_name
    if not candidate.lower().endswith(".csv"):
        candidate = f"{candidate}.csv"
    safe_candidate = "".join(char for char in candidate if char.isalnum() or char in ("-", "_", ".", " ")).strip(" .")
    return safe_candidate or default_name


def save_uploaded_mso_motor_file(file_name: str, file_bytes: bytes) -> dict:
    if not file_bytes:
        raise ValueError("File CSV kosong")
    sync_settings = get_app_setting_value("mso_motor_sync", DEFAULT_APP_SETTINGS["mso_motor_sync"])
    directory = Path(str(sync_settings.get("directory") or DEFAULT_APP_SETTINGS["mso_motor_sync"]["directory"]).strip())
    if not str(directory).strip():
        raise ValueError("Folder sinkronisasi MSO belum diatur")
    directory.mkdir(parents=True, exist_ok=True)
    clean_name = sanitize_upload_filename(file_name)
    destination = directory / clean_name
    destination.write_bytes(file_bytes)
    updated_settings = {
        **sync_settings,
        "directory": str(directory),
        "lastUploadedFile": clean_name,
        "lastUploadedAt": utc_now().isoformat(),
        "lastUploadedSize": len(file_bytes),
    }
    save_app_setting_value("mso_motor_sync", updated_settings)
    return {
        "fileName": clean_name,
        "directory": str(directory),
        "size": len(file_bytes),
    }


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
            checkpoint_connection(connection)
    return deleted


def sync_service_detail_tables(connection: sqlite3.Connection, item: dict) -> None:
    service_id = str(item.get("id", ""))
    payload = item.get("payload", {}) if isinstance(item.get("payload", {}), dict) else {}
    form_type = str(item.get("formType", ""))

    detail_tables = [
        "service_electrical_room_details",
        "service_motor_mv_details",
        "service_motor_mv_carbon_brush_details",
        "service_mcc_details",
        "service_ehca_details",
        "service_instrument_details",
        "service_dcs_details",
    ]
    for table in detail_tables:
        connection.execute(f"DELETE FROM {table} WHERE service_id = ?", (service_id,))

    if form_type == "service-electrical-room":
        battery_map = {key: payload.get(key, "") for key in [
            "battery1", "battery2", "battery3", "battery4", "battery5",
            "battery6", "battery7", "battery8", "battery9", "battery10",
        ]}
        connection.execute(
            """
            INSERT INTO service_electrical_room_details (
                service_id, panel_door_condition, floor_cleanliness, room_temperature,
                battery_vdc, battery_ampere, battery_total_vdc, battery_json,
                transformer_equipment, transformer_winding_temperature, transformer_oil_temperature,
                transformer_oil_level, transformer_silica_gel, finding_photo_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                service_id,
                str(payload.get("panelDoorCondition", "")),
                str(payload.get("floorCleanliness", "")),
                str(payload.get("roomTemperature", "")),
                str(payload.get("batteryVdc", "")),
                str(payload.get("batteryAmpere", "")),
                str(payload.get("batteryTotalVdc", "")),
                json.dumps(battery_map, ensure_ascii=False),
                str(payload.get("transformerEquipment", "")),
                str(payload.get("transformerWindingTemperature", "")),
                str(payload.get("transformerOilTemperature", "")),
                str(payload.get("transformerOilLevel", "")),
                str(payload.get("transformerSilicaGel", "")),
                str(payload.get("findingPhotoName", "")),
            ),
        )
        return

    if form_type in {"service-motor-mv", "service-motor-mso"}:
        connection.execute(
            """
            INSERT INTO service_motor_mv_details (
                service_id, vibration_de, vibration_nde, winding_temperature, bearing_condition, motor_current,
                source_name, insp_id, id_amtrans, condition_label, creator_name, equipment_desc,
                photo_url, temperatur_ds, temperatur_nds, mplant
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                service_id,
                str(payload.get("vibrationDe", "")),
                str(payload.get("vibrationNde", "")),
                str(payload.get("windingTemperature", "")),
                str(payload.get("bearingCondition", "")),
                str(payload.get("motorCurrent", "")),
                str(payload.get("source", "")),
                str(payload.get("inspId", "")),
                str(payload.get("idAmtrans", "")),
                str(payload.get("condition", "")),
                str(payload.get("creator", "")),
                str(payload.get("equipmentDesc", "")),
                str(payload.get("photoUrl", "")),
                str(payload.get("temperaturDs", "")),
                str(payload.get("temperaturNds", "")),
                str(payload.get("mplant", "")),
            ),
        )
        return

    if form_type == "service-motor-mv-carbon-brush":
        connection.execute(
            """
            INSERT INTO service_motor_mv_carbon_brush_details (
                service_id, plant, location, equipment_category, replacement_count, megger_value, pic, measurements_json, stats_json
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                service_id,
                str(payload.get("plant", "")),
                str(payload.get("location", "")),
                str(payload.get("category", "")),
                str(payload.get("replacement", "")),
                str(payload.get("megger", "")),
                str(payload.get("pic", "")),
                json.dumps(payload.get("measurements", {}), ensure_ascii=False),
                json.dumps(payload.get("stats", {}), ensure_ascii=False),
            ),
        )
        return

    if form_type == "service-mcc":
        connection.execute(
            """
            INSERT INTO service_mcc_details (
                service_id, test_function, visual_condition, part_cleanliness, finding_photo_name
            ) VALUES (?, ?, ?, ?, ?)
            """,
            (
                service_id,
                str(payload.get("testFunction", "")),
                str(payload.get("visualCondition", "")),
                str(payload.get("partCleanliness", "")),
                str(payload.get("findingPhotoName", "")),
            ),
        )
        return

    if form_type == "service-ehca":
        connection.execute(
            """
            INSERT INTO service_ehca_details (
                service_id, system_pressure, fluid_level, filter_condition, leak_condition, unit_condition
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                service_id,
                str(payload.get("systemPressure", "")),
                str(payload.get("fluidLevel", "")),
                str(payload.get("filterCondition", "")),
                str(payload.get("leakCondition", "")),
                str(payload.get("unitCondition", "")),
            ),
        )
        return

    if form_type == "service-instrument":
        connection.execute(
            """
            INSERT INTO service_instrument_details (
                service_id, sensor_condition, finding_photo_name, finding_photo_data
            ) VALUES (?, ?, ?, ?)
            """,
            (
                service_id,
                str(payload.get("sensorCondition", "")),
                str(payload.get("findingPhotoName", "")),
                str(payload.get("findingPhotoData", "")),
            ),
        )
        return

    if form_type == "service-dcs":
        connection.execute(
            """
            INSERT INTO service_dcs_details (
                service_id, equipment_function, environment_cleanliness
            ) VALUES (?, ?, ?)
            """,
            (
                service_id,
                str(payload.get("equipmentFunction", "")),
                str(payload.get("environmentCleanliness", "")),
            ),
        )


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
            str(item.get("equipment", item.get("name", ""))),
            str(item.get("part", item.get("description", ""))),
            str(item.get("note", item.get("meta", ""))),
            str(item.get("itemPhoto", "")),
            str(item.get("nameplatePhoto", "")),
            str(item.get("extraPhoto", "")),
            str(item.get("longText", "")),
            str(item.get("qty", "")),
        )

    if resource_key == "bom-motor":
        return (
            str(item.get("id", "")),
            str(item.get("inspectionDate", "")),
            str(item.get("equipment", "")),
            str(item.get("manufacture", "")),
            str(item.get("power", "")),
            str(item.get("ampere", "")),
            str(item.get("voltage", "")),
            str(item.get("speed", "")),
            str(item.get("frame", "")),
            str(item.get("serialNumber", "")),
            str(item.get("nameplatePhoto", "")),
            str(item.get("connectionPhoto", "")),
            str(item.get("motorPhoto", "")),
            str(item.get("note", "")),
            str(item.get("longText", "")),
        )

    if resource_key == "spb":
        spb_type = str(item.get("spbType", item.get("requestType", "")))
        mrp = str(item.get("mrp", item.get("requestSubtype", "")))
        stock_no = str(item.get("stockNo", item.get("materialNo", "")))
        total_ece = str(item.get("totalEce", item.get("price", "")))
        note = str(item.get("note", item.get("status", "")))
        return (
            str(item.get("id", "")),
            spb_type,
            mrp,
            str(item.get("notificationNo", "")),
            str(item.get("orderNo", "")),
            str(item.get("reservationNo", "")),
            stock_no,
            str(item.get("materialDescription", "")),
            str(item.get("qty", "")),
            total_ece,
            note,
            str(item.get("year", "")),
            str(item.get("quarter", "")),
            spb_type,
            stock_no,
            mrp,
            total_ece,
            note,
            str(item.get("prNo", "")),
            str(item.get("poNo", "")),
            str(item.get("deliveryDate", "")),
        )

    raise ValueError(f"Resource tidak dikenal: {resource_key}")


def deserialize_resource_item(resource_key: str, row: sqlite3.Row, *, include_media: bool = True) -> dict:
    if resource_key == "service":
        try:
            payload = json.loads(row["payload_json"])
        except json.JSONDecodeError:
            payload = {}
        if not include_media:
            payload = build_service_list_payload(payload)
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
            "equipment": row["name"],
            "part": row["description"],
            "note": row["meta"],
            "itemPhoto": row["item_photo"],
            "nameplatePhoto": row["nameplate_photo"],
            "extraPhoto": row["extra_photo"],
            "longText": row["long_text"],
            "qty": row["qty"],
        }

    if resource_key == "bom-motor":
        return {
            "id": row["id"],
            "inspectionDate": row["inspection_date"],
            "equipment": row["equipment"],
            "manufacture": row["manufacture"],
            "power": row["power"],
            "ampere": row["ampere"],
            "voltage": row["voltage"],
            "speed": row["speed"],
            "frame": row["frame"],
            "serialNumber": row["serial_number"],
            "nameplatePhoto": row["nameplate_photo"],
            "connectionPhoto": row["connection_photo"],
            "motorPhoto": row["motor_photo"],
            "note": row["note"],
            "longText": row["long_text"],
        }

    if resource_key == "spb":
        return {
            "id": row["id"],
            "year": row["year_label"] if "year_label" in row.keys() else "",
            "quarter": row["quarter_label"] if "quarter_label" in row.keys() else "",
            "spbType": row["spb_type"] if "spb_type" in row.keys() else "",
            "notificationNo": row["notification_no"],
            "orderNo": row["order_no"],
            "reservationNo": row["reservation_no"],
            "stockNo": row["stock_no"] if "stock_no" in row.keys() else (row["material_no"] if "material_no" in row.keys() else ""),
            "materialDescription": row["material_description"],
            "qty": row["qty"],
            "mrp": row["mrp"] if "mrp" in row.keys() else "",
            "totalEce": row["total_ece"] if "total_ece" in row.keys() else (row["price"] if "price" in row.keys() else ""),
            "note": row["note"] if "note" in row.keys() else (row["status"] if "status" in row.keys() else ""),
            "prNo": row["pr_no"] if "pr_no" in row.keys() else "",
            "poNo": row["po_no"] if "po_no" in row.keys() else "",
            "deliveryDate": row["delivery_date"] if "delivery_date" in row.keys() else "",
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


def load_resource_items(resource_key: str, *, include_media: bool = True) -> list[dict]:
    resource_config = RESOURCE_TABLES[resource_key]
    with get_connection() as connection:
        rows = connection.execute(
            f"SELECT * FROM {resource_config['table']} ORDER BY updated_at DESC, rowid DESC"
        ).fetchall()
    return [deserialize_resource_item(resource_key, row, include_media=include_media) for row in rows]


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


def ensure_bom_columns(connection: sqlite3.Connection) -> None:
    columns = {
        row["name"]
        for row in connection.execute("PRAGMA table_info(bom_items)").fetchall()
    }
    if "extra_photo" not in columns:
        connection.execute("ALTER TABLE bom_items ADD COLUMN extra_photo TEXT NOT NULL DEFAULT ''")
    if "long_text" not in columns:
        connection.execute("ALTER TABLE bom_items ADD COLUMN long_text TEXT NOT NULL DEFAULT ''")
    if "qty" not in columns:
        connection.execute("ALTER TABLE bom_items ADD COLUMN qty TEXT NOT NULL DEFAULT ''")


def ensure_spb_columns(connection: sqlite3.Connection) -> None:
    columns = {
        row["name"]
        for row in connection.execute("PRAGMA table_info(spb_items)").fetchall()
    }
    required_columns = {
        "request_type": "TEXT NOT NULL DEFAULT ''",
        "request_subtype": "TEXT NOT NULL DEFAULT ''",
        "material_no": "TEXT NOT NULL DEFAULT ''",
        "price": "TEXT NOT NULL DEFAULT ''",
        "status": "TEXT NOT NULL DEFAULT ''",
        "year_label": "TEXT NOT NULL DEFAULT ''",
        "quarter_label": "TEXT NOT NULL DEFAULT ''",
        "spb_type": "TEXT NOT NULL DEFAULT ''",
        "stock_no": "TEXT NOT NULL DEFAULT ''",
        "mrp": "TEXT NOT NULL DEFAULT ''",
        "total_ece": "TEXT NOT NULL DEFAULT ''",
        "note": "TEXT NOT NULL DEFAULT ''",
        "pr_no": "TEXT NOT NULL DEFAULT ''",
        "po_no": "TEXT NOT NULL DEFAULT ''",
        "delivery_date": "TEXT NOT NULL DEFAULT ''",
    }
    for column_name, column_definition in required_columns.items():
        if column_name not in columns:
            connection.execute(f"ALTER TABLE spb_items ADD COLUMN {column_name} {column_definition}")


def ensure_service_motor_mv_columns(connection: sqlite3.Connection) -> None:
    columns = {
        row["name"]
        for row in connection.execute("PRAGMA table_info(service_motor_mv_details)").fetchall()
    }
    required_columns = {
        "source_name": "TEXT NOT NULL DEFAULT ''",
        "insp_id": "TEXT NOT NULL DEFAULT ''",
        "id_amtrans": "TEXT NOT NULL DEFAULT ''",
        "condition_label": "TEXT NOT NULL DEFAULT ''",
        "creator_name": "TEXT NOT NULL DEFAULT ''",
        "equipment_desc": "TEXT NOT NULL DEFAULT ''",
        "photo_url": "TEXT NOT NULL DEFAULT ''",
        "temperatur_ds": "TEXT NOT NULL DEFAULT ''",
        "temperatur_nds": "TEXT NOT NULL DEFAULT ''",
        "mplant": "TEXT NOT NULL DEFAULT ''",
    }
    for column_name, column_definition in required_columns.items():
        if column_name not in columns:
            connection.execute(f"ALTER TABLE service_motor_mv_details ADD COLUMN {column_name} {column_definition}")


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

    for source_group in sorted(set(MASTER_REFERENCE_URLS) | set(FALLBACK_EQUIPMENT_REFERENCES)):
        existing = connection.execute(
            "SELECT COUNT(*) AS total FROM equipment_reference WHERE source_group = ?",
            (source_group,),
        ).fetchone()
        if existing and int(existing["total"]) > 0:
            continue
        import_equipment_reference_group(connection, source_group)

    for setting_key, value in DEFAULT_APP_SETTINGS.items():
        connection.execute(
            """
            INSERT INTO app_settings (setting_key, value_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(setting_key) DO UPDATE SET
                value_json = COALESCE(app_settings.value_json, excluded.value_json),
                updated_at = excluded.updated_at
            """,
            (setting_key, json.dumps(value, ensure_ascii=False), utc_now().isoformat()),
        )


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
    description_index = detect_reference_column(headers, ["description", "deskripsi", "deskripsi equipment", "nama equipment"])

    imported_rows: list[dict] = []
    for raw_row in rows[1:]:
        if equipment_index >= len(raw_row):
            continue
        equipment_name = raw_row[equipment_index].strip()
        if not equipment_name:
            continue
        metadata = {
            header: raw_row[index].strip()
            for index, header in enumerate(headers)
            if header and index < len(raw_row) and raw_row[index].strip()
        }
        if description_index >= 0 and description_index < len(raw_row):
            metadata["equipmentDescription"] = raw_row[description_index].strip()
        imported_rows.append(
            {
                "equipment_code": equipment_name.split(" ")[0],
                "equipment_name": equipment_name,
                "category": raw_row[category_index].strip() if category_index >= 0 and category_index < len(raw_row) else "",
                "area": raw_row[area_index].strip() if area_index >= 0 and area_index < len(raw_row) else "",
                "plant": raw_row[plant_index].strip() if plant_index >= 0 and plant_index < len(raw_row) else "",
                "metadata_json": json.dumps(metadata, ensure_ascii=False),
            }
        )
    return imported_rows


def fetch_remote_text(url: str) -> str:
    with urlopen(url, timeout=12) as response:
        return response.read().decode("utf-8", errors="ignore")


def normalize_google_sheet_csv_url(source_url: str) -> str:
    text = str(source_url or "").strip()
    if "docs.google.com/spreadsheets" not in text:
        return text
    if "/pubhtml" in text:
        return text.split("/pubhtml", 1)[0] + "/pub?output=csv"
    if "/pub?" in text and "output=csv" not in text:
        separator = "&" if "?" in text else "?"
        return f"{text}{separator}output=csv"
    return text


def parse_carbon_brush_numeric_value(value: str) -> float | None:
    text = str(value or "").strip().replace(",", ".")
    if not re.fullmatch(r"-?\d+(\.\d+)?", text):
        return None
    return float(text)


def normalize_carbon_brush_measurement_value(value: str) -> str:
    text = str(value or "").strip()
    if re.search(r"\bnew\b", text, flags=re.IGNORECASE):
        return "50"
    return text if parse_carbon_brush_numeric_value(text) is not None else ""


def normalize_carbon_brush_date(value: str) -> str:
    text = str(value or "").strip()
    if not text:
        return utc_now().date().isoformat()
    for fmt in ("%m/%d/%Y", "%m/%d/%y", "%Y-%m-%d"):
        try:
            return datetime.strptime(text, fmt).date().isoformat()
        except ValueError:
            continue
    return text


def normalize_negatif_list_date(value: str) -> str:
    text = str(value or "").strip()
    if not text:
        return ""
    for fmt in ("%d/%m/%Y", "%d/%m/%y", "%Y-%m-%d", "%m/%d/%Y"):
        try:
            return datetime.strptime(text, fmt).date().isoformat()
        except ValueError:
            continue
    return text


def infer_negatif_list_pending_mark(remark: str, action_plan: str, description: str) -> str:
    basis = " ".join([str(remark or ""), str(action_plan or ""), str(description or "")]).upper()
    if any(token in basis for token in ["OVH", "IDLE"]):
        return "Menunggu OVH"
    if any(token in basis for token in ["RAWMILL", "RM OFF", "RM SERVICE", "SERVICE BENGKEL", "BENGKEL", "KILN OFF"]):
        return "Menunggu Rawmill service"
    return "Menunggu material"


def infer_negatif_list_category(area_text: str, equipment: str, description: str, action_plan: str = "", remark: str = "") -> str:
    basis = " ".join([
        str(area_text or ""),
        str(equipment or ""),
        str(description or ""),
        str(action_plan or ""),
        str(remark or ""),
    ]).upper()
    if "DCS" in basis or "PLC" in basis or "HMI" in basis or "SERVER" in basis or "NETWORK" in basis:
        return "DCS"
    if any(token in basis for token in ["CEMS", "KALIBRASI", "TT ", "TRANSMITTER", "SENSOR", "GAS", "QCX", "X-RAY", "XRAY"]):
        return "Instrument"
    return "Electrical"


def infer_negatif_list_area(area_text: str) -> str:
    basis = str(area_text or "").upper()
    if "TUBAN 3" in basis:
        return "Tuban 3"
    if "TUBAN 4" in basis:
        return "Tuban 4"
    return "Tuban 34"


def normalize_negatif_list_status(value: str) -> str:
    text = str(value or "").strip().upper()
    if text == "CLOSE" or text == "CLOSED":
        return "Close"
    return "Open"


def build_negatif_list_import_id(source_id: str, equipment: str, found_date: str, description: str) -> str:
    raw_key = "|".join([
        str(source_id or "").strip(),
        str(equipment or "").strip(),
        str(found_date or "").strip(),
        str(description or "").strip(),
    ])
    digest = hashlib.sha1(raw_key.encode("utf-8", errors="ignore")).hexdigest()[:12]
    return f"negatif-import-{digest}"


def build_negatif_list_import_items(csv_text: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(csv_text))
    header_map = normalize_import_headers(reader.fieldnames)
    items: list[dict] = []

    for row in reader:
        if not any(str(value or "").strip() for value in row.values()):
            continue

        source_id = resolve_import_value(row, header_map, ["id"])
        equipment = resolve_import_value(row, header_map, ["equipment"])
        description = resolve_import_value(row, header_map, ["deskripsi negatif list", "deskripsiNegatifList", "damageDescription"])
        action_plan = resolve_import_value(row, header_map, ["action plan", "actionPlan", "followUpPlan"])
        found_date = normalize_negatif_list_date(resolve_import_value(row, header_map, ["tgl temuan", "tanggal temuan", "foundDate"]))
        work_status = normalize_negatif_list_status(resolve_import_value(row, header_map, ["status", "workStatus"]))
        remark = resolve_import_value(row, header_map, ["remark", "remarks"])
        area_text = resolve_import_value(row, header_map, ["area"])

        if not equipment or not description:
            continue

        items.append({
            "id": build_negatif_list_import_id(source_id, equipment, found_date, description),
            "equipment": equipment,
            "damageDescription": description,
            "followUpPlan": action_plan or "-",
            "foundDate": found_date or utc_now().date().isoformat(),
            "pendingMark": infer_negatif_list_pending_mark(remark, action_plan, description),
            "workStatus": work_status,
            "category": infer_negatif_list_category(area_text, equipment, description, action_plan, remark),
            "area": infer_negatif_list_area(area_text),
        })

    return items


def import_negatif_list_from_url(source_url: str, mode: str, user_id: int) -> dict:
    csv_text = fetch_remote_text(source_url)
    items = build_negatif_list_import_items(csv_text)
    if not items:
        raise ValueError("CSV negatif list tidak berisi data yang bisa diimport")

    if mode not in {"replace", "append"}:
        raise ValueError("Mode import harus replace atau append")

    if mode == "replace":
        save_state("negatif-list", items, user_id=user_id)
        return {"imported": len(items), "mode": mode}

    imported = 0
    for item in items:
        create_or_update_item("negatif-list", item, user_id)
        imported += 1
    return {"imported": imported, "mode": mode}


def parse_carbon_brush_equipment_code(equipment_name: str) -> str:
    text = str(equipment_name or "").strip()
    code = ""
    for char in text:
        if not code and not char.isdigit():
            continue
        if char.isalnum() or char == "-":
            code += char
            continue
        break
    return code[:32]


def get_carbon_brush_thresholds(equipment_name: str, explicit_plant: str = "") -> dict:
    code = parse_carbon_brush_equipment_code(equipment_name)
    area_digit = code[2] if len(code) >= 3 else ""
    if not area_digit and explicit_plant:
        for char in reversed(str(explicit_plant)):
            if char.isdigit():
                area_digit = char
                break
    plant_label = "Tuban 4" if area_digit == "4" else "Tuban 3"
    if explicit_plant and "4" in str(explicit_plant):
        plant_label = "Tuban 4"
    elif explicit_plant and "3" in str(explicit_plant):
        plant_label = "Tuban 3"
    settings = get_app_setting_value("carbon_brush_thresholds", DEFAULT_APP_SETTINGS["carbon_brush_thresholds"])
    tuban3 = settings.get("tuban3", {}) if isinstance(settings, dict) else {}
    tuban4 = settings.get("tuban4", {}) if isinstance(settings, dict) else {}
    if plant_label == "Tuban 4":
        return {
            "plant": plant_label,
            "low": float(tuban4.get("low", 35)),
            "high": float(tuban4.get("high", 38)),
        }
    return {
        "plant": plant_label,
        "low": float(tuban3.get("low", 30)),
        "high": float(tuban3.get("high", 34)),
    }


def decode_carbon_brush_meta(equipment_name: str, explicit_plant: str = "") -> dict:
    code = parse_carbon_brush_equipment_code(equipment_name)
    thresholds = get_carbon_brush_thresholds(equipment_name, explicit_plant)
    location_map = {"3": "Rawmill"}
    category_map = {"4": "Equipment utama produksi"}
    return {
        "code": code,
        "location": location_map.get(code[0], "-") if code else "-",
        "category": category_map.get(code[1], "-") if len(code) > 1 else "-",
        "plant": thresholds["plant"],
    }


def compute_carbon_brush_stats(measurements: dict, equipment_name: str, explicit_plant: str = "") -> dict:
    thresholds = get_carbon_brush_thresholds(equipment_name, explicit_plant)
    stats = {
        "low": 0,
        "medium": 0,
        "high": 0,
        "empty": 0,
        "min": None,
        "attentionPoints": [],
    }
    for key in CARBON_BRUSH_MEASUREMENT_KEYS:
        raw_value = str(measurements.get(key, "") or "").strip()
        numeric_value = parse_carbon_brush_numeric_value(raw_value)
        if numeric_value is None:
            stats["empty"] += 1
            continue
        if numeric_value < thresholds["low"]:
            bucket = "low"
        elif numeric_value < thresholds["high"]:
            bucket = "medium"
        else:
            bucket = "high"
        stats[bucket] += 1
        if stats["min"] is None or numeric_value < stats["min"]:
            stats["min"] = numeric_value
        if bucket != "high":
            stats["attentionPoints"].append(key)
    stats["attentionPoints"] = stats["attentionPoints"][:8]
    return stats


def build_carbon_brush_import_items(csv_text: str) -> list[dict]:
    reader = csv.DictReader(io.StringIO(csv_text))
    items: list[dict] = []
    for row in reader:
        equipment_name = str(row.get("EQUIPMENT", "") or "").strip()
        if not equipment_name:
            continue
        source_id = str(row.get("ID", "") or "").strip()
        plant_value = str(row.get("PLANT", "") or "").strip()
        measurements = {}
        for key in CARBON_BRUSH_MEASUREMENT_KEYS:
            raw_value = str(row.get(key, "") or "").strip()
            measurements[key] = normalize_carbon_brush_measurement_value(raw_value)
        meta = decode_carbon_brush_meta(equipment_name, plant_value)
        stats = compute_carbon_brush_stats(measurements, equipment_name, meta["plant"])
        replacement = str(row.get("REPLACEMENT", "") or "").strip()
        megger = str(row.get("MEGGER", "") or "").strip()
        pic = str(row.get("PIC", "") or "").strip()
        inspection_date = normalize_carbon_brush_date(str(row.get("TANGGAL", "") or ""))
        detail = f"Merah: {stats['low']} | Kuning: {stats['medium']} | Hijau: {stats['high']} | Terendah: {stats['min'] if stats['min'] is not None else '-'}"
        items.append(
            {
                "id": f"cb-{source_id}" if source_id else generate_import_id("service"),
                "type": "Electrical",
                "subtype": "Motor MV (Carbon Brush)",
                "formType": "service-motor-mv-carbon-brush",
                "equipmentName": equipment_name,
                "description": f"Import carbon brush {inspection_date}",
                "detail": detail,
                "payload": {
                    "inspectionDate": inspection_date,
                    "plant": meta["plant"],
                    "location": meta["location"],
                    "category": meta["category"],
                    "replacement": replacement,
                    "megger": megger,
                    "pic": pic,
                    "measurements": measurements,
                    "stats": stats,
                },
            }
        )
    return items


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
        SELECT id, source_group, equipment_code, equipment_name, category, area, plant, source_url, metadata_json
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
                "id": row["id"],
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


def list_app_settings() -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT setting_key, value_json, updated_at FROM app_settings ORDER BY setting_key"
        ).fetchall()
    items = []
    for row in rows:
        try:
            value = json.loads(row["value_json"])
        except json.JSONDecodeError:
            value = {}
        items.append(
            {
                "settingKey": row["setting_key"],
                "value": value,
                "updatedAt": row["updated_at"],
            }
        )
    return items


def get_app_setting_value(setting_key: str, default: dict | None = None) -> dict:
    with get_connection() as connection:
        row = connection.execute(
            "SELECT value_json FROM app_settings WHERE setting_key = ?",
            (setting_key,),
        ).fetchone()
    if not row:
        return default.copy() if isinstance(default, dict) else {}
    try:
        value = json.loads(row["value_json"])
    except json.JSONDecodeError:
        value = {}
    return value if isinstance(value, dict) else (default.copy() if isinstance(default, dict) else {})


def save_app_setting_value(setting_key: str, value: dict) -> None:
    payload = value if isinstance(value, dict) else {}
    with get_connection() as connection:
        connection.execute(
            """
            INSERT INTO app_settings (setting_key, value_json, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(setting_key) DO UPDATE SET
                value_json = excluded.value_json,
                updated_at = excluded.updated_at
            """,
            (
                str(setting_key or "").strip(),
                json.dumps(payload, ensure_ascii=False),
                utc_now().isoformat(),
            ),
        )
        checkpoint_connection(connection)


def list_master_records(resource_name: str) -> list[dict]:
    if resource_name == "areas":
        return list_areas()
    if resource_name == "inspection-templates":
        return list_inspection_templates()
    if resource_name == "equipment-references":
        return list_equipment_references()
    if resource_name == "app-settings":
        return list_app_settings()
    raise ValueError("Master resource tidak dikenal")


def save_master_record(resource_name: str, record: dict) -> dict:
    with get_connection() as connection:
        if resource_name == "areas":
            code = str(record.get("code", "")).strip()
            if not code:
                raise ValueError("Code area wajib diisi")
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
                (
                    code,
                    str(record.get("name", "")),
                    str(record.get("plant", "")),
                    int(record.get("sortOrder", record.get("sort_order", 0)) or 0),
                ),
            )
            row = connection.execute(
                "SELECT code, name, plant, sort_order FROM areas WHERE code = ?",
                (code,),
            ).fetchone()
            return dict(row) if row else {}

        if resource_name == "inspection-templates":
            module_name = str(record.get("moduleName", "")).strip()
            inspection_type = str(record.get("inspectionType", "")).strip()
            inspection_subtype = str(record.get("inspectionSubtype", "")).strip()
            if not module_name or not inspection_type or not inspection_subtype:
                raise ValueError("Module, type, dan subtype template wajib diisi")
            definition = record.get("definition", {})
            connection.execute(
                """
                INSERT INTO inspection_templates (module_name, inspection_type, inspection_subtype, title, definition_json, is_active)
                VALUES (?, ?, ?, ?, ?, 1)
                ON CONFLICT(module_name, inspection_type, inspection_subtype) DO UPDATE SET
                    title = excluded.title,
                    definition_json = excluded.definition_json,
                    is_active = 1
                """,
                (
                    module_name,
                    inspection_type,
                    inspection_subtype,
                    str(record.get("title", "")),
                    json.dumps(definition if isinstance(definition, dict) else {}, ensure_ascii=False),
                ),
            )
            return next(
                (
                    item
                    for item in list_inspection_templates()
                    if item["moduleName"] == module_name
                    and item["inspectionType"] == inspection_type
                    and item["inspectionSubtype"] == inspection_subtype
                ),
                {},
            )

        if resource_name == "equipment-references":
            source_group = str(record.get("sourceGroup", "")).strip()
            equipment_code = str(record.get("equipmentCode", "")).strip()
            equipment_name = str(record.get("equipmentName", "")).strip()
            if not source_group or not equipment_name:
                raise ValueError("Source group dan nama equipment wajib diisi")
            connection.execute(
                """
                INSERT INTO equipment_reference (
                    source_group, equipment_code, equipment_name, category, area, plant, source_url, metadata_json, is_active, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
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
                    equipment_code or equipment_name.split(" ")[0],
                    equipment_name,
                    str(record.get("category", "")),
                    str(record.get("area", "")),
                    str(record.get("plant", "")),
                    str(record.get("sourceUrl", "")),
                    json.dumps(record.get("metadata", {}), ensure_ascii=False),
                    utc_now().isoformat(),
                ),
            )
            return next(
                (
                    item
                    for item in list_equipment_references(source_group)
                    if item["equipmentName"] == equipment_name
                ),
                {},
            )

        if resource_name == "app-settings":
            setting_key = str(record.get("settingKey", "")).strip()
            if not setting_key:
                raise ValueError("Setting key wajib diisi")
            value = record.get("value", {})
            connection.execute(
                """
                INSERT INTO app_settings (setting_key, value_json, updated_at)
                VALUES (?, ?, ?)
                ON CONFLICT(setting_key) DO UPDATE SET
                    value_json = excluded.value_json,
                    updated_at = excluded.updated_at
                """,
                (setting_key, json.dumps(value if isinstance(value, dict) else {}, ensure_ascii=False), utc_now().isoformat()),
            )
            return next((item for item in list_app_settings() if item["settingKey"] == setting_key), {})

    raise ValueError("Master resource tidak dikenal")


def delete_master_record(resource_name: str, identifier: str) -> bool:
    with get_connection() as connection:
        if resource_name == "areas":
            cursor = connection.execute("DELETE FROM areas WHERE code = ?", (identifier,))
            return cursor.rowcount > 0
        if resource_name == "inspection-templates":
            parts = identifier.split("|", 2)
            if len(parts) != 3:
                return False
            cursor = connection.execute(
                """
                DELETE FROM inspection_templates
                WHERE module_name = ? AND inspection_type = ? AND inspection_subtype = ?
                """,
                tuple(parts),
            )
            return cursor.rowcount > 0
        if resource_name == "equipment-references":
            cursor = connection.execute(
                """
                DELETE FROM equipment_reference
                WHERE CAST(id AS TEXT) = ?
                   OR source_group || '|' || equipment_code || '|' || equipment_name = ?
                   OR equipment_name = ?
                """,
                (identifier, identifier, identifier),
            )
            return cursor.rowcount > 0
        if resource_name == "app-settings":
            cursor = connection.execute("DELETE FROM app_settings WHERE setting_key = ?", (identifier,))
            return cursor.rowcount > 0
    return False


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
        "appSettings": list_app_settings(),
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

        app_settings = payload.get("appSettings", [])
        if isinstance(app_settings, list):
            connection.execute("DELETE FROM app_settings")
            for setting in app_settings:
                connection.execute(
                    """
                    INSERT INTO app_settings (setting_key, value_json, updated_at)
                    VALUES (?, ?, ?)
                    """,
                    (
                        str(setting.get("settingKey", "")),
                        json.dumps(setting.get("value", {}), ensure_ascii=False),
                        str(setting.get("updatedAt", utc_now().isoformat())),
                    ),
                )

        data = payload.get("data", {})
        for resource_key in STATE_KEYS:
            items = data.get(STATE_KEYS[resource_key], data.get(resource_key.replace("-", "_"), []))
            if isinstance(items, list):
                replace_resource_items(connection, resource_key, items)
                refresh_snapshot(connection, resource_key)


def build_excel_table(title: str, headers: list[str], rows: list[list[object]]) -> str:
    header_html = "".join(f"<th>{html.escape(str(header))}</th>" for header in headers)
    body_html = "\n".join(
        "<tr>" + "".join(f"<td>{html.escape(str(cell or ''))}</td>" for cell in row) + "</tr>"
        for row in rows
    )
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
table {{ border-collapse: collapse; font-family: Arial, sans-serif; font-size: 11pt; }}
caption {{ font-size: 14pt; font-weight: bold; margin-bottom: 10px; text-align: left; }}
th {{ background: #ff6a00; color: #ffffff; font-weight: bold; }}
th, td {{ border: 1px solid #999999; padding: 6px 8px; vertical-align: top; mso-number-format: "\\@"; }}
</style>
</head>
<body>
<table>
<caption>{html.escape(title)}</caption>
<thead><tr>{header_html}</tr></thead>
<tbody>
{body_html}
</tbody>
</table>
</body>
</html>"""


def export_resource_excel(resource_key: str) -> str:
    items = list_items(resource_key)
    if resource_key == "negatif-list":
        headers = ["Equipment", "Deskripsi Kerusakan", "Rencana Tindak Lanjut", "Tanggal Temuan", "Mark", "Status", "Kategori", "Area"]
        rows = [[item["equipment"], item["damageDescription"], item["followUpPlan"], item["foundDate"], item["pendingMark"], item["workStatus"], item["category"], item["area"]] for item in items]
        return build_excel_table("Negatif List", headers, rows)
    if resource_key == "sparepart":
        headers = ["Kode", "Nama", "Kategori", "Lokasi", "Qty", "Kondisi"]
        rows = [[item["code"], item["name"], item["category"], item["location"], item["qty"], item["condition"]] for item in items]
        return build_excel_table("Sparepart", headers, rows)
    if resource_key == "service":
        headers = ["Tipe", "Sub Menu", "Form", "Equipment", "Deskripsi", "Detail"]
        rows = [[item["type"], item["subtype"], item["formType"], item["equipmentName"], item["description"], item["detail"]] for item in items]
        return build_excel_table("Service", headers, rows)
    if resource_key == "bom":
        headers = ["Nama", "Deskripsi", "Meta", "Foto Barang", "Foto Nameplate"]
        rows = [[item["name"], item["description"], item["meta"], item["itemPhoto"], item["nameplatePhoto"]] for item in items]
        return build_excel_table("BOM", headers, rows)
    if resource_key == "spb":
        headers = ["ID", "TAHUN", "QUARTER", "TYPE", "NOTIF", "ORDER", "RESERVASI", "NO STOCK", "DESKRIPSI MATERIAL", "QTY", "MRP", "TOTAL ECE", "KETERANGAN", "PR", "PO", "DELIV DATE"]
        rows = [[item["id"], item["year"], item["quarter"], item["spbType"], item["notificationNo"], item["orderNo"], item["reservationNo"], item["stockNo"], item["materialDescription"], item["qty"], item["mrp"], item["totalEce"], item["note"], item["prNo"], item["poNo"], item["deliveryDate"]] for item in items]
        return build_excel_table("SPB", headers, rows)
    raise ValueError("Resource export tidak dikenal")


def build_service_summary() -> dict:
    with get_connection() as connection:
        subtype_rows = connection.execute(
            """
            SELECT subtype, COUNT(*) AS total
            FROM service_items
            GROUP BY subtype
            ORDER BY subtype
            """
        ).fetchall()
        electrical_room = connection.execute(
            """
            SELECT COUNT(*) AS total,
                   SUM(CASE WHEN panel_door_condition = 'NOT OK' THEN 1 ELSE 0 END) AS panel_not_ok
            FROM service_electrical_room_details
            """
        ).fetchone()
        motor_mv = connection.execute(
            """
            SELECT COUNT(*) AS total,
                   AVG(CASE WHEN vibration_de != '' THEN CAST(vibration_de AS REAL) END) AS avg_vibration_de
            FROM service_motor_mv_details
            """
        ).fetchone()
        carbon_brush = connection.execute(
            """
            SELECT COUNT(*) AS total
            FROM service_motor_mv_carbon_brush_details
            """
        ).fetchone()
        mcc = connection.execute("SELECT COUNT(*) AS total FROM service_mcc_details").fetchone()
        ehca = connection.execute("SELECT COUNT(*) AS total FROM service_ehca_details").fetchone()
        instrument = connection.execute("SELECT COUNT(*) AS total FROM service_instrument_details").fetchone()
        dcs = connection.execute("SELECT COUNT(*) AS total FROM service_dcs_details").fetchone()

    return {
        "subtypes": [dict(row) for row in subtype_rows],
        "details": {
            "electricalRoom": {
                "total": int(electrical_room["total"] or 0),
                "panelNotOk": int(electrical_room["panel_not_ok"] or 0),
            },
            "motorMv": {
                "total": int(motor_mv["total"] or 0),
                "avgVibrationDe": float(motor_mv["avg_vibration_de"] or 0),
            },
            "carbonBrush": {
                "total": int(carbon_brush["total"] or 0),
            },
            "mcc": {
                "total": int(mcc["total"] or 0),
            },
            "ehca": {
                "total": int(ehca["total"] or 0),
            },
            "instrument": {
                "total": int(instrument["total"] or 0),
            },
            "dcs": {
                "total": int(dcs["total"] or 0),
            },
        },
    }


class PLIRMRequestHandler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".webmanifest": "application/manifest+json",
    }

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

        if parsed.path == "/api/reports/service-summary":
            self._handle_service_summary_get()
            return

        if parsed.path == "/api/admin/backup":
            self._handle_backup_get()
            return

        if parsed.path == "/api/admin/activity-logs":
            self._handle_activity_logs_get(parsed.query)
            return

        if parsed.path.startswith("/api/admin/masters/"):
            self._handle_admin_masters_get(parsed.path)
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
            params = parse_qs(parsed.query or "")
            requested_scope = str(params.get("scope", ["full"])[0] or "full").strip().lower()
            self._send_json(build_bootstrap_payload(user, scope=requested_scope))
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

        if parsed.path == "/api/admin/import-negatif-list":
            self._handle_admin_negatif_list_import_post()
            return

        if parsed.path == "/api/admin/import-carbon-brush":
            self._handle_admin_carbon_brush_import_post()
            return

        if parsed.path == "/api/admin/import-mso-motor-latest":
            self._handle_admin_mso_motor_import_post()
            return

        if parsed.path == "/api/admin/upload-mso-motor":
            self._handle_admin_mso_motor_upload_post()
            return

        if parsed.path == "/api/admin/import-mso-motor-scrape":
            self._handle_admin_mso_motor_scrape_post()
            return

        if parsed.path == "/api/admin/reset-mso-motor":
            self._handle_admin_mso_motor_reset_post()
            return

        if parsed.path.startswith("/api/admin/import/"):
            self._handle_admin_import_post(parsed.path)
            return

        if parsed.path.startswith("/api/admin/masters/"):
            self._handle_admin_masters_post(parsed.path)
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
        if parsed.path.startswith("/api/users/"):
            username = parsed.path.removeprefix("/api/users/").strip("/")
            self._handle_delete_user(username)
            return
        if parsed.path.startswith("/api/admin/masters/"):
            self._handle_admin_masters_delete(parsed.path)
            return
        if parsed.path.startswith("/api/items/"):
            self._handle_items_delete(parsed.path)
            return
        self.send_error(HTTPStatus.NOT_FOUND, "Endpoint tidak ditemukan")

    def log_message(self, format: str, *args):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {self.address_string()} - {format % args}")

    def _parse_json_body(self, *, max_bytes: int = MAX_JSON_BODY_BYTES, label: str = "Payload JSON") -> dict:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if max_bytes > 0 and length > max_bytes:
            self._send_json(
                {
                    "error": f"{label} melebihi batas {format_byte_size(max_bytes)}. Pecah data menjadi batch yang lebih kecil lalu coba lagi."
                },
                status=HTTPStatus.REQUEST_ENTITY_TOO_LARGE,
            )
            raise RequestBodyTooLarge(label)

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
                "appSettings": list_app_settings(),
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
        excel_text = export_resource_excel(resource_key)
        self._send_text(
            excel_text,
            content_type="application/vnd.ms-excel; charset=utf-8",
            extra_headers={"Content-Disposition": f'attachment; filename="{resource_key}.xls"'},
        )

    def _handle_service_summary_get(self):
        user = self._require_user()
        if not user:
            return
        self._send_json(build_service_summary())

    def _handle_backup_get(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        self._send_json(build_backup_payload())

    def _handle_activity_logs_get(self, query: str):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        params = parse_qs(query or "")
        try:
            limit = int(params.get("limit", ["300"])[0])
        except ValueError:
            self._send_json({"error": "Parameter limit tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            return
        self._send_json({"items": list_activity_logs(limit)})

    def _handle_restore_post(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        try:
            payload = self._parse_json_body(max_bytes=MAX_BACKUP_BODY_BYTES, label="Payload restore backup")
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return
        backup = payload.get("backup")
        if not isinstance(backup, dict):
            self._send_json({"error": "Payload backup harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            return
        restore_backup_payload(backup)
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="restore",
            resource="backup",
            target_label="Restore backup aplikasi",
        )
        self._send_json({"ok": True})

    def _handle_admin_masters_get(self, path: str):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        resource_name = path.removeprefix("/api/admin/masters/").strip("/")
        try:
            self._send_json({"items": list_master_records(resource_name)})
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.NOT_FOUND)

    def _handle_admin_masters_post(self, path: str):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        resource_name = path.removeprefix("/api/admin/masters/").strip("/")
        try:
            payload = self._parse_json_body()
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return
        item = payload.get("item")
        if not isinstance(item, dict):
            self._send_json({"error": "Payload item harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            return
        try:
            saved_item = save_master_record(resource_name, item)
            label = saved_item.get("title") or saved_item.get("equipmentName") or saved_item.get("name") or saved_item.get("code") or saved_item.get("settingKey") or item.get("settingKey") or resource_name
            identifier = saved_item.get("settingKey") or saved_item.get("equipmentName") or saved_item.get("code") or label
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="save",
                resource=f"master:{resource_name}",
                target_id=str(identifier or ""),
                target_label=str(label or ""),
            )
            self._send_json({"ok": True, "item": saved_item})
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)

    def _handle_admin_import_post(self, path: str):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        resource_name = path.removeprefix("/api/admin/import/").strip("/")
        if resource_name not in RESOURCE_TABLES:
            self._send_json({"error": "Resource import tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
            return
        try:
            payload = self._parse_json_body(max_bytes=MAX_ADMIN_IMPORT_BODY_BYTES, label="Payload import CSV")
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return

        csv_text = str(payload.get("csvText", "") or "")
        mode = str(payload.get("mode", "replace") or "replace")
        if not csv_text.strip():
            self._send_json({"error": "Isi CSV wajib diisi"}, status=HTTPStatus.BAD_REQUEST)
            return

        try:
            result = import_resource_csv(resource_name, csv_text, mode, int(user["id"]))
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="import",
                resource=resource_name,
                target_label=f"Import CSV {resource_name}",
                detail={"mode": mode, "imported": result.get("imported", 0)},
            )
            self._send_json({"ok": True, **result}, status=HTTPStatus.CREATED)
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)

    def _handle_admin_carbon_brush_import_post(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        try:
            payload = self._parse_json_body()
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return

        source_url = str(payload.get("sourceUrl") or MASTER_REFERENCE_URLS["carbon-brush"]).strip()
        mode = str(payload.get("mode", "append") or "append")
        try:
            result = import_carbon_brush_from_url(source_url, mode, int(user["id"]))
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="import",
                resource="service",
                target_label="Import carbon brush",
                detail={"mode": mode, "imported": result.get("imported", 0), "sourceUrl": source_url},
            )
            self._send_json({"ok": True, **result}, status=HTTPStatus.CREATED)
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        except Exception:
            self._send_json({"error": "Gagal mengambil data carbon brush dari link sumber"}, status=HTTPStatus.BAD_GATEWAY)

    def _handle_admin_mso_motor_import_post(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        try:
            result = import_mso_motor_from_latest_file(int(user["id"]))
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="import",
                resource="service",
                target_label="Import MSO Motor mingguan",
                detail={
                    "imported": result.get("imported", 0),
                    "created": result.get("created", 0),
                    "updated": result.get("updated", 0),
                    "fileName": result.get("fileName", ""),
                },
            )
            self._send_json({"ok": True, **result}, status=HTTPStatus.CREATED)
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)

    def _handle_admin_mso_motor_upload_post(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        try:
            payload = self._parse_json_body(max_bytes=MAX_MSO_UPLOAD_BODY_BYTES, label="Upload file MSO")
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return

        file_name = str(payload.get("fileName") or "").strip()
        file_data = str(payload.get("fileData") or "")
        if not file_name:
            self._send_json({"error": "Nama file CSV wajib diisi"}, status=HTTPStatus.BAD_REQUEST)
            return
        if not file_data:
            self._send_json({"error": "Isi file CSV wajib diisi"}, status=HTTPStatus.BAD_REQUEST)
            return
        try:
            file_bytes = base64.b64decode(file_data.encode("ascii"), validate=True)
        except Exception:
            self._send_json({"error": "Format upload CSV tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            return

        try:
            result = save_uploaded_mso_motor_file(file_name, file_bytes)
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="upload",
                resource="service",
                target_label="Upload CSV MSO Motor",
                detail={
                    "fileName": result.get("fileName", ""),
                    "size": result.get("size", 0),
                    "directory": result.get("directory", ""),
                },
            )
            self._send_json({"ok": True, **result}, status=HTTPStatus.CREATED)
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)

    def _handle_admin_mso_motor_scrape_post(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        try:
            payload = self._parse_json_body(max_bytes=MAX_MSO_SCRAPE_BODY_BYTES, label="Data scrape MSO per batch")
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return

        rows = payload.get("items")
        source_name = str(payload.get("sourceName") or "MSO Browser Sync").strip()
        if not isinstance(rows, list) or not rows:
            self._send_json({"error": "Data scrape MSO kosong"}, status=HTTPStatus.BAD_REQUEST)
            return
        try:
            items = build_mso_motor_import_items_from_rows(rows, source_name)
            result = import_mso_motor_items(items, int(user["id"]))
            sync_settings = get_app_setting_value("mso_motor_sync", DEFAULT_APP_SETTINGS["mso_motor_sync"])
            updated_settings = {
                **sync_settings,
                "lastImportedFile": source_name,
                "lastImportedAt": utc_now().isoformat(),
                "lastImportedCount": result["imported"],
            }
            save_app_setting_value("mso_motor_sync", updated_settings)
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="import",
                resource="service",
                target_label="Import MSO Motor browser sync",
                detail={
                    "imported": result.get("imported", 0),
                    "created": result.get("created", 0),
                    "updated": result.get("updated", 0),
                    "sourceName": source_name,
                },
            )
            self._send_json({"ok": True, **result, "sourceName": source_name}, status=HTTPStatus.CREATED)
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)

    def _handle_admin_mso_motor_reset_post(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        result = reset_mso_motor_items()
        sync_settings = get_app_setting_value("mso_motor_sync", DEFAULT_APP_SETTINGS["mso_motor_sync"])
        updated_settings = {
            **sync_settings,
            "lastImportedFile": "",
            "lastImportedAt": "",
            "lastImportedCount": 0,
        }
        save_app_setting_value("mso_motor_sync", updated_settings)
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="delete",
            resource="service",
            target_label="Reset data Motor MSO",
            detail={"deleted": result.get("deleted", 0)},
        )
        self._send_json({"ok": True, **result}, status=HTTPStatus.OK)

    def _handle_admin_negatif_list_import_post(self):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        try:
            payload = self._parse_json_body()
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return

        source_url = str(payload.get("sourceUrl") or MASTER_REFERENCE_URLS["negatif-list-import"]).strip()
        mode = str(payload.get("mode", "replace") or "replace")
        try:
            result = import_negatif_list_from_url(source_url, mode, int(user["id"]))
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="import",
                resource="negatif-list",
                target_label="Import negatif list",
                detail={"mode": mode, "imported": result.get("imported", 0), "sourceUrl": source_url},
            )
            self._send_json({"ok": True, **result}, status=HTTPStatus.CREATED)
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
        except Exception:
            self._send_json({"error": "Gagal mengambil data negatif list dari link sumber"}, status=HTTPStatus.BAD_GATEWAY)

    def _handle_admin_masters_delete(self, path: str):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        remainder = path.removeprefix("/api/admin/masters/").strip("/")
        parts = remainder.split("/", 1)
        if len(parts) != 2:
            self._send_json({"error": "Endpoint hapus master tidak valid"}, status=HTTPStatus.NOT_FOUND)
            return
        resource_name, identifier = parts[0], unquote(parts[1])
        try:
            deleted = delete_master_record(resource_name, identifier)
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return
        if not deleted:
            self._send_json({"error": "Master data tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
            return
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="delete",
            resource=f"master:{resource_name}",
            target_id=str(identifier),
            target_label=str(identifier),
        )
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
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return

        item = payload.get("item")
        if not isinstance(item, dict):
            self._send_json({"error": "Payload item harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            return

        existing_item = get_item_by_id(resource_key, str(item.get("id", ""))) if item.get("id") else None
        try:
            saved_item = create_or_update_item(resource_key, item, user["id"])
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return
        label = saved_item.get("equipment") or saved_item.get("equipmentName") or saved_item.get("name") or saved_item.get("materialDescription") or saved_item.get("code") or saved_item.get("id")
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="update" if existing_item else "create",
            resource=resource_key,
            target_id=str(saved_item.get("id", "")),
            target_label=str(label or ""),
        )
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
        except (json.JSONDecodeError, RequestBodyTooLarge):
            return

        item = payload.get("item")
        if not isinstance(item, dict):
            self._send_json({"error": "Payload item harus berupa object"}, status=HTTPStatus.BAD_REQUEST)
            return
        existing_item = get_item_by_id(resource_key, item_id)
        item["id"] = item_id

        try:
            saved_item = create_or_update_item(resource_key, item, user["id"])
        except ValueError as error:
            self._send_json({"error": str(error)}, status=HTTPStatus.BAD_REQUEST)
            return
        label = saved_item.get("equipment") or saved_item.get("equipmentName") or saved_item.get("name") or saved_item.get("materialDescription") or saved_item.get("code") or saved_item.get("id")
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="update" if existing_item else "create",
            resource=resource_key,
            target_id=str(saved_item.get("id", "")),
            target_label=str(label or ""),
        )
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
        if resource_key == "service" and str(user["role"]) == "team":
            self._send_json({"error": "Role team tidak diizinkan menghapus data service"}, status=HTTPStatus.FORBIDDEN)
            return
        existing_item = get_item_by_id(resource_key, item_id)
        deleted = delete_item(resource_key, item_id)
        if not deleted:
            self._send_json({"error": "Item tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
            return
        label = ""
        if existing_item:
            label = existing_item.get("equipment") or existing_item.get("equipmentName") or existing_item.get("name") or existing_item.get("materialDescription") or existing_item.get("code") or item_id
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="delete",
            resource=resource_key,
            target_id=str(item_id),
            target_label=str(label or item_id),
        )
        self._send_json({"ok": True, "id": item_id})

    def _handle_login(self):
        try:
            payload = self._parse_json_body()
        except (json.JSONDecodeError, RequestBodyTooLarge):
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
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="login",
            resource="auth",
            target_id=str(user["id"]),
            target_label=str(user["username"]),
        )
        self._send_json(
            {"user": {"id": user["id"], "username": user["username"], "role": user["role"]}},
            extra_headers={"Set-Cookie": self._build_session_cookie(token)},
        )

    def _handle_signup(self):
        try:
            payload = self._parse_json_body()
        except (json.JSONDecodeError, RequestBodyTooLarge):
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
        log_activity(
            actor_user_id=int(user["id"]),
            actor_username=str(user["username"]),
            actor_role=str(user["role"]),
            action="signup",
            resource="auth",
            target_id=str(user["id"]),
            target_label=str(user["username"]),
        )
        self._send_json(
            {"user": {"id": user["id"], "username": user["username"], "role": user["role"]}},
            status=HTTPStatus.CREATED,
            extra_headers={"Set-Cookie": self._build_session_cookie(token)},
        )

    def _handle_logout(self):
        token = self._read_session_cookie()
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
        self._send_json({"ok": True}, extra_headers={"Set-Cookie": self._clear_session_cookie()})

    def _handle_sync(self, resource_key: str):
        user = self._require_user()
        if not user:
            return

        if resource_key not in STATE_KEYS:
            self._send_json({"error": "Resource sync tidak dikenal"}, status=HTTPStatus.NOT_FOUND)
            return

        try:
            payload = self._parse_json_body(max_bytes=MAX_ADMIN_IMPORT_BODY_BYTES, label="Payload sinkronisasi resource")
        except (json.JSONDecodeError, RequestBodyTooLarge):
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
        except (json.JSONDecodeError, RequestBodyTooLarge):
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
        if updated_user:
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="change-role",
                resource="users",
                target_id=str(updated_user["id"]),
                target_label=f"{updated_user['username']} -> {updated_user['role']}",
            )
        self._send_json({"ok": True, "user": updated_user, "users": list_users()})

    def _handle_delete_user(self, username: str):
        user = self._require_user()
        if not user:
            return
        if not can_edit_resource(user["role"], "users"):
            self._send_json({"error": "Akses admin diperlukan"}, status=HTTPStatus.FORBIDDEN)
            return
        if not username:
            self._send_json({"error": "Username tidak valid"}, status=HTTPStatus.BAD_REQUEST)
            return

        target_user = get_user_by_username(username)
        if not target_user:
            self._send_json({"error": "User tidak ditemukan"}, status=HTTPStatus.NOT_FOUND)
            return
        if target_user["role"] == "admin" and count_admin_users() <= 1:
            self._send_json(
                {"error": "Minimal harus ada satu akun admin aktif"},
                status=HTTPStatus.BAD_REQUEST,
            )
            return

        deleted_user = delete_user_account(username)
        if deleted_user:
            log_activity(
                actor_user_id=int(user["id"]),
                actor_username=str(user["username"]),
                actor_role=str(user["role"]),
                action="delete-user",
                resource="users",
                target_id=str(deleted_user["id"]),
                target_label=str(deleted_user["username"]),
            )
        self._send_json({"ok": True, "user": deleted_user, "users": list_users()})


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
