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
  List<SparepartItem> _items = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadItems();
  }

  Future<void> _loadItems() async {
    final items = await widget.apiService.fetchSpareparts();
    if (mounted) {
      setState(() {
        _items = items;
        _isLoading = false;
      });
    }
  }

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
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(color: AppTheme.teal),
                  )
                : ListView.builder(
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
