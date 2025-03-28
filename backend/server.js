const app = require('./app')
// controllo
app.listen(process.env.PORT, () => {
    console.log(`Server in ascolto sulla porta ${process.env.PORT}`);
});

const sequelize = require('./db')
//sincronizzazione con il db
sequelize.sync({ alter: true }) // Creerà le tabelle se non esistono
    .then(() => console.log('Database sincronizzato!'))
    .catch(err => console.error('Errore nella sincronizzazione:', err)
    );
//autenticato al db
sequelize.authenticate()
    .then(() => console.log('Connesso al database!'))
    .catch(err => console.error('Errore di connessione al database:', err)
    );