const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db'); // Connessione al database
const token_blacklist = require('../models/token_blacklist'); // Modello per la blacklist
require('dotenv').config();

// Middleware per autenticare il token
// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     console.log('Header ricevuto:', req.headers);
//     const token = authHeader && authHeader.split(' ')[1]; // Estrae il token dall'header
//     console.log('Token ricevuto nel middleware:', token);

//     if (!token) {
//         return res.status(401).json({ message: 'Accesso negato. Token mancante!' });
//     }

//     try {
//         // Verifica il token
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         console.log('Decoded JTI:', decoded); // Log utile per debug

//         // Controlla se il token è stato revocato (blacklist)
//         token_blacklist.findOne({
//             where: {
//                 token_id: decoded.jti,
//             }
//         }).then((blacklistedToken) => {
//             if (blacklistedToken) {
//                 console.log('Token trovato nella blacklist:', decoded.jti);
//                 return res.status(401).json({ error: 'Token invalidato.' });
//             }

//             // Se il token è valido e non revocato, aggiungi i dati decodificati alla richiesta
//             req.user = decoded;
//             next();
//         }).catch((err) => {
//             console.error('Errore nel database:', err);
//             return res.status(500).json({ error: 'Errore nel database.' });
//         });
//     } catch (error) {
//         console.error('Errore durante la verifica del token:', error);
//         res.status(403).json({ message: 'Token non valido!' });
//     }
// };

const authenticateToken = (req, res, next) => {
    console.log('Middle attivato')
    const authHeader = req.headers['authorization'];
    console.log('Header ricevuto:', req.headers); // Log completo degli header della richiesta
    const token = authHeader && authHeader.split(' ')[1]; // Estrae il token dall'header

    console.log('Token ricevuto nel middleware:', token); // Log per visualizzare solo il token

    if (!token) {
        return res.status(401).json({ message: 'Accesso negato. Token mancante!' });
    }

    try {
        // Verifica il token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Decoded JTI:', decoded); // Log del payload decodificato

        // Controlla se il token è stato revocato (blacklist)
        token_blacklist.findOne({
            where: { token_id: decoded.jti }
        }).then((blacklistedToken) => {
            console.log('Query blacklist:', blacklistedToken);
            if (blacklistedToken) {
                console.log('Token trovato nella blacklist:', decoded.jti);
                return res.status(401).json({ error: 'Token invalidato.' });
            }

            // Se il token è valido e non revocato, aggiungi i dati decodificati alla richiesta
            req.user = decoded;
            next();
        }).catch((err) => {
            console.error('Errore nel database:', err);
            return res.status(500).json({ error: 'Errore nel database.' });
        });
    } catch (error) {
        console.error('Errore durante la verifica del token:', error);
        res.status(403).json({ message: 'Token non valido!' });
    }
};


// Funzione per generare un nuovo token JWT
const generateToken = (user) => {
    const jti = uuidv4(); // Genera un identificativo unico per il token
    const token = jwt.sign(
        {
            id: user.id, // Assumi che `user.id` sia il campo dell'utente
            username: user.username,
            role: user.role,
            jti,
        },
        process.env.SECRET_KEY,
        { expiresIn: '1h' }
    );
    return { token, jti };
};

// Middleware di autenticazione aggiuntivo
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Accesso negato, token mancante!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log('Decoded JTI:', decoded.jti); // Log utile per debug

        token_blacklist.findOne({ where: { token_id: decoded.jti } })
            .then((blacklistedToken) => {
                if (blacklistedToken) {
                    console.log('Token trovato nella blacklist:', decoded.jti);
                    return res.status(401).send({ error: 'Token invalidato con successo' });
                }

                req.user = decoded; // Continua con la richiesta
                next();
            })
            .catch((err) => {
                console.error('Errore nel database:', err);
                return res.status(500).send({ error: 'Errore nel database' });
            });

    } catch (error) {
        console.error('Errore durante la verifica del token:', error);
        res.status(401).send({ error: 'Token non valido o scaduto' });
    }
};

module.exports = { authenticateToken, generateToken, authMiddleware };
