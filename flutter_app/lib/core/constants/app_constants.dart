class AppConstants {
  static const String appName = "Portable Inspection Tool";
  static const String appTagline = "Industrial field operations";
  static const String baseUrl = "https://plirm34tuban.id";
  static const String ssoUrl = "https://portable-tool-inspection.firebaseapp.com/auth.html";

  // Shared Preferences Keys
  static const String prefToken = "auth_token";
  static const String prefUsername = "auth_username";
  static const String prefRole = "auth_role";
  static const String prefSelectedArea = "selected_area";

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
