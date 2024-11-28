const express = require('express');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Initialize DB
const db = new sqlite3.Database('./dbs/database.db');

db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')),
    deadline TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);
  

// Middleware to verify token
function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied.');

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).send('Invalid token.');
    req.user = user;
    next();
  });
}

// Create a new task
router.post('/', authenticateToken, (req, res) => {
  const { title, description, priority, deadline } = req.body;
  const { id: user_id } = req.user;

  if (!title || !priority) return res.status(400).send('Title and priority are required.');

  db.run(`INSERT INTO tasks (user_id, title, description, priority, deadline) VALUES (?, ?, ?, ?, ?)`, 
    [user_id, title, description, priority, deadline],
    function(err) {
      if (err) return res.status(500).send('Error creating task.');
      res.status(201).send({ taskId: this.lastID });
    });
});

// Get all tasks for the user
router.get('/', authenticateToken, (req, res) => {
  const { id: user_id } = req.user;
  db.all(`SELECT * FROM tasks WHERE user_id = ?`, [user_id], (err, tasks) => {
    if (err) return res.status(500).send('Error retrieving tasks.');
    res.json(tasks);
  });
});

// Update a task
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { title, description, priority, deadline } = req.body;
  const { id: user_id } = req.user;

  db.run(`UPDATE tasks SET title = ?, description = ?, priority = ?, deadline = ? 
          WHERE id = ? AND user_id = ?`,
    [title, description, priority, deadline, id, user_id],
    function(err) {
      if (err) return res.status(500).send('Error updating task.');
      if (this.changes === 0) return res.status(404).send('Task not found.');
      res.send('Task updated successfully.');
    });
});

// Delete a task
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { id: user_id } = req.user;

  db.run(`DELETE FROM tasks WHERE id = ? AND user_id = ?`, [id, user_id], function(err) {
    if (err) return res.status(500).send('Error deleting task.');
    if (this.changes === 0) return res.status(404).send('Task not found.');
    res.send('Task deleted successfully.');
  });

  // Get all tasks for the user with filtering and searching
router.get('/', authenticateToken, (req, res) => {
    const { id: user_id } = req.user;
    const { priority, dueDate, search } = req.query;  // Get query params
  
    // Base query
    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    let params = [user_id];
  
    // Add filters for priority and due date if provided
    if (priority) {
      query += ' AND priority = ?';
      params.push(priority);
    }
  
    if (dueDate) {
      query += ' AND deadline <= ?';
      params.push(dueDate);
    }
  
    // Add search functionality
    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
  
    // Execute the query
    db.all(query, params, (err, tasks) => {
      if (err) return res.status(500).send('Error retrieving tasks.');
      res.json(tasks);
    });
  });
  
});

module.exports = router;
