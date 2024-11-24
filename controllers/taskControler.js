const db = require('../database');

// Create a new task
exports.createTask = (req, res) => {
  const { title, description, priority, deadline } = req.body;
  const userId = req.user.id; // Assume user ID is attached from auth middleware

  const query = `INSERT INTO tasks (title, description, priority, deadline, user_id) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [title, description, priority, deadline, userId], function(err) {
    if (err) return res.status(500).json({ error: 'Task creation failed!' });

    res.status(201).json({ message: 'Task created successfully!', taskId: this.lastID });
  });
};

// Get all tasks for a user
exports.getTasks = (req, res) => {
  const userId = req.user.id;

  db.all(`SELECT * FROM tasks WHERE user_id = ?`, [userId], (err, tasks) => {
    if (err) return res.status(500).json({ error: 'Failed to retrieve tasks!' });

    res.json(tasks);
  });
};

// Update a task
exports.updateTask = (req, res) => {
  const { title, description, priority, deadline } = req.body;
  const taskId = req.params.id;

  const query = `UPDATE tasks SET title = ?, description = ?, priority = ?, deadline = ? WHERE id = ? AND user_id = ?`;

  db.run(query, [title, description, priority, deadline, taskId, req.user.id], function(err) {
    if (err || this.changes === 0) return res.status(500).json({ error: 'Task update failed or not found!' });

    res.json({ message: 'Task updated successfully!' });
  });
};

// Delete a task
exports.deleteTask = (req, res) => {
  const taskId = req.params.id;

  const query = `DELETE FROM tasks WHERE id = ? AND user_id = ?`;

  db.run(query, [taskId, req.user.id], function(err) {
    if (err || this.changes === 0) return res.status(500).json({ error: 'Task deletion failed or not found!' });

    res.json({ message: 'Task deleted successfully!' });
  });
};
