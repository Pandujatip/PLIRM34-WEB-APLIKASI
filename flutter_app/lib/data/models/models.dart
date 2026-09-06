export 'equipment_health_model.dart';

class UserModel {
  final int id;
  final String username;
  final String role;
  final String? token;
  final String? fullName;
  final String? badgeNumber;
  final String? employmentType;
  final String? company;
  final String? unitKerja;
  final bool isProfileCompleted;

  UserModel({
    required this.id,
    required this.username,
    required this.role,
    this.token,
    this.fullName,
    this.badgeNumber,
    this.employmentType,
    this.company,
    this.unitKerja,
    this.isProfileCompleted = false,
  });

  bool get isAdmin => role.toLowerCase() == 'admin';
  bool get isOrganik => role.toLowerCase() == 'organik';
  bool get isTeam => !isAdmin && !isOrganik;

  bool get needsProfileCompletion => !isAdmin && !isProfileCompleted;

  String get displayName {
    if (fullName != null && fullName!.trim().isNotEmpty) {
      return fullName!.trim();
    }
    return username;
  }

  String get roleBadgeLabel {
    if (isAdmin) return 'ADMIN';
    if (isOrganik) return 'ORGANIK';
    return 'TIM TEKNISI';
  }

  String get unitBadgeLabel {
    if (isAdmin) return 'ALL UNITS';
    if (unitKerja != null && unitKerja!.isNotEmpty) {
      return unitKerja!;
    }
    return 'UNIT BELUM DISET';
  }

  bool get canCloseNegatifList => isAdmin || isOrganik;
  bool get canEditService => isAdmin || isOrganik;
  bool get canApproveOvertime => isAdmin;
  bool get canManageSpareparts => isAdmin;

  UserModel copyWith({
    int? id,
    String? username,
    String? role,
    String? token,
    String? fullName,
    String? badgeNumber,
    String? employmentType,
    String? company,
    String? unitKerja,
    bool? isProfileCompleted,
  }) {
    return UserModel(
      id: id ?? this.id,
      username: username ?? this.username,
      role: role ?? this.role,
      token: token ?? this.token,
      fullName: fullName ?? this.fullName,
      badgeNumber: badgeNumber ?? this.badgeNumber,
      employmentType: employmentType ?? this.employmentType,
      company: company ?? this.company,
      unitKerja: unitKerja ?? this.unitKerja,
      isProfileCompleted: isProfileCompleted ?? this.isProfileCompleted,
    );
  }

  factory UserModel.fromJson(Map<String, dynamic> json, {String? token}) {
    final rawIsCompleted = json['isProfileCompleted'] ?? json['is_profile_completed'];
    final bool isCompleted = rawIsCompleted == true || rawIsCompleted == 1 || rawIsCompleted == '1';

    return UserModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      username: json['username']?.toString() ?? '',
      role: json['role']?.toString() ?? 'team',
      token: token ?? json['token']?.toString(),
      fullName: json['fullName']?.toString() ?? json['full_name']?.toString(),
      badgeNumber: json['badgeNumber']?.toString() ?? json['badge_number']?.toString(),
      employmentType: json['employmentType']?.toString() ?? json['employment_type']?.toString(),
      company: json['company']?.toString(),
      unitKerja: json['unitKerja']?.toString() ?? json['unit_kerja']?.toString(),
      isProfileCompleted: isCompleted,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'username': username,
    'role': role,
    'token': token,
    'fullName': fullName,
    'badgeNumber': badgeNumber,
    'employmentType': employmentType,
    'company': company,
    'unitKerja': unitKerja,
    'isProfileCompleted': isProfileCompleted,
  };
}

class ServiceItem {
  final String id;
  final String tanggal;
  final String equipment;
  final String kategori; // Electrical, Instrumentasi, DCS
  final String deskripsi;
  final String tindakan;
  final String status;
  final String teknisi;
  final String area;
  final String subtype;
  final String formType;
  final String recommendation;
  final String detail;
  final Map<String, dynamic> measurements;
  final Map<String, dynamic> stats;
  final List<String> replacedPoints;
  final Map<String, dynamic> payload;

  ServiceItem({
    required this.id,
    required this.tanggal,
    required this.equipment,
    required this.kategori,
    required this.deskripsi,
    required this.tindakan,
    required this.status,
    required this.teknisi,
    required this.area,
    this.subtype = '',
    this.formType = '',
    this.recommendation = '',
    this.detail = '',
    this.measurements = const {},
    this.stats = const {},
    this.replacedPoints = const [],
    this.payload = const {},
  });

  factory ServiceItem.fromJson(Map<String, dynamic> json) {
    final payloadMap = json['payload'] is Map<String, dynamic> ? Map<String, dynamic>.from(json['payload'] as Map) : <String, dynamic>{};
    final measurementsRaw = payloadMap['measurements'] is Map<String, dynamic> ? Map<String, dynamic>.from(payloadMap['measurements'] as Map) : <String, dynamic>{};
    final statsRaw = payloadMap['stats'] is Map<String, dynamic> ? Map<String, dynamic>.from(payloadMap['stats'] as Map) : <String, dynamic>{};
    final replacedRaw = payloadMap['replacedPoints'] is List ? (payloadMap['replacedPoints'] as List).map((e) => e.toString()).toList() : <String>[];

    return ServiceItem(
      id: json['id']?.toString() ?? '',
      tanggal: json['tanggal']?.toString() ?? payloadMap['inspectionDate']?.toString() ?? json['date']?.toString() ?? '',
      equipment: json['equipmentName']?.toString() ?? json['equipment']?.toString() ?? json['nama_alat']?.toString() ?? '',
      kategori: json['type']?.toString() ?? json['kategori']?.toString() ?? json['category']?.toString() ?? 'Electrical',
      deskripsi: json['description']?.toString() ?? json['deskripsi']?.toString() ?? json['subtype']?.toString() ?? '',
      tindakan: json['detail']?.toString() ?? json['tindakan']?.toString() ?? payloadMap['recommendation']?.toString() ?? '',
      status: json['status']?.toString() ?? 'Done',
      teknisi: json['teknisi']?.toString() ?? payloadMap['pic']?.toString() ?? '',
      area: json['area']?.toString() ?? '',
      subtype: json['subtype']?.toString() ?? '',
      formType: json['formType']?.toString() ?? '',
      recommendation: payloadMap['recommendation']?.toString() ?? '',
      detail: json['detail']?.toString() ?? '',
      measurements: measurementsRaw,
      stats: statsRaw,
      replacedPoints: replacedRaw,
      payload: payloadMap,
    );
  }

  Map<String, dynamic> toJson() {
    final fullPayload = Map<String, dynamic>.from(payload);
    fullPayload['inspectionDate'] = tanggal;
    fullPayload['pic'] = teknisi;
    if (recommendation.isNotEmpty) fullPayload['recommendation'] = recommendation;
    if (measurements.isNotEmpty) fullPayload['measurements'] = measurements;
    if (stats.isNotEmpty) fullPayload['stats'] = stats;
    if (replacedPoints.isNotEmpty) fullPayload['replacedPoints'] = replacedPoints;

    return {
      'id': id.isNotEmpty ? id : 'service-${DateTime.now().millisecondsSinceEpoch}',
      'type': kategori,
      'kategori': kategori,
      'subtype': subtype,
      'formType': formType,
      'equipmentName': equipment,
      'equipment': equipment,
      'area': area,
      'tanggal': tanggal,
      'teknisi': teknisi,
      'status': status,
      'description': deskripsi,
      'detail': tindakan,
      'payload': fullPayload,
    };
  }
}

class CarbonBrushPoint {
  final String pointKey;
  final double currentValue;
  final int countdownDays;
  final String estimatedReplacementDate;
  final String lastInspectionDate;
  final double medianWearRate;
  final double thresholdLow;
  final double thresholdHigh;
  final String actionLabel;
  final String severity;

  CarbonBrushPoint({
    required this.pointKey,
    required this.currentValue,
    required this.countdownDays,
    required this.estimatedReplacementDate,
    required this.lastInspectionDate,
    required this.medianWearRate,
    this.thresholdLow = 30.0,
    this.thresholdHigh = 34.0,
    this.actionLabel = '',
    this.severity = 'normal',
  });

  factory CarbonBrushPoint.fromJson(Map<String, dynamic> json) {
    final curVal = (json['currentValue'] is num)
        ? (json['currentValue'] as num).toDouble()
        : double.tryParse(json['currentValue']?.toString() ?? '0') ?? 0.0;
    final countdown = (json['countdownDays'] is num)
        ? (json['countdownDays'] as num).toInt()
        : int.tryParse(json['countdownDays']?.toString() ?? '0') ?? 0;
    final wearRate = (json['medianWearRate'] is num)
        ? (json['medianWearRate'] as num).toDouble()
        : double.tryParse(json['medianWearRate']?.toString() ?? '0') ?? 0.0;
    final tLow = (json['thresholdLow'] is num)
        ? (json['thresholdLow'] as num).toDouble()
        : 30.0;
    final tHigh = (json['thresholdHigh'] is num)
        ? (json['thresholdHigh'] as num).toDouble()
        : 34.0;

    final displayStatus = json['displayStatus'] is Map<String, dynamic> ? json['displayStatus'] as Map<String, dynamic> : {};
    final action = displayStatus['actionLabel']?.toString() ?? json['actionLabel']?.toString() ?? '';

    return CarbonBrushPoint(
      pointKey: json['pointKey']?.toString() ?? '',
      currentValue: curVal,
      countdownDays: countdown,
      estimatedReplacementDate: json['estimatedReplacementDate']?.toString() ?? '',
      lastInspectionDate: json['lastInspectionDate']?.toString() ?? '',
      medianWearRate: wearRate,
      thresholdLow: tLow,
      thresholdHigh: tHigh,
      actionLabel: action,
      severity: curVal < tLow ? 'urgent' : (curVal < tHigh ? 'warning' : 'normal'),
    );
  }
}

class CarbonBrushItem {
  final String equipment;
  final String statusLimit;
  final String estimasi;
  final String tanggalUkur;
  final String nilai;
  final String keterangan;
  final List<CarbonBrushPoint> points;
  final String equipmentKey;
  final double thresholdLow;
  final double thresholdHigh;
  final String thresholdLegend;

  CarbonBrushItem({
    required this.equipment,
    required this.statusLimit,
    required this.estimasi,
    required this.tanggalUkur,
    required this.nilai,
    required this.keterangan,
    this.points = const [],
    this.equipmentKey = '',
    this.thresholdLow = 30.0,
    this.thresholdHigh = 34.0,
    this.thresholdLegend = 'Tuban 3: Merah < 30.0 | Kuning 30.0-33.99 | Hijau >= 34.0',
  });

  factory CarbonBrushItem.fromJson(Map<String, dynamic> json) {
    return CarbonBrushItem(
      equipment: json['equipment']?.toString() ?? json['nama']?.toString() ?? '',
      statusLimit: json['status']?.toString() ?? 'DEKAT LIMIT',
      estimasi: json['estimasi']?.toString() ?? '15 Sep 2026 (10 hari)',
      tanggalUkur: json['tanggal_ukur']?.toString() ?? '20 Agu 2026',
      nilai: json['nilai']?.toString() ?? '32.5 mm',
      keterangan: json['keterangan']?.toString() ?? 'Dekat limit | Tuban 3 limit merah < 30 mm',
    );
  }

  factory CarbonBrushItem.fromAlert(Map<String, dynamic> json) {
    final equip = json['equipment']?.toString() ?? '';
    final count = json['totalAlertPointCount'] ?? 1;
    final tLow = (json['thresholdLow'] is num) ? (json['thresholdLow'] as num).toDouble() : 30.0;
    final tHigh = (json['thresholdHigh'] is num) ? (json['thresholdHigh'] as num).toDouble() : 34.0;
    final tLegend = json['thresholdLegend']?.toString() ?? 'Tuban 3: Merah < 30.0 | Kuning 30.0-33.99 | Hijau >= 34.0';

    final pointsList = <CarbonBrushPoint>[];
    if (json['displayAlertPoints'] is List) {
      for (final p in json['displayAlertPoints']) {
        if (p is Map<String, dynamic>) {
          pointsList.add(CarbonBrushPoint.fromJson(p));
        }
      }
    }
    if (json['secondaryAlertPoints'] is List) {
      for (final p in json['secondaryAlertPoints']) {
        if (p is Map<String, dynamic>) {
          if (!pointsList.any((e) => e.pointKey == p['pointKey']?.toString())) {
            pointsList.add(CarbonBrushPoint.fromJson(p));
          }
        }
      }
    }

    final first = pointsList.isNotEmpty ? pointsList.first : null;
    final pointKey = first?.pointKey ?? json['pointKey']?.toString() ?? 'F4';
    final currentVal = first != null
        ? first.currentValue.toStringAsFixed(2)
        : (json['currentValue'] != null ? (json['currentValue'] as num).toStringAsFixed(2) : '32.50');
    final estDate = first?.estimatedReplacementDate ?? json['estimatedReplacementDate']?.toString() ?? '15 Sep 2026';
    final days = first?.countdownDays.toString() ?? json['countdownDays']?.toString() ?? '10';
    final lastInsp = first?.lastInspectionDate ?? json['lastInspectionDate']?.toString() ?? '20 Agu 2026';

    final numVal = double.tryParse(currentVal) ?? 32.5;
    final isCritical = numVal < tLow;
    final statusText = isCritical ? "$count TITIK KRITIS" : "$count TITIK DEKAT LIMIT";
    final ket = isCritical
        ? "Kritis (< ${tLow.toStringAsFixed(0)} mm) | Segera lakukan penggantian"
        : "Dekat limit | Ambang batas ${tLow.toStringAsFixed(0)}-${(tHigh - 0.01).toStringAsFixed(2)} mm";

    return CarbonBrushItem(
      equipment: equip,
      statusLimit: statusText,
      estimasi: "$estDate ($days hari)",
      tanggalUkur: "$lastInsp | $pointKey = $currentVal mm",
      nilai: "$currentVal mm",
      keterangan: ket,
      points: pointsList,
      equipmentKey: json['equipmentKey']?.toString() ?? '',
      thresholdLow: tLow,
      thresholdHigh: tHigh,
      thresholdLegend: tLegend,
    );
  }
}

class NegatifItem {
  final String id;
  final String equipment;
  final String temuan;
  final String status;
  final String statusTambahan;
  final String area;
  final String followUpPlan;
  final String foundDate;
  final String pendingMark;
  final String category;

  NegatifItem({
    required this.id,
    required this.equipment,
    required this.temuan,
    required this.status,
    required this.statusTambahan,
    required this.area,
    this.followUpPlan = '',
    this.foundDate = '',
    this.pendingMark = '',
    this.category = '',
  });

  bool get isOpen => status.toUpperCase() == 'OPEN';

  factory NegatifItem.fromJson(Map<String, dynamic> json) {
    return NegatifItem(
      id: json['id']?.toString() ?? '',
      equipment: json['equipment']?.toString() ?? '',
      temuan: json['damageDescription']?.toString() ?? json['temuan']?.toString() ?? json['deskripsi']?.toString() ?? '',
      status: json['workStatus']?.toString() ?? json['status']?.toString() ?? 'OPEN',
      statusTambahan: json['pendingMark']?.toString() ?? json['followUpPlan']?.toString() ?? json['status_tambahan']?.toString() ?? '',
      area: json['area']?.toString() ?? '',
      followUpPlan: json['followUpPlan']?.toString() ?? '',
      foundDate: json['foundDate']?.toString() ?? '',
      pendingMark: json['pendingMark']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
    );
  }
}

class SparepartItem {
  final String id;
  final String kode;
  final String nama;
  final int stok;
  final String satuan;
  final String lokasi;

  SparepartItem({
    required this.id,
    required this.kode,
    required this.nama,
    required this.stok,
    required this.satuan,
    required this.lokasi,
  });

  factory SparepartItem.fromJson(Map<String, dynamic> json) {
    return SparepartItem(
      id: json['id']?.toString() ?? '',
      kode: json['kode']?.toString() ?? json['part_number']?.toString() ?? '',
      nama: json['nama']?.toString() ?? json['description']?.toString() ?? '',
      stok: json['stok'] is int ? json['stok'] : int.tryParse(json['stok'].toString()) ?? 0,
      satuan: json['satuan']?.toString() ?? 'PCS',
      lokasi: json['lokasi']?.toString() ?? '',
    );
  }
}

class OvertimeItem {
  final String employeeNo;
  final String employeeName;
  final String groupType;
  final String companyName;
  final double monthRawHours;
  final double monthLiveHours;
  final double contractLiveHours;
  final double annualRemainingHours;
  final double annualUsagePercent;
  final String quotaStatus;
  final String monthStatus;
  final String workDate;
  final String task;

  OvertimeItem({
    required this.employeeNo,
    required this.employeeName,
    required this.groupType,
    required this.companyName,
    required this.monthRawHours,
    required this.monthLiveHours,
    required this.contractLiveHours,
    required this.annualRemainingHours,
    required this.annualUsagePercent,
    required this.quotaStatus,
    required this.monthStatus,
    this.workDate = '',
    this.task = '',
  });

  factory OvertimeItem.fromJson(Map<String, dynamic> json) {
    final mRaw = (json['monthRawHours'] is num) ? (json['monthRawHours'] as num).toDouble() : (double.tryParse(json['rawHours']?.toString() ?? '0') ?? 0.0);
    final mLive = (json['monthLiveHours'] is num) ? (json['monthLiveHours'] as num).toDouble() : (double.tryParse(json['liveHours']?.toString() ?? '0') ?? 0.0);
    final cLive = (json['contractLiveHours'] is num) ? (json['contractLiveHours'] as num).toDouble() : mLive;
    final remaining = (json['annualRemainingHours'] is num) ? (json['annualRemainingHours'] as num).toDouble() : 0.0;
    final usage = (json['annualUsagePercent'] is num) ? (json['annualUsagePercent'] as num).toDouble() : 0.0;

    final qStatus = json['quotaStatus'] is Map ? (json['quotaStatus']['label']?.toString() ?? 'Normal') : (json['quotaStatus']?.toString() ?? 'Normal');
    final mStatus = json['monthStatus'] is Map ? (json['monthStatus']['label']?.toString() ?? 'Normal') : (json['monthStatus']?.toString() ?? 'Normal');

    return OvertimeItem(
      employeeNo: json['employeeNo']?.toString() ?? '',
      employeeName: json['employeeName']?.toString() ?? '',
      groupType: json['groupType']?.toString() ?? 'Teknisi',
      companyName: json['companyName']?.toString() ?? 'PT SBG',
      monthRawHours: mRaw,
      monthLiveHours: mLive,
      contractLiveHours: cLive,
      annualRemainingHours: remaining,
      annualUsagePercent: usage,
      quotaStatus: qStatus,
      monthStatus: mStatus,
      workDate: json['workDate']?.toString() ?? '',
      task: json['task']?.toString() ?? '',
    );
  }
}

class CarbonBrushStockItem {
  final String stockKey;
  final String sapNo;
  final String brushName;
  final String useLabel;
  final int currentStock;
  final String updatedAt;

  CarbonBrushStockItem({
    required this.stockKey,
    required this.sapNo,
    required this.brushName,
    required this.useLabel,
    required this.currentStock,
    this.updatedAt = '',
  });

  String get displayName => '$brushName ($sapNo)';
  String get optionLabel => '$sapNo | $brushName | Stok: $currentStock pcs${useLabel.isNotEmpty ? ' | $useLabel' : ''}';

  factory CarbonBrushStockItem.fromJson(Map<String, dynamic> json) {
    return CarbonBrushStockItem(
      stockKey: json['stockKey']?.toString() ?? '${json['sapNo']}|${json['brushName']}',
      sapNo: json['sapNo']?.toString() ?? '',
      brushName: json['brushName']?.toString() ?? json['name']?.toString() ?? '',
      useLabel: json['useLabel']?.toString() ?? json['use']?.toString() ?? '',
      currentStock: (json['currentStock'] is num)
          ? (json['currentStock'] as num).toInt()
          : int.tryParse(json['currentStock']?.toString() ?? '0') ?? 0,
      updatedAt: json['updatedAt']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'stockKey': stockKey,
      'sapNo': sapNo,
      'brushName': brushName,
      'useLabel': useLabel,
      'currentStock': currentStock,
      'updatedAt': updatedAt,
    };
  }

  CarbonBrushStockItem copyWith({int? currentStock, String? updatedAt}) {
    return CarbonBrushStockItem(
      stockKey: stockKey,
      sapNo: sapNo,
      brushName: brushName,
      useLabel: useLabel,
      currentStock: currentStock ?? this.currentStock,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  static List<CarbonBrushStockItem> defaultItems() {
    return [
      CarbonBrushStockItem(
        stockKey: 'SI00028389|RC53 50X32X25',
        sapNo: 'SI00028389',
        brushName: 'RC53 50X32X25',
        useLabel: '344RM01M01 - ABB, 344FN03M01 - ABB',
        currentStock: 36,
      ),
      CarbonBrushStockItem(
        stockKey: 'SI00005550|RC73/MR7 50X32X25',
        sapNo: 'SI00005550',
        brushName: 'RC73/MR7 50X32X25',
        useLabel: '343RM1M01 - SIEMENS, 343FN4M01 - SIEMENS, 343FN5M01 - SIEMENS',
        currentStock: 24,
      ),
      CarbonBrushStockItem(
        stockKey: 'SI00028394|RC67 50X32X25',
        sapNo: 'SI00028394',
        brushName: 'RC67 50X32X25',
        useLabel: '344RM01M01',
        currentStock: 18,
      ),
      CarbonBrushStockItem(
        stockKey: 'SI00005549|RC73 50X32X20',
        sapNo: 'SI00005549',
        brushName: 'RC73 50X32X20',
        useLabel: '343RM1M01 - ABB',
        currentStock: 12,
      ),
    ];
  }
}

class CarbonBrushStockLogItem {
  final String id;
  final String stockKey;
  final String sapNo;
  final String brushName;
  final String movementType;
  final int quantityDelta;
  final int stockBefore;
  final int stockAfter;
  final String source;
  final String serviceId;
  final String equipmentName;
  final List<String> pointKeys;
  final String note;
  final String actorUsername;
  final String createdAt;

  CarbonBrushStockLogItem({
    required this.id,
    required this.stockKey,
    required this.sapNo,
    required this.brushName,
    required this.movementType,
    required this.quantityDelta,
    required this.stockBefore,
    required this.stockAfter,
    this.source = '',
    this.serviceId = '',
    this.equipmentName = '',
    this.pointKeys = const [],
    this.note = '',
    this.actorUsername = '',
    this.createdAt = '',
  });

  String get movementLabel {
    switch (movementType.toLowerCase()) {
      case 'in':
        return 'Tambah';
      case 'adjust':
        return 'Koreksi';
      case 'out':
        return 'Service';
      case 'return':
        return 'Return';
      default:
        return movementType;
    }
  }

  factory CarbonBrushStockLogItem.fromJson(Map<String, dynamic> json) {
    final points = json['pointKeys'] is List
        ? (json['pointKeys'] as List).map((e) => e.toString()).toList()
        : <String>[];
    return CarbonBrushStockLogItem(
      id: json['id']?.toString() ?? '',
      stockKey: json['stockKey']?.toString() ?? '',
      sapNo: json['sapNo']?.toString() ?? '',
      brushName: json['brushName']?.toString() ?? '',
      movementType: json['movementType']?.toString() ?? 'in',
      quantityDelta: (json['quantityDelta'] is num)
          ? (json['quantityDelta'] as num).toInt()
          : int.tryParse(json['quantityDelta']?.toString() ?? '0') ?? 0,
      stockBefore: (json['stockBefore'] is num)
          ? (json['stockBefore'] as num).toInt()
          : int.tryParse(json['stockBefore']?.toString() ?? '0') ?? 0,
      stockAfter: (json['stockAfter'] is num)
          ? (json['stockAfter'] as num).toInt()
          : int.tryParse(json['stockAfter']?.toString() ?? '0') ?? 0,
      source: json['source']?.toString() ?? '',
      serviceId: json['serviceId']?.toString() ?? '',
      equipmentName: json['equipmentName']?.toString() ?? '',
      pointKeys: points,
      note: json['note']?.toString() ?? '',
      actorUsername: json['actorUsername']?.toString() ?? '',
      createdAt: json['createdAt']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'stockKey': stockKey,
      'sapNo': sapNo,
      'brushName': brushName,
      'movementType': movementType,
      'quantityDelta': quantityDelta,
      'stockBefore': stockBefore,
      'stockAfter': stockAfter,
      'source': source,
      'serviceId': serviceId,
      'equipmentName': equipmentName,
      'pointKeys': pointKeys,
      'note': note,
      'actorUsername': actorUsername,
      'createdAt': createdAt,
    };
  }
}

class SapEquipmentItem {
  final String equipmentId;
  final String tagNo;
  final String description;
  final String discipline;
  final String disciplineName;
  final String category;
  final String plantCode;
  final String plantName;
  final String areaCode;
  final String areaName;
  final String flocCode;
  final String? parentEquipmentId;
  final bool isMainEquipment;
  final int subEquipmentCount;

  SapEquipmentItem({
    required this.equipmentId,
    required this.tagNo,
    required this.description,
    this.discipline = '',
    this.disciplineName = '',
    this.category = '',
    this.plantCode = '',
    this.plantName = '',
    this.areaCode = '',
    this.areaName = '',
    this.flocCode = '',
    this.parentEquipmentId,
    this.isMainEquipment = false,
    this.subEquipmentCount = 0,
  });

  String get displayName => tagNo.isNotEmpty ? '$tagNo - $description' : description;

  factory SapEquipmentItem.fromJson(Map<String, dynamic> json) {
    return SapEquipmentItem(
      equipmentId: json['equipment_id']?.toString() ?? '',
      tagNo: json['tag_no']?.toString() ?? '',
      description: json['description']?.toString() ?? '',
      discipline: json['discipline']?.toString() ?? '',
      disciplineName: json['discipline_name']?.toString() ?? '',
      category: json['category']?.toString() ?? '',
      plantCode: json['plant_code']?.toString() ?? '',
      plantName: json['plant_name']?.toString() ?? '',
      areaCode: json['area_code']?.toString() ?? '',
      areaName: json['area_name']?.toString() ?? '',
      flocCode: json['floc_code']?.toString() ?? '',
      parentEquipmentId: json['parent_equipment_id']?.toString(),
      isMainEquipment: json['is_main_equipment'] == 1 || json['is_main_equipment'] == true,
      subEquipmentCount: json['sub_equipment_count'] is int
          ? json['sub_equipment_count'] as int
          : int.tryParse(json['sub_equipment_count']?.toString() ?? '0') ?? 0,
    );
  }

  Map<String, dynamic> toJson() => {
    'equipment_id': equipmentId,
    'tag_no': tagNo,
    'description': description,
    'discipline': discipline,
    'discipline_name': disciplineName,
    'category': category,
    'plant_code': plantCode,
    'plant_name': plantName,
    'area_code': areaCode,
    'area_name': areaName,
    'floc_code': flocCode,
    'parent_equipment_id': parentEquipmentId,
    'is_main_equipment': isMainEquipment ? 1 : 0,
    'sub_equipment_count': subEquipmentCount,
  };
}
