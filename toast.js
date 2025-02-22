const toast = (msg, type = null) => {
    const toast = document.createElement('div');
    toast.classList.add('toast', 'align-items-center', 'mb-3');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('data-bs-delay', '3000');
  
    switch (type) {
      case 'success':
        toast.classList.add('text-bg-success');
        break;
      case 'danger':
        toast.classList.add('text-bg-danger');
        break;
      default:
        toast.classList.add('text-bg-secondary');
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
  
    toast.append(toastBody);
  
    const toastContainer = document.getElementById('toastR');
    toastContainer.append(toast);
    new bootstrap.Toast(toast).show()
  }