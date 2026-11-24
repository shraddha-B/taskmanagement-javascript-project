import { playAlertSound } from "./sound-alert-component.js";
import { eventPubSub } from "./services/event-pub-sub.js";

const popupQueue = [];
let isPopupShowing = false;

export function customAlertPopup(todo, message /*, onActionCallback = () => {} */) {
  popupQueue.push({ todo, message /*, onActionCallback */});
  processNextPopup();
}

function processNextPopup() {
if (isPopupShowing || popupQueue.length === 0) return;

  isPopupShowing = true;
  const { todo, message /*, onActionCallback */} = popupQueue.shift();

  const popup = document.createElement('div');
  popup.className = 'reminder-popup-container';
  popup.innerHTML = `
    <div class="popup-content">
      <p>🔴 "${todo.task}" ${message}</p>
        <button class="btn-snooze">Snooze</button>
        <button class="btn-stop">Stop Reminding</button>
        <button class="btn-close">Close</button>
    </div>
  `;

  playAlertSound();
  document.body.appendChild(popup);

  popup.querySelector('.btn-snooze').onclick = () => {
    const todoSnoozedUntil = new Date(Date.now() + 3 * 60 * 1000); // example 10 min
    popup.remove();
    isPopupShowing = false;
    //onActionCallback(todo.todoId, { snoozedUntil: todoSnoozedUntil } ); // <-- trigger UI update
    handleReminder(todo.todoId, {snoozedUntil: todoSnoozedUntil});
    processNextPopup();
  };

  popup.querySelector('.btn-stop').onclick = () => {
    //todo.stopReminding = true;
    popup.remove();
    isPopupShowing = false;
    //onActionCallback(todo.todoId, { stopReminding: true } ); // <-- trigger UI update
    handleReminder(todo.todoId, {stopReminding: true});
    processNextPopup();
  };

  popup.querySelector('.btn-close').onclick = () => {
    popup.remove();
    isPopupShowing = false;
    processNextPopup();
  };
}

function handleReminder(todoId, updates) {
  //console.log("In emit ", {todoId, updates});
    eventPubSub.emit("reminderAction", {todoId, updates});
}
