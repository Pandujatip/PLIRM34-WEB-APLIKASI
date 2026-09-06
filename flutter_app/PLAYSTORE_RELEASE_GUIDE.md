# Panduan Upload & Rilis Aplikasi ke Google Play Console
Aplikasi: **Maintenance Tool Online**  
Package ID: plirm34tuban.id  
Versi: 1.0.2+3 (VersionCode: 3, VersionName: 1.0.2)  

---

## 1. Lokasi Berkas Rilis (Android App Bundle - .aab)

Berkas rilis yang siap diunggah ke Google Play Console berada di:
`	ext
pandujatip-probable-giggle\flutter_app\build\app\outputs\bundle\release\app-release.aab
`
* **Ukuran File**: ±54 MB
* **Format**: Android App Bundle (.aab) — standar wajib Google Play sejak Agustus 2021
* **Tanda Tangan Digital**: Ditandatangani dengan kunci rilis resmi upload-keystore.jks (Validitas: 2026 – 2054)
* **SHA-256 Fingerprint**: 6A:FE:48:2B:18:3D:75:EE:90:16:A9:2B:6C:5A:68:B8:A7:D2:91:62:03:F2:08:F7:2A:6B:BE:DE:4B:04:4C:5C

---

## 2. Informasi Kredensial Keystore & Cadangan Keamanan

File kunci berada di:
* **Path Keystore**: lutter_app\android\app\upload-keystore.jks
* **File Properti**: lutter_app\android\key.properties
* **Alias**: upload
* **Kata Sandi**: Plirm34Tuban2026!

> [!WARNING]
> Simpan dan cadangkan file upload-keystore.jks serta kata sandinya di tempat yang aman (Google Drive tim / cloud backup). Google Play mengidentifikasi pembaruan aplikasi selanjutnya berdasarkan kunci ini jika Google Play App Signing menggunakan kunci upload Anda.

---

## 3. Langkah-Langkah Upload di Google Play Console

### Langkah A: Buat Aplikasi Baru
1. Buka [Google Play Console](https://play.google.com/console).
2. Klik **Create app** (Buat aplikasi).
3. Isi kolom:
   * **App name**: PLIRM 34 - Inspection Tool
   * **Default language**: Indonesian (id-ID) atau English (United States)
   * **App or game**: App
   * **Free or paid**: Free
4. Centang persetujuan kebijakan Google Play, lalu klik **Create app**.

---

### Langkah B: Pengisian Kuesioner Konten & Kebijakan (Policy)
Pada menu navigasi kiri, buka bagian **Policy and programs** > **App content**:
1. **Privacy Policy (Kebijakan Privasi)**:
   * Masukkan URL kebijakan privasi (misal: https://plirm34tuban.id/privacy atau halaman privasi portal perusahaan).
2. **App Access (Akses Aplikasi)**:
   * Pilih *"All or some functionality in my app is restricted"*.
   * Tambahkan instruksi akun demo untuk tim reviewer Google:
     * *Username / Email*: akun demo (misal 	eam.plirm34 atau email demo)
     * *Password*: password akun demo
3. **Ads (Iklan)**:
   * Pilih *"No, my app does not contain ads"*.
4. **Content Ratings (Rating Konten)**:
   * Masukkan email developer Anda.
   * Pilih kategori *"Utility, Productivity, Communication, or Other"*.
   * Jawab semua pertanyaan (semua *"No"* karena ini aplikasi industri operasional).
5. **Target Audience (Audiens Target)**:
   * Pilih usia **18 and over** (Tenaga kerja / Profesional industri).
6. **Data Safety (Keamanan Data)**:
   * **Data Collected**:
     * *Personal Info*: Nama / Username / Email (untuk autentikasi login pengguna).
     * *Photos and Videos*: Foto temuan inspeksi / negative list (jika user mengunggah bukti temuan).
   * **Data Encrypted in Transit**: *"Yes, all user data collected is encrypted in transit (HTTPS / TLS)"*.
   * **Account Deletion**: Sediakan informasi penghapusan akun atau kontak admin.

---

### Langkah C: Menyiapkan Halaman Toko (Main Store Listing)
1. **App Name**: Maintenance Tool Online (Maks. 30 karakter)
2. **Short Description**: (Maks. 80 karakter — saat ini 76 karakter)
   ```text
   Aplikasi inspeksi, pemeliharaan preventif, dan monitoring peralatan industri.
   ```
3. **Full Description**: (Maks. 4000 karakter)
   ```text
   Maintenance Tool Online adalah solusi digital terpadu untuk inspeksi lapangan, manajemen pemeliharaan (preventive & corrective maintenance), dan monitoring keandalan peralatan industri secara real-time.

   Aplikasi ini dirancang untuk memudahkan teknisi lapangan, engineer, dan supervisor dalam mencatat riwayat servis, memantau kesehatan aset operasional, serta memastikan keandalan mesin industri tetap optimal.

   Fitur Utama:
   • Health & Asset Monitoring: Visualisasi interaktif status operasional dan kesehatan peralatan utama di lini produksi secara real-time.
   • Inspeksi Lapangan & Checklist Digital: Pencatatan parameter operasional rutin (suhu bearing, vibrasi, keausan komponen, dan pembacaan sensor).
   • Service & Repair Log: Pencatatan riwayat pemeliharaan multi-disiplin (Electrical, Mechanical, Instrumentation, PLC, dan Control Systems).
   • Defect & Anomaly Tracking: Pencatatan temuan abnormalitas alat di lapangan dilengkapi foto dokumentasi, penugasan tindakan perbaikan, dan verifikasi penyelesaian.
   • Manajemen Suku Cadang & Logistik: Monitoring ketersediaan stok komponen kritis dan pencatatan surat pemakaian barang suku cadang.
   • Administrasi Tim & Jadwal Kerja: Pengaturan jadwal kerja tim teknisi lapangan, pemantauan shift, dan rekapitulasi penugasan.

   Keunggulan Aplikasi:
   - Akses Cepat & Mobile-First: Input data inspeksi langsung di area kerja mesin tanpa perlu formulir kertas.
   - Dokumentasi Lengkap: Mendukung foto temuan lapangan dan penelusuran riwayat servis alat.
   - Keamanan Terjamin: Otentikasi aman berbasis peran (Role-Based Access Control) untuk menjaga integritas data operasional pabrik.

   Tingkatkan efisiensi kerja tim pemeliharaan dan cegah downtime tak terduga dengan Maintenance Tool Online!
   ```
4. **Aset Grafis**:
   * **App Icon**: 512 x 512 px PNG (32-bit color dengan alpha).
   * **Feature Graphic**: 1024 x 500 px PNG atau JPEG (Banner halaman aplikasi di Play Store).
   * **Screenshots**: Minimal 2 tangkapan layar ponsel (dapat menggunakan screenshot dari folder brain artefak).

---

### Langkah D: Unggah File .aab (Rekomendasi: Jalur Pengujian Internal Dulu)
1. Pada menu navigasi kiri, pilih **Testing** > **Internal testing**.
2. Klik **Create new release**.
3. Pada bagian **App bundles**, klik **Upload** dan pilih file:
   `pandujatip-probable-giggle\flutter_app\build\app\outputs\bundle\release\app-release.aab`
4. Masukkan **Release name**: 1.0.0 (1) - Rilis Awal Produksi.
5. Masukkan **Release notes**:
   ```text
   Rilis perdana aplikasi Maintenance Tool Online dengan fitur Live 2D Plant Flow Health Monitoring, Carbon Brush Early Warning, Negatif List, dan Service Log.
   ```
6. Klik **Next**, periksa tidak ada error merah, lalu klik **Save** dan **Start rollout to Internal testing**.
7. Tambahkan email tim Anda sebagai internal tester agar bisa langsung mendownload dari link Play Store!
