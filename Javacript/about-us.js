const API = axios.create({
  baseURL: 'https://api-hammadii-6.onrender.com/',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' }
});
const el = id => document.getElementById(id);
const q = s => document.querySelector(s);
const qa = s => document.querySelectorAll(s);

const els = {
  signupBtn: el('signup-btn'),
  loginBtn: el('login-btn'),
  signupModal: el('signup-modal'),
  loginModal: el('login-modal'),
  signupForm: el('signup-form'),
  loginForm: el('login-form'),
  signupError: el('signup-error'),
  loginError: el('login-error'),
  authBtns: el('auth-buttons'),
  userProfile: el('user-profile'),
  userName: el('user-name'),
  logout: el('logout-btn'),
  profileIcon: el('user-profile-icon'),
  dropdown: el('user-name-dropdown'),
  hamburger: el('hamburger'),
  navLinks: el('nav-links')
};

const toggleModal = (m, show) => m.style.display = show ? 'flex' : 'none';
const showError = (el, msg) => { el.textContent = msg; el.style.display = 'block'; };
const clearError = el => el.style.display = 'none';

function updateAuthUI() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('userName');
  els.signupBtn.style.display = els.loginBtn.style.display = token ? 'none' : 'inline-block';
  els.userProfile.style.display = token ? 'flex' : 'none';
  els.userName.textContent = user || 'User';
}

// hamburger
els.hamburger.onclick = () => {
  els.navLinks.classList.toggle('active');
  els.hamburger.querySelector('i').classList.toggle('fa-bars');
  els.hamburger.querySelector('i').classList.toggle('fa-times');
};
qa('#nav-links a').forEach(a => a.onclick = () => els.hamburger.click());

// profile dropdown
els.profileIcon.onclick = e => { e.stopPropagation(); els.dropdown.classList.toggle('active'); };
document.onclick = e => { if (!els.profileIcon.contains(e.target)) els.dropdown.classList.remove('active'); };

// open modals
els.signupBtn.onclick = () => toggleModal(els.signupModal, true);
els.loginBtn.onclick = () => toggleModal(els.loginModal, true);
qa('.close-btn').forEach(b => b.onclick = () => { toggleModal(els.signupModal, false); toggleModal(els.loginModal, false); });
el('show-login').onclick = e => { e.preventDefault(); toggleModal(els.signupModal, false); toggleModal(els.loginModal, true); };
el('show-signup').onclick = e => { e.preventDefault(); toggleModal(els.loginModal, false); toggleModal(els.signupModal, true); };

// logout
els.logout.onclick = () => { localStorage.clear(); updateAuthUI(); alert('Logged out successfully!'); };

// signup
els.signupForm.onsubmit = async e => {
  e.preventDefault();
  clearError(els.signupError);
  const { value: name } = el('signup-name'),
        { value: email } = el('signup-email'),
        { value: password } = el('signup-password'),
        confirm = el('signup-confirm').value;
  if (password !== confirm) return showError(els.signupError, 'Passwords do not match');
  try {
    const { data } = await API.post('/signup', { name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', name);
    alert('Account created successfully!');
    toggleModal(els.signupModal, false); els.signupForm.reset(); updateAuthUI();
  } catch (err) { showError(els.signupError, err.response?.data?.message || 'Signup failed'); }
};

// login
els.loginForm.onsubmit = async e => {
  e.preventDefault();
  clearError(els.loginError);
  const email = el('login-email').value, pwd = el('login-password').value, remember = el('remember').checked;
  try {
    const { data } = await API.post('/loginWithEmail', { email, password: pwd });
    localStorage.setItem('token', data.token);
    localStorage.setItem('userName', data.name || data.userName || 'User');
    remember ? localStorage.setItem('rememberMe', 'true') : localStorage.removeItem('rememberMe');
    alert('Login successful!');
    toggleModal(els.loginModal, false); els.loginForm.reset(); updateAuthUI();
  } catch (err) { showError(els.loginError, err.response?.data?.message || 'Invalid email or password'); }
};

document.addEventListener('DOMContentLoaded', updateAuthUI);