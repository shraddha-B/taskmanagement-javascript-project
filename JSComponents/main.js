import { injectAuthModal } from './auth-component.js';
import { injectHeader } from './header-component.js';
import { injectLoginContainer } from './login-component.js';
import { showUserGreeting } from './user-greeting-component.js';
import { injectFooter } from './footer-component.js';
import { injectSlidingLogos } from './sliding-logos-component.js';
import { injectFadeSlider } from './fade-slider-component.js';
import { SessionManager } from './services/session-component.js';
import { UserStorage } from './storage-component.js';
import { AuthService } from './services/auth-service-component.js';
import { TodoService } from './services/todo-service.js';

// single storage provider
const storageProvider = localStorage;

// create shared singletons
export const sessionManager = new SessionManager(storageProvider);
export const userStorage = new UserStorage(storageProvider);
export const authService = new AuthService(userStorage, sessionManager);
// inject userStorage + sessionManager into todoService (loose coupling)
export const todoService = new TodoService(userStorage, sessionManager);

document.addEventListener('DOMContentLoaded', () => {

  // if (page === 'home.html' && window.location.hash) {
  //   history.replaceState(null, '', 'home.html');
  //   window.location.replace('home.html');
  // }
  //window.scrollTo(0, 0); // Force scroll to top

  const currentPage = location.pathname.split('/').pop() || 'home.html';
  const isHome = currentPage === '' || currentPage === 'home.html';

  injectAuthModal(document.body);
  injectHeader(document.body);
  injectLoginContainer(document.querySelector('.header'));
  showUserGreeting(document.querySelector('.login-wrapper'));

  // Inject banner (sliding) only if on Home page
  if (!(currentPage === 'todos.html')) {
    const banner_fade_slider = document.querySelector('.banner-fade-slider');
    if(banner_fade_slider) {
      injectFadeSlider(banner_fade_slider);
    }
  }

  switch (currentPage) {
    case 'home.html':
      injectSlidingLogos(injectFooter());
      break;
    case 'todos.html':
      injectFooter(document.body, '<div class="footerMessage">Copyright &copy; ABC Management Services</div>');
      break;
    default:
      injectFooter(document.body);
  }

});
