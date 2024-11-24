const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskControler');
//const authMiddleware = require('../middleware/authMiddleware'); // For securing routes

// Secure all routes with authentication middleware
//router.use(authMiddleware);

// Route to create a new task
router.post('/tasks', taskController.createTask);

// Route to get all tasks for a user
router.get('/tasks', taskController.getTasks);

// Route to update a task by ID
router.put('/tasks/:id', taskController.updateTask);

// Route to delete a task by ID
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
