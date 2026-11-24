import { showAuthModal } from "./auth-component.js";
import { authService } from "./main.js";

export function injectHeader(container = document.body) {
  const navbarItems = [
    { label: 'Home', href: 'home.html' },
    { label: 'Todos', href: 'todos.html' },
    { label: 'About', anchor: 'about' },
    { label: 'Contact', anchor: 'contact' },
  ];

  const currentPage = location.pathname.split('/').pop() || 'home.html';
  const isHome = currentPage === '' || currentPage === 'home.html';

  const header = document.createElement('header');
  header.className = 'header';
  const hamburgerIcon = document.createElement('button');
  hamburgerIcon.textContent = '☰';
  hamburgerIcon.className = 'hamburger';
  const navbar = document.createElement('div');
  navbar.className = 'navbar';
  const headerTitle = document.createElement('h2');
  headerTitle.textContent = 'Task Management App';

  

  // <!-- Hamburger button (mobile) -->
  // <button class="hamburger">☰</button>

  // Navigation Bar
  navbarItems.forEach(item => {
    const link = document.createElement('a');

    if (item.href) {
      link.href = item.href;
      if (item.href === 'todos.html') {
        link.addEventListener('click', handleLink);
      }
    } else {
      link.href = isHome ? `#${item.anchor}` : `home.html#${item.anchor}`;
    }
    //console.log(link.href);
    link.textContent = item.label;
    navbar.appendChild(link);
  });

  header.appendChild(hamburgerIcon);
  header.appendChild(navbar);
  header.appendChild(headerTitle);
  container.prepend(header);

  /* For smooth navigation */
  if (currentPage === 'home.html') {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (!target) return;

      const id = target.getAttribute('href').slice(1);
      const section = document.getElementById(id);
      if (section) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".navbar").classList.toggle("show");
  });

}

function handleLink(e) {
  e.preventDefault();
  const user = authService.getCurrentUserId(); //getCurrentUser();

  if (user) {
    window.location.href = 'todos.html';
  } else {
    showAuthModal('login');
  }
}
