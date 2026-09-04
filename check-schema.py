#!/usr/bin/env python3
"""Check database schema and create appropriate indexes"""

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
    
    print("[*] Database schema analysis...")
    print(f"    Database: {db_path}")
    print()
    
    connection = sqlite3.connect(str(db_path))
    cursor = connection.cursor()
    
    # Get all tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = cursor.fetchall()
    
    print("[*] Tables in database:")
    for table in tables:
        table_name = table[0]
        # Get columns for each table
        cursor.execute(f"PRAGMA table_info({table_name})")
        columns = cursor.fetchall()
        col_names = [col[1] for col in columns]
        print(f"    - {table_name}: {', '.join(col_names[:5])}")
        if len(col_names) > 5:
            print(f"      ... and {len(col_names) - 5} more columns")
    
    print()
    print("[*] Existing indexes:")
    cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%' ORDER BY name")
    indexes = cursor.fetchall()
    for idx in indexes:
        print(f"    - {idx[0]}")
    
    connection.close()
    
    print()
    print("[OK] Schema analysis complete")
    
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
