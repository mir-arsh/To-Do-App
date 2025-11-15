// Get references to DOM elements
const todoInput = document.getElementById('todoInput');
const addButton = document.getElementById('add');
const todoList = document.getElementById('todo-list');
const filterButtons = document.querySelectorAll('.filter-btn');
const clearCompletedBtn = document.getElementById('clearCompleted');
const totalCountEl = document.getElementById('totalCount');
const activeCountEl = document.getElementById('activeCount');
const completedCountEl = document.getElementById('completedCount');

// Current filter state
let currentFilter = 'all';

// Load saved todos from localStorage
const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

// Function to save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Update stats counters
function updateStats() {
    const totalTasks = todos.length;
    const activeTasks = todos.filter(todo => !todo.completed).length;
    const completedTasks = todos.filter(todo => todo.completed).length;
    totalCountEl.textContent = totalTasks;
    activeCountEl.textContent = activeTasks;
    completedCountEl.textContent = completedTasks;

    // Enable/disable clear completed button
    clearCompletedBtn.disabled = completedTasks === 0;
}

// Clear all completed todos
function clearCompleted() {
    if (todos.some(todo => todo.completed)) {
        for (let i = todos.length - 1; i >= 0; i--) {
            if (todos[i].completed) {
                todos.splice(i, 1);
            }
            renderTodos();
            saveTodos();
            updateStats();
        }
    }
}

// Create DOM node for a todo item and append it
function createTodoNode(todo, index) {
    const li = document.createElement('li');

    if (todo.completed) {
        li.classList.add('completed');
    }

    const span = document.createElement('span');
    span.textContent = todo.text;

    // Create checkbox for completion status
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    // Update todo completion status on checkbox change
    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        span.style.textDecoration = todo.completed ? 'line-through' : "";
        li.classList.toggle('completed');
        saveTodos();
        updateStats();
    })

    // Enable editing of todo text on double-click
    span.addEventListener('dblclick', () => {
        const newText = prompt('Edit task:', todo.text);
        if (newText !== null && newText.trim() !== '') {
            todo.text = newText.trim();
            span.textContent = todo.text;
            saveTodos();
        }
    })

    // Create delete button for the todo item
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
        todos.splice(index, 1);
        renderTodos();
        saveTodos();
        updateStats();
    })

    // Append elements to the list item
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteButton);
    return li;
}

// Function to render the todo list based on current filter
function renderTodos() {
    todoList.innerHTML = '';

    let filteredTodos = todos;

    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // Iterate through filtered todos and create DOM nodes
    filteredTodos.forEach((todo) => {
        // Find actual index in original todos array
        const actualIndex = todos.indexOf(todo);
        const node = createTodoNode(todo, actualIndex);
        todoList.appendChild(node);
    });

    // Show empty state for filtered view if needed
    if (filteredTodos.length === 0 && currentFilter !== 'all') {
        todoList.classList.add('filtered-empty');
    } else {
        todoList.classList.remove('filtered-empty');
    }
}

// Adding a New Todo Item
function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    // Add new todo to the list
    todos.push({ text, completed: false });
    todoInput.value = '';
    todoInput.focus();
    renderTodos();
    saveTodos();
    updateStats();
}

// Setup filter buttons
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Setup clear completed button
clearCompletedBtn.addEventListener('click', clearCompleted);

// Setup add button and input
addButton.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') addTodo();
});

// Initial render
renderTodos();
updateStats();