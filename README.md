# PLIRM34 Digital Workbench

Prototype web app statis untuk digitalisasi unit kerja `PLIRM34`.

## Fitur awal

- login awal dengan role `admin`, `organik`, dan `team`
- dashboard berisi negatif list dan pembelian barang dengan status `belum ada`
- menu `Negatif List`, `Sparepart`, `Inspeksi`, `BOM`, dan `SPB`
- data contoh untuk inspeksi `electrical`, `instrument`, dan `DCS`

## File utama

- `index.html` struktur aplikasi
- `styles.css` tema dan layout dashboard
- `app.js` alur login, logout, dan perpindahan menu

## Cara pakai

1. Buka `index.html` di browser.
2. Isi `username`, `password`, lalu pilih role.
3. Setelah masuk, klik menu di sidebar untuk melihat modul.

## Catatan

Saat ini ini masih prototype frontend. Login belum tersambung ke database dan semua data masih contoh statis.
