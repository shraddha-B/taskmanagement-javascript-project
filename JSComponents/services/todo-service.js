export class TodoService {
  // dependency-inject both storage layer and session manager
  constructor(userStorage, sessionManager) {
    if (!userStorage) throw new Error('userStorage is required');
    if (!sessionManager) throw new Error('sessionManager is required');

    this.userStorage = userStorage;
    this.sessionManager = sessionManager;
  }

  _currentUserId() {
    return this.sessionManager.getCurrentUser();
  }

  getTodos() {
    const userId = this._currentUserId();
    if (!userId) return [];
    return [...this.userStorage.getUserTodos(userId)];
  }

  addTodo(_task, dueDate, priority) {
    const _userId = this._currentUserId();
    if (!_userId) throw new Error('No user logged in');

    // compute next id using stored lastId
    const lastId = this.userStorage.getLastId(_userId) || 0;
    const newId = lastId + 1;

    const newTodo = {
      todoId: newId,
      userId: _userId,
      task: _task,
      dueDate: dueDate || null,   //dueDate: due_Date,
      priority: priority || 'medium',
      completed: false,
      snoozedUntil: null,
      stopReminding: false
    };

    this.userStorage.addTodo(newTodo, _userId);
    this.userStorage.setLastId(newId, _userId);
    return newTodo;
  }

  updateTodo(id, updates) {
    const userId = this._currentUserId();
    if (!userId) throw new Error('No user logged in');
    const todo = this.userStorage.getUserTodos(userId).find(t => t.todoId === id);
    if (!todo) return;
    this.userStorage.updateTodo(id, updates, userId);
  }

  deleteTodo(id) {
    const userId = this._currentUserId();
    if (!userId) throw new Error('No user logged in');
    this.userStorage.deleteTodo(id, userId);
  }

  getTodoById(todoId) {
    const userId = this._currentUserId();
    if (!userId) throw new Error('No user logged in');
    //console.log("Within Todo service ", this.userStorage.getTodoById(userId, todoId));
    return this.userStorage.getTodoById(userId, todoId);
  }

  filterAndSortTodos(filter = 'all', sort = 'date') {
    //let filtered = this.getTodos();
    //console.log("Within todoservice filtered function getting todos in ", this.getTodos());
    let filtered = this.getTodos().filter(todo => {
      if (filter === 'completed') return todo.completed;
      if (filter === 'incomplete') return !todo.completed;
      if (filter === 'high') return todo.priority === "high";
      if (filter === 'medium') return todo.priority === "medium";
      if (filter === 'low') return todo.priority === "low";
      return true;
    });

    const order = { high: 1, medium: 2, low: 3 };
    if (sort === 'date') {
      filtered.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
    } else if (sort === 'date-desc') {
      filtered.sort((a, b) => new Date(b.dueDate || '9999-12-31') - new Date(a.dueDate || '9999-12-31'));
    } else if (sort === 'priority') {
      filtered.sort((a, b) => order[a.priority] - order[b.priority]); // High - low
    } else if (sort === 'priority-desc') {
      filtered.sort((a, b) => order[b.priority] - order[a.priority]); // Low - high
    }

    //console.log("inside todo service filtering ", filtered);
    return filtered;

  }
}


    /*
    if (filter === 'completed') filtered = filtered.filter(t => !!t.completed);
    if (filter === 'incomplete') filtered = filtered.filter(t => !t.completed);
    if (['high', 'medium', 'low'].includes(filter)) {
      filtered = filtered.filter(t => (t.priority || '').toLowerCase() === filter);
    }

    const order = { high: 1, medium: 2, low: 3 };

    if (sort === 'date') filtered.sort((a, b) => new Date(a.dueDate || '9999-12-31') - new Date(b.dueDate || '9999-12-31'));
    else if (sort === 'date-desc') filtered.sort((a, b) => new Date(b.dueDate || '9999-12-31') - new Date(a.dueDate || '9999-12-31'));
    else if (sort === 'priority') filtered.sort((a, b) => (order[(a.priority || '').toLowerCase()] || 99) - (order[(b.priority || '').toLowerCase()] || 99));
    else if (sort === 'priority-desc') filtered.sort((a, b) => (order[(b.priority || '').toLowerCase()] || 99) - (order[(a.priority || '').toLowerCase()] || 99));
    
    return filtered;
    */