// ==========================================================
// DATA UTAMA
// ==========================================================

// Array untuk menampung semua transaksi dan semua amplop
let daftarTransaksi = [];
let daftarAmplop = [];

// Kalau tidak null, berarti form sedang dipakai untuk mengedit transaksi dengan id ini
let idSedangDiedit = null;

// Nama "laci" di localStorage
const KUNCI_TRANSAKSI = "transaksi";
const KUNCI_AMPLOP = "amplop";

// Amplop bawaan saat pertama kali dibuka (nama sama dengan kategori pengeluaran)
const AMPLOP_AWAL = [
  { id: 1, nama: "Belanja Dapur", jatah: 1500000 },
  { id: 2, nama: "Listrik & Air", jatah: 500000 },
  { id: 3, nama: "Transport", jatah: 400000 },
  { id: 4, nama: "Sekolah Anak", jatah: 600000 }
];

// ==========================================================
// AMBIL ELEMEN DARI HTML
// ==========================================================
const formTransaksi = document.getElementById("form-transaksi");
const elemenDaftar = document.getElementById("daftar-transaksi");
const pesanKosong = document.getElementById("pesan-kosong");

const elemenTotalPemasukan = document.getElementById("total-pemasukan");
const elemenTotalPengeluaran = document.getElementById("total-pengeluaran");
const elemenSaldo = document.getElementById("saldo");

const elemenPesanError = document.getElementById("pesan-error");
const tombolSimpan = document.getElementById("tombol-simpan");
const tombolBatal = document.getElementById("tombol-batal");

const elemenDaftarAmplop = document.getElementById("daftar-amplop");
const elemenPengaturan = document.getElementById("pengaturan-amplop");
const tombolSimpanAmplop = document.getElementById("tombol-simpan-amplop");
const elemenPesanAmplop = document.getElementById("pesan-amplop");

const filterJenis = document.getElementById("filter-jenis");
const filterKategori = document.getElementById("filter-kategori");
const kolomCari = document.getElementById("cari");

const tombolEkspor = document.getElementById("tombol-ekspor");
const inputImpor = document.getElementById("input-impor");
const elemenPesanBackup = document.getElementById("pesan-backup");

// ==========================================================
// W4: SIMPAN DAN MUAT DATA (localStorage)
// ==========================================================

// Fungsi: simpan transaksi dan amplop ke localStorage
function simpanData() {
  // localStorage hanya bisa menyimpan teks, jadi array diubah dulu jadi teks JSON
  localStorage.setItem(KUNCI_TRANSAKSI, JSON.stringify(daftarTransaksi));
  localStorage.setItem(KUNCI_AMPLOP, JSON.stringify(daftarAmplop));
}

// Fungsi: baca data dari localStorage ke array
function muatData() {
  // Transaksi
  const dataTransaksi = localStorage.getItem(KUNCI_TRANSAKSI);
  if (dataTransaksi === null) {
    daftarTransaksi = [];
  } else {
    daftarTransaksi = JSON.parse(dataTransaksi);
  }

  // Amplop: kalau belum pernah ada, pakai amplop bawaan lalu simpan
  const dataAmplop = localStorage.getItem(KUNCI_AMPLOP);
  if (dataAmplop === null) {
    daftarAmplop = JSON.parse(JSON.stringify(AMPLOP_AWAL)); // salinan, bukan aslinya
    simpanData();
  } else {
    daftarAmplop = JSON.parse(dataAmplop);
  }
}

// ==========================================================
// FUNGSI BANTU
// ==========================================================

// Fungsi: ubah angka jadi format Rupiah, contoh 25000 -> "Rp 25.000"
function formatRupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

// Fungsi: tampilkan ulang semua bagian halaman yang bergantung pada data
function perbaruiTampilan() {
  renderDaftar();
  hitungRingkasan();
  renderAmplop();
}

// ==========================================================
// W2 + BONUS FILTER: DAFTAR TRANSAKSI
// ==========================================================

// Fungsi: tampilkan transaksi (yang lolos filter) dari array ke halaman
function renderDaftar() {
  // Kosongkan daftar dulu supaya tidak dobel setiap kali dirender ulang
  elemenDaftar.innerHTML = "";

  // Baca pilihan filter saat ini
  const jenisDipilih = filterJenis.value;
  const kategoriDipilih = filterKategori.value;
  const kataKunci = kolomCari.value.trim().toLowerCase();

  // Ambil hanya transaksi yang cocok dengan semua filter
  const hasil = daftarTransaksi.filter(function (t) {
    if (jenisDipilih !== "semua" && t.jenis !== jenisDipilih) {
      return false;
    }
    if (kategoriDipilih !== "semua" && t.kategori !== kategoriDipilih) {
      return false;
    }
    if (kataKunci !== "" && t.catatan.toLowerCase().indexOf(kataKunci) === -1) {
      return false;
    }
    return true;
  });

  // Atur pesan kosong: belum ada data, atau tidak ada yang cocok dengan filter
  if (daftarTransaksi.length === 0) {
    pesanKosong.textContent = "Belum ada transaksi.";
    pesanKosong.style.display = "block";
  } else if (hasil.length === 0) {
    pesanKosong.textContent = "Tidak ada transaksi yang cocok.";
    pesanKosong.style.display = "block";
  } else {
    pesanKosong.style.display = "none";
  }

  // Salin array lalu urutkan: id terbesar (paling baru) di atas
  const urut = hasil.slice().sort(function (a, b) {
    return b.id - a.id;
  });

  // Untuk setiap transaksi, buat satu <li> lalu masukkan ke <ul>
  urut.forEach(function (t) {
    const item = document.createElement("li");
    item.className = t.jenis; // kelas "pemasukan" atau "pengeluaran" (untuk warna di CSS)

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

    // Tombol edit untuk transaksi ini (bonus)
    const tombolEdit = document.createElement("button");
    tombolEdit.textContent = "Edit";
    tombolEdit.className = "tombol-edit";
    tombolEdit.addEventListener("click", function () {
      mulaiEdit(t.id);
    });

    // Tombol hapus untuk transaksi ini
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", function () {
      hapusTransaksi(t.id); // kirim id transaksi yang mau dihapus
    });

    // Kedua tombol dibungkus satu <div> supaya sejajar
    const kotakTombol = document.createElement("div");
    kotakTombol.className = "aksi";
    kotakTombol.appendChild(tombolEdit);
    kotakTombol.appendChild(tombolHapus);

    // Masukkan teks dan tombol ke <li>, lalu <li> ke <ul>
    item.appendChild(spanTeks);
    item.appendChild(kotakTombol);
    elemenDaftar.appendChild(item);
  });
}

// ==========================================================
// W5: RINGKASAN
// ==========================================================

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

// ==========================================================
// FITUR KHAS: AMPLOP
// ==========================================================

// Fungsi: total pengeluaran yang kategorinya sama dengan nama amplop
function hitungTerpakai(namaAmplop) {
  return daftarTransaksi
    .filter(function (t) {
      return t.jenis === "pengeluaran" && t.kategori === namaAmplop;
    })
    .reduce(function (jumlah, t) {
      return jumlah + t.nominal;
    }, 0);
}

// Fungsi: sisa amplop = jatah dikurangi yang sudah terpakai
function hitungSisaAmplop(amplop) {
  return amplop.jatah - hitungTerpakai(amplop.nama);
}

// Fungsi: tampilkan kartu tiap amplop (jatah, terpakai, sisa, tanda HABIS)
function renderAmplop() {
  elemenDaftarAmplop.innerHTML = "";

  daftarAmplop.forEach(function (amplop) {
    const terpakai = hitungTerpakai(amplop.nama);
    const sisa = hitungSisaAmplop(amplop);

    // Kartu amplop. Kalau sisa 0 atau kurang, beri kelas "habis" (warna coral)
    const kartu = document.createElement("div");
    kartu.className = "amplop";
    if (sisa <= 0) {
      kartu.className = "amplop habis";
    }

    // Baris atas: nama amplop (dan tanda HABIS kalau perlu)
    const baris = document.createElement("div");
    baris.className = "amplop-atas";

    const judul = document.createElement("h4");
    judul.textContent = amplop.nama;
    baris.appendChild(judul);

    if (sisa <= 0) {
      const tanda = document.createElement("span");
      tanda.className = "tanda-habis";
      tanda.textContent = "HABIS";
      baris.appendChild(tanda);
    }

    // Baris info: terpakai dari jatah, lalu sisa
    const infoTerpakai = document.createElement("p");
    infoTerpakai.textContent = "Terpakai " + formatRupiah(terpakai) + " dari " + formatRupiah(amplop.jatah);

    const infoSisa = document.createElement("p");
    infoSisa.className = "sisa";
    infoSisa.textContent = "Sisa: " + formatRupiah(sisa);

    kartu.appendChild(baris);
    kartu.appendChild(infoTerpakai);
    kartu.appendChild(infoSisa);
    elemenDaftarAmplop.appendChild(kartu);
  });
}

// Fungsi: buat kolom input nominal untuk tiap amplop
function renderPengaturanAmplop() {
  elemenPengaturan.innerHTML = "";

  daftarAmplop.forEach(function (amplop) {
    const kotak = document.createElement("div");

    const label = document.createElement("label");
    label.textContent = amplop.nama;
    label.setAttribute("for", "jatah-" + amplop.id);

    const input = document.createElement("input");
    input.type = "number";
    input.id = "jatah-" + amplop.id;
    input.value = amplop.jatah;
    input.dataset.id = amplop.id; // simpan id amplop supaya mudah dicari saat disimpan

    kotak.appendChild(label);
    kotak.appendChild(input);
    elemenPengaturan.appendChild(kotak);
  });
}

// Fungsi: baca semua kolom nominal amplop, validasi, lalu simpan
function simpanAmplop() {
  const semuaInput = elemenPengaturan.querySelectorAll("input");

  // Cek dulu semuanya: tidak boleh kosong dan tidak boleh negatif
  for (let i = 0; i < semuaInput.length; i++) {
    const teks = semuaInput[i].value;
    if (teks === "" || Number(teks) < 0) {
      elemenPesanAmplop.textContent = "Nominal amplop wajib diisi dan tidak boleh negatif.";
      return;
    }
  }

  // Kalau semua benar, ubah jatah tiap amplop sesuai isian
  semuaInput.forEach(function (kolom) {
    const idAmplop = Number(kolom.dataset.id);
    const amplop = daftarAmplop.find(function (a) {
      return a.id === idAmplop;
    });
    amplop.jatah = Number(kolom.value);
  });

  simpanData();
  renderAmplop();
  elemenPesanAmplop.textContent = "Amplop berhasil disimpan.";
}

// ==========================================================
// W3: HAPUS TRANSAKSI
// ==========================================================

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

  // Kalau transaksi yang sedang diedit ikut terhapus, batalkan mode edit
  if (idSedangDiedit === id) {
    selesaiEdit();
  }

  // Simpan perubahan ke localStorage, lalu tampilkan ulang
  simpanData();
  perbaruiTampilan();
}

// ==========================================================
// BONUS: EDIT TRANSAKSI
// ==========================================================

// Fungsi: isi form dengan data transaksi yang mau diedit
function mulaiEdit(id) {
  const t = daftarTransaksi.find(function (item) {
    return item.id === id;
  });
  if (t === undefined) {
    return;
  }

  idSedangDiedit = id;
  document.getElementById("tanggal").value = t.tanggal;
  document.getElementById("jenis").value = t.jenis;
  document.getElementById("kategori").value = t.kategori;
  document.getElementById("nominal").value = t.nominal;
  document.getElementById("catatan").value = t.catatan;

  // Ubah tampilan form menjadi mode edit
  tombolSimpan.textContent = "Simpan Perubahan";
  tombolBatal.hidden = false;
  elemenPesanError.textContent = "";
  formTransaksi.scrollIntoView({ behavior: "smooth" });
}

// Fungsi: keluar dari mode edit, form kembali seperti biasa
function selesaiEdit() {
  idSedangDiedit = null;
  formTransaksi.reset();
  tombolSimpan.textContent = "Simpan";
  tombolBatal.hidden = true;
  elemenPesanError.textContent = "";
}

// ==========================================================
// W6: VALIDASI FORM
// ==========================================================

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

// ==========================================================
// W1: TAMBAH TRANSAKSI (juga dipakai untuk menyimpan hasil edit)
// ==========================================================

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

  if (idSedangDiedit === null) {
    // Mode tambah: buat satu objek transaksi baru lalu masukkan ke array
    const transaksiBaru = {
      id: Date.now(),
      tanggal: tanggal,
      jenis: jenis,
      kategori: kategori,
      nominal: Number(nominalTeks),
      catatan: catatan
    };
    daftarTransaksi.push(transaksiBaru);
  } else {
    // Mode edit: cari transaksi lama, lalu ganti isinya (id tetap)
    const transaksiLama = daftarTransaksi.find(function (t) {
      return t.id === idSedangDiedit;
    });
    transaksiLama.tanggal = tanggal;
    transaksiLama.jenis = jenis;
    transaksiLama.kategori = kategori;
    transaksiLama.nominal = Number(nominalTeks);
    transaksiLama.catatan = catatan;
  }

  // Simpan ke localStorage, tampilkan ulang, lalu kosongkan form
  simpanData();
  perbaruiTampilan();
  selesaiEdit();
}

// ==========================================================
// BONUS: EKSPOR DAN IMPOR JSON
// ==========================================================

// Fungsi: unduh semua data sebagai file backup-keuangan.json
function eksporData() {
  const data = { transaksi: daftarTransaksi, amplop: daftarAmplop };
  const teks = JSON.stringify(data, null, 2);

  // Buat file sementara dari teks, lalu "klik" link unduhan
  const berkas = new Blob([teks], { type: "application/json" });
  const alamat = URL.createObjectURL(berkas);
  const link = document.createElement("a");
  link.href = alamat;
  link.download = "backup-keuangan.json";
  link.click();
  URL.revokeObjectURL(alamat);

  elemenPesanBackup.textContent = "Backup berhasil diunduh.";
}

// Fungsi: cek apakah isi file impor bentuknya benar
function cekDataImpor(data) {
  if (typeof data !== "object" || data === null) {
    return false;
  }
  if (!Array.isArray(data.transaksi) || !Array.isArray(data.amplop)) {
    return false;
  }
  // Persona ini butuh minimal 3 amplop
  if (data.amplop.length < 3) {
    return false;
  }

  for (let i = 0; i < data.transaksi.length; i++) {
    const t = data.transaksi[i];
    if (typeof t.id !== "number" || typeof t.nominal !== "number") {
      return false;
    }
    if (t.jenis !== "pemasukan" && t.jenis !== "pengeluaran") {
      return false;
    }
    if (typeof t.tanggal !== "string" || typeof t.kategori !== "string" || typeof t.catatan !== "string") {
      return false;
    }
  }

  for (let j = 0; j < data.amplop.length; j++) {
    const a = data.amplop[j];
    if (typeof a.id !== "number" || typeof a.nama !== "string" || typeof a.jatah !== "number") {
      return false;
    }
  }

  return true;
}

// Fungsi: baca file JSON yang dipilih, lalu ganti data saat ini
function imporData(event) {
  const berkas = event.target.files[0];
  if (berkas === undefined) {
    return;
  }

  const pembaca = new FileReader();

  // Fungsi ini jalan setelah file selesai dibaca
  pembaca.onload = function () {
    try {
      const data = JSON.parse(pembaca.result);

      if (cekDataImpor(data) === false) {
        elemenPesanBackup.textContent = "Isi file tidak sesuai format backup.";
        return;
      }

      if (confirm("Data saat ini akan diganti dengan isi file. Lanjutkan?") === false) {
        return;
      }

      daftarTransaksi = data.transaksi;
      daftarAmplop = data.amplop;
      simpanData();
      selesaiEdit();
      renderPengaturanAmplop();
      perbaruiTampilan();
      elemenPesanBackup.textContent = "Data berhasil diimpor.";
    } catch (galat) {
      elemenPesanBackup.textContent = "File tidak bisa dibaca. Pastikan file JSON yang benar.";
    }
  };

  pembaca.readAsText(berkas);

  // Kosongkan pilihan file supaya file yang sama bisa dipilih lagi
  event.target.value = "";
}

// ==========================================================
// EVENT LISTENER
// ==========================================================
formTransaksi.addEventListener("submit", tambahTransaksi);
tombolBatal.addEventListener("click", selesaiEdit);
tombolSimpanAmplop.addEventListener("click", simpanAmplop);

// Filter dan pencarian: tampilkan ulang daftar setiap kali berubah
filterJenis.addEventListener("change", renderDaftar);
filterKategori.addEventListener("change", renderDaftar);
kolomCari.addEventListener("input", renderDaftar);

tombolEkspor.addEventListener("click", eksporData);
inputImpor.addEventListener("change", imporData);

// ==========================================================
// SAAT HALAMAN DIBUKA
// ==========================================================
// Baca data dulu, buat kolom pengaturan amplop, lalu tampilkan semuanya
muatData();
renderPengaturanAmplop();
perbaruiTampilan();