import { ReminderManager } from './reminder-manager-component.js';
import { customAlertPopup } from './popup-manager-component.js';
import { initAlertSound } from "./sound-alert-component.js";
import { todoService } from './main.js';
import { TodoController } from './todos-controller-component.js';
import { TodoRenderer } from './todo-renderer-component.js';
import { eventPubSub } from './services/event-pub-sub.js';
import { CustomPrompt } from './customized-prompt-component.js';

// no any effect so logic in respective script's tag in header tag
// import { sessionManager, userStorage } from './main.js';
//requireLogin();

document.addEventListener('DOMContentLoaded', () => {

  let todoRenderer;
  let todoController;
  
  initAlertSound(document.body, './Sounds/alert-notification-sound.wav');

  const customPrompt = new CustomPrompt(document.body, "Edit Todo Task");
  customPrompt.injectCustomPrompt();

  const reminderManager = new ReminderManager(customAlertPopup, {
    getTodoById: (id) => todoService.getTodoById(id), // (id) => todos.find(t => t.todoId === id)
    /*
    // Callback triggered after "Snooze" or "Stop Reminding"
    onReminderAction: (todoId, todoUpdate) => {
      //saveTodos();
      todoService.updateTodo(todoId, todoUpdate);
      todoRenderer.renderTodos(todoService.filterAndSortTodos(todoController.getFilter(), todoController.getSort()));   // renderTodos();
    },
    */
    minutesBeforeReminder: 10 * 60 * 1000, // or any value in minutes
    repeatReminderTime: 1 * 60 * 1000,
  });

  todoRenderer = new TodoRenderer(document.querySelector('.todo-list-container') /*reminderManager*/);
  todoController = new TodoController(todoService, todoRenderer, reminderManager, customPrompt);
  
  todoController.init();

  eventPubSub.on("reminderAction", ({todoId, updates}) => {
    //console.log("In on ", todoId, updates);
    todoService.updateTodo(todoId,updates);
    todoController.render();
  });
});

/*
import { ReminderManager } from './JSComponents/reminder-manager-component.js';
  import { customAlertPopup } from './JSComponents/popup-manager-component.js';

  document.addEventListener('DOMContentLoaded', () => {
  window.reminderManager = new ReminderManager(customAlertPopup, {

  getTodoById: (id) => window.todos.find(t => t.todoId === id),
  // 👇 Callback triggered after "Snooze" or "Stop Reminding"
  onReminderAction: () => {
    saveTodos();
    renderTodos();
  },
  minutesBeforeReminder: 10 * 60 * 1000, // or any value in minutes
  repeatReminderTime: 1 * 60 * 1000,

 });
 
 });
 */