import "package:flutter/material.dart";
import "package:intl/intl.dart";
import "../../../core/theme/app_theme.dart";
import "../../../core/utils/offline_service.dart";
import "../../../core/utils/share_service.dart";
import "../../../data/models/models.dart";
import "../../../data/services/api_service.dart";
import "widgets/service_detail_sheet.dart";
import "widgets/service_form_sheet.dart";

class ServiceScreen extends StatefulWidget {
  final ApiService apiService;
  final String selectedArea;
  final UserModel? currentUser;

  const ServiceScreen({
    super.key,
    required this.apiService,
    required this.selectedArea,
    this.currentUser,
  });

  @override
  State<ServiceScreen> createState() => _ServiceScreenState();
}

class _ServiceScreenState extends State<ServiceScreen> {
  String _selectedCategory = "Semua";
  DateTime? _startDate;
  DateTime? _endDate;
  bool _isLoading = false;
  int _offlinePendingCount = 0;
  bool _isDeviceOffline = false;
  List<ServiceItem> _services = [];

  // Search & Sort state
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  String _searchQuery = "";
  bool _sortAscending = false; // false = Terbaru/Desc, true = Terlama/Asc
  String _sortField = "tanggal"; // "tanggal" atau "equipment"

  final List<String> _categories = ["Semua", "Electrical", "Instrumentasi", "DCS"];
  final DateFormat _dateFormatter = DateFormat("dd MMM yyyy");
  final DateFormat _apiDateFormatter = DateFormat("yyyy-MM-dd");

  @override
  void initState() {
    super.initState();
    _loadServices();
    _checkOfflineAndSync();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  @override
  void didUpdateWidget(covariant ServiceScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedArea != widget.selectedArea) {
      _loadServices();
    }
  }

  Future<void> _checkOfflineAndSync({bool manualTrigger = false}) async {
    final count = await OfflineService.getPendingCount();
    if (count == 0) {
      if (mounted) {
        setState(() {
          _offlinePendingCount = 0;
          _isDeviceOffline = false;
        });
        if (manualTrigger) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Semua laporan offline sudah tersinkronkan.'),
              behavior: SnackBarBehavior.floating,
              duration: Duration(seconds: 2),
            ),
          );
        }
      }
      return;
    }

    final syncResult = await OfflineService.syncPendingItems(widget.apiService);
    if (!mounted) return;

    setState(() {
      _offlinePendingCount = syncResult.remainingCount;
      // Banner HANYA muncul jika HP benar-benar tidak ada sinyal (offline)
      _isDeviceOffline = !syncResult.isOnline;
    });

    if (syncResult.syncedCount > 0) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.cloud_done_rounded, color: Colors.white, size: 20),
              const SizedBox(width: 8),
              Expanded(child: Text('Auto-sync: ${syncResult.syncedCount} laporan offline berhasil disinkronkan ke database!')),
            ],
          ),
          backgroundColor: const Color(0xFF25D366),
          behavior: SnackBarBehavior.floating,
        ),
      );
      _loadServices();
    } else if (manualTrigger) {
      if (!syncResult.isOnline) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Tidak ada sinyal internet. Laporan tersimpan aman di HP.'),
            backgroundColor: Color(0xFFFF9800),
            behavior: SnackBarBehavior.floating,
            duration: Duration(seconds: 3),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Sinkronisasi selesai.'),
            behavior: SnackBarBehavior.floating,
            duration: Duration(seconds: 2),
          ),
        );
      }
    }
  }

  Future<void> _loadServices() async {
    setState(() => _isLoading = true);
    try {
      final list = await widget.apiService.fetchServices(
        area: widget.selectedArea,
        kategori: _selectedCategory == "Semua" ? null : _selectedCategory,
        startDate: _startDate != null ? _apiDateFormatter.format(_startDate!) : null,
        endDate: _endDate != null ? _apiDateFormatter.format(_endDate!) : null,
      );

      final offlineCount = await OfflineService.getPendingCount();

      if (mounted) {
        setState(() {
          _services = list;
          _isLoading = false;
          _offlinePendingCount = offlineCount;
          _isDeviceOffline = false; // HP terbukti online karena fetchServices berhasil
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isDeviceOffline = true;
        });
      }
    }
  }

  List<ServiceItem> get _filteredAndSortedServices {
    var list = List<ServiceItem>.from(_services);

    if (_searchQuery.isNotEmpty) {
      final q = _searchQuery.toLowerCase();
      list = list.where((item) {
        final equip = item.equipment.toLowerCase();
        final tag = (item.payload['tag'] ?? item.payload['equipmentTag'] ?? item.subtype).toString().toLowerCase();
        final subEquip = (item.payload['subEquipment'] ?? '').toString().toLowerCase();
        final teknisi = item.teknisi.toLowerCase();
        final tagged = (item.payload['taggedPersonnel'] is List
            ? (item.payload['taggedPersonnel'] as List).join(' ')
            : '').toLowerCase();
        final desc = item.deskripsi.toLowerCase();
        final tindakan = item.tindakan.toLowerCase();
        final detail = item.detail.toLowerCase();
        final status = item.status.toLowerCase();
        final formType = item.formType.toLowerCase();

        return equip.contains(q) ||
            tag.contains(q) ||
            subEquip.contains(q) ||
            teknisi.contains(q) ||
            tagged.contains(q) ||
            desc.contains(q) ||
            tindakan.contains(q) ||
            detail.contains(q) ||
            status.contains(q) ||
            formType.contains(q);
      }).toList();
    }

    list.sort((a, b) {
      int cmp = 0;
      if (_sortField == "equipment") {
        cmp = a.equipment.toLowerCase().compareTo(b.equipment.toLowerCase());
      } else {
        cmp = a.tanggal.compareTo(b.tanggal);
      }
      return _sortAscending ? cmp : -cmp;
    });

    return list;
  }

  Future<void> _pickDate({required bool isStart}) async {
    final initialDate = isStart
        ? (_startDate ?? DateTime.now())
        : (_endDate ?? _startDate ?? DateTime.now());

    final picked = await showDatePicker(
      context: context,
      initialDate: initialDate,
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
      builder: (context, child) {
        return Theme(
          data: ThemeData.dark().copyWith(
            colorScheme: const ColorScheme.dark(
              primary: AppTheme.teal,
              onPrimary: Color(0xFF03181B),
              surface: AppTheme.surface,
              onSurface: AppTheme.text,
            ),
          ),
          child: child!,
        );
      },
    );

    if (picked != null) {
      setState(() {
        if (isStart) {
          _startDate = picked;
          if (_endDate != null && _endDate!.isBefore(picked)) {
            _endDate = picked;
          }
        } else {
          _endDate = picked;
          if (_startDate != null && _startDate!.isAfter(picked)) {
            _startDate = picked;
          }
        }
      });
      _loadServices();
    }
  }

  void _resetDateFilter() {
    setState(() {
      _startDate = null;
      _endDate = null;
    });
    _loadServices();
  }

  void _openInputServiceForm() {
    String? initialCategory;
    String? initialSubtype;

    if (_selectedCategory == "Motor MV Umum" || _selectedCategory == "Motor MSO" || _selectedCategory == "MCC" || _selectedCategory == "Trafo") {
      initialCategory = "Electrical";
      initialSubtype = _selectedCategory;
    } else if (_selectedCategory == "Instrument") {
      initialCategory = "Instrumentasi";
      initialSubtype = "Instrument Lapangan";
    } else if (_selectedCategory == "DCS") {
      initialCategory = "DCS";
    }

    ServiceFormSheet.show(
      context,
      apiService: widget.apiService,
      currentUser: widget.currentUser,
      initialArea: widget.selectedArea,
      initialCategory: initialCategory,
      initialSubtype: initialSubtype,
      existingServices: _services,
      onSuccess: _loadServices,
    );
  }

  @override
  Widget build(BuildContext context) {
    final hasDateFilter = _startDate != null || _endDate != null;

    final filteredList = _filteredAndSortedServices;

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Layanan Service & Perbaikan"),
            Text(
              "Area: ${widget.selectedArea}",
              style: const TextStyle(fontSize: 12, color: AppTheme.teal),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: "Muat Ulang / Refresh Data",
            icon: const Icon(Icons.refresh_rounded, color: AppTheme.teal),
            onPressed: () {
              _loadServices();
              _checkOfflineAndSync(manualTrigger: true);
            },
          ),
          IconButton(
            tooltip: "Input Service Baru",
            icon: const Icon(Icons.add_circle_outline, color: AppTheme.teal),
            onPressed: _openInputServiceForm,
          ),
        ],
      ),
      body: Column(
        children: [
          // Category Selector Tabs
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
            color: AppTheme.background,
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: _categories.map((cat) {
                  final isSelected = _selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      label: Text(cat),
                      selected: isSelected,
                      selectedColor: AppTheme.teal,
                      backgroundColor: AppTheme.surfaceFloat,
                      labelStyle: TextStyle(
                        color: isSelected ? const Color(0xFF03181B) : AppTheme.textMuted,
                        fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                        fontSize: 13,
                      ),
                      side: BorderSide(
                        color: isSelected ? AppTheme.teal : AppTheme.borderMuted,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      onSelected: (selected) {
                        if (selected) {
                          setState(() => _selectedCategory = cat);
                          _loadServices();
                        }
                      },
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Cross Month & Year Date Range Filter
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.surface,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.border),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _dateButton(
                    label: _startDate == null ? "Dari: Semua" : "Dari: ${_dateFormatter.format(_startDate!)}",
                    icon: Icons.calendar_today_rounded,
                    isActive: _startDate != null,
                    onTap: () => _pickDate(isStart: true),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: _dateButton(
                    label: _endDate == null ? "Sampai: Semua" : "Sampai: ${_dateFormatter.format(_endDate!)}",
                    icon: Icons.event_rounded,
                    isActive: _endDate != null,
                    onTap: () => _pickDate(isStart: false),
                  ),
                ),
                if (hasDateFilter) ...[
                  const SizedBox(width: 8),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, color: AppTheme.red, size: 20),
                    tooltip: "Reset Filter Tanggal",
                    style: IconButton.styleFrom(
                      backgroundColor: AppTheme.redSurface,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    onPressed: _resetDateFilter,
                  ),
                ],
              ],
            ),
          ),

          // Search Bar Field
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Container(
              decoration: BoxDecoration(
                color: AppTheme.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: _searchFocusNode.hasFocus ? AppTheme.teal : AppTheme.border,
                ),
              ),
              child: TextField(
                controller: _searchController,
                focusNode: _searchFocusNode,
                style: const TextStyle(color: AppTheme.text, fontSize: 13),
                decoration: InputDecoration(
                  hintText: "Cari hasil inspeksi (alat, tag, teknisi, tindakan)...",
                  hintStyle: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                  prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.teal, size: 20),
                  suffixIcon: _searchController.text.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear_rounded, color: AppTheme.textMuted, size: 18),
                          tooltip: "Hapus Pencarian",
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _searchQuery = "");
                          },
                        )
                      : null,
                  border: InputBorder.none,
                  isDense: true,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                ),
                onChanged: (val) {
                  setState(() {
                    _searchQuery = val.trim();
                  });
                },
              ),
            ),
          ),

          // Offline Pending Banner (HANYA tampil saat kondisi HP offline / tidak ada sinyal dan ada laporan pending)
          if (_offlinePendingCount > 0 && _isDeviceOffline) ...[
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFF2B1D0E),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFFF9800).withValues(alpha: 0.6)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.cloud_off_rounded, color: Color(0xFFFF9800), size: 22),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$_offlinePendingCount Laporan Tersimpan Offline',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        ),
                        const SizedBox(height: 1),
                        const Text(
                          'Tersimpan aman di HP. Otomatis sync saat ada sinyal atau ketuk Sinkronkan',
                          style: TextStyle(color: Colors.white60, fontSize: 11),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () => _checkOfflineAndSync(manualTrigger: true),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF9800),
                      foregroundColor: const Color(0xFF03181B),
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      minimumSize: Size.zero,
                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    ),
                    child: const Text('Sinkronkan', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
                  ),
                ],
              ),
            ),
          ],

          // Summary Counter & Sort Controls
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    _searchQuery.isEmpty
                        ? "${filteredList.length} Riwayat Service"
                        : "${filteredList.length} dari ${_services.length} Ditemukan",
                    style: const TextStyle(
                      color: AppTheme.textMuted,
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Sort Order Toggle (Ascending / Descending)
                    InkWell(
                      onTap: () {
                        setState(() {
                          _sortAscending = !_sortAscending;
                        });
                      },
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceFloat,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppTheme.borderMuted),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _sortAscending ? Icons.arrow_upward_rounded : Icons.arrow_downward_rounded,
                              size: 14,
                              color: AppTheme.teal,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              _sortField == "equipment"
                                  ? (_sortAscending ? "Alat: A-Z" : "Alat: Z-A")
                                  : (_sortAscending ? "Terlama (Asc)" : "Terbaru (Desc)"),
                              style: const TextStyle(
                                color: AppTheme.teal,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    // Sort Menu
                    PopupMenuButton<String>(
                      tooltip: "Opsi Urutan",
                      icon: const Icon(Icons.swap_vert_rounded, size: 20, color: AppTheme.teal),
                      color: AppTheme.surface,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                        side: const BorderSide(color: AppTheme.border),
                      ),
                      onSelected: (val) {
                        setState(() {
                          if (val == "date_desc") {
                            _sortField = "tanggal";
                            _sortAscending = false;
                          } else if (val == "date_asc") {
                            _sortField = "tanggal";
                            _sortAscending = true;
                          } else if (val == "equip_asc") {
                            _sortField = "equipment";
                            _sortAscending = true;
                          } else if (val == "equip_desc") {
                            _sortField = "equipment";
                            _sortAscending = false;
                          }
                        });
                      },
                      itemBuilder: (context) => [
                        PopupMenuItem(
                          value: "date_desc",
                          child: Row(
                            children: [
                              Icon(
                                Icons.calendar_today_rounded,
                                size: 16,
                                color: (_sortField == "tanggal" && !_sortAscending) ? AppTheme.teal : AppTheme.textMuted,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "Tanggal: Terbaru ↓ (Desc)",
                                style: TextStyle(
                                  color: (_sortField == "tanggal" && !_sortAscending) ? AppTheme.teal : AppTheme.text,
                                  fontWeight: (_sortField == "tanggal" && !_sortAscending) ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                        PopupMenuItem(
                          value: "date_asc",
                          child: Row(
                            children: [
                              Icon(
                                Icons.calendar_today_rounded,
                                size: 16,
                                color: (_sortField == "tanggal" && _sortAscending) ? AppTheme.teal : AppTheme.textMuted,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "Tanggal: Terlama ↑ (Asc)",
                                style: TextStyle(
                                  color: (_sortField == "tanggal" && _sortAscending) ? AppTheme.teal : AppTheme.text,
                                  fontWeight: (_sortField == "tanggal" && _sortAscending) ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const PopupMenuDivider(),
                        PopupMenuItem(
                          value: "equip_asc",
                          child: Row(
                            children: [
                              Icon(
                                Icons.sort_by_alpha_rounded,
                                size: 16,
                                color: (_sortField == "equipment" && _sortAscending) ? AppTheme.teal : AppTheme.textMuted,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "Alat: A ke Z (Asc)",
                                style: TextStyle(
                                  color: (_sortField == "equipment" && _sortAscending) ? AppTheme.teal : AppTheme.text,
                                  fontWeight: (_sortField == "equipment" && _sortAscending) ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                        PopupMenuItem(
                          value: "equip_desc",
                          child: Row(
                            children: [
                              Icon(
                                Icons.sort_by_alpha_rounded,
                                size: 16,
                                color: (_sortField == "equipment" && !_sortAscending) ? AppTheme.teal : AppTheme.textMuted,
                              ),
                              const SizedBox(width: 8),
                              Text(
                                "Alat: Z ke A (Desc)",
                                style: TextStyle(
                                  color: (_sortField == "equipment" && !_sortAscending) ? AppTheme.teal : AppTheme.text,
                                  fontWeight: (_sortField == "equipment" && !_sortAscending) ? FontWeight.bold : FontWeight.normal,
                                  fontSize: 12,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          // Service Items List with Pull-to-Refresh
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.teal))
                : RefreshIndicator(
                    color: AppTheme.teal,
                    backgroundColor: AppTheme.surface,
                    onRefresh: () async {
                      await Future.wait([
                        _loadServices(),
                        _checkOfflineAndSync(),
                      ]);
                    },
                    child: filteredList.isEmpty
                        ? ListView(
                            physics: const AlwaysScrollableScrollPhysics(),
                            children: [
                              SizedBox(height: MediaQuery.of(context).size.height * 0.15),
                              Center(
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(
                                      _searchQuery.isNotEmpty ? Icons.search_off_rounded : Icons.inbox_rounded,
                                      size: 48,
                                      color: AppTheme.textMuted.withValues(alpha: 0.5),
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      _searchQuery.isNotEmpty
                                          ? "Tidak ditemukan hasil untuk '$_searchQuery'"
                                          : "Tidak ada data service untuk filter ini",
                                      style: const TextStyle(color: AppTheme.textMuted, fontSize: 13),
                                      textAlign: TextAlign.center,
                                    ),
                                    if (_searchQuery.isNotEmpty) ...[
                                      const SizedBox(height: 12),
                                      OutlinedButton.icon(
                                        icon: const Icon(Icons.clear_rounded, size: 16),
                                        label: const Text("Reset Pencarian"),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor: AppTheme.teal,
                                          side: const BorderSide(color: AppTheme.teal),
                                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                        ),
                                        onPressed: () {
                                          _searchController.clear();
                                          setState(() => _searchQuery = "");
                                        },
                                      ),
                                    ],
                                  ],
                                ),
                              ),
                            ],
                          )
                        : ListView.builder(
                            physics: const AlwaysScrollableScrollPhysics(),
                            padding: const EdgeInsets.fromLTRB(16, 8, 16, 90),
                            itemCount: filteredList.length,
                            itemBuilder: (context, index) {
                              final item = filteredList[index];
                              return _serviceCard(item);
                            },
                          ),
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _openInputServiceForm,
        backgroundColor: AppTheme.teal,
        foregroundColor: const Color(0xFF03181B),
        icon: const Icon(Icons.add_task_rounded),
        label: const Text(
          "Input Service",
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
      ),
    );
  }

  Widget _dateButton({
    required String label,
    required IconData icon,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return InkWell(
      borderRadius: BorderRadius.circular(10),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
        decoration: BoxDecoration(
          color: isActive ? AppTheme.teal.withValues(alpha: 0.15) : AppTheme.surfaceFloat,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isActive ? AppTheme.teal : AppTheme.borderMuted,
          ),
        ),
        child: Row(
          children: [
            Icon(icon, size: 14, color: isActive ? AppTheme.teal : AppTheme.textMuted),
            const SizedBox(width: 6),
            Expanded(
              child: Text(
                label,
                style: TextStyle(
                  color: isActive ? AppTheme.teal : AppTheme.text,
                  fontSize: 11,
                  fontWeight: isActive ? FontWeight.w800 : FontWeight.w500,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _openEditService(ServiceItem item) {
    final isMso = (item.formType == "service-motor-mv" || item.formType == "service-motor-mso") &&
        item.payload['source']?.toString().toUpperCase() == "MSO";
    if (isMso) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Data sinkron MSO tidak diedit manual. Perbarui lewat file import berikutnya."),
          backgroundColor: AppTheme.amber,
        ),
      );
      return;
    }
    ServiceFormSheet.show(
      context,
      apiService: widget.apiService,
      currentUser: widget.currentUser,
      itemToEdit: item,
      existingServices: _services,
      onSuccess: _loadServices,
    );
  }

  void _confirmDeleteService(ServiceItem item) {
    final isMso = (item.formType == "service-motor-mv" || item.formType == "service-motor-mso") &&
        item.payload['source']?.toString().toUpperCase() == "MSO";
    if (isMso) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Motor MSO: Data sinkron MSO tidak dihapus manual dari daftar service."),
          backgroundColor: AppTheme.amber,
        ),
      );
      return;
    }

    final canDelete = widget.currentUser == null || widget.currentUser!.role.toLowerCase() != 'team';
    if (!canDelete) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Role Tim Teknisi tidak diizinkan menghapus data service."),
          backgroundColor: Color(0xFFFF5252),
        ),
      );
      return;
    }

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppTheme.border),
        ),
        title: const Row(
          children: [
            Icon(Icons.delete_forever_rounded, color: Color(0xFFFF5252), size: 24),
            SizedBox(width: 8),
            Text(
              "Hapus Data Service?",
              style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
            ),
          ],
        ),
        content: Text(
          "Apakah Anda yakin ingin menghapus data service untuk \"${item.equipment}\"? Tindakan ini akan menghapus data dari server secara permanen.",
          style: const TextStyle(color: Colors.white70, fontSize: 13, height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text("Batal", style: TextStyle(color: Colors.white60)),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              await _executeDeleteService(item);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFFF5252),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            child: const Text("Hapus", style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  Future<void> _executeDeleteService(ServiceItem item) async {
    setState(() {
      _services.removeWhere((e) => e.id == item.id);
    });
    await OfflineService.removeOfflineServiceItem(item.id);

    bool success = false;
    try {
      success = await widget.apiService.deleteServiceItem(item.id);
    } catch (_) {
      success = false;
    }

    if (mounted) {
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle_rounded, color: Colors.white, size: 20),
                const SizedBox(width: 8),
                Expanded(child: Text("Data service ${item.equipment} berhasil dihapus.")),
              ],
            ),
            backgroundColor: const Color(0xFF25D366),
            behavior: SnackBarBehavior.floating,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.info_outline, color: Colors.white, size: 20),
                const SizedBox(width: 8),
                Expanded(child: Text("Data service dihapus (${item.equipment}).")),
              ],
            ),
            backgroundColor: AppTheme.amber,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  Widget _serviceCard(ServiceItem item) {
    Color categoryColor = AppTheme.teal;
    if (item.kategori.toLowerCase().contains("instrumentasi")) {
      categoryColor = AppTheme.blue;
    } else if (item.kategori.toLowerCase().contains("dcs")) {
      categoryColor = AppTheme.amber;
    }

    final isMso = (item.formType == "service-motor-mv" || item.formType == "service-motor-mso") &&
        item.payload['source']?.toString().toUpperCase() == "MSO";
    final canDelete = widget.currentUser == null || widget.currentUser!.role.toLowerCase() != 'team';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Material(
            color: Colors.transparent,
            child: InkWell(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
              onTap: () {
                ServiceDetailSheet.show(
                  context,
                  item: item,
                  currentUser: widget.currentUser,
                  onEdit: () => _openEditService(item),
                  onDelete: () => _confirmDeleteService(item),
                );
              },
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          item.tanggal,
                          style: const TextStyle(
                            color: AppTheme.textMuted,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: categoryColor.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(color: categoryColor.withValues(alpha: 0.4)),
                              ),
                              child: Text(
                                item.kategori.toUpperCase(),
                                style: TextStyle(
                                  color: categoryColor,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 0.5,
                                ),
                              ),
                            ),
                            const SizedBox(width: 6),
                            const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: AppTheme.textMuted),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item.equipment,
                      style: const TextStyle(
                        color: AppTheme.text,
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      item.deskripsi,
                      style: const TextStyle(
                        color: AppTheme.textMuted,
                        fontSize: 13,
                        height: 1.4,
                      ),
                    ),
                    if (item.tindakan.isNotEmpty) ...[
                      const SizedBox(height: 6),
                      Text(
                        "Tindakan: ${item.tindakan}",
                        style: const TextStyle(
                          color: AppTheme.teal,
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                    const SizedBox(height: 12),
                    const Divider(color: AppTheme.borderMuted, height: 1),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.person_outline_rounded, size: 14, color: AppTheme.textSubtle),
                            const SizedBox(width: 4),
                            Text(
                              item.teknisi.isNotEmpty ? item.teknisi : "Tim Maintenance",
                              style: const TextStyle(color: AppTheme.textSubtle, fontSize: 11),
                            ),
                          ],
                        ),
                        if (item.area.isNotEmpty)
                          Text(
                            item.area,
                            style: const TextStyle(color: AppTheme.textSubtle, fontSize: 11),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: [
                    if (!isMso)
                      _actionChip(
                        Icons.edit_outlined,
                        "Edit",
                        () => _openEditService(item),
                        color: AppTheme.teal,
                      ),
                    if (!isMso && canDelete)
                      _actionChip(
                        Icons.delete_outline_rounded,
                        "Hapus",
                        () => _confirmDeleteService(item),
                        color: const Color(0xFFFF5252),
                      ),
                    _actionChip(Icons.share_outlined, "Share", () {
                      final text = ShareService.buildServiceShareText(item);
                      ShareService.shareText('Laporan Service Inspeksi', text);
                    }),
                    _actionChip(Icons.send_rounded, "Kirim WA", () {
                      final text = ShareService.buildServiceShareText(item);
                      ShareService.sendWhatsApp(text);
                    }),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _actionChip(IconData icon, String label, VoidCallback onTap, {Color? color}) {
    final chipColor = color ?? AppTheme.teal;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 6),
          decoration: BoxDecoration(
            color: chipColor.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: chipColor.withValues(alpha: 0.35)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 13, color: chipColor),
              const SizedBox(width: 4),
              Text(
                label,
                style: TextStyle(color: chipColor, fontSize: 11, fontWeight: FontWeight.w700),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
