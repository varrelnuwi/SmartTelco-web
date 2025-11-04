const userData = {
  nama: "Andi Pratama",
  dataUsage: 45,
  usage: { video: 60, call: 25, sms: 15 }
};

const allPackageOptions = [
  { name: "Paket Streaming Max", price: "Rp 150.000", data: "50GB + Unlimited YouTube", desc: "Cocok karena 60% pemakaian Anda untuk video.", isRecommended: true },
  { name: "Paket Hemat Bulanan", price: "Rp 100.000", data: "30GB + Bonus Sosmed", desc: "Ideal untuk penggunaan seimbang dan hemat." },
  { name: "Paket Premium Unlimited", price: "Rp 250.000", data: "Unlimited + 20GB Hotspot", desc: "Untuk pengguna super aktif kebutuhan tinggi." },
  { name: "Paket Gaming Boost", price: "Rp 130.000", data: "40GB + Ping Stabil", desc: "Koneksi lancar khusus untuk para gamers." },
  { name: "Paket Malam Full", price: "Rp 80.000", data: "50GB (01.00 - 06.00)", desc: "Download sepuasnya di jam malam." },
  { name: "Paket Harian Cepat", price: "Rp 25.000", data: "10GB 1 Hari", desc: "Untuk kebutuhan instan seharian penuh." }
];

window.onload = () => {
  document.getElementById("user-name").textContent = userData.nama;
  document.getElementById("dataUsage").textContent = `${50 - userData.dataUsage} GB`; 
  document.getElementById("usage").textContent = `Terpakai: ${userData.dataUsage} dari 50 GB`;

  const carousel = document.getElementById('package-list');
  allPackageOptions.forEach(pkg => {
    const item = document.createElement('div');
    item.className = 'package-item';
    if (pkg.isRecommended) item.classList.add('is-recommended');
    item.innerHTML = `
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

  // Klik card → otomatis terkunci di depan
  items.forEach(item => {
    item.addEventListener('click', () => rotateToFront(item));
  });

  setupCarousel();
};
