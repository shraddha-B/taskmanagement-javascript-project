import { TodoService } from "./services/todo-service.js";

/**
 * @param {TodoService} todoService
 */

export class TodoController {
  constructor(todoService, todoRenderer, reminderManager, customPrompt) {
    /** * @type {TodoService} */
    this.todoService = todoService;
    this.todoRenderer = todoRenderer;
    this.reminderManager = reminderManager;
    this.customPrompt = customPrompt;
    //console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(todoService))); - debugging purpose to check the service ans it's members are available
  }

  init() {
    // Initial render
    this.render();

    // Add Todo
    document.querySelector('#add-btn').addEventListener('click', () => {
      const task = document.querySelector('#todo-input').value.trim();
      const dueDate = document.querySelector('#due-date').value;
      const priority = document.querySelector('#priority').value;

      if (task === '') return;

      if (task) {
        this.todoService.addTodo(task, dueDate, priority);
        this.render();
        this.clearInputs();
      }

    });

    document.getElementById('todo-list').addEventListener('click', async (ev) => {
      const id = Number(ev.target.dataset.id);
      const action = ev.target.dataset.action;

      if (!id) return;

      if (ev.target.type === 'checkbox' && action === 'toggle') {
        this.todoService.updateTodo(id, { completed: ev.target.checked });

        //saveTodos();
        this.render();

        return; // Exit early to avoid edit/delete triggering
      }

      if (action === 'delete') {
        this.todoService.deleteTodo(id);
      }
      else if (action === 'edit') {
        console.log("Edit clicked");
        try {
          console.log("Within try");
          //console.log("Checking controller current error ", this.customPrompt.showPrompt(this.todoService.getTodoById(id).task));
          const newTask = await this.customPrompt.showPrompt(this.todoService.getTodoById(id).task);
          console.log("newTask value displayed ", newTask); //const newTask = 
          if (newTask !== null && newTask.trim() !== '') {
            this.todoService.updateTodo(id, { task: newTask });
          }
        }
        catch (err) {
          console.log("Error occured ", err);
          return;
        }

        //console.log("In edit test run");
        /*
        //console.log("Todo passed by id ", this.todoService.getTodoById(id));
        const newText = prompt('Edit task:', this.todoService.getTodoById(id).task);
        if (newText !== null && newText.trim() !== '') {
          this.todoService.updateTodo(id, { task: newText });
        }
        */
      }

      //saveTodos();
      this.render();
    });

    // Filters & sorting
    document.querySelector('#filter').addEventListener('change', () => this.render());
    document.querySelector('#sort').addEventListener('change', () => this.render());
  }

  render() {
    const todos = this.todoService.filterAndSortTodos(this.getFilter(), this.getSort());
    this.todoRenderer.renderTodos(todos);
    todos.forEach(todo => {
      this.reminderManager.start(todo);
    });

    /*
    this.todoRenderer.renderTodos(
      this.todoService.filterAndSortTodos(this.getFilter(), this.getSort())
    );
    */
  }

  getFilter() {
    return document.querySelector('#filter').value;
  }

  getSort() {
    return document.querySelector('#sort').value;
  }

  clearInputs() {
    document.querySelector('#todo-input').value = '';
    document.querySelector('#due-date').value = '';
  }
}


/*
export class TodoController {
  constructor() {
    this.todoService = new TodoService();
    this.todoRenderer = new TodoRenderer();
  }

  init() {
    // Initial render
    this.render();

    // Add Todo
    document.querySelector('#add-btn').addEventListener('click', () => {
      const task = document.getElementById('todo-input').value.trim();
      const dueDate = document.getElementById('due-date').value;
      const priority = document.getElementById('priority').value;
      if (task) {
        this.todoService.addTodo(task, dueDate, priority);
        this.render();
        this.clearInputs();
      }
    });

    // Todo list actions
    document.getElementById('todo-list').addEventListener('click', (e) => {
      const id = Number(e.target.dataset.id);
      const action = e.target.dataset.action;
      if (!id) return;

      if (action === 'toggle') {
        this.todoService.updateTodo(id, { completed: e.target.checked });
      }
      if (action === 'delete') {
        this.todoService.deleteTodo(id);
      }
      if (action === 'edit') {
        const newText = prompt("Edit task:");
        if (newText) this.todoService.updateTodo(id, { task: newText });
      }

      this.render();
    });

    // Filters & sorting
    document.getElementById('filter').addEventListener('change', () => this.render());
    document.getElementById('sort').addEventListener('change', () => this.render());
  }

  render() {
    this.todoRenderer.renderTodos(
      this.todoService.filterAndSortTodos(this.getFilter(), this.getSort())
    );
  }

  getFilter() {
    return document.getElementById('filter').value;
  }

  getSort() {
    return document.getElementById('sort').value;
  }

  clearInputs() {
    document.getElementById('todo-input').value = '';
    document.getElementById('due-date').value = '';
  }
}
*/
