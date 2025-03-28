# Gallery App

## Informazioni sul Progetto

Questa applicazione "gallery-app" è stata sviluppata come parte del mio corso di sviluppo backend presso la Steve Jobs Academy. È un'applicazione web full-stack che permette agli utenti di gestire e condividere le proprie collezioni di immagini.

## Tecnologie Utilizzate

### Frontend

- HTML5
- CSS3
- JavaScript
- Modern CSS Grid Layout
- Responsive Design

### Backend

- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT per l'autenticazione
- Express-fileupload per la gestione delle immagini

### Database

- MySQL
- Migrazioni e modelli Sequelize

## Funzionalità

- Autenticazione utente (Registrazione/Login/Logout)
- Caricamento e gestione immagini
- Visualizzazione gallery responsive
- Endpoint API sicuri
- Autenticazione basata su token
- Memorizzazione metadati immagini
- Ruoli utente (standard/premium)

## Come Iniziare

### Prerequisiti

- Node.js (v14 o superiore)
- MySQL (v8.0 o superiore)
- npm (Node Package Manager)

### Installazione

1. Clona il repository

   ```bash
   git clone [your-repository-url]
   cd gallery-app
   ```

2. Configurazione Database

   ```bash
   cd sql
   mysql -u root -p < galleryapp.sql
   ```

3. Configurazione Backend

   ```bash
   cd backend
   npm install
   ```

4. Modifica file .env

   ```.env
   PORT=3000
   DB_HOST=localhost
   DB_USER=galleryadmin
   DB_PASSWORD=password123
   DB_NAME=galleryapp
   JWT_SECRET=your_jwt_secret_key
   ```

5. Configurazione Frontend

   ```bash
   cd frontend
   ```

   - Apri index.html nel tuo browser web
   - Per lo sviluppo, puoi usare un server locale come Live Server in VS Code

### Avvio dell'Applicazione

1. Avvia il Server Backend

   ```bash
   cd backend
   npm start
   ```

   - Il server partirà su http://localhost:3000

2. Accedi al Frontend
   - Apri frontend/index.html nel tuo browser web
   - L'applicazione si collegherà automaticamente al backend

## Struttura del Progetto

```bash
gallery-app/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── sql/
    └── galleryapp.sql
```

### Endpoint API

#### Autenticazione

- POST /auth/register - Registra nuovo utente
- POST /auth/login - Accesso utente
- POST /auth/logout - Disconnessione utente

#### Immagini

- GET /api/images - Ottieni immagini dell'utente
- POST /api/images/upload - Carica nuova immagine
- DELETE /api/images/:id - Elimina immagine
