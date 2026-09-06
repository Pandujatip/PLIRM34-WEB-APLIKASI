import "dart:convert";
import "package:http/http.dart" as http;
import "../../core/constants/app_constants.dart";
import "../models/models.dart";

class ApiService {
  final String baseUrl;
  String? _sessionToken;

  ApiService({this.baseUrl = AppConstants.baseUrl});

  void setSessionToken(String? token) {
    _sessionToken = token;
  }

  Map<String, String> _headers() {
    final headers = <String, String>{
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "PLIRM34-Native-Android",
    };
    if (_sessionToken != null && _sessionToken!.isNotEmpty) {
      headers["Authorization"] = "Bearer $_sessionToken";
      headers["Cookie"] = "plirm34_session=$_sessionToken";
    }
    return headers;
  }

  // --- Auth APIs ---
  Future<UserModel> login(String username, String password) async {
    final uri = Uri.parse("$baseUrl/api/auth/login");
    final res = await http.post(
      uri,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "PLIRM34-Native-Android",
      },
      body: jsonEncode({"username": username, "password": password}),
    ).timeout(const Duration(seconds: 15));

    final data = jsonDecode(res.body);
    if (res.statusCode >= 200 && res.statusCode < 300 && data["token"] != null) {
      _sessionToken = data["token"];
      return UserModel.fromJson(data["user"] ?? {"id": 1, "username": username, "role": "team"}, token: data["token"]);
    } else {
      throw Exception(data["error"] ?? "Username atau kata sandi tidak sesuai");
    }
  }

  Future<UserModel> loginWithGoogleToken(String idToken, {String? email, String? name}) async {
    final uri = Uri.parse("$baseUrl/api/auth/google");
    final res = await http.post(
      uri,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "PLIRM34-Native-Android",
      },
      body: jsonEncode({
        "id_token": idToken,
        if (email != null) "email": email,
        if (name != null) "name": name,
      }),
    ).timeout(const Duration(seconds: 15));

    final data = jsonDecode(res.body);
    if (res.statusCode >= 200 && res.statusCode < 300 && data["token"] != null) {
      _sessionToken = data["token"];
      return UserModel.fromJson(data["user"] ?? {"id": 1, "username": email ?? "google_user", "role": "team"}, token: data["token"]);
    } else {
      throw Exception(data["error"] ?? "Verifikasi akun Google gagal");
    }
  }

  /// Verifies current or provided session token with the live server (/api/auth/me)
  Future<UserModel?> fetchCurrentUser({String? token}) async {
    final effectiveToken = token ?? _sessionToken;
    if (effectiveToken == null || effectiveToken.isEmpty) return null;
    try {
      final uri = Uri.parse("$baseUrl/api/auth/me");
      final res = await http.get(
        uri,
        headers: {
          "Accept": "application/json",
          "User-Agent": "PLIRM34-Native-Android",
          "Cookie": "plirm34_session=$effectiveToken",
        },
      ).timeout(const Duration(seconds: 10));

      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic> && data["user"] != null) {
          final userMap = data["user"] as Map<String, dynamic>;
          return UserModel.fromJson(userMap, token: effectiveToken);
        }
      }
    } catch (_) {}
    return null;
  }

  Future<UserModel> completeProfile({
    required String fullName,
    required String badgeNumber,
    required String employmentType,
    required String company,
    required String unitKerja,
  }) async {
    final uri = Uri.parse("$baseUrl/api/auth/complete-profile");
    final res = await http.post(
      uri,
      headers: _headers(),
      body: jsonEncode({
        "fullName": fullName,
        "full_name": fullName,
        "badgeNumber": badgeNumber,
        "badge_number": badgeNumber,
        "employmentType": employmentType,
        "employment_type": employmentType,
        "company": company,
        "unitKerja": unitKerja,
        "unit_kerja": unitKerja,
      }),
    ).timeout(const Duration(seconds: 15));

    final data = jsonDecode(res.body);
    if (res.statusCode >= 200 && res.statusCode < 300 && data["user"] != null) {
      return UserModel.fromJson(data["user"], token: _sessionToken);
    } else {
      throw Exception(data["error"] ?? "Gagal menyimpan kelengkapan profil");
    }
  }

  Future<List<SapEquipmentItem>> searchSapEquipments(
    String query, {
    String? area,
    String? plant,
    int limit = 50,
  }) async {
    final queryParams = <String, String>{
      "q": query,
      "limit": limit.toString(),
      if (area != null && area.isNotEmpty && area != "ALL") "area": area,
      if (plant != null && plant.isNotEmpty && plant != "ALL") "plant": plant,
    };
    final uri = Uri.parse("$baseUrl/api/equipments/search").replace(queryParameters: queryParams);
    try {
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic> && data["records"] is List) {
          return (data["records"] as List)
              .map((e) => SapEquipmentItem.fromJson(e as Map<String, dynamic>))
              .toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<List<Map<String, dynamic>>> getSapAreas({String plant = "ALL"}) async {
    final uri = Uri.parse("$baseUrl/api/equipments/areas").replace(queryParameters: {"plant": plant});
    try {
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic> && data["areas"] is List) {
          return (data["areas"] as List).map((e) => Map<String, dynamic>.from(e as Map)).toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<List<ColleagueUser>> getColleagues() async {
    final uri = Uri.parse("$baseUrl/api/users/colleagues");
    try {
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        if (data is Map<String, dynamic> && data["users"] is List) {
          return (data["users"] as List)
              .map((e) => ColleagueUser.fromJson(e as Map<String, dynamic>))
              .toList();
        }
      }
    } catch (_) {}
    return [];
  }

  // --- Inspection & Monitor APIs ---
  Future<Map<String, dynamic>> fetchOverview() async {
    try {
      final uri = Uri.parse("$baseUrl/api/monitor/overview");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        return jsonDecode(res.body);
      }
    } catch (_) {}
    return {};
  }

  Future<List<CarbonBrushItem>> fetchCarbonBrush() async {
    try {
      final uri = Uri.parse("$baseUrl/api/carbon-brush-stock");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        if (decoded is Map<String, dynamic>) {
          final alerts = decoded['alerts'] as List? ?? [];
          if (alerts.isNotEmpty) {
            return alerts.map((a) => CarbonBrushItem.fromAlert(a as Map<String, dynamic>)).toList();
          }
        } else if (decoded is List && decoded.isNotEmpty) {
          return decoded.map((e) => CarbonBrushItem.fromJson(e as Map<String, dynamic>)).toList();
        }
      }
    } catch (_) {}
    // Fallback item
    return [
      CarbonBrushItem(
        equipment: "343FN4M01 - SIEMENS",
        statusLimit: "1/6 DEKAT LIMIT",
        estimasi: "15 Sep 2026 (10 hari)",
        tanggalUkur: "20 Agu 2026 | F4 = 32.5 mm",
        nilai: "32.5 mm",
        keterangan: "Dekat limit | Tuban 3 limit merah < 30 mm | Prediksi stabil",
      )
    ];
  }

  Future<List<CarbonBrushStockItem>> fetchCarbonBrushStockItems() async {
    try {
      final uri = Uri.parse("$baseUrl/api/carbon-brush-stock");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        if (decoded is Map<String, dynamic> && decoded['items'] is List) {
          final list = (decoded['items'] as List)
              .map((e) => CarbonBrushStockItem.fromJson(e as Map<String, dynamic>))
              .toList();
          if (list.isNotEmpty) return list;
        }
      }
    } catch (_) {}
    return CarbonBrushStockItem.defaultItems();
  }

  Future<List<CarbonBrushStockLogItem>> fetchCarbonBrushStockLogs() async {
    try {
      final uri = Uri.parse("$baseUrl/api/carbon-brush-stock?limit=50");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        if (decoded is Map<String, dynamic> && decoded['logs'] is List) {
          return (decoded['logs'] as List)
              .map((e) => CarbonBrushStockLogItem.fromJson(e as Map<String, dynamic>))
              .toList();
        }
      }
    } catch (_) {}
    return [];
  }

  Future<bool> saveCarbonBrushStockMovement({
    required String stockKey,
    required String movementType,
    required int quantity,
    String note = '',
  }) async {
    try {
      final uri = Uri.parse("$baseUrl/api/carbon-brush-stock/movement");
      final payload = {
        'stockKey': stockKey,
        'movementType': movementType,
        'quantity': quantity,
        'note': note,
      };
      final res = await http.post(
        uri,
        headers: _headers(),
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 10));
      return res.statusCode == 200 || res.statusCode == 201;
    } catch (_) {
      return false;
    }
  }

  Future<List<String>> fetchEquipmentReferences({String? sourceGroup}) async {
    try {
      final q = sourceGroup != null && sourceGroup.isNotEmpty ? '?source_group=$sourceGroup' : '';
      final uri = Uri.parse("$baseUrl/api/masters$q");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        final refs = decoded is Map<String, dynamic>
            ? (decoded['equipmentReferences'] as List? ?? [])
            : (decoded is List ? decoded : []);
        final list = refs
            .map((e) => (e is Map ? (e['equipmentName'] ?? e['equipmentCode'] ?? '').toString() : e.toString()).trim())
            .where((s) => s.isNotEmpty)
            .toSet()
            .toList();
        if (list.isNotEmpty) {
          list.sort();
          return list;
        }
      }
    } catch (_) {}
    return [];
  }

  Future<List<NegatifItem>> fetchNegatifList({String? status, String? area}) async {
    try {
      var query = "limit=50&compact=1";
      if (status != null && status.isNotEmpty) query += "&status=$status";
      if (area != null && area != "Semua Area") query += "&area=$area";
      final uri = Uri.parse("$baseUrl/api/items/negatif-list?$query");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        final list = decoded is List ? decoded : (decoded['items'] as List? ?? []);
        if (list.isNotEmpty) {
          return list.map((e) => NegatifItem.fromJson(e as Map<String, dynamic>)).toList();
        }
      }
    } catch (_) {}
    return [
      NegatifItem(id: "1", equipment: "323BC2", temuan: "support drift switch patah", status: "OPEN", statusTambahan: "nunggu RM Off", area: "Raw Mill"),
      NegatifItem(id: "2", equipment: "343BE1", temuan: "kabel terinduksi mark Notif benglist", status: "OPEN", statusTambahan: "Input WhatsApp", area: "Kiln"),
      NegatifItem(id: "3", equipment: "324EH01", temuan: "Support Connector Socket", status: "OPEN", statusTambahan: "nunggu sparepart", area: "Raw Mill"),
    ];
  }

  Future<List<ServiceItem>> fetchServices({
    String? area,
    String? kategori,
    String? startDate,
    String? endDate,
  }) async {
    try {
      var params = <String>["compact=1", "limit=500"];
      if (area != null && area != "Semua Area") params.add("area=${Uri.encodeComponent(area)}");
      if (kategori != null && kategori.isNotEmpty) params.add("kategori=${Uri.encodeComponent(kategori)}");
      if (startDate != null && startDate.isNotEmpty) params.add("start_date=$startDate");
      if (endDate != null && endDate.isNotEmpty) params.add("end_date=$endDate");

      final uri = Uri.parse("$baseUrl/api/items/service?${params.join('&')}");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        final list = decoded is List ? decoded : (decoded['items'] as List? ?? []);
        if (list.isNotEmpty) {
          return list.map((e) => ServiceItem.fromJson(e as Map<String, dynamic>)).toList();
        }
      }
    } catch (_) {}

    // Fallback seed services
    return [
      ServiceItem(
        id: "SRV-01",
        tanggal: "2026-09-04",
        equipment: "341FN03M01 - ABB",
        kategori: "Electrical",
        deskripsi: "Motor MV Carbon Brush Inspection & Replacement",
        tindakan: "Pembersihan slip ring & penggantian 2 unit carbon brush",
        status: "Done",
        teknisi: "Tim Listrik Shift A",
        area: "Raw Mill",
      ),
      ServiceItem(
        id: "SRV-02",
        tanggal: "2026-09-03",
        equipment: "323BC2 - Conveyor",
        kategori: "Instrumentasi",
        deskripsi: "Kalibrasi sensor pull cord switch dan drift alignment",
        tindakan: "Penyetelan ketegangan kabel dan pengetesan interlock",
        status: "Done",
        teknisi: "Ins. Agus & Budi",
        area: "Crusher",
      ),
      ServiceItem(
        id: "SRV-03",
        tanggal: "2026-08-28",
        equipment: "DCS Controller 01",
        kategori: "DCS",
        deskripsi: "Pengecekan komunikasi modul I/O profibus rack 3",
        tindakan: "Terminasi ulang konektor RJ45 dan grounding shield",
        status: "Done",
        teknisi: "DCS Eng. Pandu",
        area: "Kiln",
      ),
    ];
  }

  Future<List<SparepartItem>> fetchSpareparts() async {
    try {
      final uri = Uri.parse("$baseUrl/api/items/sparepart?compact=1&limit=500");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        final list = decoded is List ? decoded : (decoded['items'] ?? decoded['data'] as List? ?? []);
        if (list.isNotEmpty) {
          return list.map((e) => SparepartItem.fromJson(e as Map<String, dynamic>)).toList();
        }
      }
    } catch (_) {}
    return [
      SparepartItem(id: "1", kode: "CB-634-SIEMENS", nama: "Carbon Brush SIEMENS 32x50x80", stok: 24, satuan: "PCS", lokasi: "Gudang Listrik Rak A-02"),
      SparepartItem(id: "2", kode: "SW-DRIFT-323", nama: "Drift Switch Conveyor Omron Heavy Duty", stok: 6, satuan: "UNIT", lokasi: "Gudang Instrument Rak C-01"),
      SparepartItem(id: "3", kode: "MOD-PROFIBUS-DP", nama: "Siemens ET200M IM153-1 Profibus Module", stok: 2, satuan: "UNIT", lokasi: "Ruang Server DCS"),
      SparepartItem(id: "4", kode: "PULL-CORD-KAP", nama: "Pull Cord Switch With Emergency Lock", stok: 12, satuan: "UNIT", lokasi: "Gudang Listrik Rak B-05"),
    ];
  }

  Future<bool> closeNegatifItem(NegatifItem item, {String? notes}) async {
    try {
      final uri = Uri.parse("$baseUrl/api/items/negatif-list/${item.id}");
      final res = await http.put(
        uri,
        headers: _headers(),
        body: jsonEncode({
          "item": {
            "id": item.id,
            "equipment": item.equipment,
            "damageDescription": item.temuan,
            "followUpPlan": notes != null && notes.isNotEmpty ? notes : (item.followUpPlan.isNotEmpty ? item.followUpPlan : "Sudah diselesaikan / Closed"),
            "foundDate": item.foundDate,
            "pendingMark": notes ?? item.pendingMark,
            "workStatus": "Closed",
            "category": item.category,
            "area": item.area,
          }
        }),
      ).timeout(const Duration(seconds: 15));
      return res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  Future<bool> createServiceItem(ServiceItem item) async {
    try {
      final uri = Uri.parse("$baseUrl/api/items/service");
      final res = await http.post(
        uri,
        headers: _headers(),
        body: jsonEncode({
          "item": item.toJson(),
        }),
      ).timeout(const Duration(seconds: 15));
      return res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  Future<bool> updateServiceItem(ServiceItem item) async {
    try {
      final uri = Uri.parse("$baseUrl/api/items/service/${Uri.encodeComponent(item.id)}");
      final res = await http.put(
        uri,
        headers: _headers(),
        body: jsonEncode({
          "item": item.toJson(),
        }),
      ).timeout(const Duration(seconds: 15));
      return res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  Future<bool> deleteServiceItem(String id) async {
    try {
      final uri = Uri.parse("$baseUrl/api/items/service/${Uri.encodeComponent(id)}");
      final res = await http.delete(
        uri,
        headers: _headers(),
      ).timeout(const Duration(seconds: 15));
      return res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {
      return false;
    }
  }

  Future<List<OvertimeItem>> fetchOvertimeData({String? period}) async {
    try {
      final query = period != null && period.isNotEmpty ? "period=$period" : "period=2026-08";
      final uri = Uri.parse("$baseUrl/api/overtime?$query");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 12));
      if (res.statusCode == 200) {
        final decoded = jsonDecode(res.body);
        final list = decoded is Map && decoded['ranking'] is List
            ? decoded['ranking'] as List
            : (decoded is Map && decoded['items'] is List
                ? decoded['items'] as List
                : (decoded is List ? decoded : []));
        if (list.isNotEmpty) {
          return list.map((e) => OvertimeItem.fromJson(e as Map<String, dynamic>)).toList();
        }
      }
    } catch (_) {}

    return [
      OvertimeItem(
        employeeNo: "3401",
        employeeName: "M. RIDWAN",
        groupType: "Preventif",
        companyName: "PT SBG",
        monthRawHours: 32.5,
        monthLiveHours: 42.0,
        contractLiveHours: 42.0,
        annualRemainingHours: 128.5,
        annualUsagePercent: 68.0,
        quotaStatus: "Aman",
        monthStatus: "Sesuai Jadwal",
        task: "PM Motor MV Kiln & Raw Mill",
      ),
      OvertimeItem(
        employeeNo: "3402",
        employeeName: "AHMAD SUKRI",
        groupType: "Gangguan",
        companyName: "PT SBG",
        monthRawHours: 48.0,
        monthLiveHours: 56.5,
        contractLiveHours: 56.5,
        annualRemainingHours: 42.0,
        annualUsagePercent: 89.5,
        quotaStatus: "Mendekati Limit",
        monthStatus: "Tinggi",
        task: "Troubleshooting Converter & Inverter",
      ),
      OvertimeItem(
        employeeNo: "3403",
        employeeName: "DWI PRASETYO",
        groupType: "Preventif",
        companyName: "PT SBG",
        monthRawHours: 24.0,
        monthLiveHours: 31.0,
        contractLiveHours: 31.0,
        annualRemainingHours: 165.0,
        annualUsagePercent: 52.0,
        quotaStatus: "Aman",
        monthStatus: "Normal",
        task: "Inspeksi Carbon Brush 343FN4M01",
      ),
    ];
  }

  // --- User Management APIs (Admin Only) ---
  Future<List<UserModel>> fetchUsers() async {
    try {
      final uri = Uri.parse("$baseUrl/api/users");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final list = (data["users"] ?? []) as List<dynamic>;
        return list.map((e) => UserModel.fromJson(e as Map<String, dynamic>)).toList();
      }
    } catch (_) {}
    return [];
  }

  Future<bool> updateUserRole(String username, String newRole) async {
    try {
      final encodedUser = Uri.encodeComponent(username);
      final uri = Uri.parse("$baseUrl/api/users/$encodedUser/role");
      final res = await http.put(
        uri,
        headers: _headers(),
        body: jsonEncode({"role": newRole}),
      ).timeout(const Duration(seconds: 10));
      return res.statusCode >= 200 && res.statusCode < 300;
    } catch (_) {
      return false;
    }
  }
}
