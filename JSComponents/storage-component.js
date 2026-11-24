import { LOGIN_STATUS } from "./constants/login-status-constant.js";

const USERS_KEY = 'users';
const TODOS_KEY = 'todos';
const LAST_ID_KEY = 'lastIds';

function generateUserId() {
  return 'u' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

export class UserStorage {
  constructor(storageProvider = localStorage) {
    this.storage = storageProvider;
  }

  // ---- User Auth Methods ----
  registerUser(_username, _email, _password) {
    const users = this.getAllUsers();  //JSON.parse(this.storage.getItem(USERS_KEY)) || {};

    // Check - email already exists
    const emailExists = Object.values(users).some(
      user => (user.email || '').toLowerCase() === (_email || '').toLowerCase()
    );
    if (emailExists) {
      return false; // email already registered
    }

    const userId = generateUserId();
    users[userId] = { username: _username, email: _email, password: _password, isFirstLogin: true };
    this.saveUsers(users);  //this.storage.setItem(USERS_KEY, JSON.stringify(users));

    const todos = JSON.parse(this.storage.getItem(TODOS_KEY)) || {};
    todos[userId] = [];
    this.storage.setItem(TODOS_KEY, JSON.stringify(todos));

    const lastIds = JSON.parse(this.storage.getItem(LAST_ID_KEY)) || {};
    lastIds[userId] = 0;
    this.storage.setItem(LAST_ID_KEY, JSON.stringify(lastIds));

    return true;
  }

  loginUser(email, password) {
    const users = this.getAllUsers();  //JSON.parse(this.storage.getItem(USERS_KEY)) || {};
    const user = Object.entries(users).find(([_, user]) => (user.email || '').toLowerCase() === (email || '').toLowerCase());
    if (!user) {
      return { status: LOGIN_STATUS.USER_NOT_FOUND, userId: null };
    }

    const [userId, _user] = user;

    if (_user.password !== password) {
      return { status: LOGIN_STATUS.INCORRECT_PASSWORD, userId: null };
    }

    return { status: LOGIN_STATUS.SUCCESS, userId: userId };
  }

  saveUsers(users) {
    this.storage.setItem(USERS_KEY, JSON.stringify(users));
  }

  getUserById(userId) {
    const users = this.getAllUsers();
    const user = users[userId];  //users.find(user => user.id === userId);
    return user ? { ...user } : null; // shallow copy
  }

  // For future admin use
  getAllUsers() {
    return JSON.parse(this.storage.getItem(USERS_KEY)) || {};
  }

  updateUser(userId, updatedFields) {
    const users = this.getAllUsers();
    if (!users[userId]) return; //return null;
    users[userId] = { ...users[userId], ...updatedFields };
    this.saveUsers(users);
    //return { ...users[userId] };
  }

  // ---- Todo Methods ----
  getUserTodos(userId) {
    const todosMap = JSON.parse(this.storage.getItem(TODOS_KEY)) || {};
    return todosMap[userId] || [];
  }

  saveUserTodos(todoList, userId) {
    const todosMap = JSON.parse(this.storage.getItem(TODOS_KEY)) || {};
    todosMap[userId] = todoList;
    this.storage.setItem(TODOS_KEY, JSON.stringify(todosMap));
  }

  addTodo(todo, userId) {
    const todos = this.getUserTodos(userId);
    todos.push(todo);
    this.saveUserTodos(todos, userId);
  }

  updateTodo(id, updatedFields, userId) {
    let todos = this.getUserTodos(userId);
    todos = todos.map(todo =>
      todo.todoId === id ? { ...todo, ...updatedFields } : todo
    );
    this.saveUserTodos(todos, userId);
  }

  deleteTodo(id, userId) {
    let todos = this.getUserTodos(userId);
    todos = todos.filter(todo => todo.todoId !== id);
    this.saveUserTodos(todos, userId);
  }

  getTodoById(userId, todoId) {
    const todos = this.getUserTodos(userId);
    const todo = todos.find(todo => todo.todoId === todoId);
    //console.log("Within User Storage ", { ...todo });
    return todo ? { ...todo } : null;
  }

  // ---- ID Tracking ----
  getLastId(userId) {
    const lastIds = JSON.parse(this.storage.getItem(LAST_ID_KEY)) || {};
    return lastIds[userId] || 0;
  }

  setLastId(lastId, userId) {
    const lastIds = JSON.parse(this.storage.getItem(LAST_ID_KEY)) || {};
    lastIds[userId] = lastId;
    this.storage.setItem(LAST_ID_KEY, JSON.stringify(lastIds));
  }

  // ---- Admin Helper ----
  getAllTodosForAllUsers() {
    return JSON.parse(this.storage.getItem(TODOS_KEY)) || {};
  }
}



/*
export function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '{}');
}

export function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}
*/