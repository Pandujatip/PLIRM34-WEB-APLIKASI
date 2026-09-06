import 'package:flutter/material.dart';
import 'models.dart';

enum EquipmentType {
  crusher,
  rawmill,
  coalmill,
  preheater,
  kiln,
  cooler,
  finishmill,
  packer,
}

enum HealthStatus {
  normal,
  warning,
  critical,
  offline,
}

class PlantEquipmentNode {
  final EquipmentType type;
  final int stepOrder; // 1 to 8
  final String code;
  final String title;
  final String subtitle;
  final String area;
  final double healthScore; // 0 to 100
  final HealthStatus status;
  final String statusLabel;
  final String metricValue;
  final String metricLabel;
  final String carbonBrushSummary;
  final double? lowestCbVal;
  final int openNegatifCount;
  final List<NegatifItem> openNegatifItems;
  final String lastServiceDate;
  final String lastServiceTindakan;
  final double vibration;
  final double bearingTemp;
  final double motorCurrent;

  const PlantEquipmentNode({
    required this.type,
    required this.stepOrder,
    required this.code,
    required this.title,
    required this.subtitle,
    required this.area,
    required this.healthScore,
    required this.status,
    required this.statusLabel,
    required this.metricValue,
    required this.metricLabel,
    this.carbonBrushSummary = 'Normal / Aman',
    this.lowestCbVal,
    this.openNegatifCount = 0,
    this.openNegatifItems = const [],
    this.lastServiceDate = '-',
    this.lastServiceTindakan = '-',
    this.vibration = 2.4,
    this.bearingTemp = 64.0,
    this.motorCurrent = 85.0,
  });

  Color get statusColor {
    switch (status) {
      case HealthStatus.normal:
        return const Color(0xFF00E676); // Neon Green
      case HealthStatus.warning:
        return const Color(0xFFFFB300); // Amber Warning
      case HealthStatus.critical:
        return const Color(0xFFFF1744); // Red Critical
      case HealthStatus.offline:
        return const Color(0xFF64748B); // Slate Grey
    }
  }

  Color get badgeBgColor => statusColor.withValues(alpha: 0.18);
  Color get badgeBorderColor => statusColor.withValues(alpha: 0.45);

  /// Helper untuk menghasilkan 8 node main equipment yang teragregasi dengan data aktual
  static List<PlantEquipmentNode> generatePlantNodes({
    required String selectedArea,
    required List<CarbonBrushItem> carbonBrushes,
    required List<NegatifItem> negatifItems,
    required List<ServiceItem> serviceItems,
  }) {
    final areaPrefix = selectedArea.contains("4") ? "344" : "343";

    return [
      _buildNode(
        type: EquipmentType.crusher,
        stepOrder: 1,
        code: "CR",
        title: "CRUSHER LIMESTONE",
        subtitle: "Area Quarry // Primary Jaw & Hammer Crusher",
        area: selectedArea,
        defaultVib: 3.8,
        defaultTemp: 62.5,
        defaultCurrent: 145.0,
        carbonBrushes: carbonBrushes,
        negatifItems: negatifItems,
        serviceItems: serviceItems,
      ),
      _buildNode(
        type: EquipmentType.rawmill,
        stepOrder: 2,
        code: "RM",
        title: "RAW MILL ($areaPrefix-RM1)",
        subtitle: "Vertical Roller Mill // Raw Meal Grinding",
        area: selectedArea,
        defaultVib: 3.2,
        defaultTemp: 68.0,
        defaultCurrent: 210.0,
        carbonBrushes: carbonBrushes,
        negatifItems: negatifItems,
        serviceItems: serviceItems,
      ),
      _buildNode(
        type: EquipmentType.coalmill,
        stepOrder: 3,
        code: "CM",
        title: "COAL MILL ($areaPrefix-CM1)",
        subtitle: "Pulverized Coal Firing System // Suplai Bahan Bakar",
        area: selectedArea,
        defaultVib: 2.1,
        defaultTemp: 58.4,
        defaultCurrent: 68.5,
        carbonBrushes: carbonBrushes,
        negatifItems: negatifItems,
        serviceItems: serviceItems,
      ),
      _buildNode(
        type: EquipmentType.preheater,
        stepOrder: 4,
        code: "PH",
        title: "PREHEATER TOWER",
        subtitle: "5-Stage Suspension Cyclones & Precalciner",
        area: selectedArea,
        defaultVib: 1.8,
        defaultTemp: 840.0,
        defaultCurrent: 185.0,
        carbonBrushes: carbonBrushes,
        negatifItems: negatifItems,
        serviceItems: serviceItems,
      ),
      _buildNode(
        type: EquipmentType.kiln,
        stepOrder: 5,
        code: "KL",
        title: "ROTARY KILN ($areaPrefix-KL1)",
        subtitle: "Tanur Putar Utama Klinkerisasi (1450°C)",
        area: selectedArea,
        defaultVib: 2.7,
        defaultTemp: 74.0,
        defaultCurrent: 310.0,
        carbonBrushes: carbonBrushes,
        negatifItems: negatifItems,
        serviceItems: serviceItems,
      ),
      _buildNode(
        type: EquipmentType.cooler,
        stepOrder: 6,
        code: "CL",
        title: "CLINKER COOLER",
        subtitle: "Grate Cooler Pendingin Klinker Cepat & Heat Recovery",
        area: selectedArea,
        defaultVib: 3.4,
        defaultTemp: 65.2,
        defaultCurrent: 125.0,
        carbonBrushes: carbonBrushes,
        negatifItems: negatifItems,
        serviceItems: serviceItems,
      ),
      _buildNode(
        type: EquipmentType.finishmill,
        stepOrder: 7,
        code: "FM",
        title: "FINISH MILL ($areaPrefix-FM1)",
        subtitle: "Cement Ball Mill & High-Efficiency Separator",
        area: selectedArea,
        defaultVib: 2.5,
        defaultTemp: 71.0,
        defaultCurrent: 280.0,
        carbonBrushes: carbonBrushes,
        negatifItems: negatifItems,
        serviceItems: serviceItems,
      ),
      _buildNode(
        type: EquipmentType.packer,
        stepOrder: 8,
        code: "PK",
        title: "ROTARY PACKER",
        subtitle: "Packing Plant 50kg & Bulk Loading Silo",
        area: selectedArea,
        defaultVib: 1.3,
        defaultTemp: 52.0,
        defaultCurrent: 45.0,
        carbonBrushes: carbonBrushes,
        negatifItems: negatifItems,
        serviceItems: serviceItems,
      ),
    ];
  }

  static PlantEquipmentNode _buildNode({
    required EquipmentType type,
    required int stepOrder,
    required String code,
    required String title,
    required String subtitle,
    required String area,
    required double defaultVib,
    required double defaultTemp,
    required double defaultCurrent,
    required List<CarbonBrushItem> carbonBrushes,
    required List<NegatifItem> negatifItems,
    required List<ServiceItem> serviceItems,
  }) {
    // 1. Filter data terkait berdasarkan code prefix atau nama equipment
    final searchKey = code.toLowerCase();
    final relatedCBs = carbonBrushes.where((cb) {
      final eq = cb.equipment.toLowerCase();
      return eq.contains(searchKey) || _matchesEquipmentType(eq, type);
    }).toList();

    final relatedNegatif = negatifItems.where((neg) {
      final eq = neg.equipment.toLowerCase();
      return eq.contains(searchKey) || _matchesEquipmentType(eq, type);
    }).toList();

    final relatedServices = serviceItems.where((srv) {
      final eq = srv.equipment.toLowerCase();
      return eq.contains(searchKey) || _matchesEquipmentType(eq, type);
    }).toList();

    // 2. Evaluasi kondisi Carbon Brush
    double? lowestCb;
    bool hasCriticalCb = false;
    bool hasWarningCb = false;
    String cbSummary = "Normal / Aman";

    if (relatedCBs.isNotEmpty) {
      for (final cb in relatedCBs) {
        double? currentVal;
        if (cb.points.isNotEmpty) {
          currentVal = cb.points.map((p) => p.currentValue).reduce((a, b) => a < b ? a : b);
        } else {
          final valMatch = RegExp(r'([\d\.]+)').firstMatch(cb.nilai);
          if (valMatch != null) {
            currentVal = double.tryParse(valMatch.group(1) ?? '');
          }
        }

        if (currentVal != null) {
          if (lowestCb == null || currentVal < lowestCb) lowestCb = currentVal;
          if (currentVal < cb.thresholdLow || cb.statusLimit.toLowerCase().contains("kritis")) {
            hasCriticalCb = true;
          } else if (currentVal < cb.thresholdHigh ||
              cb.statusLimit.toLowerCase().contains("dekat limit") ||
              cb.statusLimit.toLowerCase().contains("titik")) {
            hasWarningCb = true;
          }
        } else {
          if (cb.statusLimit.toLowerCase().contains("kritis")) {
            hasCriticalCb = true;
          } else if (cb.statusLimit.toLowerCase().contains("dekat limit") ||
              cb.statusLimit.toLowerCase().contains("titik")) {
            hasWarningCb = true;
          }
        }
      }
      if (hasCriticalCb) {
        cbSummary = "Kritis (< ${relatedCBs.first.thresholdLow.toStringAsFixed(0)} mm)";
      } else if (hasWarningCb) {
        cbSummary = relatedCBs.first.statusLimit;
      }
    }

    // 3. Evaluasi Negatif List Open
    final openNegatif = relatedNegatif.where((n) => n.isOpen).toList();
    final openCount = openNegatif.length;

    // 4. Kalkulasi Skor Kesehatan (0 - 100)
    double score = 100.0;
    if (hasCriticalCb) {
      score -= 35.0;
    } else if (hasWarningCb) {
      score -= 18.0;
    }

    score -= (openCount * 8.0);
    if (score < 30.0) score = 30.0;

    HealthStatus status = HealthStatus.normal;
    String statusLabel = "NORMAL OPERASIONAL";

    if (score < 65.0 || hasCriticalCb) {
      status = HealthStatus.critical;
      statusLabel = "KRITIS (PERBAIKAN)";
    } else if (score < 88.0 || hasWarningCb || openCount > 0) {
      status = HealthStatus.warning;
      statusLabel = "PERHATIAN (WARNING)";
    }

    // 5. Metrik kunci
    String metricVal;
    String metricLbl;
    switch (type) {
      case EquipmentType.crusher:
        metricVal = "${defaultVib.toStringAsFixed(1)} mm/s";
        metricLbl = "Vibrasi";
        break;
      case EquipmentType.rawmill:
        metricVal = hasCriticalCb
            ? "CB Kritis!"
            : (hasWarningCb ? "CB Dekat Limit" : "${defaultCurrent.toStringAsFixed(0)} A");
        metricLbl = (hasCriticalCb || hasWarningCb) ? "Kondisi CB" : "Motor Load";
        break;
      case EquipmentType.coalmill:
        metricVal = "${defaultCurrent.toStringAsFixed(0)} A";
        metricLbl = "Load Mill";
        break;
      case EquipmentType.preheater:
        metricVal = "${defaultTemp.toStringAsFixed(0)} °C";
        metricLbl = "Suhu Gas";
        break;
      case EquipmentType.kiln:
        metricVal = "3.8 RPM";
        metricLbl = "Rotasi";
        break;
      case EquipmentType.cooler:
        metricVal = "7 Fans ON";
        metricLbl = "Cooling Air";
        break;
      case EquipmentType.finishmill:
        metricVal = "195 TPH";
        metricLbl = "Kapasitas";
        break;
      case EquipmentType.packer:
        metricVal = "2400 bph";
        metricLbl = "Speed Bag";
        break;
    }

    // 6. Riwayat Service Terakhir
    String lastSrvDate = "-";
    String lastSrvAct = "-";
    if (relatedServices.isNotEmpty) {
      lastSrvDate = relatedServices.first.tanggal;
      lastSrvAct = relatedServices.first.tindakan.isNotEmpty
          ? relatedServices.first.tindakan
          : relatedServices.first.deskripsi;
    }

    return PlantEquipmentNode(
      type: type,
      stepOrder: stepOrder,
      code: code,
      title: title,
      subtitle: subtitle,
      area: area,
      healthScore: score,
      status: status,
      statusLabel: statusLabel,
      metricValue: metricVal,
      metricLabel: metricLbl,
      carbonBrushSummary: cbSummary,
      lowestCbVal: lowestCb,
      openNegatifCount: openCount,
      openNegatifItems: openNegatif,
      lastServiceDate: lastSrvDate,
      lastServiceTindakan: lastSrvAct,
      vibration: defaultVib,
      bearingTemp: defaultTemp,
      motorCurrent: defaultCurrent,
    );
  }

  static bool _matchesEquipmentType(String text, EquipmentType type) {
    switch (type) {
      case EquipmentType.crusher:
        return text.contains("crusher") || text.contains("quarry") || text.contains("cr");
      case EquipmentType.rawmill:
        return text.contains("raw mill") || text.contains("rawmill") || text.contains("rm1") || text.contains("rm01");
      case EquipmentType.coalmill:
        return text.contains("coal mill") || text.contains("coalmill") || text.contains("cm");
      case EquipmentType.preheater:
        return text.contains("preheater") || text.contains("cyclone") || text.contains("ph");
      case EquipmentType.kiln:
        return text.contains("kiln") || text.contains("tanur") || text.contains("kl");
      case EquipmentType.cooler:
        return text.contains("cooler") || text.contains("clinker") || text.contains("cl");
      case EquipmentType.finishmill:
        return text.contains("finish mill") || text.contains("finishmill") || text.contains("cement mill") || text.contains("fm");
      case EquipmentType.packer:
        return text.contains("packer") || text.contains("packing") || text.contains("silo") || text.contains("pk");
    }
  }
}
