# PROSES.md

## 1. Persona dan masalahnya

Persona yang saya dapat adalah ibu rumah tangga. Di awal bulan ia membagi uang belanja ke beberapa amplop, misalnya untuk dapur, listrik dan air, transport, dan sekolah anak. Masalahnya, ia sering tidak tahu sisa uang di tiap amplop. Akibatnya ada amplop yang sudah habis di tengah bulan, sementara amplop lain masih banyak sisanya. Lewat aplikasi ini ia bisa mencatat pemasukan dan pengeluaran, lalu melihat sisa tiap amplop dan mana yang sudah habis.

## 2. Rancangan struktur data

Data disimpan di localStorage dengan dua key. Key transaksi sudah dipakai sejak W1 sampai W6, sedangkan key amplop baru dibuat saat mengerjakan fitur khas.

Satu transaksi disimpan sebagai objek di dalam array:

```js
{
  id: 1739251200000,        // id unik dari Date.now()
  tanggal: "2026-10-19",    // teks dari input date, formatnya yyyy-mm-dd
  jenis: "pengeluaran",     // "pemasukan" atau "pengeluaran"
  kategori: "Belanja Dapur",
  nominal: 25000,           // angka, bukan teks
  catatan: "Sayur"          // boleh kosong
}
```

Satu amplop (masih rencana) bentuknya seperti ini:

```js
{ id: 1, nama: "Belanja Dapur", jatah: 1500000 }
```

Nominal saya simpan sebagai angka supaya bisa dijumlahkan dengan reduce. Kalau tersimpan sebagai teks, "1000" + "500" malah jadi "1000500". Format Rupiah baru dibuat saat data ditampilkan, lewat fungsi formatRupiah().

## 3. Keputusan desain

Saya memutuskan nama kategori pengeluaran dibuat sama persis dengan nama amplop, dan sisa amplop dihitung dari data transaksi, bukan disimpan sebagai angka sendiri.

Alasannya, fitur amplop jadi memakai data transaksi yang sama sehingga tidak ada dua data yang harus dijaga supaya cocok. Kalau sisa disimpan terpisah, sisa itu bisa tidak berubah ketika sebuah transaksi dihapus. Kalau dihitung ulang setiap kali tampilan dibuat (jatah dikurangi total pengeluaran di kategori itu), hasilnya selalu sesuai dengan isi daftar transaksi. Kekurangannya, nama amplop tidak boleh diganti sembarangan karena transaksi lama mencatat kategorinya lewat nama.

## 4. Bug dan kendala

### Bug 1: daftar transaksi tidak muncul (W2)

Setelah mengerjakan W2, halaman hanya menampilkan header, form, dan footer. Judul Daftar Transaksi dan tulisan "Belum ada transaksi." tidak ada. Saya membandingkan tampilan dengan isi index.html, lalu sadar script.js mencari elemen daftar-transaksi dan pesan-kosong yang ternyata tidak ada di HTML. Penyebabnya, section bagian-daftar belum saya tempel ke dalam main. Setelah section itu ditambahkan dengan id yang sama persis seperti di JavaScript, daftar langsung tampil.

### Bug 2: jenis transaksi tidak terlihat di daftar (W2)

Waktu mencoba menambah beberapa transaksi, saya tidak bisa membedakan mana pemasukan dan mana pengeluaran karena daftar hanya menampilkan tanggal, kategori, dan nominal. Datanya sebenarnya sudah benar di array. Masalahnya ada di renderDaftar(), tempat teks dirakit tanpa memasukkan t.jenis. Saya tambahkan label "Pemasukan" atau "Pengeluaran" ke teks, lalu memberi warna berbeda lewat kelas CSS pemasukan dan pengeluaran.

### Bug 3: form tidak kosong setelah klik Simpan (W5)

Setelah klik Simpan, transaksi masuk ke daftar tetapi kolom nominal masih berisi angka yang tadi saya ketik. Saya buka console dan ada error "Cannot set properties of null". Ternyata hitungRingkasan() dipanggil di tambahTransaksi() sebelum formTransaksi.reset(), sedangkan section Ringkasan belum ada di index.html. Karena getElementById mengembalikan null, fungsi itu error dan membuat tambahTransaksi() berhenti, jadi baris reset() tidak pernah dijalankan. Setelah section Ringkasan saya tempel ke HTML dengan id total-pemasukan, total-pengeluaran, dan saldo, form kembali kosong seperti seharusnya.

### Kendala 4: data belum tersimpan dan ada kode ganda (W4)

Waktu memeriksa script.js setelah menempel kode W4, ternyata tambahTransaksi() belum memanggil simpanData(), bagian bawah file belum memanggil muatData(), dan di hapusTransaksi() ada blok filter dan renderDaftar() yang tertulis dua kali. Kalau dibiarkan, transaksi baru akan hilang saat halaman di-refresh dan data yang tersimpan tidak pernah dibaca lagi. Saya perbaiki dengan memanggil simpanData() setelah push dan setelah filter, memanggil muatData() sebelum renderDaftar() saat halaman dibuka, dan menghapus bagian yang dobel.

## 5. Catatan tambahan

Di validasi form (W6), nominal saya periksa sebagai teks dulu (apakah sama dengan "") sebelum diubah jadi angka. Alasannya, Number("") hasilnya 0, jadi kolom kosong dan nominal 0 tidak bisa dibedakan kalau langsung diubah ke angka.