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
    };
    if (_sessionToken != null && _sessionToken!.isNotEmpty) {
      headers["Authorization"] = "Bearer $_sessionToken";
      headers["Cookie"] = "plirm_session=$_sessionToken";
    }
    return headers;
  }

  // --- Auth APIs ---
  Future<UserModel> login(String username, String password) async {
    final uri = Uri.parse("$baseUrl/api/auth/login");
    final res = await http.post(
      uri,
      headers: {"Content-Type": "application/json"},
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
      headers: {"Content-Type": "application/json"},
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
        final list = jsonDecode(res.body) as List;
        return list.map((e) => CarbonBrushItem.fromJson(e)).toList();
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

  Future<List<NegatifItem>> fetchNegatifList({String? status, String? area}) async {
    try {
      var query = "limit=50&compact=1";
      if (status != null && status.isNotEmpty) query += "&status=$status";
      if (area != null && area != "Semua Area") query += "&area=$area";
      final uri = Uri.parse("$baseUrl/api/items/negatif-list?$query");
      final res = await http.get(uri, headers: _headers()).timeout(const Duration(seconds: 10));
      if (res.statusCode == 200) {
        final list = jsonDecode(res.body) as List;
        return list.map((e) => NegatifItem.fromJson(e)).toList();
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
        final list = jsonDecode(res.body) as List;
        return list.map((e) => ServiceItem.fromJson(e)).toList();
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
}
