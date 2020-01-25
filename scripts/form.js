const form = document.querySelector('form');
const emailWrapper = document.getElementById('email-wrapper');
const modal = document.getElementById('exampleModal');
const submitWithoutButton = document.getElementById('submit-without');
const addEmailButton = document.getElementById('add-email');
const emailInput = document.getElementById('input-email');

let isFirstTimeSubmitPressed = true;

form.addEventListener('submit', event => {
  if (isFirstTimeSubmitPressed) {
    event.preventDefault();
    emailWrapper.classList.remove('d-none');
    modal.classList.remove('d-none');
    modal.style.display = 'block';
  }

  isFirstTimeSubmitPressed = false;
});

function hideModal() {
  modal.classList.add('d-none');
}

function submitWithoutEmail() {
  hideModal();
  form.submit();
}

function highlightElement(element) {
  const classes = ['border', 'border-primary'];
  element.classList.add(...classes);
}

addEmailButton.addEventListener('click', () => {
  hideModal();
  highlightElement(emailInput);
  emailInput.focus();
});
submitWithoutButton.addEventListener('click', submitWithoutEmail);
