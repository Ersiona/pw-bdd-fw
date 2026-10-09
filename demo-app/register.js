// Demo app registration logic.
const form = document.getElementById('register-form');
const success = document.getElementById('success-message');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const firstName = document.getElementById('first-name').value.trim();
  const email = document.getElementById('email').value.trim();
  success.hidden = true;

  if (!firstName || !email) {
    success.classList.add('error-message');
    success.textContent = 'First Name and Email are required.';
    success.hidden = false;
    return;
  }

  success.classList.remove('error-message');
  success.textContent = `Registration successful for ${firstName}!`;
  success.hidden = false;
});
