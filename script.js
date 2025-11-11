/* script.js (FILE LENGKAP DIPERBARUI) */

/* ================================================================
  BAGIAN BARU: Data Pengguna (Nantinya didapat dari Database)
  Ini adalah data "dummy" berdasarkan kolom excel Anda.
  ================================================================
*/
const currentUserData = {
  customerId: "CUST-1001",
  planType: "Internet Hemat 35GB", // Paket dia saat ini
  deviceBrand: "Samsung S23",
  avgDataUsageGb: 45,
  penggunaanVideo: 62, // dalam persen
  avgDurasiTelfon: 30, // dalam menit
  sms: 15, // dalam unit
  rata2Pengeluaran: 130000,
  seringTopup: "Bulanan"
};

/* ================================================================
  MODIFIKASI: Data Paket
  Saya tambahkan 'priceNum' (angka) dan 'dataNum' (angka) 
  agar logika perbandingan kita berfungsi.
  ================================================================
*/
const allPackageOptions = [
  { name: "Paket Streaming Max", price: "Rp 125.000", priceNum: 125000, data: "50GB + Unlimited YouTube", dataNum: 50, desc: "Cocok karena >50% pemakaian Anda untuk video.", isRecommended: true },
  { name: "Paket Hemat Bulanan", price: "Rp 100.000", priceNum: 100000, data: "30GB + Bonus Sosmed", dataNum: 30, desc: "Ideal untuk penggunaan seimbang dan hemat." },
  { name: "Paket Premium Unlimited", price: "Rp 250.000", priceNum: 250000, data: "Unlimited + 20GB Hotspot", dataNum: 999, desc: "Untuk pengguna super aktif kebutuhan tinggi." },
  { name: "Paket Gaming Boost", price: "Rp 130.000", priceNum: 130000, data: "40GB + Ping Stabil", dataNum: 40, desc: "Koneksi lancar khusus untuk para gamers." },
  { name: "Paket Harian Cepat", price: "Rp 25.000", priceNum: 25000, data: "10GB 1 Hari", dataNum: 10, desc: "Untuk kebutuhan instan seharian penuh." }
];

/* ================================================================
  BAGIAN BARU: Fungsi untuk membuat Tag Rekomendasi
  ================================================================
*/
function getRecommendationTags(pkg, user) {
  let tagsHTML = '';

  // Logika 1: Tag Budget
  // Jika harga paket <= rata-rata pengeluaran + 10rb (toleransi)
  if (pkg.priceNum <= user.rata2Pengeluaran + 10000 && pkg.priceNum >= user.rata2Pengeluaran - 20000) {
    tagsHTML += `<div class="rec-tag budget">✓ Sesuai Budget</div>`;
  }
  
  // Logika 2: Tag Kuota
  // Jika kuota paket > rata-rata pemakaian
  if (pkg.dataNum > user.avgDataUsageGb) {
    tagsHTML += `<div class="rec-tag data">✓ Kuota Cukup</div>`;
  }

  // Logika 3: Tag Aktivitas (Contoh untuk video)
  if (pkg.name.includes("Streaming") && user.penggunaanVideo > 50) {
    tagsHTML += `<div class="rec-tag activity">✓ Pas untuk Video</div>`;
  }

  return `<div class="recommendation-tags">${tagsHTML}</div>`;
}


// === Personalisasi Otomatis Berdasarkan Data Pengguna ===
// (Fungsi ini sekarang menggunakan currentUserData)
function personalizePackages(user) {
  allPackageOptions.forEach(pkg => pkg.isRecommended = false);

  if (user.penggunaanVideo > 50 && user.avgDataUsageGb > 40) {
    markRecommended("Paket Streaming Max");
  } else if (user.rata2Pengeluaran < 110000) {
    markRecommended("Paket Hemat Bulanan");
  } else {
    markRecommended("Paket Premium Unlimited"); // Default
  }
}

function markRecommended(packageName) {
  const pkg = allPackageOptions.find(p => p.name === packageName);
  if (pkg) pkg.isRecommended = true;
}

// Jalankan personalisasi otomatis
personalizePackages(currentUserData);


window.onload = () => {
  // === MODIFIKASI: Mengisi data dari currentUserData ===
  document.getElementById("user-name").textContent = "Andi Pratama"; // Anda bisa tambahkan 'nama' ke data user
  document.getElementById("dataUsage").textContent = `${50 - currentUserData.avgDataUsageGb} GB`; 
  document.getElementById("usage").textContent = `Terpakai: ${currentUserData.avgDataUsageGb} dari 50 GB`;

  // Mengisi Kartu Profil Kebiasaan
  document.getElementById("habit-spending").textContent = `Rp ${currentUserData.rata2Pengeluaran.toLocaleString('id-ID')}`;
  document.getElementById("habit-data").textContent = `${currentUserData.avgDataUsageGb} GB`;
  document.getElementById("habit-activity").textContent = `${currentUserData.penggunaanVideo}% Video`;
  document.getElementById("habit-topup").textContent = currentUserData.seringTopup;
  
  // Mengisi Kartu Perbandingan
  document.getElementById("current-plan-name").textContent = currentUserData.planType;
  // (Anda bisa tambahkan data paket saat ini ke currentUserData untuk mengisi sisanya)


  // === MODIFIKASI: Loop Pembuatan Carousel ===
  const carousel = document.getElementById('package-list');
  allPackageOptions.forEach(pkg => {
    const item = document.createElement('div');
    item.className = 'package-item';
    if (pkg.isRecommended) item.classList.add('is-recommended');

    /* ================================================================
      MODIFIKASI: item.innerHTML sekarang memanggil 
      getRecommendationTags(pkg, currentUserData)
      ================================================================
    */
    item.innerHTML = `
      ${pkg.isRecommended ? `<div class="best-label">⭐ Pilihan Terbaik</div>` : ""}
      
      ${getRecommendationTags(pkg, currentUserData)} 
      
      <div class="details">
        <h4>${pkg.name}</h4>
        <p>${pkg.data}</p>
        <p class="price">${pkg.price}/bulan</p>
        <p style="font-size: 0.8rem; margin-top: 8px;">${pkg.desc}</p>
      </div>
      <button class="buy-btn">${pkg.isRecommended ? 'Pilih Paket Ini' : 'Lihat Detail'}</button>
    `;
    carousel.appendChild(item);
  });

  // (Sisa kode carousel Anda ... )
  const items = carousel.querySelectorAll('.package-item');
  const itemCount = items.length;
  const theta = 360 / itemCount;
  const radius = 350; 
  const translateY = 50;
  let isDragging = false, startX = 0, currentRotation = 0, startRotation = 0;

  function setupCarousel() {
    items.forEach((item, i) => item.dataset.angle = theta * i);
    carousel.style.transform = `translateZ(-${radius}px) translateY(${translateY}px)`;
    updateItemStyles();
  }

  function updateItemStyles() {
    items.forEach(item => {
      const base = parseFloat(item.dataset.angle);
      const total = base + currentRotation;
      let delta = total % 360;
      if (delta < 0) delta += 360;
      let normalized = delta > 180 ? 360 - delta : delta;
      const scale = 1 - (normalized / 180) * 0.15;
      const opacity = 1 - (normalized / 180) * 0.2;
      item.style.transform = `rotateY(${base}deg) translateZ(${radius}px) scale(${scale})`;
      item.style.opacity = opacity;
      item.style.zIndex = Math.round(100 - normalized);
    });
  }

  function rotateToFront(item) {
    const targetAngle = parseFloat(item.dataset.angle);
    const offset = -targetAngle;
    currentRotation = offset;
    carousel.style.transition = 'transform 0.6s ease-out';
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${currentRotation}deg) translateY(${translateY}px)`;
    setTimeout(() => {
      carousel.style.transition = 'none';
      updateItemStyles();
    }, 600);
  }

  // Drag rotation
  function getStartX(e) { return e.type.startsWith('touch') ? e.changedTouches[0].pageX : e.pageX; }
  function onDragStart(e) { isDragging = true; startX = getStartX(e); startRotation = currentRotation; carousel.style.transition = 'none'; }
  function onDragMove(e) {
    if (!isDragging) return;
    const currentX = getStartX(e);
    const deltaX = currentX - startX;
    currentRotation = startRotation + (deltaX * 0.5);
    carousel.style.transform = `translateZ(-${radius}px) rotateY(${currentRotation}deg) translateY(${translateY}px)`;
    updateItemStyles();
  }
  function onDragEnd() { isDragging = false; }

  carousel.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
  carousel.addEventListener('touchstart', onDragStart);
  window.addEventListener('touchmove', onDragMove);
  window.addEventListener('touchend', onDragEnd);

  items.forEach(item => {
    item.addEventListener('click', () => rotateToFront(item));
  });

  setupCarousel();

  // (Sisa kode Chart.js Anda ...)
  // === DONUT CHART: Sisa Paket ===
  const totalKuota = 50;
  const terpakai = currentUserData.avgDataUsageGb; // Menggunakan data dinamis
  const sisa = totalKuota - terpakai;

  const ctxDonut = document.getElementById("dataDonutChart").getContext("2d");
  new Chart(ctxDonut, {
    type: "doughnut",
    data: {
      labels: ["Terpakai", "Sisa Kuota"],
      datasets: [{
        data: [terpakai, sisa],
        backgroundColor: ["#ef4444", "#22c55e"],
        borderWidth: 2,
        hoverOffset: 10,
      }],
    },
    options: {
      cutout: "70%",
      plugins: {
        legend: { position: "bottom", labels: { color: "#333", font: { size: 12 }}},
        tooltip: { callbacks: { label: (context) => `${context.label}: ${context.parsed} GB`,}},
      },
    },
  });

  // === DONUT CHART: Distribusi Penggunaan Paket ===
  const ctxActivity = document.getElementById("activityDonutChart").getContext("2d");
  new Chart(ctxActivity, {
    type: "doughnut",
    data: {
      labels: ["Video", "TELP", "SMS"],
      datasets: [{
        data: [currentUserData.penggunaanVideo, currentUserData.avgDurasiTelfon, currentUserData.sms], // (Ini perlu disesuaikan jika data telfon/sms bukan persen)
        backgroundColor: ["#3b82f6", "#facc15", "#a855f7"],
        borderWidth: 2,
        hoverOffset: 10,
      }],
    },
    options: {
      cutout: "70%",
      plugins: {
        legend: { position: "bottom", labels: { color: "#333", font: { size: 12 }}},
        tooltip: { callbacks: { label: (context) => `${context.label}: ${context.parsed}%`,}},
      },
    },
  });


  // (Kode Toggle Sidebar Anda ...)
  const toggleBtn = document.getElementById('sidebarToggle');
  const bodyEl = document.body;

  toggleBtn.addEventListener('click', () => {
    if (window.innerWidth > 768) {
      bodyEl.classList.toggle('sidebar-tertutup');
    } else {
      bodyEl.classList.toggle('sidebar-terbuka');
    }
  });

}; // AKHIR DARI window.onload