import argparse
import csv
import shutil
import sys
from datetime import datetime
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

import server


DEFAULT_CSV_PATH = ROOT_DIR / "service-mcc-source.csv"
DEFAULT_IMAGE_DIR = ROOT_DIR / "service-mcc-images"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Import data service MCC ke database PLIRM34")
    parser.add_argument("--csv", dest="csv_path", default=str(DEFAULT_CSV_PATH), help="Path file CSV sumber MCC")
    parser.add_argument("--source-image-dir", dest="source_image_dir", required=True, help="Folder sumber foto MCC")
    parser.add_argument("--target-image-dir", dest="target_image_dir", default=str(DEFAULT_IMAGE_DIR), help="Folder target image statis yang akan diserve aplikasi")
    parser.add_argument("--mode", choices=("replace", "append"), default="replace", help="Replace data MCC lama atau append data baru")
    parser.add_argument("--month-first", action="store_true", help="Interpretasi default tanggal ambigu sebagai mm/dd/yyyy")
    return parser.parse_args()


def normalize_status(value: str) -> str:
    normalized = str(value or "").strip().lower()
    if normalized in {"true", "ok", "normal", "baik", "bersih", "ya", "yes"}:
        return "OK"
    if normalized in {"false", "not ok", "abnormal", "kotor", "tidak", "no"}:
        return "NOT OK"
    return str(value or "").strip().upper() or "OK"


def parse_sheet_date(raw_value: str, day_first: bool = True) -> str:
    raw = str(raw_value or "").strip()
    if not raw:
        return datetime.now().isoformat()
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%d-%m-%Y", "%m-%d-%Y"):
        try:
            return datetime.strptime(raw, fmt).isoformat()
        except ValueError:
            continue
    if "/" in raw:
        parts = raw.split("/")
        if len(parts) == 3 and all(part.isdigit() for part in parts):
            first, second, third = [int(part) for part in parts]
            if first > 12:
                return datetime(third, second, first).isoformat()
            if second > 12:
                return datetime(third, first, second).isoformat()
            if day_first:
                return datetime(third, second, first).isoformat()
            return datetime(third, first, second).isoformat()
    try:
        return datetime.fromisoformat(raw).isoformat()
    except ValueError:
        return datetime.now().isoformat()


def copy_image_if_needed(filename: str, source_dir: Path, target_dir: Path) -> str:
    safe_name = Path(str(filename or "").strip()).name
    if not safe_name:
        return ""
    source_path = source_dir / safe_name
    if not source_path.exists():
        return ""
    target_dir.mkdir(parents=True, exist_ok=True)
    target_path = target_dir / safe_name
    if not target_path.exists() or source_path.stat().st_mtime > target_path.stat().st_mtime:
        shutil.copy2(source_path, target_path)
    return safe_name


def build_description(equipment: str, test_function: str, visual_condition: str, part_cleanliness: str, note: str) -> str:
    cleaned_note = str(note or "").strip()
    if cleaned_note:
        return cleaned_note
    return (
        f"Inspeksi MCC {equipment}: "
        f"test fungsi {test_function}, visual {visual_condition}, kebersihan part {part_cleanliness}."
    )


def import_rows(csv_path: Path, source_image_dir: Path, target_image_dir: Path, mode: str, day_first: bool) -> int:
    server.init_db()
    with csv_path.open("r", encoding="utf-8-sig", newline="") as handle:
        rows = list(csv.DictReader(handle))

    imported = 0
    with server.get_connection() as connection:
        if mode == "replace":
            service_ids = [
                row["id"]
                for row in connection.execute(
                    "SELECT id FROM service_items WHERE form_type = 'service-mcc'"
                ).fetchall()
            ]
            if service_ids:
                connection.executemany(
                    "DELETE FROM service_mcc_details WHERE service_id = ?",
                    [(service_id,) for service_id in service_ids],
                )
                connection.execute("DELETE FROM service_items WHERE form_type = 'service-mcc'")

        for index, row in enumerate(rows, start=1):
            equipment = str(row.get("Equipment", "")).strip().upper()
            if not equipment:
                continue

            inspection_date = parse_sheet_date(str(row.get("Tanggal", "")), day_first=day_first)
            test_function = normalize_status(str(row.get("Test Fungsi", "")))
            visual_condition = normalize_status(str(row.get("Visual", "")))
            part_cleanliness = normalize_status(str(row.get("Kebersihan Part", "")))
            image_name = copy_image_if_needed(str(row.get("Foto", "")), source_image_dir, target_image_dir)
            photo_payload = server.json.loads(server.json.dumps({
                "findingPhotos": [{
                    "name": image_name,
                    "url": f"/service-mcc-images/{image_name}",
                }],
                "findingPhotoName": image_name or "tidak ada file",
                "findingPhotoUrl": f"/service-mcc-images/{image_name}" if image_name else "",
                "findingPhotoData": "",
            }, ensure_ascii=False))

            item = {
                "id": f"service-mcc-{datetime.fromisoformat(inspection_date).strftime('%Y%m%d')}-{equipment.lower()}-{index:03d}",
                "type": "Electrical",
                "subtype": "MCC",
                "formType": "service-mcc",
                "equipmentName": equipment,
                "description": build_description(
                    equipment,
                    test_function,
                    visual_condition,
                    part_cleanliness,
                    str(row.get("Keterangan", "")),
                ),
                "detail": f"Fungsi: {test_function} | Visual: {visual_condition} | Kebersihan: {part_cleanliness}",
                "payload": {
                    "inspectionDate": inspection_date,
                    "testFunction": test_function,
                    "visualCondition": visual_condition,
                    "partCleanliness": part_cleanliness,
                    **photo_payload,
                },
            }
            row_data = server.serialize_resource_item("service", item) + (1, 1, server.utc_now().isoformat())
            columns = server.RESOURCE_TABLES["service"]["columns"]
            placeholders = ", ".join(["?"] * (len(columns) + 3))
            insert_columns = ", ".join(columns + ["created_by_user_id", "updated_by_user_id", "updated_at"])
            update_assignments = ", ".join([f"{column} = excluded.{column}" for column in columns[1:]])
            connection.execute(
                f"""
                INSERT INTO service_items ({insert_columns}) VALUES ({placeholders})
                ON CONFLICT(id) DO UPDATE SET
                    {update_assignments},
                    updated_by_user_id = excluded.updated_by_user_id,
                    updated_at = excluded.updated_at
                """,
                row_data,
            )
            server.sync_service_detail_tables(connection, item)
            imported += 1

        server.refresh_snapshot(connection, "service")
        server.checkpoint_connection(connection)
    return imported


def main() -> None:
    args = parse_args()
    csv_path = Path(args.csv_path).expanduser().resolve()
    source_image_dir = Path(args.source_image_dir).expanduser().resolve()
    target_image_dir = Path(args.target_image_dir).expanduser().resolve()

    if not csv_path.exists():
        raise SystemExit(f"CSV tidak ditemukan: {csv_path}")
    if not source_image_dir.exists():
        raise SystemExit(f"Folder sumber foto tidak ditemukan: {source_image_dir}")

    imported = import_rows(csv_path, source_image_dir, target_image_dir, args.mode, not args.month_first)
    print(f"Import MCC selesai. Total data: {imported}")
    print(f"Target image folder: {target_image_dir}")


if __name__ == "__main__":
    main()
