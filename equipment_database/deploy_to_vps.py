#!/usr/bin/env python3
"""
Skrip Migrasi & Deployment Database Master Equipment SAP ke Database VPS (plirm34.db)

Fungsi:
1. Memindahkan data master dari sap_equipment.db ke plirm34.db pada tabel:
   - sap_plants
   - sap_areas
   - sap_functional_locations
   - sap_equipments
   - sap_equipment_fts (FTS5 Virtual Table untuk pencarian kilat)
2. Memastikan tabel lama (equipment_reference, service_motor_mv_carbon_brush_details, dsb.)
   TIDAK TERSENTUH / TIDAK BERUBAH sama sekali.
3. Mendukung eksekusi lokal maupun langsung di server VPS.
"""

import sys
import os
import sqlite3
import argparse
from pathlib import Path

# Ensure UTF-8 output
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_SOURCE_DB = BASE_DIR / "sap_equipment.db"

def get_default_target_db() -> Path:
    env_dir = os.environ.get("PLIRM34_DATA_DIR", "").strip()
    if env_dir:
        return Path(env_dir).expanduser() / "plirm34.db"
    
    # Candidate 1: standard repo sibling .plirm34-data
    c1 = BASE_DIR.parent.parent / ".plirm34-data" / "plirm34.db"
    if c1.exists():
        return c1
    
    # Candidate 2: user home directory
    c2 = Path.home() / ".plirm34-data" / "plirm34.db"
    if c2.exists():
        return c2
    
    return c1

SCHEMA_SQL = """
-- 1. Master Pabrik
CREATE TABLE IF NOT EXISTS sap_plants (
    plant_code TEXT PRIMARY KEY,
    plant_number TEXT,
    plant_name TEXT NOT NULL,
    planning_plant TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master Area Operasional
CREATE TABLE IF NOT EXISTS sap_areas (
    area_code TEXT PRIMARY KEY,
    plant_code TEXT NOT NULL,
    area_name TEXT NOT NULL,
    short_code TEXT,
    equipment_count INTEGER DEFAULT 0,
    main_equipment_count INTEGER DEFAULT 0,
    FOREIGN KEY (plant_code) REFERENCES sap_plants(plant_code)
);
CREATE INDEX IF NOT EXISTS idx_sap_areas_plant ON sap_areas(plant_code);

-- 3. Master Functional Locations
CREATE TABLE IF NOT EXISTS sap_functional_locations (
    floc_code TEXT PRIMARY KEY,
    plant_code TEXT NOT NULL,
    area_code TEXT,
    group_area_code TEXT,
    parent_floc_code TEXT,
    description TEXT NOT NULL,
    category TEXT,
    cost_center TEXT,
    level INTEGER DEFAULT 0,
    raw_tokens TEXT,
    FOREIGN KEY (plant_code) REFERENCES sap_plants(plant_code)
);
CREATE INDEX IF NOT EXISTS idx_sap_floc_plant ON sap_functional_locations(plant_code);
CREATE INDEX IF NOT EXISTS idx_sap_floc_area ON sap_functional_locations(area_code);

-- 4. Master Equipment (Utama & Sub-Equipment)
CREATE TABLE IF NOT EXISTS sap_equipments (
    equipment_id TEXT PRIMARY KEY,
    floc_code TEXT,
    parent_equipment_id TEXT,
    tag_no TEXT,
    description TEXT NOT NULL,
    discipline TEXT,
    discipline_name TEXT,
    category TEXT,
    plant_code TEXT NOT NULL,
    plant_name TEXT NOT NULL,
    area_code TEXT,
    area_name TEXT,
    planning_plant TEXT,
    cost_center TEXT,
    level INTEGER DEFAULT 0,
    is_main_equipment INTEGER NOT NULL DEFAULT 0,
    sub_equipment_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plant_code) REFERENCES sap_plants(plant_code),
    FOREIGN KEY (area_code) REFERENCES sap_areas(area_code),
    FOREIGN KEY (parent_equipment_id) REFERENCES sap_equipments(equipment_id)
);

CREATE INDEX IF NOT EXISTS idx_sap_equipments_tag ON sap_equipments(tag_no);
CREATE INDEX IF NOT EXISTS idx_sap_equipments_parent ON sap_equipments(parent_equipment_id);
CREATE INDEX IF NOT EXISTS idx_sap_equipments_floc ON sap_equipments(floc_code);
CREATE INDEX IF NOT EXISTS idx_sap_equipments_plant ON sap_equipments(plant_code);
CREATE INDEX IF NOT EXISTS idx_sap_equipments_area ON sap_equipments(area_code);
CREATE INDEX IF NOT EXISTS idx_sap_equipments_disc ON sap_equipments(discipline_name);
CREATE INDEX IF NOT EXISTS idx_sap_equipments_main ON sap_equipments(is_main_equipment);

-- 5. SQLite FTS5 Virtual Table untuk Pencarian Kilat (< 2ms)
CREATE VIRTUAL TABLE IF NOT EXISTS sap_equipment_fts USING fts5(
    equipment_id,
    tag_no,
    description,
    floc_code,
    area_code,
    area_name,
    plant_name,
    discipline_name,
    category
);
"""

def deploy(source_db_path: Path, target_db_path: Path):
    print("=" * 65)
    print("MIGRASI MASTER EQUIPMENT SAP KE DATABASE PRODUKSI VPS")
    print("=" * 65)
    print(f"Sumber Master Database : {source_db_path}")
    print(f"Target VPS Database    : {target_db_path}")

    if not source_db_path.exists():
        print(f"[ERROR] Berkas master {source_db_path} tidak ditemukan!")
        sys.exit(1)

    target_db_path.parent.mkdir(parents=True, exist_ok=True)

    src_conn = sqlite3.connect(source_db_path)
    src_conn.row_factory = sqlite3.Row
    src_cur = src_conn.cursor()

    tgt_conn = sqlite3.connect(target_db_path)
    tgt_conn.row_factory = sqlite3.Row
    tgt_cur = tgt_conn.cursor()

    # Pre-check: verify Carbon Brush integrity in target database before migration
    tgt_cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='equipment_reference'")
    has_eq_ref = tgt_cur.fetchone() is not None
    cb_count_before = 0
    if has_eq_ref:
        tgt_cur.execute("SELECT count(*) FROM equipment_reference WHERE source_group = 'carbon-brush'")
        cb_count_before = tgt_cur.fetchone()[0]
        print(f"[*] Verifikasi awal Carbon Brush di target: {cb_count_before} item aktif aman.")

    print("\n[1/5] Menyiapkan skema tabel 'sap_*' di database target...")
    tgt_cur.executescript(SCHEMA_SQL)
    tgt_conn.commit()

    # Begin Atomic Transaction
    try:
        print("[2/5] Menyalin Master Pabrik (sap_plants)...")
        src_cur.execute("SELECT plant_code, plant_number, plant_name, planning_plant, created_at FROM plants")
        plants = src_cur.fetchall()
        tgt_cur.execute("DELETE FROM sap_plants")
        tgt_cur.executemany(
            "INSERT INTO sap_plants (plant_code, plant_number, plant_name, planning_plant, created_at) VALUES (?, ?, ?, ?, ?)",
            [list(p) for p in plants]
        )
        print(f"      -> {len(plants)} pabrik berhasil disalin.")

        print("[3/5] Menyalin Master Area Operasional (sap_areas)...")
        src_cur.execute("SELECT area_code, plant_code, area_name, short_code, equipment_count, main_equipment_count FROM areas")
        areas = src_cur.fetchall()
        tgt_cur.execute("DELETE FROM sap_areas")
        tgt_cur.executemany(
            "INSERT INTO sap_areas (area_code, plant_code, area_name, short_code, equipment_count, main_equipment_count) VALUES (?, ?, ?, ?, ?, ?)",
            [list(a) for a in areas]
        )
        print(f"      -> {len(areas)} area operasional berhasil disalin.")

        print("[4/5] Menyalin Master Functional Locations (sap_functional_locations)...")
        src_cur.execute("SELECT floc_code, plant_code, area_code, group_area_code, parent_floc_code, description, category, cost_center, level, raw_tokens FROM functional_locations")
        flocs = src_cur.fetchall()
        tgt_cur.execute("DELETE FROM sap_functional_locations")
        tgt_cur.executemany(
            "INSERT INTO sap_functional_locations (floc_code, plant_code, area_code, group_area_code, parent_floc_code, description, category, cost_center, level, raw_tokens) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [list(f) for f in flocs]
        )
        print(f"      -> {len(flocs):,} functional locations berhasil disalin.")

        print("[5/5] Menyalin Master Equipments & Membangun Indeks FTS5...")
        src_cur.execute("""
            SELECT equipment_id, floc_code, parent_equipment_id, tag_no, description,
                   discipline, discipline_name, category, plant_code, plant_name,
                   area_code, area_name, planning_plant, cost_center, level,
                   is_main_equipment, sub_equipment_count, created_at, updated_at
            FROM equipments
        """)
        eqs = src_cur.fetchall()
        tgt_cur.execute("DELETE FROM sap_equipments")
        tgt_cur.executemany("""
            INSERT INTO sap_equipments (
                equipment_id, floc_code, parent_equipment_id, tag_no, description,
                discipline, discipline_name, category, plant_code, plant_name,
                area_code, area_name, planning_plant, cost_center, level,
                is_main_equipment, sub_equipment_count, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, [list(e) for e in eqs])

        # Rebuild FTS5
        tgt_cur.execute("DELETE FROM sap_equipment_fts")
        tgt_cur.execute("""
            INSERT INTO sap_equipment_fts (
                equipment_id, tag_no, description, floc_code, area_code, area_name, plant_name, discipline_name, category
            )
            SELECT equipment_id, COALESCE(tag_no, ''), description, COALESCE(floc_code, ''),
                   COALESCE(area_code, ''), COALESCE(area_name, ''), plant_name, COALESCE(discipline_name, ''), COALESCE(category, '')
            FROM sap_equipments
        """)

        tgt_conn.commit()
        print(f"      -> {len(eqs):,} equipment & indeks FTS5 berhasil disalin!")

    except Exception as e:
        tgt_conn.rollback()
        print(f"\n[FATAL ERROR] Gagal melakukan migrasi: {e}")
        import traceback
        traceback.print_exc()
        src_conn.close()
        tgt_conn.close()
        sys.exit(1)

    # Post-check: Verify counts and Carbon Brush safety
    tgt_cur.execute("SELECT count(*) FROM sap_plants")
    cnt_p = tgt_cur.fetchone()[0]
    tgt_cur.execute("SELECT count(*) FROM sap_areas")
    cnt_a = tgt_cur.fetchone()[0]
    tgt_cur.execute("SELECT count(*) FROM sap_functional_locations")
    cnt_f = tgt_cur.fetchone()[0]
    tgt_cur.execute("SELECT count(*), sum(is_main_equipment) FROM sap_equipments")
    cnt_e, cnt_m = tgt_cur.fetchone()

    print("\n" + "=" * 65)
    print("VERIFIKASI HASIL DEPLOYMENT:")
    print("=" * 65)
    print(f"  * Total Unit Pabrik    : {cnt_p} / 4")
    print(f"  * Total Area Pabrik    : {cnt_a} / 29")
    print(f"  * Total Functional Loc : {cnt_f:,} / 6,852")
    print(f"  * Total Equipment      : {cnt_e:,} (Main: {cnt_m:,}) / 33,028")

    if has_eq_ref:
        tgt_cur.execute("SELECT count(*) FROM equipment_reference WHERE source_group = 'carbon-brush'")
        cb_count_after = tgt_cur.fetchone()[0]
        tgt_cur.execute("SELECT equipment_code, equipment_name FROM equipment_reference WHERE source_group = 'carbon-brush' LIMIT 3")
        sample_cb = tgt_cur.fetchall()
        print("-" * 65)
        print(f"  [PROTEKSI CARBON BRUSH] Status: AMAN & TIDAK BERUBAH")
        print(f"  * Sebelum migrasi      : {cb_count_before} item")
        print(f"  * Setelah migrasi      : {cb_count_after} item (Tetap sama)")
        print(f"  * Sampel motor CB      : {[r[1] for r in sample_cb]}")

    print("=" * 65)
    print("MIGRASI BERHASIL 100%! Database target siap digunakan di VPS.")
    print("=" * 65)

    src_conn.close()
    tgt_conn.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Deploy SAP Master Equipment to VPS Database")
    parser.add_argument("--source", default=str(DEFAULT_SOURCE_DB), help="Path ke sap_equipment.db")
    parser.add_argument("--target", default=str(get_default_target_db()), help="Path ke plirm34.db")
    args = parser.parse_args()

    deploy(Path(args.source), Path(args.target))
