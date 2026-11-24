//import { getCurrentUser } from './services/session-component.js';
import { authService } from "./main.js";

export function showUserGreeting(container = document.querySelector('.login-wrapperr')) {

  const user = authService.getCurrentUserDetails(); //getCurrentUser();
  if (user) {
    //const loginContainer = document.querySelector('.login-container');
    const greeting = document.createElement('div');
    greeting.className = 'greeting-message';
    greeting.textContent = user.isFirstLogin ? `Welcome, ${user.username}!` : `Welcome back, ${user.username}!`;
    container.insertBefore(greeting, container.firstChild);   //    //document.body.insertAdjacentElement('afterbegin', greeting);
    //loginContainer.insertBefore(greeting, loginContainer.firstChild);   //    //document.body.insertAdjacentElement('afterbegin', greeting);
    //container.insertBefore(greeting, container.lastChild);   //    //document.body.insertAdjacentElement('afterbegin', greeting);
  }
}
