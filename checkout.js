// checkout.js
function renderOrderSummary() {
  const summary = document.getElementById('order-summary');
  const cart = JSON.parse(localStorage.getItem('lavessa_cart') || '[]');
  let html = '<ul>';
  cart.forEach(item => {
    html += `<li>${item.name} x ${item.qty} - ₹${item.price * item.qty}</li>`;
  });
  html += '</ul>';
  html += `<p>Total: ₹${calculateTotal()}</p>`;
  summary.innerHTML = html;
}

function calculateTotal() {
  const cart = JSON.parse(localStorage.getItem('lavessa_cart') || '[]');
  return cart.reduce((s,i)=>s+i.price*i.qty,0);
}

function clearCart() {
  localStorage.removeItem('lavessa_cart');
  updateCartCount();
}

function onPay() {
  const total = calculateTotal();
  const options = {
    key: "RAZORPAY_KEY",
    amount: total * 100,
    currency: "INR",
    name: "Lavessa Fashion",
    description: "Order Payment",
    handler: function (response) {
      // upload order
      const order = {
        customerName: document.getElementById('customer-name').value,
        phone: document.getElementById('customer-phone').value,
        email: document.getElementById('customer-email').value,
        address: document.getElementById('customer-address').value,
        items: JSON.parse(localStorage.getItem('lavessa_cart')), 
        total: total,
        paymentStatus: 'paid',
        paymentId: response.razorpay_payment_id,
        timestamp: new Date()
      };
      saveOrder(order).then(() => {
        alert('Payment successful! Thank you for your order.');
        clearCart();
        window.location.href = 'index.html';
      });
    },
    prefill: {
      name: document.getElementById('customer-name').value,
      email: document.getElementById('customer-email').value,
      contact: document.getElementById('customer-phone').value
    },
    theme: {color: "#5a2a82"}
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('order-summary')) renderOrderSummary();
  const btn = document.getElementById('pay-btn');
  if (btn) btn.addEventListener('click', onPay);
});
