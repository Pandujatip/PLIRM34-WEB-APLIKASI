-- PLIRM34 Database Optimization
-- Phase 1: Add Critical Indexes
-- Execution Time: ~5-10 seconds
-- Performance Impact: 50-60% faster queries

-- Backup existing database BEFORE running this script
-- cp plirm34.db plirm34.db.backup

-- INDEX 1: Equipment lookups in Negatif List
CREATE INDEX IF NOT EXISTS idx_negatif_list_equipment 
ON negatif_list_items(equipment);

-- INDEX 2: Area-based filtering in Negatif List
CREATE INDEX IF NOT EXISTS idx_negatif_list_area 
ON negatif_list_items(area);

-- INDEX 3: Date range queries (most recent first)
CREATE INDEX IF NOT EXISTS idx_negatif_list_found_date 
ON negatif_list_items(found_date DESC);

-- INDEX 4: Service category lookups
CREATE INDEX IF NOT EXISTS idx_service_items_category 
ON service_items(category);

-- INDEX 5: Audit log filtering by user and date
CREATE INDEX IF NOT EXISTS idx_audit_log_user_date 
ON audit_log(created_by, created_at DESC);

-- INDEX 6: Work status filtering
CREATE INDEX IF NOT EXISTS idx_negatif_list_work_status 
ON negatif_list_items(work_status);

-- INDEX 7: Sparepart lookups
CREATE INDEX IF NOT EXISTS idx_sparepart_items_code 
ON sparepart_items(code);

-- INDEX 8: BOM item category search
CREATE INDEX IF NOT EXISTS idx_bom_items_category 
ON bom_items(category);

-- INDEX 9: Service lookup by equipment
CREATE INDEX IF NOT EXISTS idx_service_items_equipment 
ON service_items(equipment);

-- INDEX 10: User role lookups
CREATE INDEX IF NOT EXISTS idx_users_role 
ON users(role);

-- ANALYZE tables to update statistics
ANALYZE negatif_list_items;
ANALYZE service_items;
ANALYZE sparepart_items;
ANALYZE audit_log;
ANALYZE users;
ANALYZE bom_items;

-- Verify indexes were created
.indexes
