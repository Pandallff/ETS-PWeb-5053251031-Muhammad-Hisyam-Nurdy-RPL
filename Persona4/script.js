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

    // Isi teks: tanggal | kategori | catatan | nominal
    let teks = t.tanggal + " | " + t.kategori;
    if (t.catatan !== "") {
      teks = teks + " | " + t.catatan;
    }
    teks = teks + " | " + formatRupiah(t.nominal);

    // Teks ditaruh di <span>
    const spanTeks = document.createElement("span");
    spanTeks.textContent = teks;

    // Tombol hapus untuk transaksi ini
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", function () {
      hapusTransaksi(t.id); // kirim id transaksi yang mau dihapus
    });

    // Masukkan teks dan tombol ke <li>, lalu <li> ke <ul>
    item.appendChild(spanTeks);
    item.appendChild(tombolHapus);
    elemenDaftar.appendChild(item);
  });
}

// Fungsi: hapus satu transaksi berdasarkan id, setelah user konfirmasi
function hapusTransaksi(id) {
  // confirm() memunculkan kotak OK / Cancel
  const yakin = confirm("Yakin ingin menghapus transaksi ini?");

  // Kalau user pilih Cancel, hentikan fungsi, data tidak dihapus
  if (yakin === false) {
    return;
  }

  // Simpan semua transaksi KECUALI yang id-nya sama dengan id yang dihapus
  daftarTransaksi = daftarTransaksi.filter(function (t) {
    return t.id !== id;
  });

  // Tampilkan ulang daftar
  renderDaftar();
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