import { authService } from "../main.js";

export function requireLogin() {
  if (!authService.isAuthenticated()) {
    //console.log(!authService.isAuthenticated());
    window.location.href = "home.html"; // redirect if not logged in
  }
}
