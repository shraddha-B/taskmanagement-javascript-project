export function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = msg;
  const modalContainer = document.getElementById('modalContent');
  if (modalContainer) modalContainer.prepend(toast);
   setTimeout(() => toast.remove(), 3000);
}