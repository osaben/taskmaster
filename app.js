// const express = require('express');
// const app = express();
// // const mongoose = require('mongoose'); // Or import PostgreSQL client
// const taskRoutes = require('./route/taskRoutes');
// const authRoutes = require('./route/authRoutes');

// // Middleware
// app.use(express.json());


// // Test Route
// app.get('/', (req, res) => {
//   res.send('Express.js Server is Running!');
// });

// // Routes
//  app.use('/api/tasks', taskRoutes);
//  app.use('/api/auth', authRoutes);

// // Database Connection (Replace with PostgreSQL config if needed)
// // mongoose.connect('mongodb://localhost/taskmaster_db', {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // });

// app.listen(3000, () => console.log('Server running on port 3000'));

const express = require('express');
const app = express();
const taskRoutes = require('./route/taskRoutes');

// Middleware to parse JSON
app.use(express.json());

// Use task routes
app.use('/api', taskRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
