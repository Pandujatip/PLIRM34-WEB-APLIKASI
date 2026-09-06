import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../data/models/models.dart';
import '../../data/services/api_service.dart';

class OfflineService {
  static const String _storageKey = 'offline_pending_services';

  /// Menyimpan ServiceItem secara lokal di SharedPreferences ketika offline / tidak ada sinyal
  static Future<void> saveOfflineServiceItem(ServiceItem item) async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_storageKey) ?? [];
    final jsonStr = jsonEncode(item.toJson());
    int existingIndex = -1;
    for (int i = 0; i < list.length; i++) {
      try {
        final map = jsonDecode(list[i]) as Map<String, dynamic>;
        if (map['id'] == item.id) {
          existingIndex = i;
          break;
        }
      } catch (_) {}
    }
    if (existingIndex >= 0) {
      list[existingIndex] = jsonStr;
    } else {
      list.add(jsonStr);
    }
    await prefs.setStringList(_storageKey, list);
  }

  /// Menghapus item offline berdasarkan ID
  static Future<void> removeOfflineServiceItem(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_storageKey) ?? [];
    list.removeWhere((str) {
      try {
        final map = jsonDecode(str) as Map<String, dynamic>;
        return map['id'] == id;
      } catch (_) {
        return false;
      }
    });
    await prefs.setStringList(_storageKey, list);
  }

  /// Mendapatkan jumlah laporan service offline yang belum tersinkronisasi
  static Future<int> getPendingCount() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_storageKey) ?? [];
    return list.length;
  }

  /// Mendapatkan daftar semua ServiceItem yang tersimpan secara offline
  static Future<List<ServiceItem>> getPendingItems() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_storageKey) ?? [];
    return list.map((str) {
      try {
        final map = jsonDecode(str) as Map<String, dynamic>;
        return ServiceItem.fromJson(map);
      } catch (_) {
        return null;
      }
    }).whereType<ServiceItem>().toList();
  }

  /// Mengirim semua data pending offline ke database server via ApiService
  /// Mengembalikan SyncResult dengan status sinkronisasi dan koneksi (online/offline)
  static Future<SyncResult> syncPendingItems(ApiService apiService) async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_storageKey) ?? [];
    if (list.isEmpty) {
      return const SyncResult(syncedCount: 0, remainingCount: 0, isOnline: true);
    }

    final remaining = <String>[];
    int syncedCount = 0;
    bool isOnline = true;

    for (final str in list) {
      try {
        final data = jsonDecode(str) as Map<String, dynamic>;
        final item = ServiceItem.fromJson(data);
        final result = await apiService.createServiceItemDetailed(item);
        if (result.isSuccess) {
          syncedCount++;
        } else if (result.isNetworkError) {
          isOnline = false;
          remaining.add(str);
        } else {
          // Server merespon (HP kondisi ONLINE)
          if (result.statusCode == 409) {
            // Sudah ada di server, anggap tersinkron
            syncedCount++;
          } else {
            // Error lain dari server saat online
            remaining.add(str);
          }
        }
      } catch (_) {
        isOnline = false;
        remaining.add(str);
      }
    }

    await prefs.setStringList(_storageKey, remaining);
    return SyncResult(
      syncedCount: syncedCount,
      remainingCount: remaining.length,
      isOnline: isOnline,
    );
  }

  /// Menghapus seluruh data pending offline
  static Future<void> clearPendingItems() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_storageKey);
  }

  // --- Carbon Brush Stock Offline Cache ---
  static const String _cbStockStorageKey = 'offline_carbon_brush_stock';

  static Future<void> saveCachedCarbonBrushStock(List<CarbonBrushStockItem> items) async {
    final prefs = await SharedPreferences.getInstance();
    final jsonList = items.map((e) => jsonEncode(e.toJson())).toList();
    await prefs.setStringList(_cbStockStorageKey, jsonList);
  }

  static Future<List<CarbonBrushStockItem>> getCachedCarbonBrushStock() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_cbStockStorageKey) ?? [];
    if (list.isEmpty) return CarbonBrushStockItem.defaultItems();
    return list.map((str) {
      try {
        final map = jsonDecode(str) as Map<String, dynamic>;
        return CarbonBrushStockItem.fromJson(map);
      } catch (_) {
        return null;
      }
    }).whereType<CarbonBrushStockItem>().toList();
  }

  static Future<void> deductOfflineCarbonBrushStock(String stockKey, int quantity) async {
    if (quantity <= 0) return;
    final items = await getCachedCarbonBrushStock();
    final updated = items.map((item) {
      if (item.stockKey == stockKey || item.sapNo == stockKey) {
        final newQty = (item.currentStock - quantity).clamp(0, 999999);
        return item.copyWith(currentStock: newQty);
      }
      return item;
    }).toList();
    await saveCachedCarbonBrushStock(updated);
  }
}

class SyncResult {
  final int syncedCount;
  final int remainingCount;
  final bool isOnline;
  final String? message;

  const SyncResult({
    required this.syncedCount,
    required this.remainingCount,
    required this.isOnline,
    this.message,
  });
}

