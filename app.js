let tasks = JSON.parse(localStorage.getItem('tasks')) || [
  {id:1, title:"Review JavaScript loops", completed:true},
  {id:2, title:"Finish CSS layout", completed:true},
  {id:3, title:"Build task dashboard", completed:false},
  {id:4, title:"Refactor code", completed:false}
];

let currentFilter = "all";

const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-task-btn');
const stats = document.getElementById('stats');

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  taskList.innerHTML = '';
  
  tasks.forEach(task => {
    if (currentFilter === 'completed' && !task.completed) return;
    if (currentFilter === 'pending' && task.completed) return;
    
    const div = document.createElement('div');
    div.className = 'task' + (task.completed ? ' completed' : '');
    div.dataset.id = task.id;
    div.innerHTML = `
      <div>
        <h3>${task.title}</h3>
        <p>${task.completed ? 'Completed' : 'Pending'}</p>
      </div>
      <button class="delete-btn">Delete</button>
    `;
    taskList.appendChild(div);
  });
  
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  stats.textContent = `Total: ${total} | Completed: ${done} | Pending: ${total-done}`;
  
  document.querySelectorAll('#filter-all, #filter-completed, #filter-pending').forEach(btn => {
    btn.classList.toggle('active-filter', btn.id === `filter-${currentFilter}`);
  });
}

if (addBtn && taskInput) {
  addBtn.onclick = () => {
    const title = taskInput.value.trim();
    if (title) {
      tasks.push({id: Date.now(), title, completed: false});
      taskInput.value = '';
      save();
      render();
    }
  };
  
  taskInput.onkeydown = e => e.key === 'Enter' && addBtn.click();
}

taskList.onclick = e => {
  const task = e.target.closest('.task');
  if (!task) return;
  
  const id = task.dataset.id;
  const del = e.target.classList.contains('delete-btn');
  
  if (del) {
    task.style.opacity = 0;
    setTimeout(() => {
      tasks = tasks.filter(t => t.id != id);
      save();
      render();
    }, 300);
  } else {
    const t = tasks.find(t => t.id == id);
    if (t) t.completed = !t.completed;
    save();
    render();
  }
};

['all', 'completed', 'pending'].forEach(filter => {
  const btn = document.getElementById(`filter-${filter}`);
  if (btn) btn.onclick = () => {
    currentFilter = filter;
    render();
  };
});

render();
