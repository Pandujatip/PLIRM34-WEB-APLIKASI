async function refreshAdminMasters() {
  if (!backendState.available || !backendState.sessionActive || activeRole !== "admin") {
    return;
  }
  try {
    const [areas, equipmentReferences, sparepartReferences, templates, appSettings] = await Promise.all([
      fetchAdminMaster("areas"),
      fetchAdminMaster("equipment-references"),
      fetchAdminMaster("sparepart-references"),
      fetchAdminMaster("inspection-templates"),
      fetchAdminMaster("app-settings"),
    ]);
    backendState.masters.areas = areas;
    backendState.masters.equipmentReferences = equipmentReferences;
    backendState.masters.sparepartReferences = sparepartReferences;
    backendState.masters.inspectionTemplates = templates;
    backendState.masters.appSettings = appSettings;
    renderAdminAreasTable(areas);
    renderAdminElectricalRoomTable();
    renderAdminEquipmentSourceFilter(equipmentReferences);
    applyAdminEquipmentFilter();
    applyAdminSparepartMasterFilter();
    renderAdminTemplatesTable(templates);
    hydrateCarbonBrushThresholdForm();
    hydrateElectricalRoomThresholdForm();
    renderMsoMotorSyncSettings();
    renderElectricalRoomReferenceOptions();
    renderMccReferenceOptions();
  } catch (error) {
    console.error("Gagal memuat master admin:", error);
  }
}
