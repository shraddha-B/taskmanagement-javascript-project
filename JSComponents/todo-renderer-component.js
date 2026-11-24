
export class TodoRenderer {
    constructor(container = document.querySelector('.todo-list-container'), /*reminderManager*/) {
        //this.container = document.getElementById(containerId);
        this.container = container;
        //this.reminderManager = reminderManager;
    }

    renderTodos(todos){
      //console.log("Entered renderTodos method ", todos);
        //const container = document.querySelector('.todo-list-container');
        // To make ul Idempotent - Check if UL already exists
        let list = this.container.querySelector('#todo-list');
        if (!list) {
            list = document.createElement('ul');
            list.id = 'todo-list';
            this.container.appendChild(list);
        }
        list.innerHTML = '';

        todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'fade-in';
        if (todo.completed) li.classList.add('completed');

        const now = new Date().getTime();
        //const snoozedTime = todo.snoozedUntil ? new Date(todo.snoozedUntil).getTime() : 0;    // not needed but will check atlast if filtered passing better for reminder logic nstead of all todos
        const dueDate = new Date(todo.dueDate);
        let isOverdue = !todo.completed && todo.dueDate && dueDate < now;

        li.innerHTML = `
        <input type="checkbox" data-action="toggle" data-id="${todo.todoId}" ${todo.completed ? 'checked' : ''}>
        <span class="todo-text">${todo.task}</span>
        <span class="meta priority-${todo.priority}">[${todo.priority}]</span>
        ${todo.dueDate ? `<span class="meta ${isOverdue ? 'overdue' : ''}">${isOverdue ? '🔴' : ''}Due: ${todo.dueDate}</span>` : ''}
        <button id="btnEdit" data-action="edit" data-id="${todo.todoId}">Edit</button>
        <button id="btnDelete" data-action="delete" data-id="${todo.todoId}">Delete</button>
      `;
            list.appendChild(li);
            //console.log(list.textContent);
            //this.reminderManager.start(todo);  //Check to place reminder Manager here or somewhere else
        });
    }
}


/*
export function renderTodos(todos) {
  const container = document.querySelector('.todo-list-container');
  container.innerHTML = ''; // clear old list

  const ul = document.createElement('ul');
  ul.id = 'todo-list';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.textContent = todo.text;
    ul.appendChild(li);
  });

  container.appendChild(ul);
}
*/
