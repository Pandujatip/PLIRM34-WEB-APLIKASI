import "package:flutter/material.dart";

class AppTheme {
  // Industrial SCADA Dark Colors
  static const Color background = Color(0xFF07131E);
  static const Color surface = Color(0xFF0D1E2E);
  static const Color surfaceFloat = Color(0xFF132B40);
  static const Color border = Color(0x2E2DD4BF);
  static const Color borderMuted = Color(0x1F94A3B8);

  static const Color teal = Color(0xFF2DD4BF);
  static const Color tealDark = Color(0xFF14B8A6);
  static const Color blue = Color(0xFF3B82F6);
  static const Color amber = Color(0xFFF59E0B);
  static const Color amberSurface = Color(0x2EF59E0B);
  static const Color red = Color(0xFFF43F5E);
  static const Color redSurface = Color(0x2EF43F5E);
  static const Color green = Color(0xFF10B981);
  static const Color greenSurface = Color(0x2E10B981);

  static const Color text = Color(0xFFF1F5F9);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textSubtle = Color(0xFF64748B);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: background,
      colorScheme: const ColorScheme.dark(
        primary: teal,
        secondary: blue,
        surface: surface,
        error: red,
        onPrimary: Color(0xFF03181B),
        onSurface: text,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: background,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: TextStyle(
          color: text,
          fontSize: 20,
          fontWeight: FontWeight.bold,
          letterSpacing: -0.5,
        ),
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: border, width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: teal,
          foregroundColor: const Color(0xFF03181B),
          elevation: 0,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: const TextStyle(
            fontSize: 15,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceFloat,
        hintStyle: const TextStyle(color: textSubtle, fontSize: 14),
        labelStyle: const TextStyle(color: textMuted, fontSize: 13),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: borderMuted),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: borderMuted),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: teal, width: 1.5),
        ),
      ),
    );
  }
}
