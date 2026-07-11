from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class AndroidSigningTests(unittest.TestCase):
    def test_signing_uses_external_keystore_and_environment_secrets(self):
        build_script = (PROJECT_ROOT / "native-android" / "build-apk.ps1").read_text(encoding="utf-8")
        self.assertNotIn("pass:plirm34", build_script)
        self.assertNotIn("-storepass plirm34", build_script)
        self.assertNotIn("-keypass plirm34", build_script)
        self.assertIn("PLIRM34_ANDROID_KEYSTORE", build_script)
        self.assertIn("--ks-pass env:PLIRM34_ANDROID_STORE_PASSWORD", build_script)
        self.assertIn("--key-pass env:PLIRM34_ANDROID_KEY_PASSWORD", build_script)
        self.assertFalse((PROJECT_ROOT / "native-android" / "plirm34-debug.keystore").exists())

        gitignore = (PROJECT_ROOT / ".gitignore").read_text(encoding="utf-8")
        self.assertIn("native-android/*.keystore", gitignore)
        self.assertIn("native-android/*.jks", gitignore)
        self.assertIn("native-android/dist/", gitignore)


class BackendIntegrityTests(unittest.TestCase):
    def test_bot_target_validation_and_atomic_service_stock(self):
        script = r"""
import json
import server

server.init_db()

base_setting = {
    "enabled": False,
    "groupId": "",
    "groupName": "",
    "autoWriteEnabled": True,
    "dailyScheduleEnabled": True,
    "dailyScheduleTime": "08:00",
    "commandPrefix": "!",
}

for payload in (
    {**base_setting, "enabled": True},
    {**base_setting, "enabled": True, "groupId": "not-a-group"},
    {**base_setting, "dailyScheduleTime": "29:99"},
):
    try:
        server.save_whatsapp_bot_setting(payload)
    except ValueError:
        pass
    else:
        raise AssertionError(f"Setting bot seharusnya ditolak: {payload}")

saved_setting = server.save_whatsapp_bot_setting({
    **base_setting,
    "enabled": True,
    "groupId": "120363123456789@g.us",
    "groupName": "PLIRM34",
})
assert saved_setting["enabled"] is True
assert saved_setting["groupId"] == "120363123456789@g.us"

source_message_id = "create-negatif:" + ("a" * 64)
bot_payload = {
    "sourceMessageId": source_message_id,
    "equipment": "343RM1",
    "description": "Bearing perlu diperiksa",
    "followUpPlan": "Jadwalkan inspeksi",
    "area": "Raw Mill",
}
bot_item, bot_duplicate = server.create_negatif_item_from_bot(bot_payload)
assert bot_duplicate is False
duplicate_item, duplicate_flag = server.create_negatif_item_from_bot(bot_payload)
assert duplicate_flag is True
assert duplicate_item["id"] == bot_item["id"]
with server.get_connection() as connection:
    assert connection.execute(
        "SELECT COUNT(*) FROM negatif_list_items WHERE id = ?",
        (bot_item["id"],),
    ).fetchone()[0] == 1
    assert connection.execute(
        "SELECT COUNT(*) FROM whatsapp_bot_message_receipts WHERE message_id = ?",
        (source_message_id,),
    ).fetchone()[0] == 1

try:
    server.create_negatif_item_from_bot({
        **bot_payload,
        "sourceMessageId": "create-negatif:" + ("b" * 64),
        "equipment": "X" * 81,
    })
except ValueError:
    pass
else:
    raise AssertionError("Equipment WhatsApp yang terlalu panjang seharusnya ditolak")

try:
    server.create_negatif_item_from_bot([])
except ValueError:
    pass
else:
    raise AssertionError("Payload WhatsApp non-object seharusnya ditolak")

close_message_id = "close-negatif:" + ("c" * 64)
closed_item, close_duplicate = server.close_negatif_item_from_bot({
    "sourceMessageId": close_message_id,
    "equipment": "343RM1",
    "note": "Selesai diperiksa",
})
assert close_duplicate is False
assert closed_item["workStatus"] == "Close"
closed_again, close_duplicate_again = server.close_negatif_item_from_bot({
    "sourceMessageId": close_message_id,
    "equipment": "343RM1",
    "note": "Selesai diperiksa",
})
assert close_duplicate_again is True
assert closed_again["id"] == closed_item["id"]

admin_row = server.get_user_by_username("admin.plirm34")
user = {"id": int(admin_row["id"]), "username": admin_row["username"], "role": admin_row["role"]}
reference = server.get_carbon_brush_type_reference_groups()[0]

valid_item = {
    "id": "test-atomic-success",
    "type": "Electrical",
    "subtype": "Motor MV Carbon Brush",
    "formType": "service-motor-mv-carbon-brush",
    "equipmentName": "TEST MOTOR VALID",
    "description": "Atomic success",
    "detail": "",
    "payload": {
        "inspectionDate": "2026-07-10",
        "carbonBrushStockKey": reference["stockKey"],
        "measurements": {"A1": "31"},
        "replacedPoints": ["A1"],
    },
}

with server.get_connection() as connection:
    before_stock = connection.execute(
        "SELECT current_stock FROM carbon_brush_stock WHERE stock_key = ?",
        (reference["stockKey"],),
    ).fetchone()["current_stock"]

existing, saved, stock_result = server.create_or_update_service_item_atomic(valid_item, user)
assert existing is None
assert saved["id"] == valid_item["id"]
assert stock_result["movements"][0]["stockAfter"] == int(before_stock) - 1

with server.get_connection() as connection:
    committed_service = connection.execute(
        "SELECT 1 FROM service_items WHERE id = ?",
        (valid_item["id"],),
    ).fetchone()
    committed_log = connection.execute(
        "SELECT 1 FROM carbon_brush_stock_logs WHERE service_id = ?",
        (valid_item["id"],),
    ).fetchone()
assert committed_service is not None
assert committed_log is not None

invalid_item = {
    **valid_item,
    "id": "test-atomic-rollback",
    "equipmentName": "UNMAPPED TEST MOTOR",
    "payload": {
        "inspectionDate": "2026-07-10",
        "measurements": {"A1": "30"},
        "replacedPoints": ["A1"],
    },
}

try:
    server.create_or_update_service_item_atomic(invalid_item, user)
except ValueError:
    pass
else:
    raise AssertionError("Service tanpa mapping stock seharusnya gagal")

with server.get_connection() as connection:
    rolled_back_service = connection.execute(
        "SELECT 1 FROM service_items WHERE id = ?",
        (invalid_item["id"],),
    ).fetchone()
    rolled_back_log = connection.execute(
        "SELECT 1 FROM carbon_brush_stock_logs WHERE service_id = ?",
        (invalid_item["id"],),
    ).fetchone()
    snapshot = connection.execute(
        "SELECT payload FROM app_state WHERE resource = ?",
        (server.STATE_KEYS["service"],),
    ).fetchone()["payload"]
assert rolled_back_service is None
assert rolled_back_log is None
assert all(item.get("id") != invalid_item["id"] for item in json.loads(snapshot))

print("bot_validation=ok")
print("atomic_commit=ok")
print("atomic_rollback=ok")
"""
        with tempfile.TemporaryDirectory() as temporary_directory:
            data_dir = Path(temporary_directory)
            environment = os.environ.copy()
            environment["PLIRM34_DATA_DIR"] = str(data_dir)
            environment["PLIRM34_SKIP_LEGACY_MIGRATION"] = "1"
            result = subprocess.run(
                [sys.executable, "-c", script],
                cwd=PROJECT_ROOT,
                env=environment,
                capture_output=True,
                text=True,
                timeout=60,
                check=False,
            )
        self.assertEqual(result.returncode, 0, msg=f"stdout:\n{result.stdout}\nstderr:\n{result.stderr}")


if __name__ == "__main__":
    unittest.main()
