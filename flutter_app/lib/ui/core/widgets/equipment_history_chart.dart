import 'package:flutter/material.dart';
import '../../../core/constants/app_constants.dart';

class HistoryDataPoint {
  final String dateLabel;
  final double value; // in mm
  final String? note;

  const HistoryDataPoint({
    required this.dateLabel,
    required this.value,
    this.note,
  });
}

class EquipmentHistoryChart extends StatefulWidget {
  final String equipmentName;
  final String? initialPointKey;
  final Map<String, List<HistoryDataPoint>>? customPointHistory;
  final double thresholdLow;
  final double thresholdHigh;
  final String thresholdLegend;

  const EquipmentHistoryChart({
    super.key,
    required this.equipmentName,
    this.initialPointKey,
    this.customPointHistory,
    this.thresholdLow = 30.0,
    this.thresholdHigh = 34.0,
    this.thresholdLegend = 'Tuban 3: Merah < 30.0 mm | Hijau ≥ 34.0 mm',
  });

  @override
  State<EquipmentHistoryChart> createState() => _EquipmentHistoryChartState();
}

class _EquipmentHistoryChartState extends State<EquipmentHistoryChart> {
  late String _selectedPointKey;
  int? _selectedPointIndex;

  // Default historical wear progression for standard motor MV (e.g. 343FN4M01)
  static final Map<String, List<HistoryDataPoint>> _defaultMotorHistory = {
    'F4': [
      const HistoryDataPoint(dateLabel: '07 Apr', value: 45.30, note: 'Inspeksi berkala'),
      const HistoryDataPoint(dateLabel: '13 Mei', value: 42.00, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '19 Jun', value: 38.72, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '16 Jul', value: 35.98, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '20 Agu', value: 32.52, note: 'Dekat limit!'),
    ],
    'E4': [
      const HistoryDataPoint(dateLabel: '07 Apr', value: 44.80, note: 'Inspeksi berkala'),
      const HistoryDataPoint(dateLabel: '13 Mei', value: 41.50, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '19 Jun', value: 37.90, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '16 Jul', value: 35.20, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '20 Agu', value: 33.10, note: 'Perlu pantauan'),
    ],
    'F3': [
      const HistoryDataPoint(dateLabel: '07 Apr', value: 46.00, note: 'Inspeksi berkala'),
      const HistoryDataPoint(dateLabel: '13 Mei', value: 43.10, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '19 Jun', value: 40.20, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '16 Jul', value: 37.50, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '20 Agu', value: 34.80, note: 'Aman'),
    ],
    'E6': [
      const HistoryDataPoint(dateLabel: '07 Apr', value: 45.50, note: 'Inspeksi berkala'),
      const HistoryDataPoint(dateLabel: '13 Mei', value: 42.80, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '19 Jun', value: 39.50, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '16 Jul', value: 36.80, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '20 Agu', value: 34.10, note: 'Aman'),
    ],
    'C6': [
      const HistoryDataPoint(dateLabel: '07 Apr', value: 47.00, note: 'Inspeksi berkala'),
      const HistoryDataPoint(dateLabel: '13 Mei', value: 44.20, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '19 Jun', value: 41.00, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '16 Jul', value: 38.40, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '20 Agu', value: 35.60, note: 'Aman'),
    ],
    'D2': [
      const HistoryDataPoint(dateLabel: '07 Apr', value: 46.50, note: 'Inspeksi berkala'),
      const HistoryDataPoint(dateLabel: '13 Mei', value: 43.90, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '19 Jun', value: 40.80, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '16 Jul', value: 38.00, note: 'Normal'),
      const HistoryDataPoint(dateLabel: '20 Agu', value: 35.20, note: 'Aman'),
    ],
  };

  @override
  void initState() {
    super.initState();
    final history = widget.customPointHistory ?? _defaultMotorHistory;
    if (widget.initialPointKey != null && history.containsKey(widget.initialPointKey)) {
      _selectedPointKey = widget.initialPointKey!;
    } else if (history.isNotEmpty) {
      _selectedPointKey = history.keys.first;
    } else {
      _selectedPointKey = 'F4';
    }
  }

  @override
  Widget build(BuildContext context) {
    final history = widget.customPointHistory ?? _defaultMotorHistory;
    final points = history[_selectedPointKey] ?? [];
    final availableKeys = history.keys.toList();

    final lastPoint = points.isNotEmpty ? points.last : null;
    final selectedOrLast = _selectedPointIndex != null && _selectedPointIndex! < points.length
        ? points[_selectedPointIndex!]
        : lastPoint;

    // Calculate wear rate if we have multiple points
    double? wearRate;
    if (points.length >= 2) {
      final drop = points.first.value - points.last.value;
      // approx 135 days between Apr 7 and Aug 20
      wearRate = drop / 135.0;
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppConstants.cardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppConstants.primaryTeal.withValues(alpha: 0.3)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header: Title & Equipment
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.show_chart, color: AppConstants.primaryTeal, size: 20),
                        SizedBox(width: 8),
                        Text(
                          'TREN HISTORICAL KEAUSAN',
                          style: TextStyle(
                            color: AppConstants.primaryTeal,
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.1,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      widget.equipmentName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ),
              ),
              // Point selector chip
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppConstants.surfaceDark,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: AppConstants.primaryTeal.withValues(alpha: 0.5)),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: availableKeys.contains(_selectedPointKey) ? _selectedPointKey : availableKeys.first,
                    dropdownColor: AppConstants.surfaceDark,
                    isDense: true,
                    icon: const Icon(Icons.arrow_drop_down, color: AppConstants.primaryTeal, size: 20),
                    style: const TextStyle(
                      color: AppConstants.accentCyan,
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                    ),
                    items: availableKeys.map((key) {
                      return DropdownMenuItem<String>(
                        value: key,
                        child: Text('Titik $key'),
                      );
                    }).toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() {
                          _selectedPointKey = val;
                          _selectedPointIndex = null;
                        });
                      }
                    },
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Point Selection Pills for quick access
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: availableKeys.map((key) {
                final isSelected = key == _selectedPointKey;
                final keyPoints = history[key] ?? [];
                final lastVal = keyPoints.isNotEmpty ? keyPoints.last.value : 40.0;
                final isNearLimit = lastVal < widget.thresholdHigh;

                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: ChoiceChip(
                    label: Text('$key (${lastVal.toStringAsFixed(1)}mm)'),
                    selected: isSelected,
                    selectedColor: AppConstants.primaryTeal.withValues(alpha: 0.3),
                    backgroundColor: AppConstants.surfaceDark,
                    labelStyle: TextStyle(
                      fontSize: 11,
                      fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                      color: isSelected
                          ? AppConstants.accentCyan
                          : (isNearLimit ? AppConstants.warningYellow : Colors.white70),
                    ),
                    side: BorderSide(
                      color: isSelected
                          ? AppConstants.primaryTeal
                          : (isNearLimit ? AppConstants.warningYellow.withValues(alpha: 0.5) : Colors.white12),
                    ),
                    onSelected: (selected) {
                      if (selected) {
                        setState(() {
                          _selectedPointKey = key;
                          _selectedPointIndex = null;
                        });
                      }
                    },
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),

          // Chart Display Area
          SizedBox(
            height: 190,
            width: double.infinity,
            child: GestureDetector(
              onTapUp: (details) {
                if (points.isEmpty) return;
                // Calculate which point was clicked based on x position
                final RenderBox box = context.findRenderObject() as RenderBox;
                final localPos = details.localPosition;
                final chartWidth = box.size.width - 32; // padding
                final segmentWidth = chartWidth / (points.length > 1 ? points.length - 1 : 1);
                final clickedIndex = ((localPos.dx - 40) / segmentWidth).round().clamp(0, points.length - 1);
                setState(() {
                  _selectedPointIndex = clickedIndex;
                });
              },
              child: CustomPaint(
                painter: _ChartPainter(
                  points: points,
                  thresholdLow: widget.thresholdLow,
                  thresholdHigh: widget.thresholdHigh,
                  selectedIndex: _selectedPointIndex,
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),

          // Threshold Legends
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 12,
                    height: 3,
                    color: AppConstants.alertRed,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'Limit (< ${widget.thresholdLow.toStringAsFixed(0)}mm)',
                    style: const TextStyle(color: AppConstants.alertRed, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Row(
                children: [
                  Container(
                    width: 12,
                    height: 3,
                    color: AppConstants.warningYellow,
                  ),
                  const SizedBox(width: 4),
                  const Text(
                    'Waspada (30-34mm)',
                    style: TextStyle(color: AppConstants.warningYellow, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
              Row(
                children: [
                  Container(
                    width: 12,
                    height: 3,
                    color: AppConstants.successGreen,
                  ),
                  const SizedBox(width: 4),
                  const Text(
                    'Normal (≥ 34mm)',
                    style: TextStyle(color: AppConstants.successGreen, fontSize: 10, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Point Inspection Details Card
          if (selectedOrLast != null)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppConstants.surfaceDark,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(
                  color: selectedOrLast.value < widget.thresholdLow
                      ? AppConstants.alertRed.withValues(alpha: 0.6)
                      : (selectedOrLast.value < widget.thresholdHigh
                          ? AppConstants.warningYellow.withValues(alpha: 0.6)
                          : AppConstants.primaryTeal.withValues(alpha: 0.4)),
                ),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    decoration: BoxDecoration(
                      color: selectedOrLast.value < widget.thresholdLow
                          ? AppConstants.alertRed.withValues(alpha: 0.2)
                          : (selectedOrLast.value < widget.thresholdHigh
                              ? AppConstants.warningYellow.withValues(alpha: 0.2)
                              : AppConstants.successGreen.withValues(alpha: 0.2)),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      children: [
                        Text(
                          _selectedPointKey,
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14),
                        ),
                        Text(
                          '${selectedOrLast.value.toStringAsFixed(2)} mm',
                          style: TextStyle(
                            color: selectedOrLast.value < widget.thresholdLow
                                ? AppConstants.alertRed
                                : (selectedOrLast.value < widget.thresholdHigh
                                    ? AppConstants.warningYellow
                                    : AppConstants.successGreen),
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Inspeksi: ${selectedOrLast.dateLabel}',
                              style: const TextStyle(color: Colors.white70, fontSize: 12),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: selectedOrLast.value < widget.thresholdLow
                                    ? AppConstants.alertRed
                                    : (selectedOrLast.value < widget.thresholdHigh
                                        ? AppConstants.warningYellow
                                        : AppConstants.successGreen),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                selectedOrLast.value < widget.thresholdLow
                                    ? 'URGENT'
                                    : (selectedOrLast.value < widget.thresholdHigh ? 'DEKAT LIMIT' : 'NORMAL'),
                                style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 9),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          wearRate != null
                              ? 'Laju aus: ${wearRate.toStringAsFixed(4)} mm/hari • Est. habis: 10 hari'
                              : (selectedOrLast.note ?? 'Data historis motor'),
                          style: TextStyle(
                            color: AppConstants.accentCyan.withValues(alpha: 0.9),
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

class _ChartPainter extends CustomPainter {
  final List<HistoryDataPoint> points;
  final double thresholdLow;
  final double thresholdHigh;
  final int? selectedIndex;

  _ChartPainter({
    required this.points,
    required this.thresholdLow,
    required this.thresholdHigh,
    this.selectedIndex,
  });

  @override
  void paint(Canvas canvas, Size size) {
    if (points.isEmpty) return;

    const leftPadding = 38.0;
    const rightPadding = 16.0;
    const topPadding = 16.0;
    const bottomPadding = 28.0;

    final drawWidth = size.width - leftPadding - rightPadding;
    final drawHeight = size.height - topPadding - bottomPadding;

    // Y Axis Scale: from 25.0 mm to 50.0 mm
    const minY = 25.0;
    const maxY = 50.0;

    double getYPos(double val) {
      final ratio = (val - minY) / (maxY - minY);
      return (topPadding + drawHeight) - (ratio.clamp(0.0, 1.0) * drawHeight);
    }

    double getXPos(int index) {
      if (points.length <= 1) return leftPadding + (drawWidth / 2);
      return leftPadding + (index / (points.length - 1)) * drawWidth;
    }

    // 1. Draw horizontal grid lines & Y labels (30, 35, 40, 45, 50 mm)
    final gridPaint = Paint()
      ..color = Colors.white.withValues(alpha: 0.08)
      ..strokeWidth = 1.0;

    final textPainter = TextPainter(textDirection: TextDirection.ltr);

    for (final val in [30.0, 35.0, 40.0, 45.0, 50.0]) {
      final y = getYPos(val);
      canvas.drawLine(Offset(leftPadding, y), Offset(size.width - rightPadding, y), gridPaint);

      textPainter.text = TextSpan(
        text: '${val.toInt()} mm',
        style: TextStyle(
          color: Colors.white.withValues(alpha: 0.4),
          fontSize: 9,
          fontWeight: FontWeight.w500,
        ),
      );
      textPainter.layout();
      textPainter.paint(canvas, Offset(4, y - 6));
    }

    // 2. Draw Threshold Lines
    // Red threshold (30.0 mm)
    final redY = getYPos(thresholdLow);
    final redPaint = Paint()
      ..color = AppConstants.alertRed.withValues(alpha: 0.7)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    _drawDashedLine(canvas, Offset(leftPadding, redY), Offset(size.width - rightPadding, redY), redPaint);

    // Green/Yellow threshold (34.0 mm)
    final highY = getYPos(thresholdHigh);
    final highPaint = Paint()
      ..color = AppConstants.warningYellow.withValues(alpha: 0.7)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    _drawDashedLine(canvas, Offset(leftPadding, highY), Offset(size.width - rightPadding, highY), highPaint);

    // 3. Draw gradient area under the curve
    final path = Path();
    final fillPath = Path();

    for (int i = 0; i < points.length; i++) {
      final x = getXPos(i);
      final y = getYPos(points[i].value);

      if (i == 0) {
        path.moveTo(x, y);
        fillPath.moveTo(x, topPadding + drawHeight);
        fillPath.lineTo(x, y);
      } else {
        path.lineTo(x, y);
        fillPath.lineTo(x, y);
      }
    }

    fillPath.lineTo(getXPos(points.length - 1), topPadding + drawHeight);
    fillPath.close();

    final fillGradient = LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [
        AppConstants.primaryTeal.withValues(alpha: 0.35),
        AppConstants.primaryTeal.withValues(alpha: 0.0),
      ],
    );

    final fillPaint = Paint()
      ..shader = fillGradient.createShader(Rect.fromLTWH(leftPadding, topPadding, drawWidth, drawHeight))
      ..style = PaintingStyle.fill;

    canvas.drawPath(fillPath, fillPaint);

    // 4. Draw Trend Line with subtle neon glow
    final glowPaint = Paint()
      ..color = AppConstants.primaryTeal.withValues(alpha: 0.4)
      ..strokeWidth = 5.0
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, glowPaint);

    final linePaint = Paint()
      ..color = AppConstants.accentCyan
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, linePaint);

    // 5. Draw Points and X-Axis Labels
    for (int i = 0; i < points.length; i++) {
      final x = getXPos(i);
      final y = getYPos(points[i].value);
      final val = points[i].value;
      final isSelected = selectedIndex == i;

      // Color coding per point value
      Color pointColor = AppConstants.successGreen;
      if (val < thresholdLow) {
        pointColor = AppConstants.alertRed;
      } else if (val < thresholdHigh) {
        pointColor = AppConstants.warningYellow;
      }

      // Outer ring if selected
      if (isSelected) {
        canvas.drawCircle(
          Offset(x, y),
          9,
          Paint()..color = pointColor.withValues(alpha: 0.3),
        );
      }

      // White outline
      canvas.drawCircle(
        Offset(x, y),
        isSelected ? 6.5 : 5.0,
        Paint()..color = Colors.white,
      );

      // Core point
      canvas.drawCircle(
        Offset(x, y),
        isSelected ? 4.5 : 3.5,
        Paint()..color = pointColor,
      );

      // Value label on top of point
      textPainter.text = TextSpan(
        text: val.toStringAsFixed(1),
        style: TextStyle(
          color: isSelected ? Colors.white : Colors.white70,
          fontSize: 9,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      );
      textPainter.layout();
      textPainter.paint(canvas, Offset(x - (textPainter.width / 2), y - 16));

      // Date label on bottom
      textPainter.text = TextSpan(
        text: points[i].dateLabel,
        style: TextStyle(
          color: isSelected ? AppConstants.accentCyan : Colors.white54,
          fontSize: 9,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      );
      textPainter.layout();
      textPainter.paint(canvas, Offset(x - (textPainter.width / 2), topPadding + drawHeight + 6));
    }
  }

  void _drawDashedLine(Canvas canvas, Offset p1, Offset p2, Paint paint) {
    const dashWidth = 4.0;
    const dashSpace = 4.0;
    double currentX = p1.dx;
    while (currentX < p2.dx) {
      final nextX = (currentX + dashWidth).clamp(p1.dx, p2.dx);
      canvas.drawLine(Offset(currentX, p1.dy), Offset(nextX, p1.dy), paint);
      currentX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant _ChartPainter oldDelegate) {
    return oldDelegate.points != points ||
        oldDelegate.thresholdLow != thresholdLow ||
        oldDelegate.thresholdHigh != thresholdHigh ||
        oldDelegate.selectedIndex != selectedIndex;
  }
}
