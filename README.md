# PLIRM34 WEB APLIKASI

Prototype aplikasi digitalisasi unit kerja `PLIRM34` dengan frontend web, backend Python, dan database SQLite.

## Stack

- Frontend: `index.html`, `styles.css`, `app.js`
- Backend: `server.py`
- Database: `SQLite` (`plirm34.db`)

## Fitur yang sudah aktif

- login, sign up, logout
- role `admin`, `organik`, dan `team`
- manajemen user untuk admin
- modul `Negatif List`, `Sparepart`, `Service`, `BOM`, dan `SPB`
- penyimpanan data ke database lewat API backend
- fallback ke `localStorage` jika backend belum dijalankan

## Akun awal

- `admin.plirm34 / admin123`
- `organik.plirm34 / organik123`
- `team.plirm34 / team123`

## Menjalankan aplikasi

1. Buka terminal di folder proyek.
2. Jalankan backend:

```powershell
python server.py --host 0.0.0.0 --port 8015
```

3. Buka browser ke:

```text
http://127.0.0.1:8015
```

Jika ingin dibuka dari HP pada jaringan yang sama, gunakan IP laptop/PC ini, misalnya:

```text
http://192.168.x.x:8015
```

## Endpoint utama

- `GET /api/health`
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/logout`
- `GET /api/bootstrap`
- `PUT /api/sync/<resource>`
- `GET /api/users`
- `PUT /api/users/<username>/role`
- `GET /api/items/<resource>`
- `GET /api/items/<resource>/<id>`
- `POST /api/items/<resource>`
- `PUT /api/items/<resource>/<id>`
- `DELETE /api/items/<resource>/<id>`
- `GET /api/masters`
- `GET /api/admin/backup`
- `POST /api/admin/restore`
- `GET /api/reports/export/<resource>`

## Catatan

- database lokal disimpan di file `plirm34.db`
- data utama sekarang sudah memakai tabel nyata per modul:
  - `negatif_list_items`
  - `sparepart_items`
  - `service_items`
  - `bom_items`
  - `spb_items`
- backend sekarang juga mendukung CRUD per item dan validasi role edit:
  - `admin`: semua modul
  - `organik`: `negatif-list`
  - `team`: `service`
- tabel `app_state` masih dipertahankan sementara untuk kompatibilitas migrasi dari versi prototype sebelumnya
