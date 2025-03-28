const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const authMiddlewareRoutes = express.Router();

// Rotte middleware
authMiddlewareRoutes.use(authMiddleware);
authMiddlewareRoutes.post('/authenticateToken', (req, res) => {
    res.json({ message: 'Token verificato con successo' });
});

// app.use(authenticateToken);
// app.get('/protected-route', (req, res) => {
//     res.json({ message: `Benvenuto, ${req.user.username}!` });
// });
// app.use('/secure-blacklist', authMiddleware, (req, res) => {
//     res.json({ message: 'Accesso a una rotta con blacklist!' });
// });


module.exports = authMiddlewareRoutes;