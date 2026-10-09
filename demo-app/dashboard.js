// Demo app dashboard logic.
const params = new URLSearchParams(window.location.search);
const user = params.get('user') || 'User';
document.getElementById('welcome-message').textContent = `Welcome, ${user}!`;

document.getElementById('logout').addEventListener('click', () => {
  window.location.href = '/';
});
