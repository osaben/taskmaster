const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController.js');

// Registration Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

module.exports = router;
