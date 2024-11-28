const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController.js');
const authMiddleware = require('../middleware/authMiddleware'); // For securing routes

// Registration Route (public)
router.post('/register', registerUser);

// Login Route (public)
router.post('/login', loginUser);

// Apply authentication middleware only to protected routes below
router.use(authMiddleware);

// Example of a protected route
router.get('/protected', (req, res) => {
  res.json({ message: 'This is a protected route' });
});

module.exports = router;
