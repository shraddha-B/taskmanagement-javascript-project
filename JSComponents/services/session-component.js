export class SessionManager {
  constructor(storageProvider = localStorage) {
    this.storage = storageProvider;
    this.CURRENT_USER_KEY = 'currentUser';
  }

  getCurrentUser() {
    return this.storage.getItem(this.CURRENT_USER_KEY);
  }

  setCurrentUser(userId) {
    this.storage.setItem(this.CURRENT_USER_KEY, userId);
  }

  clearCurrentUser() {
    this.storage.removeItem(this.CURRENT_USER_KEY);
  }

  requireLogin(redirectTo = 'home.html') {
    if (!this.getCurrentUser()) {
      window.location.href = redirectTo;
    }
  }
}




/*
export function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

export function setCurrentUser(name) {
  localStorage.setItem('currentUser', name);
}

export function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

export function requireLogin(redirectTo = 'home.html') {
  const user = getCurrentUser();
  //console.log("Checking",user);
  if (!user) {    
    window.location.href = redirectTo;
  }
}
*/