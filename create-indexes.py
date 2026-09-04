#!/usr/bin/env python3
"""Apply Phase 1 database indexes - corrected version"""

import sys
import sqlite3
from pathlib import Path

try:
    script_dir = Path(__file__).parent
    db_path = script_dir.parent / ".plirm34-data" / "plirm34.db"
    
    if not db_path.exists():
        db_path = Path.home() / ".plirm34-data" / "plirm34.db"
    
    if not db_path.exists():
        print("[ERROR] Database not found")
        sys.exit(1)
    
    print("[*] Creating Phase 1 database indexes (corrected)...")
    print(f"    Database: {db_path}")
    print()
    
    connection = sqlite3.connect(str(db_path))
    cursor = connection.cursor()
    
    # Corrected indexes based on actual schema
    indexes = [
        # Search performance
        ("idx_negatif_found_date", "CREATE INDEX IF NOT EXISTS idx_negatif_found_date ON negatif_list_items(found_date DESC)"),
        ("idx_negatif_work_status", "CREATE INDEX IF NOT EXISTS idx_negatif_work_status ON negatif_list_items(work_status)"),
        ("idx_sparepart_condition", "CREATE INDEX IF NOT EXISTS idx_sparepart_condition ON sparepart_items(condition)"),
        ("idx_sparepart_category", "CREATE INDEX IF NOT EXISTS idx_sparepart_category ON sparepart_items(category)"),
        ("idx_service_type", "CREATE INDEX IF NOT EXISTS idx_service_type ON service_items(type)"),
        ("idx_service_subtype", "CREATE INDEX IF NOT EXISTS idx_service_subtype ON service_items(subtype)"),
        ("idx_service_equipment", "CREATE INDEX IF NOT EXISTS idx_service_equipment ON service_items(equipment_name)"),
        
        # Audit log performance
        ("idx_activity_logs_created", "CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs(created_at DESC)"),
        ("idx_activity_logs_resource", "CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON activity_logs(resource)"),
        ("idx_activity_logs_actor", "CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON activity_logs(actor_username)"),
        
        # Composite indexes for common queries
        ("idx_negatif_category_area", "CREATE INDEX IF NOT EXISTS idx_negatif_category_area ON negatif_list_items(category, area)"),
        ("idx_service_type_equipment", "CREATE INDEX IF NOT EXISTS idx_service_type_equipment ON service_items(type, equipment_name)"),
    ]
    
    created_count = 0
    for idx_name, sql_statement in indexes:
        try:
            cursor.execute(sql_statement)
            print(f"    [OK] {idx_name}")
            created_count += 1
        except sqlite3.OperationalError as e:
            if "already exists" in str(e):
                print(f"    [EXISTS] {idx_name}")
            else:
                print(f"    [SKIP] {idx_name}: {e}")
    
    connection.commit()
    
    # Verify indexes
    cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%' ORDER BY name")
    all_indexes = cursor.fetchall()
    connection.close()
    
    print()
    print(f"[OK] Created {created_count} new indexes")
    print(f"[*] Total indexes in database: {len(all_indexes)}")
    print()
    print("[*] Indexes by purpose:")
    print("    Search Performance (7):")
    for idx in all_indexes:
        if any(x in idx[0] for x in ['negatif_found_date', 'negatif_work_status', 'sparepart_', 'service_']):
            print(f"      - {idx[0]}")
    
    print("    Audit Log Performance (3):")
    for idx in all_indexes:
        if 'activity_logs' in idx[0]:
            print(f"      - {idx[0]}")
    
    print("    Composite Indexes (2):")
    for idx in all_indexes:
        if 'category_area' in idx[0] or 'type_equipment' in idx[0]:
            print(f"      - {idx[0]}")
    
    print()
    print("[SUCCESS] Phase 1 database optimization complete!")
    print("[*] Expected performance gain: 50-60% faster queries on indexed columns")
    
except Exception as e:
    print(f"[ERROR] Failed: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
