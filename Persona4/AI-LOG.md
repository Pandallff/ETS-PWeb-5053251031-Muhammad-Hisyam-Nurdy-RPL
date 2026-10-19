## 1
Menentukan Alur kerja serta fitur yang dibutuhkan :
Prompt : aku mendapatkan persona 4, berikan aku alur kerja mulai dari kerangka kode harus bikin apa serta fitur apa sesuai check point

hasil :

Kerangka file
index.html: header, kartu ringkasan, bagian amplop, form transaksi, daftar transaksi.
style.css
script.js
README.md, AI-LOG.md, PROSES.md

Fungsi di script.js (satu tugas satu fungsi):

Fungsi	Tugas
simpanData() / muatData()	JSON.stringify dan JSON.parse untuk kedua key
tambahTransaksi()	baca form, validasi, push, simpan, render
hapusTransaksi(id)	confirm, lalu filter
renderDaftar()	tampilkan daftar, terbaru di atas
hitungRingkasan()	reduce untuk pemasukan, pengeluaran, saldo
formatRupiah(angka)	toLocaleString("id-ID")
validasiForm()	tampilkan pesan error di elemen halaman
hitungSisaAmplop(amplop)	jatah dikurangi pengeluaran terkait
renderAmplop()	kartu amplop, sisa, dan tanda “HABIS”
simpanAmplop()	atur nominal tiap amplop
Checkpoint 1 (15.30–16.30): fondasi dan W1–W4
Buat repo publik, aktifkan GitHub Pages sekarang juga, lalu commit awal berisi README (persona dan masalahnya dengan kata-katamu sendiri, 2–3 kalimat).
Buat kerangka HTML, CSS, dan JS yang kosong tapi terhubung. Pastikan tidak ada error di console.
W1: form tanggal, jenis, kategori (minimal 4), nominal, dan catatan opsional.
W2: renderDaftar() dirender dari array, bukan ditulis di HTML.
W3: tombol hapus dengan confirm().
W4: simpanData() dan muatData(), lalu uji dengan refresh.

Contoh pesan commit: W1–W4: form tambah, daftar dinamis, hapus, simpan ke localStorage

Checkpoint 2 (16.30–17.40): W5, W6, dan fitur khas amplop
W5: hitungRingkasan(), dipanggil setelah setiap tambah atau hapus.
W6: validasi nominal lebih dari 0 dan semua field wajib terisi. Error tampil di <p> di halaman, bukan alert().
Amplop, langkah berurutan:
Seed 4 amplop default saat key kosong.
Form atau input untuk mengatur nominal tiap amplop (minimal 3 pos).
Isi dropdown kategori pengeluaran dari daftar amplop.
renderAmplop(): tampilkan jatah, terpakai, dan sisa tiap amplop.
Tandai amplop dengan sisa <= 0 (kelas CSS merah dan teks “HABIS”).
Panggil renderAmplop() setiap transaksi berubah, termasuk hapus.

Contoh pesan commit: W5–W6 dan fitur amplop: sisa per amplop dan penanda habis

Checkpoint 3 (17.40–18.15): bonus, dokumen, dan kumpul
Bonus (urut dari termudah, targetnya minimal 3): responsif 360px (@media atau Flexbox/Grid), filter jenis atau kategori, ekspor JSON, edit transaksi.
Isi README: nama dan NRP, persona, fitur yang selesai, dan fitur yang belum selesai.
Isi AI-LOG.md dan PROSES.md (minimal 2 bug beserta solusinya).
Cek link GitHub Pages dan console, lalu kumpulkan dua link di Classroom sebelum 18.15, bukan 18.30.


## 2
membuat kerangka kode index.html
prompt : buatkan saya temmplate kerangka untuk file index.html

hasil: 
<!DOCTYPE html>
<html lang="id">
<head>
  <!-- Pengaturan dasar halaman -->
  <meta charset="UTF-8">
  <!-- viewport supaya tampilan pas di layar HP (bonus responsif 360px) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Catatan Keuangan Amplop</title>
 
  <!-- Hubungkan ke file CSS -->
  <link rel="stylesheet" href="style.css">
</head>
<body>
 
  <!-- ===== HEADER: logo + judul aplikasi ===== -->
  <header>
    <!-- Logo sederhana pakai emoji. Kalau mau gambar: <img src="logo.png" alt="Logo" width="40"> -->
    <span class="logo">💰</span>
    <h1>Catatan Keuangan Amplop</h1>
  </header>
 
  <main>
 <!-- ===== W5: RINGKASAN (diisi otomatis oleh hitungRingkasan() di script.js) ===== -->
    <section id="ringkasan">
      <h2>Ringkasan</h2>
      <div class="kotak-ringkasan">
        <div class="kartu">
          <p>Total Pemasukan</p>
          <strong id="total-pemasukan">Rp 0</strong>
        </div>
        <div class="kartu">
          <p>Total Pengeluaran</p>
          <strong id="total-pengeluaran">Rp 0</strong>
        </div>
        <div class="kartu">
          <p>Saldo</p>
          <strong id="saldo">Rp 0</strong>
        </div>
      </div>
    </section>
 
    <!-- ===== FITUR KHAS: AMPLOP (diisi oleh renderAmplop() di script.js) ===== -->
    <section id="bagian-amplop">
      <h2>Amplop Bulan Ini</h2>
 
      <!-- Tempat kartu amplop: nama, jatah, sisa, dan tanda HABIS -->
      <div id="daftar-amplop"></div>
 
      <!-- Pengaturan nominal tiap amplop (input dibuat oleh JS, minimal 3 pos) -->
      <h3>Atur Nominal Amplop</h3>
      <div id="pengaturan-amplop"></div>
      <button type="button" id="tombol-simpan-amplop">Simpan Amplop</button>
      <p id="pesan-amplop" class="pesan"></p>
    </section>
 
    <!-- ===== W1 + W6: FORM TAMBAH TRANSAKSI ===== -->
    <section id="bagian-form">
      <h2>Tambah Transaksi</h2>
 
      <form id="form-transaksi">
 
        <label for="tanggal">Tanggal</label>
        <input type="date" id="tanggal">
 
        <label for="jenis">Jenis</label>
        <!-- Kalau jenis diganti, isi pilihan kategori ikut berubah (diatur di JS) -->
        <select id="jenis">
          <option value="pengeluaran">Pengeluaran</option>
          <option value="pemasukan">Pemasukan</option>
        </select>
 
        <label for="kategori">Kategori</label>
        <!-- Pilihan kategori diisi oleh JS (pengeluaran = nama amplop) -->
        <select id="kategori"></select>
 
        <label for="nominal">Nominal (Rp)</label>
        <input type="number" id="nominal" placeholder="contoh: 25000">
 
        <label for="catatan">Catatan (opsional)</label>
        <input type="text" id="catatan" placeholder="contoh: beli sayur">
 
        <!-- W6: pesan error tampil di sini, bukan alert() -->
        <p id="pesan-error" class="pesan error"></p>
 
        <button type="submit" id="tombol-simpan">Simpan</button>
      </form>
    </section>
 
    <!-- ===== W2 + W3: DAFTAR TRANSAKSI (dirender oleh renderDaftar() di script.js) ===== -->
    <section id="bagian-daftar">
      <h2>Daftar Transaksi</h2>
 
      <!-- BONUS filter: hapus bagian ini kalau tidak sempat -->
      <div class="filter">
        <select id="filter-jenis">
          <option value="semua">Semua jenis</option>
          <option value="pemasukan">Pemasukan</option>
          <option value="pengeluaran">Pengeluaran</option>
        </select>
        <input type="text" id="cari" placeholder="Cari catatan...">
      </div>
 
      <!-- Pesan kalau belum ada data -->
      <p id="pesan-kosong">Belum ada transaksi.</p>
 
      <!-- Setiap transaksi ditambahkan ke sini sebagai <li> oleh JS -->
      <ul id="daftar-transaksi"></ul>
    </section>
 
    <!-- ===== BONUS: BACKUP DATA (ekspor / impor JSON) ===== -->
    <section id="bagian-backup">
      <h2>Backup Data</h2>
      <button type="button" id="tombol-ekspor">Ekspor JSON</button>
      <!-- input file disembunyikan lewat CSS atau dibiarkan saja -->
      <input type="file" id="input-impor" accept=".json">
    </section>
  </main>
 
  <footer>
    <p>ETS Pemrograman Web - Persona: Ibu Rumah Tangga</p>
  </footer>
 
  <!-- Hubungkan ke file JavaScript. Ditaruh paling bawah supaya elemen HTML sudah ada saat JS jalan -->
  <script src="script.js"></script>
</body>
</html>

Digunakan : 
seluruh isi di main dihapus agar dapat dikerjakan terpisah dan urut

## 3 mengerjakan soal W1

Prompt : Sekarang mengerjakan Soal W1  yaitu Form berisi tanggal, jenis (pemasukan/pengeluaran), kategori (pilihan tetap, minimal 4), nominal, dan catatan opsional

hasil :

-html
<main>

  <!-- ===== W1: FORM TAMBAH TRANSAKSI ===== -->
  <section id="bagian-form">
    <h2>Tambah Transaksi</h2>

    <form id="form-transaksi">

      <!-- Tanggal transaksi -->
      <label for="tanggal">Tanggal</label>
      <input type="date" id="tanggal">

      <!-- Jenis: pemasukan atau pengeluaran -->
      <label for="jenis">Jenis</label>
      <select id="jenis">
        <option value="pengeluaran">Pengeluaran</option>
        <option value="pemasukan">Pemasukan</option>
      </select>

      <!-- Kategori: pilihan tetap (minimal 4) -->
      <label for="kategori">Kategori</label>
      <select id="kategori">
        <option value="Uang Belanja">Uang Belanja</option>
        <option value="Belanja Dapur">Belanja Dapur</option>
        <option value="Listrik & Air">Listrik &amp; Air</option>
        <option value="Transport">Transport</option>
        <option value="Sekolah Anak">Sekolah Anak</option>
        <option value="Lainnya">Lainnya</option>
      </select>

      <!-- Nominal: angka -->
      <label for="nominal">Nominal (Rp)</label>
      <input type="number" id="nominal" placeholder="contoh: 25000">

      <!-- Catatan: boleh dikosongkan -->
      <label for="catatan">Catatan (opsional)</label>
      <input type="text" id="catatan" placeholder="contoh: beli sayur">

      <button type="submit">Simpan</button>
    </form>
  </section>

</main>

-js
// Array untuk menampung semua transaksi
let daftarTransaksi = [];

// Ambil elemen form dari HTML
const formTransaksi = document.getElementById("form-transaksi");

// Fungsi ini jalan saat tombol Simpan diklik
function tambahTransaksi(event) {
  // Cegah halaman reload otomatis saat form dikirim
  event.preventDefault();

  // Buat satu objek transaksi dari isi form
  const transaksiBaru = {
    id: Date.now(), // id unik dari waktu sekarang
    tanggal: document.getElementById("tanggal").value,
    jenis: document.getElementById("jenis").value,
    kategori: document.getElementById("kategori").value,
    nominal: Number(document.getElementById("nominal").value), // jadi angka, bukan teks
    catatan: document.getElementById("catatan").value
  };

  // Masukkan ke array
  daftarTransaksi.push(transaksiBaru);

  // Cek hasilnya di console dulu (daftar tampil di W2)
  console.log(daftarTransaksi);

  // Kosongkan form
  formTransaksi.reset();
}

// Pasang event listener: saat form di-submit, jalankan tambahTransaksi
formTransaksi.addEventListener("submit", tambahTransaksi);

## 4 mengerjakan soal W2
prompt : oke sekarang lanjut ke W2 yaitu Daftar transaksi    Dirender dinamis dari data JavaScript, bukan ditulis langsung di HTML; transaksi terbaru di atas; nominal tampil dalam format Rupiah

Dipakai :

html

<!-- ===== W2: DAFTAR TRANSAKSI ===== -->
<section id="bagian-daftar">
  <h2>Daftar Transaksi</h2>

  <!-- Pesan ini tampil kalau belum ada transaksi -->
  <p id="pesan-kosong">Belum ada transaksi.</p>

  <!-- Isi <ul> ini sengaja kosong, nanti diisi oleh JavaScript -->
  <ul id="daftar-transaksi"></ul>
</section>

js

// Array untuk menampung semua transaksi
let daftarTransaksi = [];

// Ambil elemen dari HTML
const formTransaksi = document.getElementById("form-transaksi");
const elemenDaftar = document.getElementById("daftar-transaksi");
const pesanKosong = document.getElementById("pesan-kosong");

// Fungsi: ubah angka jadi format Rupiah, contoh 25000 -> "Rp 25.000"
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Fungsi: tampilkan semua transaksi dari array ke halaman
function renderDaftar() {
  // Kosongkan daftar dulu supaya tidak dobel setiap kali dirender ulang
  elemenDaftar.innerHTML = "";

  // Tampilkan atau sembunyikan pesan "Belum ada transaksi"
  if (daftarTransaksi.length === 0) {
    pesanKosong.style.display = "block";
  } else {
    pesanKosong.style.display = "none";
  }

  // Salin array lalu urutkan: id terbesar (paling baru) di atas
  const urut = daftarTransaksi.slice().sort(function (a, b) {
    return b.id - a.id;
  });

  // Untuk setiap transaksi, buat satu <li> lalu masukkan ke <ul>
  urut.forEach(function (t) {
    const item = document.createElement("li");
    item.className = t.jenis; // kelas "pemasukan" atau "pengeluaran" (untuk warna di CSS)

    // Isi teks: tanggal - kategori - catatan - nominal
    let teks = t.tanggal + " | " + t.kategori;
    if (t.catatan !== "") {
      teks = teks + " | " + t.catatan;
    }
    teks = teks + " | " + formatRupiah(t.nominal);

    item.textContent = teks;
    elemenDaftar.appendChild(item);
  });
}

// Fungsi ini jalan saat tombol Simpan diklik
function tambahTransaksi(event) {
  // Cegah halaman reload otomatis saat form dikirim
  event.preventDefault();

  // Buat satu objek transaksi dari isi form
  const transaksiBaru = {
    id: Date.now(),
    tanggal: document.getElementById("tanggal").value,
    jenis: document.getElementById("jenis").value,
    kategori: document.getElementById("kategori").value,
    nominal: Number(document.getElementById("nominal").value),
    catatan: document.getElementById("catatan").value
  };

  // Masukkan ke array, lalu tampilkan ulang daftarnya
  daftarTransaksi.push(transaksiBaru);
  renderDaftar();

  // Kosongkan form
  formTransaksi.reset();
}

// Saat form di-submit, jalankan tambahTransaksi
formTransaksi.addEventListener("submit", tambahTransaksi);

// Tampilkan daftar saat halaman pertama dibuka (supaya pesan kosong muncul)
renderDaftar();

diubah : 
js hasil promt soal W1 diganti menggunakan kode yang ini

Yang berubah dari W1: console.log diganti renderDaftar(), ditambah fungsi formatRupiah() dan renderDaftar(), serta satu pemanggilan renderDaftar() di akhir file.

