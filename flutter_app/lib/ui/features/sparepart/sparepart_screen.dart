import "package:flutter/material.dart";
import "../../../core/theme/app_theme.dart";
import "../../../data/models/models.dart";
import "../../../data/services/api_service.dart";

class SparepartScreen extends StatefulWidget {
  final ApiService apiService;
  final String selectedArea;

  const SparepartScreen({
    super.key,
    required this.apiService,
    required this.selectedArea,
  });

  @override
  State<SparepartScreen> createState() => _SparepartScreenState();
}

class _SparepartScreenState extends State<SparepartScreen> {
  final _searchCtrl = TextEditingController();
  final List<SparepartItem> _items = [
    SparepartItem(id: "1", kode: "CB-634-SIEMENS", nama: "Carbon Brush SIEMENS 32x50x80", stok: 24, satuan: "PCS", lokasi: "Gudang Listrik Rak A-02"),
    SparepartItem(id: "2", kode: "SW-DRIFT-323", nama: "Drift Switch Conveyor Omron Heavy Duty", stok: 6, satuan: "UNIT", lokasi: "Gudang Instrument Rak C-01"),
    SparepartItem(id: "3", kode: "MOD-PROFIBUS-DP", nama: "Siemens ET200M IM153-1 Profibus Module", stok: 2, satuan: "UNIT", lokasi: "Ruang Server DCS"),
    SparepartItem(id: "4", kode: "PULL-CORD-KAP", nama: "Pull Cord Switch With Emergency Lock", stok: 12, satuan: "UNIT", lokasi: "Gudang Listrik Rak B-05"),
  ];

  @override
  Widget build(BuildContext context) {
    final query = _searchCtrl.text.toLowerCase();
    final filtered = _items.where((i) => i.nama.toLowerCase().contains(query) || i.kode.toLowerCase().contains(query)).toList();

    return Scaffold(
      appBar: AppBar(
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("Katalog & Stok Sparepart"),
            Text("Area: ${widget.selectedArea}", style: const TextStyle(fontSize: 12, color: AppTheme.teal)),
          ],
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchCtrl,
              decoration: const InputDecoration(
                hintText: "Cari nama alat, kode sparepart, atau lokasi...",
                prefixIcon: Icon(Icons.search_rounded, color: AppTheme.teal),
              ),
              onChanged: (_) => setState(() {}),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 90),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final item = filtered[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.border),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: AppTheme.surfaceFloat,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.teal.withValues(alpha: 0.3)),
                        ),
                        child: const Icon(Icons.inventory_2_outlined, color: AppTheme.teal),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              item.kode,
                              style: const TextStyle(color: AppTheme.teal, fontSize: 11, fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item.nama,
                              style: const TextStyle(color: AppTheme.text, fontSize: 15, fontWeight: FontWeight.w700),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              item.lokasi,
                              style: const TextStyle(color: AppTheme.textSubtle, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        decoration: BoxDecoration(
                          color: item.stok <= 4 ? AppTheme.amberSurface : AppTheme.greenSurface,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: item.stok <= 4 ? AppTheme.amber : AppTheme.green),
                        ),
                        child: Column(
                          children: [
                            Text(
                              "${item.stok}",
                              style: TextStyle(
                                color: item.stok <= 4 ? AppTheme.amber : AppTheme.green,
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            Text(
                              item.satuan,
                              style: TextStyle(
                                color: item.stok <= 4 ? AppTheme.amber : AppTheme.green,
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
