// Array untuk menampung semua transaksi
let daftarTransaksi = [];

// Nama "laci" di localStorage tempat transaksi disimpan
const KUNCI_TRANSAKSI = "transaksi";

// Ambil elemen dari HTML
const formTransaksi = document.getElementById("form-transaksi");
const elemenDaftar = document.getElementById("daftar-transaksi");
const pesanKosong = document.getElementById("pesan-kosong");

const elemenTotalPemasukan = document.getElementById("total-pemasukan");
const elemenTotalPengeluaran = document.getElementById("total-pengeluaran");
const elemenSaldo = document.getElementById("saldo");

const elemenPesanError = document.getElementById("pesan-error");

// Fungsi: simpan array transaksi ke localStorage
function simpanData() {
  // localStorage hanya bisa menyimpan teks, jadi array diubah dulu jadi teks JSON
  localStorage.setItem(KUNCI_TRANSAKSI, JSON.stringify(daftarTransaksi));
}

// Fungsi: baca data dari localStorage ke array
function muatData() {
  const dataTersimpan = localStorage.getItem(KUNCI_TRANSAKSI);

  // Kalau belum pernah ada data (pertama kali dibuka), biarkan array kosong
  if (dataTersimpan === null) {
    daftarTransaksi = [];
    return;
  }

  // Teks JSON diubah kembali jadi array objek
  daftarTransaksi = JSON.parse(dataTersimpan);
}

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

    // Isi teks: tanggal | kategori | catatan | nominal
        // Ubah jenis jadi label yang mudah dibaca
    let labelJenis = "Pengeluaran";
    if (t.jenis === "pemasukan") {
      labelJenis = "Pemasukan";
    }

    // Isi teks: tanggal | jenis | kategori | catatan | nominal
    let teks = t.tanggal + " | " + labelJenis + " | " + t.kategori;
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

// Fungsi: hitung total pemasukan, total pengeluaran, dan saldo, lalu tampilkan
function hitungRingkasan() {
  // Ambil hanya transaksi pemasukan, lalu jumlahkan nominalnya
  const totalPemasukan = daftarTransaksi
    .filter(function (t) {
      return t.jenis === "pemasukan";
    })
    .reduce(function (jumlah, t) {
      return jumlah + t.nominal;
    }, 0);

  // Sama, tapi untuk pengeluaran
  const totalPengeluaran = daftarTransaksi
    .filter(function (t) {
      return t.jenis === "pengeluaran";
    })
    .reduce(function (jumlah, t) {
      return jumlah + t.nominal;
    }, 0);

  // Saldo = pemasukan dikurangi pengeluaran
  const saldo = totalPemasukan - totalPengeluaran;

  // Tampilkan ke halaman dalam format Rupiah
  elemenTotalPemasukan.textContent = formatRupiah(totalPemasukan);
  elemenTotalPengeluaran.textContent = formatRupiah(totalPengeluaran);
  elemenSaldo.textContent = formatRupiah(saldo);
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

  // Simpan perubahan ke localStorage, lalu tampilkan ulang daftar
  simpanData();
  renderDaftar();
  hitungRingkasan();
}

// Fungsi: cek isian form. Mengembalikan true kalau semua benar, false kalau ada yang salah
function validasiForm(tanggal, jenis, kategori, nominalTeks) {
  // Tampung semua pesan error di array
  const daftarError = [];

  // Field wajib tidak boleh kosong
  if (tanggal === "") {
    daftarError.push("Tanggal wajib diisi.");
  }
  if (jenis === "") {
    daftarError.push("Jenis wajib dipilih.");
  }
  if (kategori === "") {
    daftarError.push("Kategori wajib dipilih.");
  }

  // Nominal: wajib diisi dan harus lebih dari 0
  if (nominalTeks === "") {
    daftarError.push("Nominal wajib diisi.");
  } else if (Number(nominalTeks) <= 0) {
    daftarError.push("Nominal harus lebih dari 0.");
  }

  // Kalau ada error, tampilkan di halaman lalu kembalikan false
  if (daftarError.length > 0) {
    elemenPesanError.textContent = daftarError.join(" ");
    return false;
  }

  // Kalau semua benar, hapus pesan error lama
  elemenPesanError.textContent = "";
  return true;
}

// Fungsi ini jalan saat tombol Simpan diklik
// Fungsi ini jalan saat tombol Simpan diklik
function tambahTransaksi(event) {
  // Cegah halaman reload otomatis saat form dikirim
  event.preventDefault();

  // Baca isi form ke variabel
  const tanggal = document.getElementById("tanggal").value;
  const jenis = document.getElementById("jenis").value;
  const kategori = document.getElementById("kategori").value;
  const nominalTeks = document.getElementById("nominal").value;
  const catatan = document.getElementById("catatan").value;

  // Validasi dulu. Kalau tidak lolos, hentikan fungsi, data tidak disimpan
  if (validasiForm(tanggal, jenis, kategori, nominalTeks) === false) {
    return;
  }

  // Buat satu objek transaksi dari isi form
  const transaksiBaru = {
    id: Date.now(),
    tanggal: tanggal,
    jenis: jenis,
    kategori: kategori,
    nominal: Number(nominalTeks),
    catatan: catatan
  };

  // Masukkan ke array, simpan ke localStorage, lalu tampilkan ulang
  daftarTransaksi.push(transaksiBaru);
  simpanData();
  renderDaftar();
  hitungRingkasan();

  // Kosongkan form
  formTransaksi.reset();
}

// Saat form di-submit, jalankan tambahTransaksi
formTransaksi.addEventListener("submit", tambahTransaksi);

// Saat halaman dibuka: baca data dulu, baru tampilka
muatData();
renderDaftar();
hitungRingkasan();