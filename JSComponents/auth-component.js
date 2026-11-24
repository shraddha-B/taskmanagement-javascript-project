import { showToast } from './toast-component.js';
import { showSpinner, hideSpinner } from './spinner-component.js';
import { authService } from './main.js';
import { LOGIN_STATUS } from './constants/login-status-constant.js';

let mode = 'login'; // , container
let modal, modalContent, titleEl, switchLink, submitBtn, confirmRow, errorContainer;

export function injectAuthModal(container = document.body) {
  const modalHTML = `
      <div class="modal" id="authModal">
        <div class="modal-content" id="modalContent">
        <span class="close-icon" id="closeModalBtn"><i class="fa-solid fa-xmark"></i></span>
            <h2 id="formTitle">Login</h2>
            <div id="errorContainer" class="error-msg"></div>
            <form id="authForm">
                <input type="email" id="useremail" placeholder="Enter your email" />
                <input type="password" id="password" placeholder="Password" />
                <div id="confirmRow">
                    <input type="password" id="confirmPassword" placeholder="Confirm Password" />
                    <input type="text" id="username" placeholder="Enter your name" />
                </div>
                <button type="submit" id="submitBtn">Login</button>
            </form>
            <span class="switch-link" id="switchLink">Don' t have an account? <u>Register</u></span>
        </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', modalHTML); //document.body - container = document.body

  modal = document.getElementById('authModal');
  modalContent = document.getElementById('modalContent');
  titleEl = document.getElementById('formTitle');
  switchLink = document.getElementById('switchLink');
  submitBtn = document.getElementById('submitBtn');
  confirmRow = document.getElementById('confirmRow');
  errorContainer = document.getElementById('errorContainer');

  switchLink.addEventListener('click', modalSwitchLink);
  //modal.addEventListener('click', closeModal);
  document.getElementById('authForm').addEventListener('submit', submitAuth);
  document.getElementById('closeModalBtn').addEventListener('click', closeAuthModal);
  // document.getElementById('submitBtn').onclick = submitAuth;
}

export function showAuthModal(startMode = 'login') { // , container = document.body
  mode = startMode;
  //if (!modal) injectAuthModal();  // code is for injecting form that removed
  updateForm();
  modal.classList.add('show');	//document.getElementById('authModal')?.classList.add('show');
}

function closeAuthModal() {
  /* Below code is for removing form completely
  const modal = document.getElementById('auth-modal');
  if (modal) modal.remove();
  modal = null;      // need to clear the reference of removed element
  */
  modal.classList.remove('show');
}

function updateForm() {
  [useremail, username, password, confirmPassword].forEach(el => el.value = "");
  [useremail, username, password, confirmPassword].forEach(el => el.classList.remove('error'));
  if (mode === 'login') {
    modalContent.classList.remove('register');
    confirmRow.style.display = 'none';
    titleEl.textContent = 'Login';
    submitBtn.textContent = 'Login';
    switchLink.innerHTML = "Don't have an account? <u>Register</u>";
  } else {
    modalContent.classList.add('register');
    confirmRow.style.display = 'block';
    titleEl.textContent = 'Register';
    submitBtn.textContent = 'Register';
    switchLink.innerHTML = 'Already have an account? <u>Login</u>';
  }
  errorContainer.textContent = '';
}

function modalSwitchLink() {
  mode = mode === 'login' ? 'register' : 'login';
  updateForm();
}
/*
function closeModal(e) {
  if (e.target === modal) closeAuthModal();
}
*/
function submitAuth(e) {
  e.preventDefault();
  errorContainer.textContent = '';

  const useremail = document.getElementById('useremail');
  const username = document.getElementById('username');
  const userpassword = document.getElementById('password');
  const confirmPassword = document.getElementById('confirmPassword');

  [useremail, username, userpassword, confirmPassword].forEach(el => el.classList.remove('error'));

  const email = useremail.value.trim();
  const password = userpassword.value.trim();

  if (!email) {
    useremail.classList.add('error');
    errorContainer.textContent = 'User email ID is required';
    //console.log("Email check ", !email);
    return;
  }

  if (!password || password.length < 6) {
    userpassword.classList.add('error');
    errorContainer.textContent = 'Password must be at least 6 characters';
    return;
  }

  showSpinner(document.body);

  setTimeout(() => {
    if (mode === 'register') {

      if (!confirmPassword.value || password !== confirmPassword.value) {
        confirmPassword.classList.add('error');
        errorContainer.textContent = 'Passwords do not match';
        hideSpinner();
        return;
      }

      const name = username.value.trim();
      if (!name) {
        username.classList.add('error');
        errorContainer.textContent = 'User name is required';
        hideSpinner();
        return;
      }

      //if (isUserExist(name))
      if (!authService.registerUser(name, email, password)) {
        // console.log(!authService.registerUser(name, email, password));
        errorContainer.textContent = 'User already exists';
        hideSpinner();
        return;
      }
      //registerUser(name, password.value);
      showToast('Registered successfully!');
      mode = 'login';
      updateForm();
    } else {
      const loginStatus = authService.login(email, password);
      //console.log("Entered login ", loginStatus);
      if (loginStatus.status === LOGIN_STATUS.USER_NOT_FOUND) {
        // console.log("testing check");
        errorContainer.textContent = 'User not found. Please register.';
        hideSpinner();
        // console.log("lno user");
        return;
      }
      if (loginStatus.status === LOGIN_STATUS.INCORRECT_PASSWORD) {
        errorContainer.textContent = 'Incorrect password';
        hideSpinner();
        // console.log("Incorrect pass");
        return;
      }
      if (loginStatus.status === LOGIN_STATUS.SUCCESS) {
        //sessionManager.setCurrentUser();
        // console.log("login successful");
        showToast('Login successful!');
        setTimeout(() => {
          window.location.href = 'todos.html';
        }, 1000);
      }
    }
    hideSpinner();
  }, 1000);
};
