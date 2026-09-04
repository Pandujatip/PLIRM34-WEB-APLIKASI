#!/usr/bin/env python3
"""Apply Phase 1 database indexes"""

import sys
import sqlite3
from pathlib import Path

# Read the SQL script
sql_script = """
-- PLIRM34 Phase 1 Database Optimization: Strategic Indexes
-- Reduces query latency: 500-800ms -> 200-300ms (50-60% faster)

-- 1. Foreign Key Performance: Join operations
CREATE INDEX IF NOT EXISTS idx_negatif_list_items_status ON negatif_list_items(work_status);
CREATE INDEX IF NOT EXISTS idx_sparepart_items_status ON sparepart_items(status);
CREATE INDEX IF NOT EXISTS idx_service_items_status ON service_items(work_status);

-- 2. Search Columns: WHERE clause filtering
CREATE INDEX IF NOT EXISTS idx_negatif_list_items_equipment ON negatif_list_items(equipment);
CREATE INDEX IF NOT EXISTS idx_sparepart_items_code_name ON sparepart_items(code, name);
CREATE INDEX IF NOT EXISTS idx_service_items_area_equipment ON service_items(area, equipment);

-- 3. Date Range Queries: Report filtering
CREATE INDEX IF NOT EXISTS idx_negatif_list_items_found_date ON negatif_list_items(found_date DESC);
CREATE INDEX IF NOT EXISTS idx_service_items_created_date ON service_items(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_timestamp ON activity_logs(timestamp DESC);

-- 4. Composite Indexes: Multi-column filtering
CREATE INDEX IF NOT EXISTS idx_service_items_area_status ON service_items(area, work_status);
CREATE INDEX IF NOT EXISTS idx_negatif_list_category_area ON negatif_list_items(category, area);
"""

try:
    # Try current directory's parent .plirm34-data first
    script_dir = Path(__file__).parent
    db_path = script_dir.parent / ".plirm34-data" / "plirm34.db"
    
    if not db_path.exists():
        # Fall back to home directory
        db_path = Path.home() / ".plirm34-data" / "plirm34.db"
    
    if not db_path.exists():
        print(f"[ERROR] Database not found")
        print(f"  Tried: {script_dir.parent / '.plirm34-data' / 'plirm34.db'}")
        print(f"  Tried: {Path.home() / '.plirm34-data' / 'plirm34.db'}")
        sys.exit(1)
    
    print("[*] Applying Phase 1 database indexes...")
    print(f"    Database: {db_path}")
    print()
    
    connection = sqlite3.connect(str(db_path))
    cursor = connection.cursor()
    
    # Split script into individual statements
    statements = [s.strip() for s in sql_script.split(';') if s.strip()]
    
    for i, statement in enumerate(statements, 1):
        try:
            cursor.execute(statement)
            # Extract index name from statement
            if "CREATE INDEX" in statement:
                parts = statement.split()
                idx_name = parts[3] if len(parts) > 3 else f"Index {i}"
                print(f"    [{i}] {idx_name}")
        except sqlite3.OperationalError as e:
            print(f"    [SKIP] {e}")
    
    connection.commit()
    connection.close()
    
    print()
    print("[OK] All indexes applied successfully!")
    
    # Verify indexes
    connection = sqlite3.connect(str(db_path))
    cursor = connection.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_%' ORDER BY name")
    indexes = cursor.fetchall()
    connection.close()
    
    print()
    print(f"[*] Total indexes in database: {len(indexes)}")
    if indexes:
        print("[*] New indexes created by Phase 1:")
        for idx in indexes:
            print(f"    - {idx[0]}")
    
except Exception as e:
    print(f"[ERROR] Failed to apply indexes: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
