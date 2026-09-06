import "package:flutter/material.dart";
import "../../../core/constants/app_constants.dart";
import "../../../core/theme/app_theme.dart";
import "../../../data/models/models.dart";
import "../../../data/services/api_service.dart";
import "../../core/widgets/stat_card.dart";
import "widgets/carbon_brush_detail_sheet.dart";
import "widgets/cement_plant_flow_widget.dart";
import "widgets/equipment_health_sheet.dart";
import "widgets/negatif_detail_sheet.dart";
import "widgets/user_management_sheet.dart";
import "../service/widgets/service_detail_sheet.dart";

class OverviewScreen extends StatefulWidget {
  final ApiService apiService;
  final VoidCallback onLogout;
  final String selectedArea;
  final Function(String) onAreaChanged;
  final UserModel? currentUser;

  const OverviewScreen({
    super.key,
    required this.apiService,
    required this.onLogout,
    required this.selectedArea,
    required this.onAreaChanged,
    this.currentUser,
  });

  @override
  State<OverviewScreen> createState() => _OverviewScreenState();
}

class _OverviewScreenState extends State<OverviewScreen> {
  bool _isLoading = false;
  List<CarbonBrushItem> _carbonBrushList = [];
  List<NegatifItem> _negatifList = [];
  List<ServiceItem> _serviceList = [];
  List<PlantEquipmentNode> _plantNodes = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void didUpdateWidget(covariant OverviewScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedArea != widget.selectedArea) {
      _loadData();
    }
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final cb = await widget.apiService.fetchCarbonBrush();
      final neg = await widget.apiService.fetchNegatifList(status: "Open", area: widget.selectedArea);
      final srv = await widget.apiService.fetchServices(area: widget.selectedArea);
      final nodes = PlantEquipmentNode.generatePlantNodes(
        selectedArea: widget.selectedArea,
        carbonBrushes: cb,
        negatifItems: neg,
        serviceItems: srv,
      );
      if (mounted) {
        setState(() {
          _carbonBrushList = cb;
          _negatifList = neg;
          _serviceList = srv;
          _plantNodes = nodes;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showAreaPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        side: BorderSide(color: AppTheme.border),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      "Pilih Area Pabrik",
                      style: TextStyle(
                        color: AppTheme.text,
                        fontSize: 18,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, color: AppTheme.textMuted),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Expanded(
                  child: ListView.builder(
                    itemCount: AppConstants.areas.length,
                    itemBuilder: (context, index) {
                      final area = AppConstants.areas[index];
                      final isSelected = area == widget.selectedArea;
                      return ListTile(
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        tileColor: isSelected ? AppTheme.teal.withValues(alpha: 0.12) : null,
                        leading: Icon(
                          isSelected ? Icons.radio_button_checked_rounded : Icons.radio_button_unchecked_rounded,
                          color: isSelected ? AppTheme.teal : AppTheme.textMuted,
                        ),
                        title: Text(
                          area,
                          style: TextStyle(
                            color: isSelected ? AppTheme.teal : AppTheme.text,
                            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                          ),
                        ),
                        onTap: () {
                          widget.onAreaChanged(area);
                          Navigator.pop(ctx);
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 16,
        title: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                color: AppTheme.surfaceFloat,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppTheme.teal.withValues(alpha: 0.3)),
              ),
              child: const Icon(Icons.engineering_rounded, color: AppTheme.teal, size: 20),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  "Overview",
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.text,
                  ),
                ),
                GestureDetector(
                  onTap: _showAreaPicker,
                  child: Row(
                    children: [
                      Text(
                        widget.selectedArea,
                        style: const TextStyle(
                          fontSize: 12,
                          color: AppTheme.teal,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const Icon(Icons.arrow_drop_down_rounded, color: AppTheme.teal, size: 18),
                    ],
                  ),
                ),
              ],
            ),
            if (widget.currentUser != null) ...[
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                decoration: BoxDecoration(
                  color: AppConstants.accentCyan.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: AppConstants.accentCyan),
                ),
                child: Text(
                  widget.currentUser!.unitBadgeLabel,
                  style: const TextStyle(
                    color: AppConstants.accentCyan,
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              const SizedBox(width: 4),
              GestureDetector(
                onTap: widget.currentUser!.isAdmin
                    ? () => UserManagementSheet.show(context, apiService: widget.apiService)
                    : null,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                  decoration: BoxDecoration(
                    color: widget.currentUser!.isAdmin
                        ? AppTheme.amber.withOpacity(0.15)
                        : (widget.currentUser!.isOrganik
                            ? AppTheme.teal.withOpacity(0.15)
                            : AppTheme.green.withOpacity(0.15)),
                    borderRadius: BorderRadius.circular(6),
                    border: Border.all(
                      color: widget.currentUser!.isAdmin
                          ? AppTheme.amber
                          : (widget.currentUser!.isOrganik ? AppTheme.teal : AppTheme.green),
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        widget.currentUser!.roleBadgeLabel,
                        style: TextStyle(
                          color: widget.currentUser!.isAdmin
                              ? AppTheme.amber
                              : (widget.currentUser!.isOrganik ? AppTheme.teal : AppTheme.green),
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      if (widget.currentUser!.isAdmin) ...[
                        const SizedBox(width: 3),
                        const Icon(Icons.settings_outlined, size: 10, color: AppTheme.amber),
                      ],
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
        actions: [
          if (widget.currentUser?.isAdmin == true)
            IconButton(
              icon: const Icon(Icons.manage_accounts_rounded, color: AppTheme.amber),
              tooltip: "Kelola User & Otorisasi",
              onPressed: () => UserManagementSheet.show(context, apiService: widget.apiService),
            ),
          IconButton(
            icon: const Icon(Icons.filter_list_rounded, color: AppTheme.teal),
            tooltip: "Filter Area",
            onPressed: _showAreaPicker,
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.teal),
            tooltip: "Sinkron Ulang",
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: AppTheme.red),
            tooltip: "Keluar",
            onPressed: widget.onLogout,
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: AppTheme.teal))
          : RefreshIndicator(
              color: AppTheme.teal,
              backgroundColor: AppTheme.surface,
              onRefresh: _loadData,
              child: ListView(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 90),
                children: [
                  // 2D Real Live Cement Plant Flow Health Monitoring (8 Main Equipment)
                  if (_plantNodes.isNotEmpty)
                    CementPlantFlowWidget(
                      nodes: _plantNodes,
                      selectedArea: widget.selectedArea,
                      onRefresh: _loadData,
                      onEquipmentTapped: (node) {
                        EquipmentHealthSheet.show(
                          context,
                          node: node,
                          apiService: widget.apiService,
                          currentUser: widget.currentUser,
                          onRefresh: _loadData,
                        );
                      },
                    ),

                  // Carbon Brush Early Warning Section
                  _sectionHeader("Carbon Brush Early Warning"),
                  if (_carbonBrushList.isNotEmpty)
                    StatCard(
                      title: "Carbon Brush Early Warning",
                      badge: _carbonBrushList.first.statusLimit,
                      badgeColor: AppTheme.amber,
                      mainText: _carbonBrushList.first.equipment,
                      subText: "Estimasi penggantian: ${_carbonBrushList.first.estimasi}",
                      footer: "Pengukuran terakhir: ${_carbonBrushList.first.tanggalUkur}\n${_carbonBrushList.first.keterangan}",
                      onTap: () {
                        CarbonBrushDetailSheet.show(context, _carbonBrushList.first);
                      },
                    ),

                  const SizedBox(height: 8),

                  // Jadwal Inspeksi Hari Ini
                  _sectionHeader("Jadwal Inspeksi Hari Ini"),
                  const StatCard(
                    title: "Jadwal",
                    mainText: "Tidak ada jadwal hari ini",
                    footer: "Sinkron dari Google Calendar.",
                  ),

                  const SizedBox(height: 8),

                  // Negatif List Open
                  _sectionHeader("Negatif List Open (${widget.selectedArea})"),
                  if (_negatifList.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      child: Text("Tidak ada temuan negatif open.", style: TextStyle(color: AppTheme.textMuted)),
                    )
                  else
                    ..._negatifList.map((item) => StatCard(
                          title: item.area.isNotEmpty ? "${item.equipment} - ${item.area}" : item.equipment,
                          badge: item.status,
                          badgeColor: item.isOpen ? AppTheme.amber : AppTheme.green,
                          mainText: item.temuan,
                          footer: item.statusTambahan.isNotEmpty ? item.statusTambahan : null,
                          onTap: () {
                            NegatifDetailSheet.show(
                              context,
                              item: item,
                              currentUser: widget.currentUser,
                              onItemClosed: _loadData,
                            );
                          },
                        )),

                  const SizedBox(height: 8),

                  // Hasil Service Terakhir
                  _sectionHeader("Hasil Service Terakhir (${widget.selectedArea})"),
                  if (_serviceList.isEmpty)
                    const Padding(
                      padding: EdgeInsets.symmetric(vertical: 12),
                      child: Text("Belum ada riwayat service.", style: TextStyle(color: AppTheme.textMuted)),
                    )
                  else
                    ..._serviceList.take(3).map((item) => StatCard(
                          title: "${item.tanggal} | ${item.kategori}",
                          badge: item.status,
                          badgeColor: AppTheme.teal,
                          mainText: item.equipment,
                          subText: item.deskripsi,
                          footer: "Tindakan: ${item.tindakan}\nTeknisi: ${item.teknisi}",
                          onTap: () {
                            ServiceDetailSheet.show(
                              context,
                              item: item,
                              currentUser: widget.currentUser,
                            );
                          },
                        )),
                ],
              ),
            ),
    );
  }

  Widget _sectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10, top: 4),
      child: Text(
        title,
        style: const TextStyle(
          color: AppTheme.text,
          fontSize: 15,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.2,
        ),
      ),
    );
  }
}
