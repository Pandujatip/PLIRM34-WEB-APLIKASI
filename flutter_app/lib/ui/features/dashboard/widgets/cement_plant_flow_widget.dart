import "dart:math" as math;
import "package:flutter/material.dart";
import "../../../../core/constants/app_constants.dart";
import "../../../../core/theme/app_theme.dart";
import "../../../../data/models/models.dart";

/// Widget visualisasi 2D Real Live Aliran Pabrik Semen Terhubung Horizontal
/// untuk Health Monitoring 8 Main Equipment:
/// 1. Crusher
/// 2. Raw Mill
/// 3. Coal Mill (fuel branch ke Preheater & Kiln)
/// 4. Preheater Tower
/// 5. Rotary Kiln
/// 6. Clinker Cooler
/// 7. Finish Mill
/// 8. Rotary Packer
class CementPlantFlowWidget extends StatefulWidget {
  final List<PlantEquipmentNode> nodes;
  final Function(PlantEquipmentNode) onEquipmentTapped;
  final String selectedArea;
  final VoidCallback? onRefresh;

  const CementPlantFlowWidget({
    super.key,
    required this.nodes,
    required this.onEquipmentTapped,
    this.selectedArea = "Tuban 3",
    this.onRefresh,
  });

  @override
  State<CementPlantFlowWidget> createState() => _CementPlantFlowWidgetState();
}

class _CementPlantFlowWidgetState extends State<CementPlantFlowWidget>
    with SingleTickerProviderStateMixin {
  late final AnimationController _animController;
  final ScrollController _scrollController = ScrollController();

  static const double _cardWidth = 142.0;
  static const double _cardHeight = 184.0;
  static const double _cardGap = 38.0;
  static const double _trackPadding = 16.0;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    )..repeat();
  }

  @override
  void dispose() {
    _animController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  double get _totalTrackWidth =>
      (widget.nodes.length * _cardWidth) +
      ((widget.nodes.length - 1) * _cardGap) +
      (_trackPadding * 2);

  @override
  Widget build(BuildContext context) {
    if (widget.nodes.isEmpty) return const SizedBox.shrink();

    // Hitung rata-rata kesehatan pabrik
    final avgHealth = widget.nodes.fold<double>(
          0.0,
          (sum, node) => sum + node.healthScore,
        ) /
        widget.nodes.length;

    final criticalCount = widget.nodes
        .where((n) => n.status == HealthStatus.critical)
        .length;
    final warningCount = widget.nodes
        .where((n) => n.status == HealthStatus.warning)
        .length;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: const Color(0xFF0D1527),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: const Color(0xFF1E293B),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 16,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Widget: Title & Live Diagnostics
          _buildHeader(avgHealth, warningCount, criticalCount),

          const Divider(color: Color(0xFF1E293B), height: 1),

          // Track Scroll Aliran 2D Horizontal
          SizedBox(
            height: _cardHeight + 24,
            child: SingleChildScrollView(
              controller: _scrollController,
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.symmetric(
                horizontal: _trackPadding,
                vertical: 12,
              ),
              child: SizedBox(
                width: _totalTrackWidth - (_trackPadding * 2),
                height: _cardHeight,
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    // Layer 1: Pipa Aliran Material & Bahan Bakar (CustomPainter 60 FPS)
                    Positioned.fill(
                      child: AnimatedBuilder(
                        animation: _animController,
                        builder: (context, _) {
                          return CustomPaint(
                            painter: _PlantFlowPainter(
                              progress: _animController.value,
                              nodeCount: widget.nodes.length,
                              cardWidth: _cardWidth,
                              cardGap: _cardGap,
                              cardHeight: _cardHeight,
                              nodes: widget.nodes,
                            ),
                          );
                        },
                      ),
                    ),

                    // Layer 2: Kartu 2D Equipment Interaktif
                    Row(
                      children: List.generate(widget.nodes.length, (index) {
                        final node = widget.nodes[index];
                        final isLast = index == widget.nodes.length - 1;
                        return Row(
                          children: [
                            _buildEquipmentCard(node, index),
                            if (!isLast) const SizedBox(width: _cardGap),
                          ],
                        );
                      }),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Footer Hint Bar
          _buildFooterHint(),
        ],
      ),
    );
  }

  Widget _buildHeader(double avgHealth, int warningCount, int criticalCount) {
    Color plantHealthColor = const Color(0xFF00E676);
    String plantSummary = "NORMAL";
    if (criticalCount > 0) {
      plantHealthColor = const Color(0xFFFF1744);
      plantSummary = "$criticalCount CRITICAL";
    } else if (warningCount > 0) {
      plantHealthColor = const Color(0xFFFFB300);
      plantSummary = "$warningCount PERHATIAN";
    }

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 12),
      child: Row(
        children: [
          // Radar / Pulse Live Icon
          AnimatedBuilder(
            animation: _animController,
            builder: (context, _) {
              final scale = 1.0 + (math.sin(_animController.value * 2 * math.pi) * 0.12);
              return Transform.scale(
                scale: scale,
                child: Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: plantHealthColor,
                    boxShadow: [
                      BoxShadow(
                        color: plantHealthColor.withValues(alpha: 0.6),
                        blurRadius: 8,
                        spreadRadius: 2,
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
          const SizedBox(width: 10),

          // Judul
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text(
                      "LIVE 2D PLANT FLOW",
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 0.8,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF00E5FF).withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(4),
                        border: Border.all(
                          color: const Color(0xFF00E5FF).withValues(alpha: 0.4),
                        ),
                      ),
                      child: Text(
                        widget.selectedArea.toUpperCase(),
                        style: const TextStyle(
                          color: Color(0xFF00E5FF),
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 2),
                const Text(
                  "Monitoring Kesehatan 8 Main Equipment",
                  style: TextStyle(
                    color: AppTheme.textMuted,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),

          // Overall Plant Health Pill
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: plantHealthColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: plantHealthColor.withValues(alpha: 0.4),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "${avgHealth.toStringAsFixed(0)}%",
                  style: TextStyle(
                    color: plantHealthColor,
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const SizedBox(width: 5),
                Text(
                  plantSummary,
                  style: TextStyle(
                    color: plantHealthColor,
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEquipmentCard(PlantEquipmentNode node, int index) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => widget.onEquipmentTapped(node),
        borderRadius: BorderRadius.circular(14),
        splashColor: node.statusColor.withValues(alpha: 0.2),
        highlightColor: node.statusColor.withValues(alpha: 0.1),
        child: Container(
          width: _cardWidth,
          height: _cardHeight,
          decoration: BoxDecoration(
            color: const Color(0xFF131E35),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: node.status == HealthStatus.normal
                  ? const Color(0xFF23324C)
                  : node.statusColor.withValues(alpha: 0.6),
              width: node.status == HealthStatus.normal ? 1.0 : 1.6,
            ),
            boxShadow: [
              if (node.status != HealthStatus.normal)
                BoxShadow(
                  color: node.statusColor.withValues(alpha: 0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
            ],
          ),
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar: Step Order & Status LED
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
                    decoration: BoxDecoration(
                      color: const Color(0xFF1E293B),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      "0${node.stepOrder} ${node.code}",
                      style: const TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  // Glowing LED status indicator
                  _buildStatusLed(node.statusColor),
                ],
              ),

              const SizedBox(height: 6),

              // 2D Equipment Illustration
              Expanded(
                child: Center(
                  child: AnimatedBuilder(
                    animation: _animController,
                    builder: (context, _) {
                      return _Equipment2DIcon(
                        type: node.type,
                        statusColor: node.statusColor,
                        progress: _animController.value,
                      );
                    },
                  ),
                ),
              ),

              const SizedBox(height: 6),

              // Equipment Title
              Text(
                _getShortTitle(node),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                ),
              ),

              const SizedBox(height: 4),

              // Metric / Health Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Health bar & score
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(2),
                          child: LinearProgressIndicator(
                            value: node.healthScore / 100.0,
                            minHeight: 3,
                            backgroundColor: const Color(0xFF1E293B),
                            valueColor: AlwaysStoppedAnimation<Color>(node.statusColor),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          node.metricValue,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: node.statusColor,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 4),
                  // Open Negative count alert badge if any
                  if (node.openNegatifCount > 0)
                    Container(
                      padding: const EdgeInsets.all(3),
                      decoration: const BoxDecoration(
                        color: AppConstants.warningYellow,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        "${node.openNegatifCount}",
                        style: const TextStyle(
                          color: Colors.black,
                          fontSize: 8,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatusLed(Color color) {
    return AnimatedBuilder(
      animation: _animController,
      builder: (context, _) {
        final opacity = 0.5 + (0.5 * math.sin(_animController.value * 2 * math.pi).abs());
        return Container(
          width: 9,
          height: 9,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: color,
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: opacity * 0.8),
                blurRadius: 6,
                spreadRadius: 1,
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildFooterHint() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: const BoxDecoration(
        color: Color(0xFF090E1B),
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(16)),
      ),
      child: const Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(Icons.touch_app_rounded, color: Color(0xFF00E5FF), size: 13),
              SizedBox(width: 6),
              Text(
                "Ketuk alat untuk diagnostik & input service",
                style: TextStyle(
                  color: Color(0xFF94A3B8),
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
          Row(
            children: [
              Text(
                "Geser",
                style: TextStyle(
                  color: Color(0xFF64748B),
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                ),
              ),
              SizedBox(width: 2),
              Icon(Icons.arrow_forward_rounded, color: Color(0xFF64748B), size: 12),
            ],
          ),
        ],
      ),
    );
  }

  String _getShortTitle(PlantEquipmentNode node) {
    switch (node.type) {
      case EquipmentType.crusher:
        return "CRUSHER";
      case EquipmentType.rawmill:
        return "RAW MILL";
      case EquipmentType.coalmill:
        return "COAL MILL";
      case EquipmentType.preheater:
        return "PREHEATER";
      case EquipmentType.kiln:
        return "ROTARY KILN";
      case EquipmentType.cooler:
        return "COOLER";
      case EquipmentType.finishmill:
        return "FINISH MILL";
      case EquipmentType.packer:
        return "PACKER";
    }
  }
}

/// CustomPainter untuk menggambar pipa aliran 2D terhubung antar alat
/// Termasuk cabang suplai batubara Coal Mill ke Kiln & Preheater
class _PlantFlowPainter extends CustomPainter {
  final double progress;
  final int nodeCount;
  final double cardWidth;
  final double cardGap;
  final double cardHeight;
  final List<PlantEquipmentNode> nodes;

  _PlantFlowPainter({
    required this.progress,
    required this.nodeCount,
    required this.cardWidth,
    required this.cardGap,
    required this.cardHeight,
    required this.nodes,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final centerY = cardHeight * 0.50;

    // Background Pipeline Base Paint
    final pipeBgPaint = Paint()
      ..color = const Color(0xFF1A2840)
      ..strokeWidth = 6.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final pipeBorderPaint = Paint()
      ..color = const Color(0xFF2A3D5C)
      ..strokeWidth = 8.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    // Animated Flow Stream Paint (Material Aliran Semen: Cyan Glowing Stream)
    final streamPaint = Paint()
      ..color = const Color(0xFF00E5FF)
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    // Animated Coal Branch Stream Paint (Bahan Bakar Batubara: Amber Glow)
    final coalStreamPaint = Paint()
      ..color = const Color(0xFFFFB300)
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    // 1. Gambar pipa lurus penghubung utama antar node
    for (int i = 0; i < nodeCount - 1; i++) {
      final startX = (i * (cardWidth + cardGap)) + cardWidth;
      final endX = (i + 1) * (cardWidth + cardGap);

      // Jangan gambar pipa material lurus biasa antara Raw Mill (1) dan Coal Mill (2),
      // karena Coal Mill adalah loop cabang bahan bakar batubara.
      // Namun kita hubungkan Raw Mill (1) ke Preheater (3) lewat pipa atas / bypass,
      // dan Coal Mill (2) ke Preheater (3) & Kiln (4) lewat pipa bahan bakar.
      final isBetweenRawAndCoal = i == 1; // index 1 is Raw Mill, index 2 is Coal Mill
      final isBetweenCoalAndPreheater = i == 2; // index 2 is Coal Mill, index 3 is Preheater

      if (!isBetweenRawAndCoal && !isBetweenCoalAndPreheater) {
        // Pipa Material Standar (Lurus horizontal)
        _drawStandardPipe(canvas, startX, endX, centerY, pipeBorderPaint, pipeBgPaint, streamPaint);
      }
    }

    // 2. Hubungkan Raw Mill (index 1) langsung ke Preheater (index 3) via Pipa Overhead Material Raw Meal
    final rmStartX = (1 * (cardWidth + cardGap)) + cardWidth;
    final phEndX = 3 * (cardWidth + cardGap);
    final topPipeY = cardHeight * 0.16;

    final rawMealPath = Path()
      ..moveTo(rmStartX, centerY - 15)
      ..lineTo(rmStartX + 12, topPipeY)
      ..lineTo(phEndX - 12, topPipeY)
      ..lineTo(phEndX, centerY - 15);

    canvas.drawPath(rawMealPath, pipeBorderPaint);
    canvas.drawPath(rawMealPath, pipeBgPaint);
    _drawMovingDashes(canvas, rawMealPath, streamPaint, 18.0, 10.0, progress);

    // 3. Hubungkan Coal Mill (index 2) ke Preheater (3) & Kiln (4) via Pipa Pulverized Coal
    final cmStartX = (2 * (cardWidth + cardGap)) + cardWidth;
    final kilnEndX = 4 * (cardWidth + cardGap);
    final bottomPipeY = cardHeight * 0.84;

    final coalPath = Path()
      ..moveTo(cmStartX, centerY + 15)
      ..lineTo(cmStartX + 10, bottomPipeY)
      ..lineTo(kilnEndX - 10, bottomPipeY)
      ..lineTo(kilnEndX, centerY + 15);

    // Branch ke Preheater bawah
    final coalPreheaterBranch = Path()
      ..moveTo(cmStartX + (cardGap * 0.5), bottomPipeY)
      ..lineTo(phEndX, centerY + 20);

    canvas.drawPath(coalPath, pipeBorderPaint);
    canvas.drawPath(coalPath, pipeBgPaint);
    _drawMovingDashes(canvas, coalPath, coalStreamPaint, 16.0, 8.0, (progress + 0.3) % 1.0);

    canvas.drawPath(coalPreheaterBranch, pipeBgPaint);
    _drawMovingDashes(canvas, coalPreheaterBranch, coalStreamPaint, 14.0, 6.0, (progress + 0.5) % 1.0);
  }

  void _drawStandardPipe(
    Canvas canvas,
    double startX,
    double endX,
    double centerY,
    Paint borderPaint,
    Paint bgPaint,
    Paint streamPaint,
  ) {
    // Garis pipa
    canvas.drawLine(Offset(startX, centerY), Offset(endX, centerY), borderPaint);
    canvas.drawLine(Offset(startX, centerY), Offset(endX, centerY), bgPaint);

    // Flange / Sambungan Pipa
    final flangePaint = Paint()
      ..color = const Color(0xFF334155)
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(Offset(startX + 4, centerY - 8), Offset(startX + 4, centerY + 8), flangePaint);
    canvas.drawLine(Offset(endX - 4, centerY - 8), Offset(endX - 4, centerY + 8), flangePaint);

    // Moving Particles
    final path = Path()
      ..moveTo(startX, centerY)
      ..lineTo(endX, centerY);
    _drawMovingDashes(canvas, path, streamPaint, 16.0, 8.0, progress);

    // Panah Arah Aliran di Tengah Pipa
    final midX = (startX + endX) / 2;
    _drawFlowArrow(canvas, midX, centerY, const Color(0xFF00E5FF));
  }

  void _drawFlowArrow(Canvas canvas, double cx, double cy, Color color) {
    final arrowPaint = Paint()
      ..color = color.withValues(alpha: 0.7)
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final arrowPath = Path()
      ..moveTo(cx - 3, cy - 3)
      ..lineTo(cx + 2, cy)
      ..lineTo(cx - 3, cy + 3);

    canvas.drawPath(arrowPath, arrowPaint);
  }

  void _drawMovingDashes(
    Canvas canvas,
    Path path,
    Paint paint,
    double dashLength,
    double dashSpace,
    double animProgress,
  ) {
    final metrics = path.computeMetrics().toList();
    if (metrics.isEmpty) return;

    for (final metric in metrics) {
      final totalLen = metric.length;
      final cycle = dashLength + dashSpace;
      final offset = (animProgress * cycle);

      double distance = offset;
      while (distance < totalLen) {
        final start = distance;
        final end = math.min(distance + dashLength, totalLen);
        final extract = metric.extractPath(start, end);
        canvas.drawPath(extract, paint);
        distance += cycle;
      }
    }
  }

  @override
  bool shouldRepaint(covariant _PlantFlowPainter oldDelegate) {
    return oldDelegate.progress != progress;
  }
}

/// Widget Khusus Gambar Ilustrasi 2D Vektor untuk masing-masing Equipment Pabrik Semen
class _Equipment2DIcon extends StatelessWidget {
  final EquipmentType type;
  final Color statusColor;
  final double progress;

  const _Equipment2DIcon({
    required this.type,
    required this.statusColor,
    required this.progress,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 72,
      height: 64,
      child: CustomPaint(
        painter: _EquipmentVisualPainter(
          type: type,
          statusColor: statusColor,
          progress: progress,
        ),
      ),
    );
  }
}

/// CustomPainter untuk merender bentuk 2D teknis setiap peralatan pabrik semen
class _EquipmentVisualPainter extends CustomPainter {
  final EquipmentType type;
  final Color statusColor;
  final double progress;

  _EquipmentVisualPainter({
    required this.type,
    required this.statusColor,
    required this.progress,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    switch (type) {
      case EquipmentType.crusher:
        _paintCrusher(canvas, w, h);
        break;
      case EquipmentType.rawmill:
        _paintRawMill(canvas, w, h);
        break;
      case EquipmentType.coalmill:
        _paintCoalMill(canvas, w, h);
        break;
      case EquipmentType.preheater:
        _paintPreheater(canvas, w, h);
        break;
      case EquipmentType.kiln:
        _paintKiln(canvas, w, h);
        break;
      case EquipmentType.cooler:
        _paintCooler(canvas, w, h);
        break;
      case EquipmentType.finishmill:
        _paintFinishMill(canvas, w, h);
        break;
      case EquipmentType.packer:
        _paintPacker(canvas, w, h);
        break;
    }
  }

  // 1. CRUSHER: Jaw Crusher Hopper dengan Batu Bergerak
  void _paintCrusher(Canvas canvas, double w, double h) {
    final bodyPaint = Paint()
      ..color = const Color(0xFF334155)
      ..style = PaintingStyle.fill;
    final strokePaint = Paint()
      ..color = const Color(0xFF64748B)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    // Hopper atas (Trapesium)
    final hopperPath = Path()
      ..moveTo(w * 0.15, h * 0.15)
      ..lineTo(w * 0.85, h * 0.15)
      ..lineTo(w * 0.70, h * 0.55)
      ..lineTo(w * 0.30, h * 0.55)
      ..close();
    canvas.drawPath(hopperPath, bodyPaint);
    canvas.drawPath(hopperPath, strokePaint);

    // Rahang Jaw Crusher yang Bergerak Mengunyah
    final jawOffset = math.sin(progress * 2 * math.pi) * 3.0;
    final jawPaint = Paint()
      ..color = const Color(0xFF00E5FF)
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;
    canvas.drawLine(
      Offset(w * 0.35 + jawOffset, h * 0.25),
      Offset(w * 0.45, h * 0.55),
      jawPaint,
    );
    canvas.drawLine(
      Offset(w * 0.65 - jawOffset, h * 0.25),
      Offset(w * 0.55, h * 0.55),
      jawPaint,
    );

    // Batuan jatuh keluar di bawah
    final stonePaint = Paint()..color = const Color(0xFF94A3B8);
    final stoneY = h * 0.65 + ((progress * 16) % 16);
    canvas.drawCircle(Offset(w * 0.50, stoneY), 3.0, stonePaint);
    canvas.drawCircle(Offset(w * 0.42, (stoneY + 6) % (h * 0.9)), 2.2, stonePaint);
    canvas.drawCircle(Offset(w * 0.58, (stoneY + 11) % (h * 0.9)), 2.5, stonePaint);
  }

  // 2. RAW MILL: Vertical Roller Mill dengan Roda Penggiling Berputar
  void _paintRawMill(Canvas canvas, double w, double h) {
    final millBodyPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.fill;
    final millStrokePaint = Paint()
      ..color = const Color(0xFF475569)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    // Tabung Utama VRM
    final rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(w * 0.22, h * 0.22, w * 0.56, h * 0.65),
      const Radius.circular(6),
    );
    canvas.drawRRect(rect, millBodyPaint);
    canvas.drawRRect(rect, millStrokePaint);

    // Dynamic Separator / Cyclone cone di atas
    final separatorPath = Path()
      ..moveTo(w * 0.35, h * 0.22)
      ..lineTo(w * 0.50, h * 0.08)
      ..lineTo(w * 0.65, h * 0.22)
      ..close();
    canvas.drawPath(separatorPath, millBodyPaint);
    canvas.drawPath(separatorPath, millStrokePaint);

    // 2 Roller Penggiling Berputar (kiri & kanan)
    final angle = progress * 2 * math.pi;
    _drawRoller(canvas, w * 0.38, h * 0.58, angle);
    _drawRoller(canvas, w * 0.62, h * 0.58, -angle);

    // Grinding Table di bawah
    final tablePaint = Paint()
      ..color = const Color(0xFF00E5FF)
      ..strokeWidth = 3.0;
    canvas.drawLine(Offset(w * 0.26, h * 0.76), Offset(w * 0.74, h * 0.76), tablePaint);
  }

  void _drawRoller(Canvas canvas, double cx, double cy, double angle) {
    final rollerPaint = Paint()..color = const Color(0xFF64748B);
    final spokePaint = Paint()
      ..color = const Color(0xFF00E5FF)
      ..strokeWidth = 1.5;

    canvas.drawCircle(Offset(cx, cy), 9.0, rollerPaint);
    canvas.drawLine(
      Offset(cx + math.cos(angle) * 7, cy + math.sin(angle) * 7),
      Offset(cx - math.cos(angle) * 7, cy - math.sin(angle) * 7),
      spokePaint,
    );
  }

  // 3. COAL MILL: Pulverizer dengan Api / Burner Glow
  void _paintCoalMill(Canvas canvas, double w, double h) {
    final bodyPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.fill;
    final strokePaint = Paint()
      ..color = const Color(0xFF475569)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    // Badan Mill Kerucut Terbalik
    final path = Path()
      ..moveTo(w * 0.20, h * 0.25)
      ..lineTo(w * 0.80, h * 0.25)
      ..lineTo(w * 0.65, h * 0.75)
      ..lineTo(w * 0.35, h * 0.75)
      ..close();
    canvas.drawPath(path, bodyPaint);
    canvas.drawPath(path, strokePaint);

    // Suplai Batubara Hitam
    final coalPaint = Paint()..color = const Color(0xFF0F172A);
    canvas.drawCircle(Offset(w * 0.5, h * 0.40), 10.0, coalPaint);

    // Api Pembakar / Burner Heat Glow Pulverizer (Amber / Orange)
    final flamePulse = 0.8 + (math.sin(progress * 4 * math.pi) * 0.2);
    final flamePaint = Paint()
      ..color = const Color(0xFFFF9100).withValues(alpha: 0.85)
      ..style = PaintingStyle.fill;
    final flamePath = Path()
      ..moveTo(w * 0.50, h * 0.32 - (4 * flamePulse))
      ..lineTo(w * 0.58, h * 0.48)
      ..lineTo(w * 0.42, h * 0.48)
      ..close();
    canvas.drawPath(flamePath, flamePaint);
  }

  // 4. PREHEATER TOWER: Menara 5-Stage Cyclones dengan Aliran Gas Panas
  void _paintPreheater(Canvas canvas, double w, double h) {
    final towerPaint = Paint()
      ..color = const Color(0xFF334155)
      ..strokeWidth = 1.8
      ..style = PaintingStyle.stroke;

    // Rangka Kolom Menara Preheater
    canvas.drawLine(Offset(w * 0.25, h * 0.10), Offset(w * 0.25, h * 0.90), towerPaint);
    canvas.drawLine(Offset(w * 0.75, h * 0.10), Offset(w * 0.75, h * 0.90), towerPaint);

    // 4 Cyclone Bertingkat (Top to Bottom)
    final cyclonePaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.fill;
    final cycloneBorder = Paint()
      ..color = const Color(0xFF00E5FF)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    final cycloneY = [h * 0.22, h * 0.40, h * 0.58, h * 0.76];
    for (int i = 0; i < cycloneY.length; i++) {
      final cy = cycloneY[i];
      final cx = (i % 2 == 0) ? w * 0.40 : w * 0.60;

      final cPath = Path()
        ..moveTo(cx - 9, cy - 6)
        ..lineTo(cx + 9, cy - 6)
        ..lineTo(cx + 5, cy + 6)
        ..lineTo(cx - 5, cy + 6)
        ..close();
      canvas.drawPath(cPath, cyclonePaint);
      canvas.drawPath(cPath, cycloneBorder);
    }

    // Updraft Gas Panas (Animated red/amber dashed arrows)
    final heatPaint = Paint()
      ..color = const Color(0xFFFF5252).withValues(alpha: 0.8)
      ..strokeWidth = 1.5
      ..strokeCap = StrokeCap.round;
    final heatY = h * 0.85 - ((progress * h * 0.7) % (h * 0.7));
    canvas.drawLine(Offset(w * 0.5, heatY), Offset(w * 0.5, heatY - 6), heatPaint);
  }

  // 5. ROTARY KILN: Silinder Miring Berputar dengan Kilau Api 1450°C
  void _paintKiln(Canvas canvas, double w, double h) {
    canvas.save();

    // Sedikit rotasi/kemiringan kiln (-6 derajat)
    canvas.translate(w * 0.5, h * 0.5);
    canvas.rotate(-0.10);

    // Badan Silinder Kiln Miring
    final kilnRect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset.zero, width: w * 0.85, height: h * 0.40),
      const Radius.circular(4),
    );

    final kilnGradient = const LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: [
        Color(0xFF475569),
        Color(0xFF1E293B),
        Color(0xFF0F172A),
      ],
    ).createShader(kilnRect.outerRect);

    final kilnPaint = Paint()..shader = kilnGradient;
    canvas.drawRRect(kilnRect, kilnPaint);

    final strokePaint = Paint()
      ..color = const Color(0xFF64748B)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;
    canvas.drawRRect(kilnRect, strokePaint);

    // Riding Rings (Tyre Kiln)
    final tyrePaint = Paint()
      ..color = const Color(0xFF94A3B8)
      ..strokeWidth = 3.5;
    canvas.drawLine(Offset(-w * 0.25, -h * 0.22), Offset(-w * 0.25, h * 0.22), tyrePaint);
    canvas.drawLine(Offset(w * 0.22, -h * 0.22), Offset(w * 0.22, h * 0.22), tyrePaint);

    // Animasi Garis Rotasi Kiln Berputar (Stripes moving)
    final rotStripePaint = Paint()
      ..color = const Color(0xFF00E5FF).withValues(alpha: 0.5)
      ..strokeWidth = 1.8;
    final shift = ((progress * 24) % 24) - 12;
    canvas.drawLine(Offset(shift - 6, -h * 0.15), Offset(shift - 6, h * 0.15), rotStripePaint);
    canvas.drawLine(Offset(shift + 10, -h * 0.15), Offset(shift + 10, h * 0.15), rotStripePaint);

    // Api Pembakar Utama (Burning Zone Fire Glow di Ujung Kanan)
    final firePaint = Paint()
      ..color = const Color(0xFFFF3D00).withValues(alpha: 0.85)
      ..style = PaintingStyle.fill;
    final firePulse = math.sin(progress * 6 * math.pi) * 2;
    canvas.drawCircle(Offset(w * 0.35 + firePulse, 0), 6.0, firePaint);

    canvas.restore();

    // Roller Support di bawah Kiln
    final rollerPaint = Paint()..color = const Color(0xFF334155);
    canvas.drawCircle(Offset(w * 0.28, h * 0.78), 4.5, rollerPaint);
    canvas.drawCircle(Offset(w * 0.72, h * 0.78), 4.5, rollerPaint);
  }

  // 6. CLINKER COOLER: Grate Cooler dengan Semburan Udara Pendingin Bawah
  void _paintCooler(Canvas canvas, double w, double h) {
    final bodyPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.fill;
    final strokePaint = Paint()
      ..color = const Color(0xFF475569)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    // Chamber Cooler Horizontal
    final rect = RRect.fromRectAndRadius(
      Rect.fromLTWH(w * 0.12, h * 0.28, w * 0.76, h * 0.38),
      const Radius.circular(5),
    );
    canvas.drawRRect(rect, bodyPaint);
    canvas.drawRRect(rect, strokePaint);

    // Grate Plates Stepped
    final gratePaint = Paint()
      ..color = const Color(0xFF94A3B8)
      ..strokeWidth = 2.0;
    canvas.drawLine(Offset(w * 0.18, h * 0.48), Offset(w * 0.82, h * 0.48), gratePaint);

    // Udara Pendingin (Fans Blowing Cold Air Upward from Bottom)
    final airPaint = Paint()
      ..color = const Color(0xFF00E5FF).withValues(alpha: 0.8)
      ..strokeWidth = 1.6
      ..strokeCap = StrokeCap.round;

    final airOffsets = [0.28, 0.45, 0.62, 0.78];
    for (final xRatio in airOffsets) {
      final airY = h * 0.82 - ((progress * 14) % 14);
      canvas.drawLine(Offset(w * xRatio, airY), Offset(w * xRatio, airY - 5), airPaint);
    }

    // Cooling Fans di dasar
    final fanPaint = Paint()..color = const Color(0xFF334155);
    for (final xRatio in airOffsets) {
      canvas.drawCircle(Offset(w * xRatio, h * 0.78), 3.5, fanPaint);
    }
  }

  // 7. FINISH MILL: Horizontal Ball Mill Tabung Giling Klinker jadi Semen
  void _paintFinishMill(Canvas canvas, double w, double h) {
    final drumPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.fill;
    final strokePaint = Paint()
      ..color = const Color(0xFF475569)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    // Tabung Horisontal Silinder Giling
    final drumRect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(w * 0.50, h * 0.50), width: w * 0.78, height: h * 0.44),
      const Radius.circular(6),
    );
    canvas.drawRRect(drumRect, drumPaint);
    canvas.drawRRect(drumRect, strokePaint);

    // Girth Gear Besar di Tengah
    final gearPaint = Paint()
      ..color = const Color(0xFF00E5FF)
      ..strokeWidth = 4.0;
    canvas.drawLine(Offset(w * 0.50, h * 0.25), Offset(w * 0.50, h * 0.75), gearPaint);

    // Trunnion Bearings (Kiri & Kanan)
    final trunnionPaint = Paint()..color = const Color(0xFF64748B);
    canvas.drawRect(Rect.fromLTWH(w * 0.06, h * 0.42, w * 0.08, h * 0.16), trunnionPaint);
    canvas.drawRect(Rect.fromLTWH(w * 0.86, h * 0.42, w * 0.08, h * 0.16), trunnionPaint);

    // Animasi Grinding Balls Berputar di Dalam
    final angle = progress * 2 * math.pi;
    final ballPaint = Paint()..color = const Color(0xFF94A3B8);
    for (int i = 0; i < 3; i++) {
      final bAngle = angle + (i * 2.0);
      final bx = w * 0.35 + math.cos(bAngle) * 7.0;
      final by = h * 0.50 + math.sin(bAngle) * 5.0;
      canvas.drawCircle(Offset(bx, by), 2.2, ballPaint);
    }
  }

  // 8. ROTARY PACKER: Mesin Pengantongan Semen 50kg dengan Spout Berputar
  void _paintPacker(Canvas canvas, double w, double h) {
    final bodyPaint = Paint()
      ..color = const Color(0xFF1E293B)
      ..style = PaintingStyle.fill;
    final strokePaint = Paint()
      ..color = const Color(0xFF475569)
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    // Silo Hopper atas
    final hopperPath = Path()
      ..moveTo(w * 0.30, h * 0.15)
      ..lineTo(w * 0.70, h * 0.15)
      ..lineTo(w * 0.60, h * 0.35)
      ..lineTo(w * 0.40, h * 0.35)
      ..close();
    canvas.drawPath(hopperPath, bodyPaint);
    canvas.drawPath(hopperPath, strokePaint);

    // Carousel Packer Rotari Berputar
    final angle = progress * 2 * math.pi;
    final carouselPaint = Paint()..color = const Color(0xFF334155);
    canvas.drawCircle(Offset(w * 0.50, h * 0.55), 14.0, carouselPaint);

    // Spouts Pengisi Sak Semen
    final spoutPaint = Paint()
      ..color = const Color(0xFF00E5FF)
      ..strokeWidth = 2.0;
    for (int i = 0; i < 4; i++) {
      final sAngle = angle + (i * (math.pi / 2));
      final sx = w * 0.50 + math.cos(sAngle) * 12.0;
      final sy = h * 0.55 + math.sin(sAngle) * 12.0;
      canvas.drawLine(Offset(w * 0.50, h * 0.55), Offset(sx, sy), spoutPaint);
    }

    // Sak Semen di Bawah Berjalan di Konveyor
    final bagOffset = ((progress * 18) % 18) - 9;
    final bagPaint = Paint()..color = const Color(0xFFE2E8F0);
    final bagRect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(w * 0.50 + bagOffset, h * 0.82), width: 12, height: 9),
      const Radius.circular(2),
    );
    canvas.drawRRect(bagRect, bagPaint);

    // Konveyor Belt Bawah
    final beltPaint = Paint()
      ..color = const Color(0xFF475569)
      ..strokeWidth = 2.0;
    canvas.drawLine(Offset(w * 0.20, h * 0.90), Offset(w * 0.80, h * 0.90), beltPaint);
  }

  @override
  bool shouldRepaint(covariant _EquipmentVisualPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.statusColor != statusColor;
  }
}
