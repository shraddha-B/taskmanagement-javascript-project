//import { getCurrentUser, clearCurrentUser } from './services/session-component.js';
import { authService } from './main.js';
import { showAuthModal } from './auth-component.js';
//import { logout } from './services/auth-service-component.js';

export function injectLoginContainer(targetSelector) {
  const user = authService.getCurrentUserId();  //getCurrentUser();

  /*
  const loginContainerHTML = `
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-icon"></div>
      <div class="dropdown">
        <a href="#" id="loginLogoutLink">${user ? 'Logout' : 'Login / Register'}</a>
      </div>
    </div>
  </div>
`;
*/

  /* Login Icon + Dropdown */
  const loginContainerHTML = `
    <div class="login-wrapper">
                <div class="login-container">
                    <span class="login-icon"><i class="fa-solid fa-user" style="color: white;"></i></span>
                    <div class="login-dropdown">
                        <a href="#" id="loginLogoutLink">${user ? 'Logout' : 'Login / Register'}</a>
                    </div>
                </div>
            </div>
      `;

  targetSelector.insertAdjacentHTML('beforeend', loginContainerHTML);

  const link = document.getElementById('loginLogoutLink');
  link.addEventListener('click', handleLoginLogout);
}

function handleLoginLogout(e) {
  e.preventDefault();
  const user = authService.getCurrentUserId();  //getCurrentUser();
  //console.log("Entered login/logout");
  if (user) {
    //console.log("Entered if block");
    authService.logout();   //logout();
  } else {
    //console.log("Entered else block");
    showAuthModal('login');
  }
}
