const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const path = require('path');
const cors = require('cors');


const app = express();
app.use(cors());
//app.use(express.static('public')); // Serving static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/login.html'); // Manually serve the index.html as a fallback
// });
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
