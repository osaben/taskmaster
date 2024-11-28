const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database');

// Register User
exports.registerUser = async (req, res) => {
  console.log('Request Body:', req.body); 
 // const { username, email, password } = req.body;

  // Validate input fields
  // if (!username || !email || !password) {
  //   return res.status(400).json({ error: 'All fields are required!' });
  // }

  // try {
  //   // Hash the password asynchronously
  //   const hashedPassword = await bcrypt.hash(password, 10);

  //   // SQL query to insert the new user into the database
  //   const query = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;

  //   // Execute the query with parameters to avoid SQL injection
  //   db.run(query, [username, email, hashedPassword], function (err) {
  //     if (err) {
  //       console.error('Database Error:', err.message); // Log the error for debugging
  //       return res.status(500).json({ error: 'Registration failed!' });
  //     }

  //     // Respond with a success message
  //     res.status(201).json({
  //       message: 'User registered successfully!',
  //       userId: this.lastID, // Return the newly created user's ID
  //     });
  //   });
  // } catch (error) {
  //   console.error('Hashing Error:', error.message);
  //   res.status(500).json({ error: 'Internal server error.' });
  // }
};

// User Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials!' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials!' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
};
