#!/usr/bin/env python3
"""Get detailed column info for key tables"""

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
    
    connection = sqlite3.connect(str(db_path))
    cursor = connection.cursor()
    
    # Check key tables for indexing
    key_tables = [
        'negatif_list_items',
        'sparepart_items',
        'service_items',
        'activity_logs',
    ]
    
    for table_name in key_tables:
        print(f"[*] Columns in {table_name}:")
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        for col in columns:
            col_id, col_name, col_type, not_null, default, pk = col
            print(f"    - {col_name}: {col_type}")
        print()
    
    connection.close()
    
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
