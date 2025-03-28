const express = require('express');
const authRoutes = express.Router();
const authController = require('../controllers/authController');

// Rotta per il login
authRoutes.post('/login', authController.login);
authRoutes.post('/register', authController.register)
authRoutes.post('/logout', authController.logout)

module.exports = authRoutes;
