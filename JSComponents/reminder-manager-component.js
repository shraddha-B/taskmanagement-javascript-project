//import { playAlertSound } from './alert-sound.js';
//import { showNotification } from './notification.js';
  /*box-shadow: 0 2px 5px rgba(173, 216, 230, 0.4); */
            //box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
export class ReminderManager {
  constructor(popupCallback, options = {}) {
    this.popupCallback = popupCallback;
    // this.onReminderAction = options.onReminderAction ?? (() => {});
    // Best practice: inject a function to get the current task by ID
    this.getTodoById = options.getTodoById ?? (() => null);
    this.repeatReminderTime = options.repeatReminderTime ?? 1 * 60 * 1000;
    this.minutesBeforeReminder = options.minutesBeforeReminder ?? 10 * 60 * 1000;

    this.activeReminders = new Map(); // Map of task.id -> timeout or interval ID
  }

  start(todo) {
    if (!todo || !todo.dueDate) return;

    if (todo.completed || todo.stopReminding) {
      this.stop(todo.todoId); // Clean up any previous reminders if task became inactive
      return;
    }

    // Avoid duplicate starts (hence duplicate timers) - as start called at re-render, reload, add todo, complete todo
    for (const key of this.activeReminders.keys())
    if (key.startsWith(todo.todoId)) return; // already scheduled for this phase

    //if (key.startsWith(todo.todoId))
    const snoozedUntil = todo.snoozedUntil ? new Date(todo.snoozedUntil).getTime() : 0;
    const dueTime = new Date(todo.dueDate).getTime();
    const now = Date.now();

    const minutesBeforeReminder = this.minutesBeforeReminder;
    //const repeatReminderTime = this.repeatReminderTime;

    console.log("dueTime - now - minutesBeforeReminder ", dueTime, " " , now, " Difference ", (dueTime-now), " check ", (dueTime - now > minutesBeforeReminder), " ", minutesBeforeReminder);
    //1,85,97,050   6,00,00,000
    // Schedule 10-minute before reminder
    if (dueTime - now >= minutesBeforeReminder) { //10 * 60 * 1000
      console.log("In 10 mins before reminder testing", dueTime, " " , now, " Difference ", (dueTime-now), " check ", (dueTime - now > minutesBeforeReminder), " ", minutesBeforeReminder);
      const beforeDelay = dueTime - minutesBeforeReminder - now;
      const beforeTimeout = setTimeout(() => {
        this._remind(todo, 'Upcoming (10 minutes left!)');
      }, beforeDelay);
      this.activeReminders.set(todo.todoId + '_before', beforeTimeout);
    }

    // Schedule on-time reminder
    if (dueTime - now >= 0) {
      console.log("In now reminder testing", dueTime, " " , now, " Difference ", (dueTime-now), " check ", (dueTime - now > minutesBeforeReminder), " ", minutesBeforeReminder );
      const onTimeDelay = dueTime - now;
      const onTimeTimeout = setTimeout(() => {
        this._remind(todo, 'Due now!');
        this._startRepeating(todo); // Begin reminder loop after due
      }, onTimeDelay);
      this.activeReminders.set(todo.todoId + '_ontime', onTimeTimeout);
    } else if (snoozedUntil <= now) {
      // If already overdue and not snoozed, start looping immediately
      console.log("After due 1st reminder testing", dueTime, " " , now);
      this._startRepeating(todo);
    } else {
      console.log("After due 2nd reminder testing", dueTime, " " , now);
      // Snoozed but not overdue yet
      const delay = snoozedUntil - now;
      const resumeTimeout = setTimeout(() => {
        this._startRepeating(todo);
      }, delay);
      this.activeReminders.set(todo.todoId + '_snooze', resumeTimeout);
    }
  }

  _startRepeating(todo) {
    if (!todo || todo.completed || todo.stopReminding) return;
    const repeatReminderTime = this.repeatReminderTime;

    const intervalId = setInterval(() => {
      const current = this.getTodoById(todo.todoId);
      if (!current || current.completed || current.stopReminding) {
        clearInterval(intervalId);
        this.stop(todo.todoId);
        return;
      }

      const snoozedTime = current.snoozedUntil ? new Date(current.snoozedUntil).getTime() : 0;
      if (snoozedTime > Date.now()) {
        clearInterval(intervalId);
        const delay = snoozedTime - Date.now();
        const resumeTimeout = setTimeout(() => {
          this._startRepeating(current);
        }, delay);
        this.activeReminders.set(todo.todoId + '_snooze', resumeTimeout);
        return;
      }

      this._remind(current, 'Still overdue!');
    }, repeatReminderTime); // Every specified mins after due

    this.activeReminders.set(todo.todoId + '_loop', intervalId);
  }

  _remind(todo, message) {
    if (todo.completed || todo.stopReminding) {
      this.stop(todo.todoId);
      return;
    }

    const now = Date.now();
    const snoozedUntil = todo.snoozedUntil ? new Date(todo.snoozedUntil).getTime() : 0;

    // For defensive programming check - extra check
    if (snoozedUntil > now) {
      // Skip current reminder; reschedule start after snooze
      const delay = snoozedUntil - now;
      const resumeTimeout = setTimeout(() => {
        this._startRepeating(todo);
      }, delay);
      this.activeReminders.set(todo.todoId + '_snooze', resumeTimeout);
      return;
    }

    //playAlertSound();
    this.popupCallback(todo, message /*, this.onReminderAction */);  // customAlertPopup(todo, message); // Use your custom popup
    //showNotification(`"${todo.task}" - ${message}`);
  }

  stop(todoId) {
    // Cancel all timers related to a todo
    ['_before', '_ontime', '_snooze', '_loop'].forEach(suffix => {
      const key = todoId + suffix;
      const id = this.activeReminders.get(key);
      if (id) {
        clearTimeout(id);
        clearInterval(id);
        this.activeReminders.delete(key);
      }
    });
  }
}

/* Calling reminder manager, popup manager and render todo lsit from mao=in.js
Example usage
Suppose in main.js or todos.js you do:

js
Copy
Edit
import { ReminderManager } from './ReminderManager.js';
import { customAlertPopup } from './popup-manager-component.js';
import { renderTodoList } from './ui.js'; // assuming this re-renders your todo list

const reminderManager = new ReminderManager(customAlertPopup, {
  getTodoById: (id) => todos.find(t => t.id === id),
  onReminderAction: () => renderTodoList()
});
*/

/* Above changed to - i.e. added for saveTOdos() method calling
 In your main.js or todos.js:
js
Copy
Edit
import { ReminderManager } from './ReminderManager.js';
import { customAlertPopup } from './popup-manager-component.js';
import { saveTodos, renderTodos } from './storage-or-ui.js'; // adjust path

const reminderManager = new ReminderManager(customAlertPopup, {
  getTodoById: (id) => todos.find(t => t.id === id),

  // 👇 Callback triggered after "Snooze" or "Stop Reminding"
  onReminderAction: () => {
    saveTodos();
    renderTodos();
  }
});
*/
