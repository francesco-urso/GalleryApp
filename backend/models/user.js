const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const users = sequelize.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    role: {
        type: DataTypes.ENUM('standard', 'premium'),
        defaultValue: 'standard', // Ruolo di default
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    timestamps: false,
});

module.exports = users;

// CREATE TABLE if not exists users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     username VARCHAR(255) UNIQUE NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     role ENUM('standard', 'premium') DEFAULT 'standard',
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//   );