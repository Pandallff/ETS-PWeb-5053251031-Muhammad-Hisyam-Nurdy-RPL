1. Alur kerja dan daftar fitur per checkpoint
Prompt: "aku mendapatkan persona 4, berikan aku alur kerja mulai dari kerangka kode harus bikin apa serta fitur apa sesuai check point"
Dipakai: pembagian tiga checkpoint (W1-W4, W5-W6 dan fitur amplop, lalu bonus dan dokumen), daftar fungsi yang perlu dibuat di script.js (simpanData, muatData, tambahTransaksi, hapusTransaksi, renderDaftar, hitungRingkasan, formatRupiah, validasiForm, dan fungsi amplop), serta struktur file index.html, style.css, script.js.
Diubah: tidak ada kode di tahap ini. Daftar fungsi saya pakai sebagai panduan urutan kerja.

2. Kerangka index.html
Prompt: "buatkan saya template kerangka untuk file index.html"
Dipakai: kerangka halaman (head, header dengan logo emoji, main, footer, dan tag script di bawah).
Diubah: seluruh isi main saya hapus supaya fitur bisa dikerjakan satu per satu sesuai urutan W1 sampai W6.

3. W1: form tambah transaksi
Prompt: "Sekarang mengerjakan soal W1, yaitu form berisi tanggal, jenis (pemasukan/pengeluaran), kategori (pilihan tetap, minimal 4), nominal, dan catatan opsional"
Dipakai: section form di index.html (6 pilihan kategori) dan fungsi tambahTransaksi() di script.js yang membaca isi form menjadi satu objek transaksi, memasukkannya ke array dengan push, lalu mengosongkan form.
Diubah: versi W1 hanya menampilkan array lewat console.log. Bagian itu saya ganti dengan versi W2 (lihat nomor 4).

4. W2: daftar transaksi
Prompt: "lanjut ke W2, yaitu daftar transaksi dirender dinamis dari data JavaScript, bukan ditulis langsung di HTML; transaksi terbaru di atas; nominal tampil dalam format Rupiah"
Dipakai: section daftar di index.html, serta fungsi formatRupiah() dan renderDaftar() di script.js (urutan terbaru di atas dengan slice dan sort, isi daftar dibuat dengan forEach dan createElement).
Diubah: kode W1 di script.js diganti dengan kode W2, yaitu console.log diganti renderDaftar() dan ada satu pemanggilan renderDaftar() di akhir file.

5. Daftar transaksi tidak muncul
Prompt: "Mengapa bagian daftar transaksi tidak muncul pada website dan berikan solusinya"
Dipakai: section bagian-daftar yang ternyata belum saya tempel ke index.html. Saya juga memakai saran mengubah urutan kategori.
Diubah: section daftar saya tempel ke dalam main. Urutan kategori saya ubah supaya "Belanja Dapur" menjadi pilihan pertama dan "Uang Belanja" ada di paling bawah, karena jenis default adalah pengeluaran.

6. W3: hapus transaksi dengan konfirmasi
Prompt: "lanjut ke W3, yaitu fitur menghapus transaksi, dan saat ingin menghapus akan ada notifikasi untuk meyakinkan user jadi untuk menghapus transaksi atau tidak"
Dipakai: renderDaftar() versi baru yang menambahkan tombol Hapus di setiap baris, dan fungsi hapusTransaksi(id) yang memakai confirm() lalu filter.
Diubah: renderDaftar() versi W2 saya ganti dengan versi baru. Hasilnya masih saya sesuaikan lagi di nomor 7 karena ada bagian yang tertulis ganda.

7. W4: data tetap ada setelah refresh
Prompt: "buat fungsi agar data tetap ada saat website direfresh atau ditutup"
Dipakai: konstanta KUNCI_TRANSAKSI, fungsi simpanData() (JSON.stringify ke localStorage), dan muatData() (JSON.parse, dengan pengecekan null saat data belum ada).
Diubah: waktu pertama kali menempel, saya belum memanggil simpanData() di tambahTransaksi(), belum memanggil muatData() di bagian bawah file, dan di hapusTransaksi() ada blok filter dan renderDaftar() yang tertulis dua kali. Saya minta kode yang sudah dirapikan, lalu memperbaiki script.js sesuai versi itu.

8. W5: ringkasan
Prompt: "kerjakan W5, fitur ringkasan: total pemasukan, total pengeluaran, dan saldo; diperbarui otomatis setiap ada perubahan data"
Dipakai: section Ringkasan di index.html, tiga variabel elemen di script.js, dan fungsi hitungRingkasan() (filter lalu reduce untuk menjumlahkan nominal). Fungsi ini dipanggil di tambahTransaksi(), hapusTransaksi(), dan bagian bawah file.
Diubah: kode JavaScript saya tempel lebih dulu daripada section HTML-nya, sehingga muncul error. Perbaikannya ada di nomor 9.

9. Debugging: jenis transaksi dan ringkasan tidak tampil
Prompt: "terjadi bug yaitu saat memasukkan transaksi tidak ada keterangan pengeluaran atau pemasukan dan ringkasan tidak tampil"
Dipakai: penjelasan penyebab dan perbaikannya.
Diubah: saya tempel section Ringkasan ke index.html. Di renderDaftar() saya tambahkan t.jenis (label "Pemasukan" atau "Pengeluaran") ke teks tiap transaksi. Penyebab form tidak kosong setelah Simpan ternyata sama: hitungRingkasan() error karena elemennya belum ada, sehingga formTransaksi.reset() tidak pernah dijalankan.

10. W6: validasi form
Prompt: "tambahkan fitur W6, yaitu validasi form: nominal harus lebih dari 0 dan field wajib terisi; pesan error tampil di halaman, tidak cukup hanya alert()"
Dipakai: elemen p untuk pesan error di dalam form, variabel elemenPesanError di script.js, fungsi validasiForm(), dan versi baru tambahTransaksi() yang membaca isian form ke variabel, memvalidasinya dulu, baru membuat objek transaksi kalau lolos.
Diubah: tambahTransaksi() versi sebelumnya saya ganti dengan versi baru.