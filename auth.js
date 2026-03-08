// auth.js
function showUserInfo(user) {
  const info = document.getElementById('user-info');
  if (info) {
    info.textContent = `Logged in as ${user.email || user.phoneNumber}`;
  }
}

function showOrderHistory(user) {
  const historyEl = document.getElementById('order-history');
  if (!historyEl) return;
  db.collection('orders').where('email','==', user.email)
    .get().then(snapshot => {
      snapshot.forEach(doc => {
        const o = doc.data();
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `<p>${o.timestamp.toDate()} - ₹${o.total}</p>`;
        historyEl.appendChild(div);
      });
    });
}

function initAuth() {
  auth.onAuthStateChanged(user => {
    if (user) {
      showUserInfo(user);
      showOrderHistory(user);
      document.getElementById('logout-btn')?.addEventListener('click', ()=>auth.signOut());
    }
  });
}

function loginWithEmail() {
  const email = prompt('Enter your email');
  const password = prompt('Enter a password');
  auth.signInWithEmailAndPassword(email, password).catch(err=>{
    if (err.code==='auth/user-not-found') {
      auth.createUserWithEmailAndPassword(email, password);
    } else alert(err.message);
  });
}

function loginWithPhone() {
  const phone = prompt('Enter phone number with country code');
  // Firebase requires reCAPTCHA; simplifying here
  const appVerifier = new firebase.auth.RecaptchaVerifier('auth-section', {size:'invisible'});
  auth.signInWithPhoneNumber(phone, appVerifier)
    .then(confirmationResult => {
      const code = prompt('Enter OTP');
      return confirmationResult.confirm(code);
    }).catch(err=>alert(err.message));
}

document.addEventListener('DOMContentLoaded', () => {
  const emailBtn = document.getElementById('email-login-btn');
  const phoneBtn = document.getElementById('phone-login-btn');
  if (emailBtn) emailBtn.addEventListener('click', loginWithEmail);
  if (phoneBtn) phoneBtn.addEventListener('click', loginWithPhone);
  initAuth();
});