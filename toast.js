const toast = (msg, type = null) => {
  const toastElem = document.createElement('div');
  toastElem.classList.add('toast', 'align-items-center', 'mb-3');
  toastElem.setAttribute('role', 'alert');
  toastElem.setAttribute('data-bs-delay', '3000');
  switch (type) {
    case 'success':
      toastElem.classList.add('text-bg-success');
      break;
    case 'danger':
      toastElem.classList.add('text-bg-danger');
      break;
    default:
      toastElem.classList.add('text-bg-secondary');
      break;
  }
  const toastBody = document.createElement('div');
  toastBody.classList.add('d-flex');
  const toastContent = document.createElement('div');
  toastContent.classList.add('toast-body');
  toastContent.innerHTML = msg;
  toastBody.append(toastContent);
  const toastButton = document.createElement('button');
  toastButton.setAttribute('type', 'button');
  toastButton.classList.add('btn-close', 'me-2', 'm-auto', 'btn-close-white');
  toastButton.setAttribute('data-bs-dismiss', 'toast');
  toastBody.append(toastButton);
  toastElem.append(toastBody);
  const toastContainer = document.getElementById('toastR');
  toastContainer.append(toastElem);
  new bootstrap.Toast(toastElem).show();
};