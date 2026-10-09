// Demo app login logic (client-side, for framework demonstration only).
const form = document.getElementById('login-form');
const error = document.getElementById('error-message');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  error.hidden = true;

  if (!username || !password) {
    error.textContent = 'Username and password are required.';
    error.hidden = false;
    return;
  }

  if (username === 'standard_user' && password === 'secret_sauce') {
    window.location.href = `/dashboard.html?user=${encodeURIComponent(username)}`;
    return;
  }

  error.textContent = 'Invalid username or password.';
  error.hidden = false;
});
