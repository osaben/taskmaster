const Task = require('../models/task');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;
    const task = new Task({
      title,
      description,
      priority,
      deadline,
      user: req.user.id, // Assuming the user is authenticated
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Task creation failed!' });
  }
};

// Get all tasks for a user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tasks!' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Task update failed!' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Task deletion failed!' });
  }
};
