# Catatan Keuangan Amplop

ETS Pemrograman Web: Personal Money Management

Nama: Muhammad Hisyam Nurdy
NRP: 5053251031

Link aplikasi (GitHub Pages): https://pandallff.github.io/ETS-PWeb-5053251031-Muhammad-Hisyam-Nurdy-RPL/Persona4/index.html
Link repo: https://github.com/pandallff/ETS-PWeb-5053251031-Muhammad-Hisyam-Nurdy-RPL

## Persona

Persona yang saya dapat adalah persona 4, yaitu ibu rumah tangga. Di awal bulan ia membagi uang belanja ke beberapa amplop, misalnya untuk dapur, listrik dan air, transport, dan sekolah anak. Masalahnya, ia sering tidak tahu berapa sisa uang di tiap amplop, sehingga ada amplop yang habis lebih dulu padahal bulan belum selesai. Aplikasi ini membantunya mencatat uang masuk dan keluar, lalu menunjukkan sisa tiap amplop dan menandai amplop yang sudah habis.

## Fitur yang sudah selesai

Fitur wajib:

- W1: form tambah transaksi (tanggal, jenis, kategori dengan 6 pilihan tetap, nominal, catatan opsional)
- W2: daftar transaksi dirender dari data JavaScript, terbaru di atas, nominal berformat Rupiah
- W3: hapus transaksi dengan konfirmasi
- W4: data tetap ada setelah refresh atau browser ditutup (localStorage)
- W5: ringkasan total pemasukan, total pengeluaran, dan saldo yang diperbarui otomatis
- W6: validasi form (nominal harus lebih dari 0, field wajib terisi), pesan error tampil di halaman

Fitur khas persona (amplop):

- Nominal tiap amplop bisa diatur (ada 4 amplop: Belanja Dapur, Listrik & Air, Transport, Sekolah Anak)
- Pengeluaran mengurangi amplop yang kategorinya sama, memakai data transaksi yang sama di localStorage
- Sisa tiap amplop ditampilkan
- Amplop yang sisanya sudah 0 atau kurang diberi tanda HABIS

Fitur bonus:

- Edit transaksi yang sudah tersimpan
- Filter berdasarkan jenis dan kategori, serta pencarian kata kunci pada catatan
- Ekspor data ke file JSON dan impor kembali sebagai backup
- Tampilan responsif, rapi di layar HP 360px, dan tampil dalam satu layar di desktop

## Fitur yang belum selesai

- Budget per kategori dengan peringatan saat mendekati batas (tidak dikerjakan)
- Filter berdasarkan rentang tanggal (filter yang dibuat baru jenis, kategori, dan kata kunci)

## Catatan

- Sisa amplop dihitung dari semua pengeluaran di kategori yang sama, tidak dibatasi per bulan.
- Pengeluaran dengan kategori Lainnya dan Uang Belanja tidak mengurangi amplop mana pun.
- Data tersimpan di localStorage browser, jadi tidak ikut terbawa ke browser atau perangkat lain. Fitur ekspor dan impor JSON bisa dipakai untuk memindahkannya.

## Struktur file

- index.html: struktur halaman
- style.css: tampilan
- script.js: logika aplikasi
- AI-LOG.md: catatan penggunaan AI
- PROSES.md: proses pengerjaan, rancangan data, keputusan desain, dan bug