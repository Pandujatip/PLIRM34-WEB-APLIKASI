import "package:flutter/material.dart";
import "../theme/app_theme.dart";

class AppConstants {
  static const String appName = "Maintenance Tool Online";
  static const String appTagline = "Industrial field operations";
  static const String baseUrl = "https://plirm34tuban.id";
  static const String ssoUrl = "https://portable-tool-inspection.firebaseapp.com/auth.html";

  // Shared Preferences Keys
  static const String prefToken = "auth_token";
  static const String prefUsername = "auth_username";
  static const String prefRole = "auth_role";
  static const String prefSelectedArea = "selected_area";

  // Design System Colors
  static const Color primaryTeal = AppTheme.teal;
  static const Color accentCyan = Color(0xFF22D3EE);
  static const Color warningYellow = AppTheme.amber;
  static const Color alertRed = AppTheme.red;
  static const Color successGreen = AppTheme.green;
  static const Color bgDark = AppTheme.background;
  static const Color surfaceDark = AppTheme.surface;
  static const Color cardBg = AppTheme.surface;

  // Factory Areas
  static const List<String> areas = [
    "Semua Area",
    "Crusher",
    "Raw Mill",
    "Kiln",
    "Coal Mill",
    "Finish Mill",
    "Packer",
    "Pelabuhan / Jetty"
  ];
}
