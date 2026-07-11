# PLIRM34 Native Android

Native Android APK for PLIRM34 field operations, built without WebView and using the existing PLIRM34 web icon assets.

## Build

Siapkan keystore release di luar repository dan masukkan kredensialnya melalui environment variable. Password tidak boleh ditulis di script atau command line.

```powershell
$env:PLIRM34_ANDROID_KEYSTORE = "D:\secure\plirm34-release.jks"
$env:PLIRM34_ANDROID_KEY_ALIAS = "plirm34-release"
$env:PLIRM34_ANDROID_STORE_PASSWORD = "<secret>"
$env:PLIRM34_ANDROID_KEY_PASSWORD = "<secret>"
```

Kemudian jalankan dari folder ini:

```powershell
.\build-apk.ps1
```

The signed APK is written to `dist/PLIRM34-native.apk`.

Build akan gagal sebelum menghapus artefak lama apabila konfigurasi signing belum lengkap, keystore tidak ditemukan, atau keystore berada di dalam repository. Folder `build`, `dist`, file `*.keystore`, dan `*.jks` diabaikan Git.

## Scope

This APK follows the approved Stitch direction:

- Login screen with PLIRM34 icon reused from the web assets.
- Live login to the PLIRM34 backend at `https://plirm34tuban.id` by default.
- Dashboard with Carbon Brush Early Warning, today's inspection schedule, latest service, and sparepart stock alerts.
- Service hub with the real PLIRM34 service categories and latest service history.
- BOM, Sparepart catalog, Carbon Brush stock board, and Carbon Brush measurement input.
- Carbon Brush stock mutation actions for tambah stok and koreksi stok through `/api/carbon-brush-stock/movement`.
- Native service input/edit for supported PLIRM34 categories using the same backend item API as web.
- WhatsApp share action for service result cards.

The login screen defaults to the production server. A server URL field is kept internally so the same APK can still be pointed to another PLIRM34 server during testing.

## Spec Alignment

- Product behavior is tracked in `../specs/product/native-app.md`.
- Acceptance status is tracked in `../specs/acceptance/native-app-audit.md`.
- Session cookies are held in app memory only. Closing the app may require login again.
- Field parity with web should be checked whenever a service form changes.
