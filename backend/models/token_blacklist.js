const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const token_blacklist = sequelize.define('token_blacklist', {
    token_id: {
        type: DataTypes.STRING,
        primaryKey: true, // Chiave primaria
        allowNull: false,
    },
    revoked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Valore di default è la data corrente
        allowNull: true,
    }
}, {
    tableName: 'token_blacklist', // Nome della tabella esatto
});

module.exports = token_blacklist;

// CREATE TABLE if not exists token_blacklist (
//     token_id VARCHAR(255) PRIMARY KEY,
//     revoked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );.