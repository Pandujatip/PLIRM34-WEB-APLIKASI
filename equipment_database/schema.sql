-- Schema for Dedicated SAP Equipment Database with Area Grouping
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS plants (
    plant_code TEXT PRIMARY KEY,
    plant_number TEXT,
    plant_name TEXT NOT NULL,
    planning_plant TEXT,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS areas (
    area_code TEXT PRIMARY KEY,
    plant_code TEXT NOT NULL REFERENCES plants(plant_code),
    area_name TEXT NOT NULL,
    short_code TEXT NOT NULL,
    equipment_count INTEGER DEFAULT 0,
    main_equipment_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS functional_locations (
    floc_code TEXT PRIMARY KEY,
    plant_code TEXT NOT NULL REFERENCES plants(plant_code),
    area_code TEXT REFERENCES areas(area_code),
    group_area_code TEXT,
    parent_floc_code TEXT REFERENCES functional_locations(floc_code),
    description TEXT NOT NULL,
    category TEXT,
    cost_center TEXT,
    level INTEGER NOT NULL,
    raw_tokens TEXT
);

CREATE TABLE IF NOT EXISTS equipments (
    equipment_id TEXT PRIMARY KEY,
    floc_code TEXT REFERENCES functional_locations(floc_code),
    parent_equipment_id TEXT REFERENCES equipments(equipment_id),
    tag_no TEXT,
    description TEXT NOT NULL,
    discipline TEXT,
    discipline_name TEXT,
    category TEXT,
    plant_code TEXT NOT NULL REFERENCES plants(plant_code),
    plant_name TEXT NOT NULL,
    area_code TEXT REFERENCES areas(area_code),
    area_name TEXT NOT NULL,
    planning_plant TEXT,
    cost_center TEXT,
    level INTEGER NOT NULL DEFAULT 1,
    is_main_equipment INTEGER NOT NULL DEFAULT 0,
    sub_equipment_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_equipments_plant ON equipments(plant_code);
CREATE INDEX IF NOT EXISTS idx_equipments_area ON equipments(area_code);
CREATE INDEX IF NOT EXISTS idx_equipments_parent ON equipments(parent_equipment_id);
CREATE INDEX IF NOT EXISTS idx_equipments_floc ON equipments(floc_code);
CREATE INDEX IF NOT EXISTS idx_equipments_tag ON equipments(tag_no);
CREATE INDEX IF NOT EXISTS idx_equipments_discipline ON equipments(discipline);
CREATE INDEX IF NOT EXISTS idx_equipments_main ON equipments(is_main_equipment);

CREATE INDEX IF NOT EXISTS idx_floc_plant ON functional_locations(plant_code);
CREATE INDEX IF NOT EXISTS idx_floc_area ON functional_locations(area_code);
CREATE INDEX IF NOT EXISTS idx_floc_parent ON functional_locations(parent_floc_code);

CREATE VIRTUAL TABLE IF NOT EXISTS equipment_fts USING fts5(
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
