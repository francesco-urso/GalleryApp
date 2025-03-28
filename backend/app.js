//per il file .env
require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const cors = require('cors');
app.use(fileUpload());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use('/api/images', cors({
    origin: '*',
    methods: ['GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

const path = require('path');


const authRoutes = require('./routes/authRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/auth', authRoutes);

const { authMiddleware } = require('./middleware/authMiddleware');
const middlewareRoutes = require('./routes/middlewareRoutes');
app.use('/middleware', middlewareRoutes);

// Middleware generale per API protette
app.use('/api', authMiddleware);

// per middleware immg
app.use('/api/images', express.static(path.join(__dirname, 'images')));

// Rotte per le immagini
const imageRoutes = require('./routes/imageRoutes');
app.use('/api/images', imageRoutes);




module.exports = app;