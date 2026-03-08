// login-modal.js - handles Sign In popup on index.html

const USER_KEY = 'lavessa_user';

// Get current user from localStorage
function getCurrentUser() {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
}

// Save user to localStorage
function saveUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

// Check if user is logged in
function isUserLoggedIn() {
  return getCurrentUser() !== null;
}

// Logout - clear localStorage
function logoutUser() {
  localStorage.removeItem(USER_KEY);
  
  // Reset UI and close modal
  updateProfileUI();
  if (window.closeProfileModal) {
    window.closeProfileModal();
  }
}

// Handle login form submission
function handleLogin(e) {
  if (e) e.preventDefault();
  
  const nameInput = document.getElementById('userName');
  const emailInput = document.getElementById('userEmail');
  const phoneInput = document.getElementById('userPhone');
  const errorEl = document.getElementById('loginError');
  
  if (!nameInput || !emailInput || !phoneInput || !errorEl) {
    console.error('Login form elements not found');
    return false;
  }
  
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  
  // Clear previous errors
  errorEl.textContent = '';
  
  // Validation
  if (!name) {
    errorEl.textContent = 'Please enter your Full Name.';
    return false;
  }
  
  if (!email && !phone) {
    errorEl.textContent = 'Please enter Email or Phone Number.';
    return false;
  }
  
  // Save user
  const user = { 
    name: name, 
    email: email || null, 
    phone: phone || null 
  };
  saveUser(user);
  
  // Clear form and update UI
  document.getElementById('profileForm').reset();
  errorEl.textContent = '';
  
  // Update profile UI
  if (window.updateProfileUI) {
    window.updateProfileUI();
  }
  
  // Close modal
  if (window.closeProfileModal) {
    setTimeout(() => {
      window.closeProfileModal();
    }, 100);
  }
  
  return false;
}

// Update profile UI based on login state
function updateProfileUI() {
  const user = getCurrentUser();
  const profileForm = document.getElementById('profileForm');
  const profileContent = document.getElementById('profile-content');
  const profileModalH2 = document.querySelector('.profile-modal h2');
  
  if (user) {
    // User is logged in - show profile info
    if (profileForm) profileForm.style.display = 'none';
    if (profileContent) {
      profileContent.style.display = 'block';
      profileContent.innerHTML = `
        <div class="profile-info">
          <h3>${user.name}</h3>
          ${user.email ? `<p>📧 ${user.email}</p>` : ''}
          ${user.phone ? `<p>📱 ${user.phone}</p>` : ''}
          <button class="logout-btn" onclick="logoutUser()">Logout</button>
        </div>
      `;
    }
    if (profileModalH2) profileModalH2.textContent = 'My Profile';
  } else {
    // User not logged in - show form
    if (profileForm) profileForm.style.display = 'block';
    if (profileContent) profileContent.style.display = 'none';
    if (profileModalH2) profileModalH2.textContent = 'Sign In';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const profileForm = document.getElementById('profileForm');
  
  if (profileForm) {
    profileForm.addEventListener('submit', handleLogin);
  }
  
  // Update profile UI on page load
  updateProfileUI();
});

// Make functions globally accessible
window.getCurrentUser = getCurrentUser;
window.saveUser = saveUser;
window.isUserLoggedIn = isUserLoggedIn;
window.logoutUser = logoutUser;
window.handleLogin = handleLogin;
window.updateProfileUI = updateProfileUI;
