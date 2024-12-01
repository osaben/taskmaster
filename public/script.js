let authToken = '';

// Handle Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (res.ok) {
    const data = await res.json();
    authToken = data.token;
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('task-container').style.display = 'block';
    fetchTasks();
  } else {
    alert('Login failed.');
  }
});

// Fetch Tasks with Filters
async function fetchTasks() {
  const priority = document.getElementById('filter-priority').value;
  const dueDate = document.getElementById('filter-due-date').value;
  const search = document.getElementById('search-keyword').value;

  let query = '';
  if (priority) query += `priority=${priority}&`;
  if (dueDate) query += `dueDate=${dueDate}&`;
  if (search) query += `search=${encodeURIComponent(search)}&`;

  const res = await fetch(`/api/tasks?${query}`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  const tasks = await res.json();
  displayTasks(tasks);
}

// Display Tasks
function displayTasks(tasks) {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
      <strong>${task.title}</strong> - ${task.priority} priority<br>
      ${task.description}<br>
      Due: ${task.deadline}
    `;
    taskList.appendChild(taskItem);
  });
}

// Add Task
document.getElementById('add-task-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('task-title').value;
  const description = document.getElementById('task-description').value;
  const priority = document.getElementById('task-priority').value;
  const deadline = document.getElementById('task-deadline').value;

  const res = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    body: JSON.stringify({ title, description, priority, deadline }),
  });
  if (res.ok) {
    fetchTasks();  // Refresh task list
    document.getElementById('add-task-form').reset();
  } else {
    alert('Failed to add task.');
  }
});

// Fetch Tasks with Update functionality
function displayTasks(tasks) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
      const taskItem = document.createElement('li');
      taskItem.className = 'task-item';
      taskItem.innerHTML = `
        <strong>${task.title}</strong> - ${task.priority} priority<br>
        ${task.description}<br>
        Due: ${task.deadline}
        <button onclick="showEditForm(${task.id}, '${task.title}', '${task.description}', '${task.priority}', '${task.deadline}')">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      `;
      taskList.appendChild(taskItem);
    });
  }
  
  // Show Edit Form with task data
  function showEditForm(id, title, description, priority, deadline) {
    document.getElementById('task-title').value = title;
    document.getElementById('task-description').value = description;
    document.getElementById('task-priority').value = priority;
    document.getElementById('task-deadline').value = deadline;
    document.getElementById('add-task-form').onsubmit = (e) => updateTask(e, id);
  }
  
  // Update Task
  async function updateTask(e, id) {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value;
  
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ title, description, priority, deadline }),
    });
  
    if (res.ok) {
      fetchTasks();  // Refresh task list
      document.getElementById('add-task-form').reset();
    } else {
      alert('Failed to update task.');
    }
  }

  // Delete Task
async function deleteTask(id) {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
  
    if (res.ok) {
      fetchTasks();  // Refresh task list
    } else {
      alert('Failed to delete task.');
    }
  }
  
      