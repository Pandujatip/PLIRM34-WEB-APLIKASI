import os
import glob
import re
import sqlite3
import json
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SAP_DIR = r"C:\Users\tigal\OneDrive\Dokumen\SAP\SAP GUI"
DB_PATH = os.path.join(BASE_DIR, "sap_equipment.db")
SCHEMA_PATH = os.path.join(BASE_DIR, "schema.sql")

DISCIPLINE_MAP = {
    "E": "Electrical",
    "M": "Mechanical",
    "I": "Instrumentation",
    "C": "Civil",
    "U": "Utility / Lubrication",
}

PLANT_METADATA = {
    "SG-2302": {"number": "2302", "name": "PLANT TUBAN 1", "planning_plant": "7902"},
    "SG-2303": {"number": "2303", "name": "PLANT TUBAN 2", "planning_plant": "7902"},
    "SG-2304": {"number": "2304", "name": "PLANT TUBAN 3", "planning_plant": "7902"},
    "SG-2305": {"number": "2305", "name": "PLANT TUBAN 4", "planning_plant": "7902"},
}

def clean_description(desc: str) -> str:
    desc = re.sub(r'\s+', ' ', desc).strip()
    parts = [p.strip() for p in desc.split(',') if p.strip()]
    if len(parts) > 1 and len(set(parts)) == 1:
        desc = parts[0]
    return desc.rstrip(',').strip()

def init_database(conn):
    with open(SCHEMA_PATH, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    conn.executescript(schema_sql)
    now = datetime.now(timezone.utc).isoformat()
    for code, meta in PLANT_METADATA.items():
        conn.execute(
            "INSERT OR REPLACE INTO plants (plant_code, plant_number, plant_name, planning_plant, created_at) VALUES (?, ?, ?, ?, ?)",
            (code, meta["number"], meta["name"], meta["planning_plant"], now)
        )
    conn.commit()

def parse_file(filepath, conn):
    filename = os.path.basename(filepath)
    print(f"[*] Processing {filename} with Area hierarchy...")
    
    with open(filepath, 'r', encoding='utf-16', errors='replace') as fp:
        lines = [l.rstrip('\r\n') for l in fp if l.strip()]

    stack = []
    floc_records = []
    eq_records = []
    area_dict = {}  # area_code -> {area_name, short_code, plant_code}
    
    current_plant_code = None
    current_area_code = None
    current_area_name = ""
    current_group_area_code = None
    now = datetime.now(timezone.utc).isoformat()

    for line in lines[2:]:
        tabs = len(line) - len(line.lstrip('\t'))
        parts = [p.strip() for p in line.split('\t') if p.strip()]
        if not parts:
            continue
            
        code = parts[0]
        desc = clean_description(parts[1]) if len(parts) > 1 else ''
        
        while stack and stack[-1]['tabs'] >= tabs:
            stack.pop()

        if code.startswith('SG-'):
            plant_prefix = '-'.join(code.split('-')[:2])
            if plant_prefix in PLANT_METADATA:
                current_plant_code = plant_prefix
                
            parent_floc = next((item['code'] for item in reversed(stack) if item['type'] == 'floc'), None)
            
            code_parts = code.split('-')
            level = len(code_parts)
            
            if level == 2:
                current_plant_code = code
            elif level == 3:
                current_area_code = code
                current_area_name = desc
                short_code = code_parts[2] if len(code_parts) > 2 else code
                area_dict[current_area_code] = {
                    "plant_code": current_plant_code,
                    "area_name": current_area_name,
                    "short_code": short_code
                }
            elif level == 4:
                current_group_area_code = code
                
            category = parts[3] if len(parts) > 3 else (parts[2] if len(parts) > 2 else '')
            cost_center = parts[6] if len(parts) > 6 else (parts[5] if len(parts) > 5 else '')
            
            floc_records.append((
                code,
                current_plant_code or 'SG-2302',
                current_area_code,
                current_group_area_code,
                parent_floc,
                desc,
                category,
                cost_center,
                level,
                json.dumps(parts)
            ))
            stack.append({
                'tabs': tabs, 
                'type': 'floc', 
                'code': code, 
                'depth': level,
                'area_code': current_area_code,
                'area_name': current_area_name
            })
            
        elif code.isdigit():
            parent_eq = next((item['code'] for item in reversed(stack) if item['type'] == 'equipment'), None)
            parent_floc_node = next((item for item in reversed(stack) if item['type'] == 'floc'), None)
            parent_floc = parent_floc_node['code'] if parent_floc_node else None
            eq_area_code = parent_floc_node.get('area_code', current_area_code) if parent_floc_node else current_area_code
            eq_area_name = parent_floc_node.get('area_name', current_area_name) if parent_floc_node else current_area_name
            
            tag_no = parts[2] if len(parts) > 2 else ''
            discipline = parts[3] if len(parts) > 3 else ''
            discipline_name = DISCIPLINE_MAP.get(discipline, discipline)
            category = parts[4] if len(parts) > 4 else ''
            plant_num = parts[5] if len(parts) > 5 else ''
            planning_plant = parts[6] if len(parts) > 6 else ''
            
            is_main = 1 if parent_eq is None else 0
            
            eq_depth = 1
            if parent_eq:
                for item in reversed(stack):
                    if item['type'] == 'equipment':
                        eq_depth = item.get('depth', 1) + 1
                        break
                        
            p_code = current_plant_code or f'SG-{plant_num}'
            p_name = PLANT_METADATA.get(p_code, {}).get("name", "PLANT TUBAN")
            
            eq_records.append((
                code,
                parent_floc,
                parent_eq,
                tag_no,
                desc,
                discipline,
                discipline_name,
                category,
                p_code,
                p_name,
                eq_area_code or '',
                eq_area_name or '',
                planning_plant,
                '', # cost center
                eq_depth,
                is_main,
                0, # sub_equipment_count
                now,
                now
            ))
            stack.append({
                'tabs': tabs, 
                'type': 'equipment', 
                'code': code, 
                'depth': eq_depth,
                'area_code': eq_area_code,
                'area_name': eq_area_name
            })

    # Insert areas
    area_records = [
        (ac, info["plant_code"], info["area_name"], info["short_code"])
        for ac, info in area_dict.items()
    ]
    conn.executemany("""
        INSERT OR REPLACE INTO areas (area_code, plant_code, area_name, short_code)
        VALUES (?, ?, ?, ?)
    """, area_records)

    # Bulk insert flocs
    conn.executemany("""
        INSERT OR REPLACE INTO functional_locations 
        (floc_code, plant_code, area_code, group_area_code, parent_floc_code, description, category, cost_center, level, raw_tokens)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, floc_records)
    
    # Bulk insert equipments
    conn.executemany("""
        INSERT OR REPLACE INTO equipments 
        (equipment_id, floc_code, parent_equipment_id, tag_no, description, discipline, discipline_name, category, plant_code, plant_name, area_code, area_name, planning_plant, cost_center, level, is_main_equipment, sub_equipment_count, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, eq_records)
    
    conn.commit()
    print(f"[+] Completed {filename}: {len(area_dict)} Areas, {len(floc_records):,} Flocs, {len(eq_records):,} Equipments.")

def update_counts_and_fts(conn):
    print("[*] Updating sub_equipment_counts and area equipment_counts...")
    conn.execute("""
        UPDATE equipments
        SET sub_equipment_count = (
            SELECT COUNT(*) FROM equipments sub WHERE sub.parent_equipment_id = equipments.equipment_id
        )
    """)
    conn.execute("""
        UPDATE areas
        SET 
            equipment_count = (SELECT COUNT(*) FROM equipments e WHERE e.area_code = areas.area_code),
            main_equipment_count = (SELECT COUNT(*) FROM equipments e WHERE e.area_code = areas.area_code AND e.is_main_equipment = 1)
    """)
    conn.commit()
    
    print("[*] Building FTS5 search index with Area fields...")
    conn.execute("DELETE FROM equipment_fts")
    conn.execute("""
        INSERT INTO equipment_fts (rowid, equipment_id, tag_no, description, floc_code, area_code, area_name, plant_name, discipline_name, category)
        SELECT 
            e.rowid,
            e.equipment_id,
            COALESCE(e.tag_no, ''),
            e.description,
            COALESCE(e.floc_code, ''),
            COALESCE(e.area_code, ''),
            COALESCE(e.area_name, ''),
            e.plant_name,
            COALESCE(e.discipline_name, ''),
            COALESCE(e.category, '')
        FROM equipments e
    """)
    conn.commit()
    print("[+] FTS5 index built successfully!")

def main():
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print(f"Removed existing {DB_PATH}")
        
    conn = sqlite3.connect(DB_PATH)
    conn.execute("PRAGMA synchronous = NORMAL")
    init_database(conn)
    
    files = sorted(glob.glob(os.path.join(SAP_DIR, "*.XLS")))
    if not files:
        print(f"No XLS files found in {SAP_DIR}")
        return
        
    for f in files:
        parse_file(f, conn)
        
    update_counts_and_fts(conn)
    
    cur = conn.cursor()
    cur.execute("SELECT count(*) FROM areas")
    num_areas = cur.fetchone()[0]
    cur.execute("SELECT count(*), sum(is_main_equipment) FROM equipments")
    tot_eq, main_eq = cur.fetchone()
    
    print("\n========================================================")
    print("DATABASE MASTER EQUIPMENT SAP BERHASIL DIBUAT (+ AREA)!")
    print("========================================================")
    print(f"Path Database   : {DB_PATH}")
    print(f"Total Area      : {num_areas} Area (Tuban 1 s/d Tuban 4)")
    print(f"Total Equipment : {tot_eq:,} (Main: {main_eq:,})")
    print("--------------------------------------------------------")
    
    cur.execute("""
        SELECT a.area_code, a.area_name, a.equipment_count, a.main_equipment_count, p.plant_name
        FROM areas a
        JOIN plants p ON a.plant_code = p.plant_code
        ORDER BY a.area_code
    """)
    for row in cur.fetchall():
        print(f"  [{row[4].replace('PLANT ', '')}] {row[0]:15s} | {row[1]:32s} : {row[2]:,d} unit (Main: {row[3]:,d})")
        
    print("========================================================")
    conn.close()

if __name__ == '__main__':
    main()
