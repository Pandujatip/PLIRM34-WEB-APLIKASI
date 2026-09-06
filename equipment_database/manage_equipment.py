#!/usr/bin/env python3
"""
CLI Tool: Pengelolaan & Penelusuran Database Master Equipment SAP (Tuban 1 - 4)
Mendukung pengelompokan berdasarkan Pabrik dan Area Operasional.
"""

import sys
import os
import sqlite3
import argparse
import csv
import json

# Ensure UTF-8 output on Windows terminals
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "sap_equipment.db")

def get_db():
    if not os.path.exists(DB_PATH):
        print(f"Error: Database {DB_PATH} belum dibuat. Jalankan equipment_parser.py terlebih dahulu.")
        sys.exit(1)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def cmd_stats(args):
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("SELECT count(*) FROM plants")
    num_plants = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM areas")
    num_areas = cur.fetchone()[0]
    cur.execute("SELECT count(*) FROM functional_locations")
    num_floc = cur.fetchone()[0]
    cur.execute("SELECT count(*), sum(is_main_equipment), count(*) - sum(is_main_equipment) FROM equipments")
    tot_eq, main_eq, sub_eq = cur.fetchone()
    
    print("=" * 65)
    print("RINGKASAN STATISTIK DATABASE EQUIPMENT SAP (TUBAN 1 - 4)")
    print("=" * 65)
    print(f"Lokasi Database      : {DB_PATH}")
    print(f"Total Unit Pabrik    : {num_plants}")
    print(f"Total Area Pabrik    : {num_areas} Area")
    print(f"Total Functional Loc : {num_floc:,}")
    print(f"Total Equipment      : {tot_eq:,} unit")
    print(f"  |-- Main Equipment : {main_eq:,} unit")
    print(f"  +-- Sub-Equipment  : {sub_eq:,} unit")
    print("-" * 65)
    print("DISTRIBUSI PER PABRIK & AREA:")
    
    cur.execute("""
        SELECT p.plant_code, p.plant_name, count(e.equipment_id), sum(e.is_main_equipment)
        FROM plants p
        LEFT JOIN equipments e ON p.plant_code = e.plant_code
        GROUP BY p.plant_code
        ORDER BY p.plant_code
    """)
    plants_rows = cur.fetchall()
    for prow in plants_rows:
        p_code = prow[0]
        p_name = prow[1].replace("PLANT ", "")
        print(f"\n[{p_code} - {p_name}] Total: {prow[2]:,d} unit (Main: {prow[3]:,d})")
        cur.execute("""
            SELECT area_code, area_name, equipment_count, main_equipment_count
            FROM areas
            WHERE plant_code = ?
            ORDER BY area_code
        """, (p_code,))
        for a in cur.fetchall():
            print(f"   * {a['area_code']:14s} | {a['area_name']:30s} : {a['equipment_count']:>5,d} unit (Main: {a['main_equipment_count']:>3,d})")

    print("-" * 65)
    print("DISTRIBUSI PER DISIPLIN (KEAHLIAN):")
    cur.execute("""
        SELECT discipline_name, count(*) as cnt
        FROM equipments
        GROUP BY discipline_name
        ORDER BY cnt DESC
    """)
    for row in cur.fetchall():
        name = row[0] or "General / Lainnya"
        print(f"  * {name:25s} : {row[1]:,d} unit")
    print("=" * 65)
    conn.close()

def cmd_search(args):
    query = args.query.strip()
    area_filter = (args.area or "").strip().upper()
    plant_filter = (args.plant or "").strip().upper()
    limit = args.limit or 25
    conn = get_db()
    cur = conn.cursor()
    
    where_clauses = []
    params = []
    
    if plant_filter and plant_filter != "ALL":
        where_clauses.append("plant_code = ?")
        params.append(plant_filter)

    if area_filter and area_filter != "ALL":
        where_clauses.append("(area_code LIKE ? OR area_name LIKE ?)")
        params.extend([f"%{area_filter}%", f"%{area_filter}%"])

    like_term = f"%{query}%"
    where_clauses.append("(equipment_id LIKE ? OR tag_no LIKE ? OR description LIKE ? OR floc_code LIKE ?)")
    params.extend([like_term, like_term, like_term, like_term])

    where_str = f"WHERE {' AND '.join(where_clauses)}"
    cur.execute(f"""
        SELECT equipment_id, tag_no, description, discipline_name, plant_name, area_name, area_code, is_main_equipment, sub_equipment_count
        FROM equipments
        {where_str}
        ORDER BY plant_code, area_code, level, equipment_id
        LIMIT ?
    """, params + [limit])
    rows = cur.fetchall()

    print(f"\nHasil pencarian untuk '{query}' (Ditemukan {len(rows)} data, limit {limit}):")
    print("-" * 110)
    print(f"{'No Equipment':<14} | {'Tag / Tech Ident':<16} | {'Disiplin':<15} | {'Area':<22} | Deskripsi")
    print("-" * 110)
    for r in rows:
        tag = r["tag_no"] or "-"
        disc = r["discipline_name"] or "-"
        area = (r["area_name"] or r["area_code"] or "").replace("AREA ", "")
        main_badge = "[MAIN]" if r["is_main_equipment"] else f"[SUB ({r['sub_equipment_count']})]"
        print(f"{r['equipment_id']:<14} | {tag:<16} | {disc:<15} | {area[:22]:<22} | {r['description']} {main_badge}")
    print("-" * 110)
    conn.close()

def cmd_tree(args):
    ident = args.id_or_tag.strip()
    conn = get_db()
    cur = conn.cursor()
    
    cur.execute("""
        SELECT * FROM equipments 
        WHERE equipment_id = ? OR tag_no = ?
        LIMIT 1
    """, (ident, ident))
    eq = cur.fetchone()
    
    if not eq:
        print(f"Error: Equipment dengan ID atau Tag '{ident}' tidak ditemukan.")
        conn.close()
        return

    # Find root equipment if this is a sub-equipment
    root = eq
    visited = set()
    while root["parent_equipment_id"] and root["equipment_id"] not in visited:
        visited.add(root["equipment_id"])
        cur.execute("SELECT * FROM equipments WHERE equipment_id = ?", (root["parent_equipment_id"],))
        p = cur.fetchone()
        if not p:
            break
        root = p

    print("=" * 70)
    print("POHON HIERARKI EQUIPMENT SAP (BERDASARKAN AREA)")
    print("=" * 70)
    print(f"Pabrik           : {root['plant_name']} ({root['plant_code']})")
    print(f"Area             : {root['area_code']} - {root['area_name']}")
    print(f"Functional Group : {root['floc_code']}")
    print("-" * 70)

    def print_subtree(eq_id, prefix=""):
        cur.execute("SELECT * FROM equipments WHERE equipment_id = ?", (eq_id,))
        node = cur.fetchone()
        if not node:
            return
            
        highlight = " <-- TARGET" if node["equipment_id"] == eq["equipment_id"] else ""
        badge = f"[{node['discipline_name'] or node['discipline']}]"
        tag = f"({node['tag_no']})" if node['tag_no'] else ""
        print(f"{prefix}|-- {node['equipment_id']} {tag} {node['description']} {badge}{highlight}")
        
        cur.execute("SELECT equipment_id FROM equipments WHERE parent_equipment_id = ? ORDER BY equipment_id", (eq_id,))
        children = cur.fetchall()
        for i, child in enumerate(children):
            is_last = (i == len(children) - 1)
            next_prefix = prefix + ("    " if is_last else "|   ")
            print_subtree(child["equipment_id"], next_prefix)

    print_subtree(root["equipment_id"])
    print("=" * 70)
    conn.close()

def cmd_info(args):
    ident = args.id.strip()
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM equipments WHERE equipment_id = ? OR tag_no = ?", (ident, ident))
    row = cur.fetchone()
    if not row:
        print(f"Equipment '{ident}' tidak ditemukan.")
        conn.close()
        return
        
    data = dict(row)
    print("=" * 60)
    print(f"INFORMASI EQUIPMENT: {data['equipment_id']} - {data['description']}")
    print("=" * 60)
    for k, v in data.items():
        print(f"  {k:<22} : {v}")
    
    if data["parent_equipment_id"]:
        cur.execute("SELECT equipment_id, tag_no, description FROM equipments WHERE equipment_id = ?", (data["parent_equipment_id"],))
        parent = cur.fetchone()
        if parent:
            print(f"  [Parent Equipment]     : {parent['equipment_id']} ({parent['tag_no']}) {parent['description']}")

    cur.execute("SELECT equipment_id, tag_no, description, discipline_name FROM equipments WHERE parent_equipment_id = ?", (data["equipment_id"],))
    children = cur.fetchall()
    print(f"  [Sub-Equipment Count]  : {len(children)}")
    for ch in children:
        print(f"     +-- {ch['equipment_id']} ({ch['tag_no']}) : {ch['description']} [{ch['discipline_name']}]")
    print("=" * 60)
    conn.close()

def cmd_export(args):
    plant = args.plant
    area = args.area
    fmt = (args.format or "csv").lower()
    out_file = args.output or f"export_equipments_{plant or 'all'}_{area or 'all'}.{fmt}"
    
    conn = get_db()
    cur = conn.cursor()
    
    where_clauses = []
    params = []
    if plant and plant.upper() != "ALL":
        where_clauses.append("plant_code = ?")
        params.append(plant)
    if area and area.upper() != "ALL":
        where_clauses.append("(area_code LIKE ? OR area_name LIKE ?)")
        params.extend([f"%{area}%", f"%{area}%"])

    where_str = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
    query = f"SELECT * FROM equipments {where_str} ORDER BY plant_code, area_code, level, equipment_id"
    
    cur.execute(query, params)
    rows = cur.fetchall()
    
    if fmt == "csv":
        with open(out_file, "w", newline="", encoding="utf-8-sig") as fp:
            writer = csv.writer(fp)
            if rows:
                writer.writerow(rows[0].keys())
                for r in rows:
                    writer.writerow(list(r))
        print(f"Berhasil mengekspor {len(rows):,} equipment ke CSV: {out_file}")
    elif fmt == "json":
        records = [dict(r) for r in rows]
        with open(out_file, "w", encoding="utf-8") as fp:
            json.dump(records, fp, indent=2, ensure_ascii=False)
        print(f"Berhasil mengekspor {len(rows):,} equipment ke JSON: {out_file}")
    else:
        print(f"Format {fmt} tidak didukung (gunakan csv atau json).")
    conn.close()

def main():
    parser = argparse.ArgumentParser(description="Alat Pengelolaan & Penelusuran Database Master Equipment SAP (+ Area)")
    subparsers = parser.add_subparsers(dest="command")

    # stats
    subparsers.add_parser("stats", help="Menampilkan ringkasan statistik database per Pabrik & Area")

    # search
    sp_search = subparsers.add_parser("search", help="Mencari equipment berdasarkan nomor, tag, deskripsi, dan area")
    sp_search.add_argument("query", help="Kata kunci pencarian (misal: 231BF1, MOTOR, 50015855)")
    sp_search.add_argument("--plant", help="Filter plant (SG-2302, SG-2303, SG-2304, SG-2305)")
    sp_search.add_argument("--area", help="Filter area (CR, RM, KL, FM, PC, EL, WH, WT)")
    sp_search.add_argument("--limit", type=int, default=25, help="Batas jumlah hasil (default: 25)")

    # tree
    sp_tree = subparsers.add_parser("tree", help="Menampilkan pohon hierarki equipment dan areanya")
    sp_tree.add_argument("id_or_tag", help="Nomor Equipment (8 digit) atau No Function Loc / Tag")

    # info
    sp_info = subparsers.add_parser("info", help="Menampilkan detail lengkap satu equipment")
    sp_info.add_argument("id", help="Nomor Equipment atau Tag")

    # export
    sp_export = subparsers.add_parser("export", help="Mengekspor data equipment ke CSV atau JSON")
    sp_export.add_argument("--plant", default="ALL", help="Kode plant (SG-2302, SG-2303, SG-2304, SG-2305, atau ALL)")
    sp_export.add_argument("--area", default="ALL", help="Kode area (CR, RM, KL, FM, PC, EL, WH, WT, atau ALL)")
    sp_export.add_argument("--format", default="csv", choices=["csv", "json"], help="Format ekspor (csv atau json)")
    sp_export.add_argument("--output", help="Nama file hasil ekspor")

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    if args.command == "stats":
        cmd_stats(args)
    elif args.command == "search":
        cmd_search(args)
    elif args.command == "tree":
        cmd_tree(args)
    elif args.command == "info":
        cmd_info(args)
    elif args.command == "export":
        cmd_export(args)

if __name__ == "__main__":
    main()
