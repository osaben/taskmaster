const express = require('express');
const app = express();
const mongoose = require('mongoose'); // Or import PostgreSQL client
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);

// Database Connection (Replace with PostgreSQL config if needed)
mongoose.connect('mongodb://localhost/taskmaster_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(3000, () => console.log('Server running on port 3000'));
