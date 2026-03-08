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
  updateProfileUI();
}

// Logout - clear localStorage
function logoutUser() {
  localStorage.removeItem(USER_KEY);
  updateProfileUI();
}

// Update profile icon and modal based on login state
function updateProfileUI() {
  const user = getCurrentUser();
  const profileModal = document.getElementById('profileModal');
  const profileForm = document.getElementById('profileForm');
  const profileContent = document.getElementById('profile-content');
  
  if (!profileModal) return;
  
  if (user) {
    // User is logged in - show profile info
    if (profileForm) profileForm.style.display = 'none';
    if (!profileContent) {
      const content = document.createElement('div');
      content.id = 'profile-content';
      content.innerHTML = `
        <div class="profile-info">
          <h3>${user.name}</h3>
          ${user.email ? `<p>📧 ${user.email}</p>` : ''}
          ${user.phone ? `<p>📱 ${user.phone}</p>` : ''}
          <button class="logout-btn" onclick="logoutUser()">Logout</button>
        </div>
      `;
      profileModal.querySelector('.modal-content').appendChild(content);
    } else {
      profileContent.innerHTML = `
        <div class="profile-info">
          <h3>${user.name}</h3>
          ${user.email ? `<p>📧 ${user.email}</p>` : ''}
          ${user.phone ? `<p>📱 ${user.phone}</p>` : ''}
          <button class="logout-btn" onclick="logoutUser()">Logout</button>
        </div>
      `;
      profileContent.style.display = 'block';
    }
  } else {
    // User not logged in - show form
    if (profileForm) profileForm.style.display = 'block';
    if (profileContent) profileContent.style.display = 'none';
  }
}

// Handle login form submission
function handleLogin(e) {
  e.preventDefault();
  
  const name = document.getElementById('userName').value.trim();
  const email = document.getElementById('userEmail').value.trim();
  const phone = document.getElementById('userPhone').value.trim();
  const errorEl = document.getElementById('loginError');
  
  // Validation
  if (!name) {
    errorEl.textContent = 'Please enter your Full Name.';
    return;
  }
  
  if (!email && !phone) {
    errorEl.textContent = 'Please enter Email or Phone Number.';
    return;
  }
  
  // Save user
  const user = { name, email: email || null, phone: phone || null };
  saveUser(user);
  
  // Clear form
  document.getElementById('profileForm').reset();
  errorEl.textContent = '';
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
window.logoutUser = logoutUser;
window.handleLogin = handleLogin;
