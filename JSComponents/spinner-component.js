export function showSpinner(container = document.body) {
  if (document.getElementById('spinner')) return;
  const spinnerHTML = `<div id="spinner" class="spinner-container"><div class="spinner"></div></div>`;
  container.insertAdjacentHTML('beforeend', spinnerHTML);
}

export function hideSpinner() {
  const sp = document.getElementById('spinner');
  if (sp) sp.remove();
}