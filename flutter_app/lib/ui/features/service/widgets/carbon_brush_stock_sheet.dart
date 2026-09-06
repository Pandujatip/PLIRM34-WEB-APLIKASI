import 'package:flutter/material.dart';
import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../data/models/models.dart';
import '../../../../data/services/api_service.dart';

class CarbonBrushStockSheet extends StatefulWidget {
  final ApiService apiService;
  final String? preselectedStockKey;
  final VoidCallback? onStockChanged;

  const CarbonBrushStockSheet({
    super.key,
    required this.apiService,
    this.preselectedStockKey,
    this.onStockChanged,
  });

  static Future<void> show(
    BuildContext context, {
    required ApiService apiService,
    String? preselectedStockKey,
    VoidCallback? onStockChanged,
  }) {
    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => CarbonBrushStockSheet(
        apiService: apiService,
        preselectedStockKey: preselectedStockKey,
        onStockChanged: onStockChanged,
      ),
    );
  }

  @override
  State<CarbonBrushStockSheet> createState() => _CarbonBrushStockSheetState();
}

class _CarbonBrushStockSheetState extends State<CarbonBrushStockSheet> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<CarbonBrushStockItem> _items = [];
  List<CarbonBrushStockLogItem> _logs = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final items = await widget.apiService.fetchCarbonBrushStockItems();
      final logs = await widget.apiService.fetchCarbonBrushStockLogs();
      if (mounted) {
        setState(() {
          _items = items;
          _logs = logs;
          _isLoading = false;
        });
      }
    } catch (_) {
      if (mounted) {
        setState(() {
          _items = CarbonBrushStockItem.defaultItems();
          _isLoading = false;
        });
      }
    }
  }

  void _showMovementDialog(CarbonBrushStockItem item, String mode) {
    final isAdjust = mode == 'adjust';
    final qtyCtrl = TextEditingController(
      text: isAdjust ? item.currentStock.toString() : '',
    );
    final noteCtrl = TextEditingController(
      text: isAdjust
          ? 'Koreksi stok fisik ${item.brushName}'
          : 'Penerimaan stok dari gudang ${item.brushName}',
    );

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.surface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppTheme.border),
        ),
        title: Row(
          children: [
            Icon(
              isAdjust ? Icons.tune_rounded : Icons.add_circle_outline_rounded,
              color: isAdjust ? AppConstants.warningYellow : AppTheme.teal,
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Text(
                isAdjust ? 'Koreksi Saldo Stok' : 'Tambah Stok Masuk',
                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: AppTheme.surfaceFloat,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: AppTheme.borderMuted),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.brushName,
                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'SAP: ${item.sapNo} | Saldo saat ini: ${item.currentStock} pcs',
                      style: const TextStyle(color: AppTheme.teal, fontSize: 12),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 14),
              Text(
                isAdjust ? 'SALDO FISIK TERKINI (PCS)' : 'JUMLAH TAMBAH STOK (PCS)',
                style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: qtyCtrl,
                keyboardType: TextInputType.number,
                autofocus: true,
                style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  hintText: isAdjust ? 'Jumlah saldo fisik baru...' : 'Contoh: 12',
                  hintStyle: const TextStyle(color: Colors.white30),
                  suffixText: 'pcs',
                  suffixStyle: const TextStyle(color: AppTheme.teal, fontWeight: FontWeight.bold),
                  filled: true,
                  fillColor: AppTheme.surfaceFloat,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.border)),
                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.teal)),
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'CATATAN / KETERANGAN',
                style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8),
              ),
              const SizedBox(height: 6),
              TextField(
                controller: noteCtrl,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: InputDecoration(
                  hintText: 'Keterangan mutasi...',
                  hintStyle: const TextStyle(color: Colors.white30),
                  filled: true,
                  fillColor: AppTheme.surfaceFloat,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.border)),
                  focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: AppTheme.teal)),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Batal', style: TextStyle(color: Colors.white54)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: isAdjust ? AppConstants.warningYellow : AppTheme.teal,
              foregroundColor: const Color(0xFF03181B),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
            ),
            onPressed: () async {
              final val = int.tryParse(qtyCtrl.text.trim());
              if (val == null || val < 0 || (!isAdjust && val == 0)) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(isAdjust ? 'Saldo fisik tidak valid' : 'Jumlah tambah stok harus lebih dari 0'),
                    backgroundColor: AppConstants.alertRed,
                  ),
                );
                return;
              }
              Navigator.pop(ctx);
              final success = await widget.apiService.saveCarbonBrushStockMovement(
                stockKey: item.stockKey,
                movementType: mode,
                quantity: val,
                note: noteCtrl.text.trim(),
              );

              if (success) {
                widget.onStockChanged?.call();
                _loadData();
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(isAdjust ? 'Saldo stok berhasil disesuaikan!' : 'Stok berhasil ditambahkan!'),
                      backgroundColor: const Color(0xFF25D366),
                    ),
                  );
                }
              } else {
                // Optimistic local update if offline
                final delta = isAdjust ? (val - item.currentStock) : val;
                final newStock = item.currentStock + delta;
                setState(() {
                  _items = _items.map((it) {
                    if (it.stockKey == item.stockKey) {
                      return it.copyWith(currentStock: newStock);
                    }
                    return it;
                  }).toList();
                  _logs.insert(
                    0,
                    CarbonBrushStockLogItem(
                      id: 'local-${DateTime.now().millisecondsSinceEpoch}',
                      stockKey: item.stockKey,
                      sapNo: item.sapNo,
                      brushName: item.brushName,
                      movementType: mode,
                      quantityDelta: delta,
                      stockBefore: item.currentStock,
                      stockAfter: newStock,
                      note: '${noteCtrl.text.trim()} (Tersimpan Lokal)',
                      createdAt: DateTime.now().toIso8601String(),
                    ),
                  );
                });
                widget.onStockChanged?.call();
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Tersimpan di cache lokal perangkat (Offline)'),
                      backgroundColor: AppConstants.warningYellow,
                    ),
                  );
                }
              }
            },
            child: Text(
              isAdjust ? 'Simpan Koreksi' : 'Tambah Stok',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final totalStock = _items.fold<int>(0, (sum, it) => sum + it.currentStock);

    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
      decoration: const BoxDecoration(
        color: AppTheme.surface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag handle
          Container(
            margin: const EdgeInsets.only(top: 12, bottom: 8),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.white24,
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: AppTheme.teal.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.inventory_2_rounded, color: AppTheme.teal, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'STOK CARBON BRUSH',
                        style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold, letterSpacing: 0.5),
                      ),
                      Text(
                        'PLIRM 3 & 4 Tuban | Total: $totalStock pcs (${_items.length} tipe)',
                        style: const TextStyle(color: Colors.white54, fontSize: 11),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: _loadData,
                  icon: const Icon(Icons.refresh_rounded, color: AppTheme.teal, size: 20),
                  tooltip: 'Segarkan Stok',
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: Colors.white60),
                ),
              ],
            ),
          ),

          // Tab Bar
          TabBar(
            controller: _tabController,
            indicatorColor: AppTheme.teal,
            indicatorWeight: 3,
            labelColor: AppTheme.teal,
            unselectedLabelColor: Colors.white54,
            labelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
            tabs: [
              Tab(text: 'Daftar Stok (${_items.length})'),
              Tab(text: 'Riwayat Mutasi (${_logs.length})'),
            ],
          ),

          const Divider(color: Colors.white10, height: 1),

          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator(color: AppTheme.teal))
                : TabBarView(
                    controller: _tabController,
                    children: [
                      // TAB 1: DAFTAR STOK
                      _buildStockList(),

                      // TAB 2: RIWAYAT MUTASI
                      _buildLogsList(),
                    ],
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildStockList() {
    if (_items.isEmpty) {
      return const Center(
        child: Text('Belum ada data stok Carbon Brush', style: TextStyle(color: Colors.white54)),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _items.length,
      itemBuilder: (context, index) {
        final item = _items[index];
        final isLow = item.currentStock <= 6;
        final isPreselected = widget.preselectedStockKey == item.stockKey;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isPreselected ? const Color(0xFF0F2628) : AppTheme.surfaceFloat,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isPreselected ? AppTheme.teal : (isLow ? AppConstants.alertRed.withValues(alpha: 0.6) : AppTheme.borderMuted),
              width: isPreselected ? 1.5 : 1.0,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.brushName,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.black45,
                                borderRadius: BorderRadius.circular(4),
                                border: Border.all(color: Colors.white12),
                              ),
                              child: Text(
                                'SAP: ${item.sapNo}',
                                style: const TextStyle(color: Colors.white70, fontSize: 10, fontFamily: 'monospace'),
                              ),
                            ),
                            if (isPreselected) ...[
                              const SizedBox(width: 6),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppTheme.teal.withValues(alpha: 0.2),
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(color: AppTheme.teal.withValues(alpha: 0.6)),
                                ),
                                child: const Text(
                                  'Tipe Terpilih',
                                  style: TextStyle(color: AppTheme.teal, fontSize: 10, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Stock Count Badge
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: isLow ? AppConstants.alertRed.withValues(alpha: 0.2) : AppTheme.teal.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: isLow ? AppConstants.alertRed : AppTheme.teal.withValues(alpha: 0.5)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          '${item.currentStock} pcs',
                          style: TextStyle(
                            color: isLow ? AppConstants.alertRed : AppTheme.teal,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        Text(
                          isLow ? 'Stok Kritis' : 'Tersedia',
                          style: TextStyle(
                            color: isLow ? AppConstants.alertRed : AppTheme.teal,
                            fontSize: 9,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              if (item.useLabel.isNotEmpty) ...[
                const SizedBox(height: 10),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.settings_suggest_rounded, color: Colors.white38, size: 14),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'Digunakan pada: ${item.useLabel}',
                        style: const TextStyle(color: Colors.white60, fontSize: 11),
                      ),
                    ),
                  ],
                ),
              ],

              const SizedBox(height: 12),
              const Divider(color: Colors.white10, height: 1),
              const SizedBox(height: 10),

              // Action Buttons: Tambah Stok & Koreksi Stok
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppTheme.teal,
                        side: const BorderSide(color: AppTheme.teal),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () => _showMovementDialog(item, 'in'),
                      icon: const Icon(Icons.add_rounded, size: 16),
                      label: const Text('Tambah Stok', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      style: OutlinedButton.styleFrom(
                        foregroundColor: AppConstants.warningYellow,
                        side: const BorderSide(color: AppConstants.warningYellow),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () => _showMovementDialog(item, 'adjust'),
                      icon: const Icon(Icons.tune_rounded, size: 16),
                      label: const Text('Koreksi Saldo', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLogsList() {
    if (_logs.isEmpty) {
      return const Center(
        child: Text('Belum ada riwayat mutasi stok tersimpan', style: TextStyle(color: Colors.white54)),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _logs.length,
      itemBuilder: (context, index) {
        final log = _logs[index];
        final isPositive = log.quantityDelta > 0;
        final deltaText = '${isPositive ? "+" : ""}${log.quantityDelta} pcs';

        Color badgeColor;
        if (log.movementType == 'in') {
          badgeColor = const Color(0xFF25D366);
        } else if (log.movementType == 'adjust') {
          badgeColor = AppConstants.warningYellow;
        } else {
          badgeColor = const Color(0xFFFF5252);
        }

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppTheme.surfaceFloat,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.borderMuted),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: badgeColor.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(6),
                      border: Border.all(color: badgeColor.withValues(alpha: 0.6)),
                    ),
                    child: Text(
                      '${log.movementLabel}: $deltaText',
                      style: TextStyle(color: badgeColor, fontWeight: FontWeight.bold, fontSize: 12),
                    ),
                  ),
                  Text(
                    log.createdAt.length >= 10 ? log.createdAt.substring(0, 10) : log.createdAt,
                    style: const TextStyle(color: Colors.white38, fontSize: 11),
                  ),
                ],
              ),
              const SizedBox(height: 6),
              Text(
                '${log.brushName} (${log.sapNo})',
                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
              ),
              const SizedBox(height: 2),
              Text(
                'Saldo: ${log.stockBefore} pcs ➔ ${log.stockAfter} pcs',
                style: const TextStyle(color: AppTheme.teal, fontSize: 11, fontWeight: FontWeight.w600),
              ),
              if (log.equipmentName.isNotEmpty || log.pointKeys.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(
                  'Equipment: ${log.equipmentName}${log.pointKeys.isNotEmpty ? ' | Titik: ${log.pointKeys.join(", ")}' : ''}',
                  style: const TextStyle(color: Colors.white70, fontSize: 11),
                ),
              ],
              if (log.note.isNotEmpty) ...[
                const SizedBox(height: 2),
                Text(
                  'Catatan: ${log.note}',
                  style: const TextStyle(color: Colors.white54, fontSize: 11, fontStyle: FontStyle.italic),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
