const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const users = require('../models/user');
const token_blacklist = require('../models/token_blacklist');
const { generateToken } = require('../middleware/authMiddleware');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Troviamo l'utente
        const user = await users.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato!' });
        }

        // Confrontiamo la password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password errata!' });
        }

        const { token, jti } = generateToken(user); // Genera token con jti
        res.json({ message: 'Login effettuato!', token, jti });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore interno del server.' });
    }
};

exports.register = async (req, res) => {
    const { username, password, email, role } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'L\'email è obbligatoria!' });
    }

    console.log('Richiesta di registrazione ricevuta:', req.body);

    try {
        // Verifica se l'utente o l'email esistono già
        const existingUser = await users.findOne({ where: { username } });
        const existingEmail = await users.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'Nome utente già registrato!' });
        }
        if (existingEmail) {
            return res.status(400).json({ message: 'Email già registrata!' });
        }

        // Hashiamo la password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Salviamo l'utente
        const newUser = await users.create({
            username,
            password: hashedPassword,
            email,
            role: role || 'standard', // Imposta il ruolo
            created_at: new Date()
        });

        res.status(201).json({ message: 'Utente registrato!', user: newUser });
    } catch (err) {
        console.error('Errore nel server:', err);
        res.status(500).json({ message: 'Errore interno del server.' });
    }
};

exports.logout = (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(400).send({ error: 'Token non trovato' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const jti = decoded.jti;

        token_blacklist.create({ token_id: jti })
            .then(() => {
                res.status(200).send({ message: 'Logout effettuato con successo' });
            })
            .catch((err) => {
                console.error('Errore nell\'inserimento del token nella blacklist:', err);
                res.status(500).send({ error: 'Logout fallito' });
            });

    } catch (error) {
        res.status(401).send({ error: 'Token non valido o scaduto' });
    }
};

// exports.logout = (req, res) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).json({ message: 'Token mancante' });
//     }

//     try {
//         // Decodifica il token e inseriscilo nella blacklist
//         const decoded = jwt.verify(token, process.env.SECRET_KEY);
//         token_blacklist.create({
//             token_id: decoded.jti, // Inserisci l'ID del token nella blacklist
//         }).then(() => {
//             res.status(200).json({ message: 'Logout effettuato con successo' });
//         }).catch((error) => {
//             res.status(500).json({ message: 'Errore nel database durante il logout', error });
//         });
//     } catch (error) {
//         res.status(400).json({ message: 'Token non valido', error });
//     }
// };