# PLIRM34 WEB APLIKASI

Aplikasi web operasional untuk digitalisasi unit kerja `PLIRM34`, terdiri dari frontend web, backend Python, dan database SQLite lokal.

## Stack

- Frontend: `index.html`, `styles.css`, `app.js`
- Backend: `server.py`
- Database: `SQLite` di file `plirm34.db`

## Fitur Aktif

- autentikasi `login`, `sign up`, `logout`
- role `admin`, `organik`, dan `team`
- manajemen role user oleh admin
- modul `Dashboard`, `Negatif List`, `Sparepart`, `Service`, `BOM`, `SPB`
- backend CRUD item-level untuk semua modul utama
- backup, restore, export CSV, dan master management dari panel admin
- audit trail atau log aktivitas user
- import data referensi dan import data operasional tertentu dari CSV / Google Sheets
- akses LAN sehingga aplikasi bisa dibuka dari HP dalam jaringan yang sama

## Service Module

Submenu `Service` yang sudah tersedia:

- `Electrical Room`
- `Motor MV`
- `Motor MV (Carbon Brush)`
- `EH/CA`
- `Instrument`
- `DCS`

Fitur penting pada `Service`:

- detail hasil inspeksi
- analisa otomatis berdasarkan isian
- export / kirim hasil inspeksi
- monitoring tren `Carbon Brush`
- penandaan titik penggantian `Carbon Brush`
- threshold admin untuk `Carbon Brush`
- threshold admin untuk `Electrical Room`:
  - battery charge
  - battery per cell
  - temperatur winding trafo
  - temperatur oil trafo

## Master Data Admin

Master data yang saat ini bisa dikelola dari web:

- `areas`
- `equipment_reference`
- `inspection_templates`
- referensi `Electrical Room`
- `app_settings` untuk threshold dan parameter analisa

## Audit Log

Halaman `Log Aktivitas` untuk admin mencatat aktivitas berikut:

- login
- logout
- signup
- create
- update
- delete
- save master
- import
- restore backup
- perubahan role user

## Akun Awal

- `admin.plirm34 / admin123`
- `organik.plirm34 / organik123`
- `team.plirm34 / team123`

## Menjalankan Aplikasi

1. Buka terminal di folder proyek.
2. Jalankan backend:

```powershell
python server.py --host 0.0.0.0 --port 8017
```

3. Buka aplikasi dari browser lokal:

```text
http://127.0.0.1:8017
```

4. Jika ingin dibuka dari HP dalam jaringan yang sama, gunakan IP laptop/PC:

```text
http://192.168.x.x:8017
```

## Endpoint Utama

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `GET /api/bootstrap`
- `GET /api/items/<resource>`
- `GET /api/items/<resource>/<id>`
- `POST /api/items/<resource>`
- `PUT /api/items/<resource>/<id>`
- `DELETE /api/items/<resource>/<id>`
- `GET /api/masters`
- `GET /api/reports/export/<resource>`
- `GET /api/reports/service-summary`
- `GET /api/admin/backup`
- `POST /api/admin/restore`
- `GET /api/admin/activity-logs`
- `GET /api/admin/masters/<resource>`
- `POST /api/admin/masters/<resource>`
- `DELETE /api/admin/masters/<resource>/<id>`
- `POST /api/admin/import/<resource>`
- `POST /api/admin/import-carbon-brush`
- `POST /api/admin/import-negatif-list`

## Catatan Teknis

- tabel utama modul:
  - `negatif_list_items`
  - `sparepart_items`
  - `service_items`
  - `bom_items`
  - `spb_items`
- tabel detail service sudah dipisah per subtype untuk fondasi laporan yang lebih kuat
- tabel `app_state` masih dipertahankan untuk kompatibilitas migrasi dari versi awal
- bila backend tidak aktif, frontend masih punya fallback `localStorage`, tetapi mode utama aplikasi sekarang adalah backend + SQLite
