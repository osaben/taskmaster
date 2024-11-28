const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const router = express.Router();

// Database initialization
const db = new sqlite3.Database('./dbs/database.db');

// Create users table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT
)`);

// Registration route
router.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('All fields are required.');

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send('Server error.');
    
    // Insert into database
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], function(err) {
      if (err) return res.status(400).send('User already exists.');
      res.status(201).send('User registered successfully.');
    });
  });
});

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('All fields are required.');

  // Check user existence
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).send('Server error.');
    if (!user) return res.status(400).send('Invalid credentials.');

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).send('Server error.');
      if (!isMatch) return res.status(400).send('Invalid credentials.');

      // Generate JWT
      const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

module.exports = router;
