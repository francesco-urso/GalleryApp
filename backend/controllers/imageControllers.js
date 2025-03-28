const fs = require('fs');
const path = require('path');
const images = require('../models/image');
const users = require('../models/user');

// Carica un'immagine
exports.uploadImage = async (req, res) => {
    try {
        const { title } = req.body;
        const user_id = req.user?.id; // Recupera l'ID dell'utente autenticato
        const user = await users.findByPk(user_id); // Recupera il ruolo dell'utente

        if (!title || typeof title !== 'string') {
            return res.status(400).send({ error: 'Il titolo è obbligatorio.' });
        }

        if (!req.files || !req.files.image) {
            return res.status(400).send({ error: 'È necessario caricare un file immagine.' });
        }

        // Verifica quante immagini ha già caricato l'utente
        const userImages = await images.count({ where: { user_id } });
        const maxImages = user.role === 'premium' ? 10 : 3; // Limite per utenti premium o standard

        if (userImages >= maxImages) {
            return res.status(400).send({ error: `Limite di immagini raggiunto. Puoi caricare al massimo ${maxImages} immagini.` });
        }

        const image = req.files.image;
        const url = `/api/images/${image.name}`; // Percorso dell'immagine salvata

        const uploadsPath = path.join(__dirname, '..', '..', 'frontend', 'assets', 'images', image.name);
        await image.mv(uploadsPath);

        // Imposta esplicitamente `created_at`
        const created_at = new Date();

        const newImage = await images.create({
            user_id, // Associa l'immagine all'utente
            title,
            url,
            created_at,  // Imposta il valore manualmente
        });

        res.status(201).json({ success: true, data: newImage });
    } catch (err) {
        console.error('Errore durante il caricamento dell\'immagine:', err);
        res.status(500).json({ error: 'Errore del server.' });
    }
};

// Recupera tutte le immagini dell'utente
exports.getUserImages = async (req, res) => {
    try {
        const user_id = req.user.id;
        const userImages = await images.findAll({ where: { user_id } });
        res.status(200).send(userImages);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Errore durante il recupero delle immagini.' });
    }
};

// Elimina un'immagine
exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const user_id = req.user.id;

        // Trova l'immagine
        const image = await images.findOne({ where: { id, user_id } });

        if (!image) {
            return res.status(404).send({ error: 'Immagine non trovata o non autorizzato.' });
        }

        // Rimuovi il file dal filesystem
        const filePath = path.join(__dirname, '..', image.url);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Rimuovi il record dal database
        await images.destroy({ where: { id, user_id } });

        res.status(200).send({ message: 'Immagine eliminata con successo.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Errore durante l\'eliminazione dell\'immagine.' });
    }
};

// Recupera un'immagine specifica
exports.getImage = async (req, res) => {
    try {
        const imageName = req.params.imageName;
        const imagePath = path.join(__dirname, '..', '..', 'frontend', 'assets', 'images', imageName);

        // Controlla se l'immagine esiste
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath);
        } else {
            return res.status(404).send({ error: 'Immagine non trovata' });
        }
    } catch (error) {
        console.error('Errore durante il recupero dell\'immagine:', error);
        res.status(500).send({ error: 'Errore del server' });
    }
};