import { LOGIN_STATUS } from "../constants/login-status-constant.js";

export class AuthService {
  constructor(userStorage, sessionManager) {
    if (!userStorage) throw new Error('userStorage is required');
    if (!sessionManager) throw new Error('sessionManager is required');

    this.userStorage = userStorage;
    this.sessionManager = sessionManager;
  }

  registerUser(username, email, password) {
    return this.userStorage.registerUser(username, email, password);
  }

  login(email, password) {
    const loginStatus = this.userStorage.loginUser(email, password);
    if (loginStatus.status === LOGIN_STATUS.SUCCESS) {
      this.sessionManager.setCurrentUser(loginStatus.userId);
    }
    return loginStatus;
  }

  logout(redirectTo = 'home.html') {
    const userId = this.getCurrentUserId();
    if (!userId) return;
    this.sessionManager.clearCurrentUser();
    window.location.href = redirectTo;
    const user = this.userStorage.getUserById(userId);    
    if (!user || user.isFirstLogin === false) return;
    this.userStorage.updateUser(userId, { isFirstLogin: false });
  }

   // For future use - Checks if any user is currently logged in.
  isAuthenticated() {
    return !!this.sessionManager.getCurrentUser();
  }

  getCurrentUserId() {
    return this.sessionManager.getCurrentUser();
  }

  getCurrentUserDetails() {
    const userId = this.getCurrentUserId();
    if (!userId) return null;
    return this.userStorage.getUserById(userId);
  }
}



/*
// import { getUsers, saveUsers } from '../storage-component.js';
// import { clearCurrentUser } from './session-component.js';

export function registerUser(name, _password) {
  const users = getUsers();
  //users[name] = { password, isFirstLogin: true };
  users[name] = { password: _password, isFirstLogin: true };
  saveUsers(users);
}

export function loginUser(name) {
  const users = getUsers();
  users[name].isFirstLogin = false;
  saveUsers(users);
}

export function isUserExist(name) {
  const users = getUsers();
  return !!users[name];
}

export function validatePassword(name, password) {
  const users = getUsers();
  return users[name]?.password === password;
}

export function logout(redirectTo = 'home.html') {
  clearCurrentUser(); //localStorage.removeItem('currentUser'); changed recently
  window.location.href = redirectTo;
}
*/