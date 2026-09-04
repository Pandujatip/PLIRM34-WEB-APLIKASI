import "package:flutter/material.dart";
import "package:intl/intl.dart";
import "../../../core/theme/app_theme.dart";
import "../../../data/models/models.dart";
import "../../../data/services/api_service.dart";

class ServiceScreen extends StatefulWidget {
  final ApiService apiService;
  final String selectedArea;

  const ServiceScreen({
    super.key,
    required this.apiService,
    required this.selectedArea,
  });

  @override
  State<ServiceScreen> createState() => _ServiceScreenState();
}

class _ServiceScreenState extends State<ServiceScreen> {
  String _selectedCategory = "Semua";
  DateTime? _startDate;
  DateTime? _endDate;
  bool _isLoading = false;
  List<ServiceItem> _services = [];

  final List<String> _categories = ["Semua", "Electrical", "Instrumentasi", "DCS"];
  final DateFormat _dateFormatter = DateFormat("dd MMM yyyy");
  final DateFormat _apiDateFormatter = DateFormat("yyyy-MM-dd");

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  @override
  void didUpdateWidget(covariant ServiceScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.selectedArea != widget.selectedArea) {
      _loadServices();
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

      // Sort newest on top
      list.sort((a, b) => b.tanggal.compareTo(a.tanggal));

      if (mounted) {
        setState(() {
          _services = list;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
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

  @override
  Widget build(BuildContext context) {
    final hasDateFilter = _startDate != null || _endDate != null;

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
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
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

          // Summary Counter
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 6),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "${_services.length} Riwayat Service",
                  style: const TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const Text(
                  "Urutan: Terbaru di atas",
                  style: TextStyle(
                    color: AppTheme.teal,
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),

          // Service Items List
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.teal))
                : _services.isEmpty
                    ? const Center(
                        child: Text(
                          "Tidak ada data service untuk filter ini",
                          style: TextStyle(color: AppTheme.textMuted),
                        ),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 8, 16, 90),
                        itemCount: _services.length,
                        itemBuilder: (context, index) {
                          final item = _services[index];
                          return _serviceCard(item);
                        },
                      ),
          ),
        ],
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

  Widget _serviceCard(ServiceItem item) {
    Color categoryColor = AppTheme.teal;
    if (item.kategori.toLowerCase().contains("instrumentasi")) {
      categoryColor = AppTheme.blue;
    } else if (item.kategori.toLowerCase().contains("dcs")) {
      categoryColor = AppTheme.amber;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.border),
      ),
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
              Row(
                children: [
                  _actionChip(Icons.share_outlined, "Share", () {}),
                  const SizedBox(width: 8),
                  _actionChip(Icons.send_rounded, "Kirim WA", () {}),
                ],
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _actionChip(IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      borderRadius: BorderRadius.circular(8),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        decoration: BoxDecoration(
          color: AppTheme.surfaceFloat,
          borderRadius: BorderRadius.circular(8),
          border: Border.all(color: AppTheme.borderMuted),
        ),
        child: Row(
          children: [
            Icon(icon, size: 12, color: AppTheme.teal),
            const SizedBox(width: 4),
            Text(
              label,
              style: const TextStyle(color: AppTheme.teal, fontSize: 11, fontWeight: FontWeight.w700),
            ),
          ],
        ),
      ),
    );
  }
}
