const express = require('express');
const immageRouter = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const imageController = require('../controllers/imageControllers')
const { authenticateToken } = require('../middleware/authMiddleware')

// Rotte protette per le immagini
immageRouter.post('/upload', authMiddleware, imageController.uploadImage); // Carica un'immagine
immageRouter.get('/', authMiddleware, imageController.getUserImages);
//immageRouter.get('/', authenticateToken, imageController.getUserImages);     // Recupera le immagini dell'utente

immageRouter.delete('/:id', authMiddleware, imageController.deleteImage); // Elimina un'immagine
// immageRouter.get('/:imageName', authMiddleware, imageController.getImage);

module.exports = immageRouter;