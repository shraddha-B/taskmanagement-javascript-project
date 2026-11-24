export function injectFooter(container = document.body, content='') {
  const footer = document.createElement('footer');
  footer.classList.add('footer');
  container.appendChild(footer);

  if (typeof content === 'string') {
    footer.insertAdjacentHTML('beforeend', content);
  } else if (content instanceof HTMLElement) {
    footer.appendChild(content);
  } else {
    footer.insertAdjacentHTML('beforeend', '');  //footer.innerHTML = content;
  }
  return footer;
}
