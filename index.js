const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'todos.json');

// Initialize the JSON file if it doesn't exist
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

const getTodos = () => {
    const data = fs.readFileSync(FILE_PATH, 'utf-8');
    return JSON.parse(data);
};

const saveTodos = (todos) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(todos, null, 2));
};

const addTodo = (task) => {
    const todos = getTodos();
    todos.push({ id: Date.now(), task, completed: false });
    saveTodos(todos);
    console.log(`Added: "${task}"`);
};

const listTodos = () => {
    const todos = getTodos();
    console.log('\n--- Todo List ---');
    if (todos.length === 0) {
        console.log('No todos found. Add one!');
    } else {
        todos.forEach((todo, index) => {
            console.log(`${index + 1}. [${todo.completed ? 'x' : ' '}] ${todo.task} (ID: ${todo.id})`);
        });
    }
    console.log('-----------------\n');
};

const completeTodo = (id) => {
    const todos = getTodos();
    const todo = todos.find(t => t.id == id);
    if (todo) {
        todo.completed = true;
        saveTodos(todos);
        console.log(`Completed: "${todo.task}"`);
    } else {
        console.log(`Todo with ID ${id} not found.`);
    }
};

const deleteTodo = (id) => {
    let todos = getTodos();
    const initialLength = todos.length;
    todos = todos.filter(t => t.id != id);
    if (todos.length < initialLength) {
        saveTodos(todos);
        console.log(`Deleted todo with ID ${id}`);
    } else {
        console.log(`Todo with ID ${id} not found.`);
    }
};

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case 'add':
        const task = args.slice(1).join(' ');
        if (!task) {
            console.log('Please provide a task. Example: node index.js add "Buy groceries"');
        } else {
            addTodo(task);
        }
        break;
    case 'list':
        listTodos();
        break;
    case 'complete':
        if (!args[1]) {
            console.log('Please provide an ID. Example: node index.js complete 123456');
        } else {
            completeTodo(args[1]);
        }
        break;
    case 'delete':
        if (!args[1]) {
            console.log('Please provide an ID. Example: node index.js delete 123456');
        } else {
            deleteTodo(args[1]);
        }
        break;
    default:
        console.log(`
CLI Todo App Usage:
  node index.js add "task description"   - Add a new todo
  node index.js list                     - List all todos
  node index.js complete <id>            - Mark a todo as completed
  node index.js delete <id>              - Delete a todo
`);
}
