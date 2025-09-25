document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Simple in-page nav: default to login section open
  const sections = Array.from(document.querySelectorAll('.section'));
  const navLinks = Array.from(document.querySelectorAll('.nav-link[data-nav]'));
  function showSection(id) {
    sections.forEach(s => s.classList.toggle('active', `#${s.id}` === `#${id}`));
    navLinks.forEach(n => n.classList.toggle('active', n.dataset.nav === id));
    if (id === 'home') document.getElementById('home').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  navLinks.forEach(link => link.addEventListener('click', (e) => {
    const id = link.dataset.nav;
    if (!id) return;
    e.preventDefault();
    showSection(id);
  }));

  const loginForm = document.getElementById('loginForm');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  if (loginForm && usernameInput && passwordInput) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      const password = passwordInput.value.trim();

      if (username.length < 3) {
        shake(usernameInput);
        toast('Please enter a valid username');
        return;
      }
      if (password.length < 3) {
        shake(passwordInput);
        toast('Please enter a valid password');
        return;
      }

      // Simulate login and go to dashboard
      localStorage.setItem('kb_user', JSON.stringify({ username }));
      window.location.href = 'dashboard.html';
    });
  }

  // Registration modal
  const openRegister = document.getElementById('openRegister');
  const closeRegister = document.getElementById('closeRegister');
  const registerModal = document.getElementById('registerModal');
  const registerForm = document.getElementById('registerForm');

  if (openRegister && closeRegister && registerModal && registerForm) {
    openRegister.addEventListener('click', () => registerModal.classList.add('show'));
    closeRegister.addEventListener('click', () => registerModal.classList.remove('show'));
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) registerModal.classList.remove('show');
    });
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const pwd = document.getElementById('regPassword').value.trim();
      if (!name || !email || pwd.length < 3) {
        toast('Please fill all fields correctly');
        return;
      }
      toast('Registration successful. You can now login.');
      registerModal.classList.remove('show');
    });
  }

  // Feature scroller and gating
  const featureModal = document.getElementById('featureModal');
  const featureTitle = document.getElementById('featureTitle');
  const featureBody = document.getElementById('featureBody');
  const closeFeature = document.getElementById('closeFeature');
  closeFeature && closeFeature.addEventListener('click', () => featureModal.classList.remove('show'));
  featureModal && featureModal.addEventListener('click', (e) => { if (e.target === featureModal) featureModal.classList.remove('show'); });
  const featureButtons = Array.from(document.querySelectorAll('.feature-scroller .feature'));
  featureButtons.forEach(btn => btn.addEventListener('click', () => {
    const key = btn.getAttribute('data-key');
    const free = btn.getAttribute('data-free') === 'true';
    const loggedIn = Boolean(localStorage.getItem('kb_user'));
    if (!free && !loggedIn) {
      showSection('login');
      toast('Please login to access this feature');
      return;
    }
    const info = getFeatureInfo(key);
    featureTitle.textContent = info.title;
    featureBody.innerHTML = info.html;
    featureModal.classList.add('show');
  }));
});

function shake(el) {
  el.style.transform = 'translateX(0)';
  el.animate([
    { transform: 'translateX(0)' },
    { transform: 'translateX(-6px)' },
    { transform: 'translateX(6px)' },
    { transform: 'translateX(-4px)' },
    { transform: 'translateX(4px)' },
    { transform: 'translateX(0)' }
  ], { duration: 300, easing: 'ease-in-out' });
}

function toast(message) {
  const t = document.createElement('div');
  t.textContent = message;
  t.style.position = 'fixed';
  t.style.bottom = '24px';
  t.style.left = '50%';
  t.style.transform = 'translateX(-50%)';
  t.style.background = 'linear-gradient(135deg, #6b4dff, #18d26e)';
  t.style.color = '#fff';
  t.style.padding = '10px 14px';
  t.style.borderRadius = '12px';
  t.style.boxShadow = '0 10px 30px rgba(0,0,0,0.35)';
  t.style.zIndex = '1000';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function getFeatureInfo(key) {
  const map = {
    'remedies': { title: 'Customer remedies', html: '<p>Home-made, low-cost solutions like neem oil spray, ash dusting, and garlic-chilli extract for common pests.</p>' },
    'community': { title: 'Farmers community', html: '<p>Ask questions, share experiences, and learn best practices from fellow farmers.</p>' },
    'schemes': { title: 'Government Scheme', html: '<ul><li>PM-KISAN income support</li><li>Soil Health Card</li><li>PMFBY crop insurance</li></ul>' },
    'soil-detect': { title: 'Soil detect', html: '<p>Use simple kit values or sensor readings to estimate pH, moisture, and nutrients. Get targeted fertilizer advice.</p>' },
    'weather-alerts': { title: 'Weather alerts', html: '<p>Timely notifications about rainfall, heatwaves, and wind for spraying and irrigation planning.</p>' },
    'optimize-ai': { title: 'Optimize Solution using AI', html: '<p>AI suggests sowing windows, irrigation schedules, and fertilizer plans based on your inputs.</p>' },
    'market-price': { title: 'Market Price', html: '<p>Track mandi trends and nearby prices to decide the best selling time.</p>' },
    'ai-disease': { title: 'AI disease Detection', html: '<p>Upload leaf images to identify probable diseases and get safe remedy steps.</p>' },
    'crop-guide': { title: 'Crop Guide', html: '<p>Step-by-step crop calendars: land prep, sowing, irrigation, nutrient, and harvest tips.</p>' }
  };
  return map[key] || { title: 'Feature', html: '<p>Coming soon.</p>' };
}


