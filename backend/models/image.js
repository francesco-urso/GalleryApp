const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const images = sequelize.define('images', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        DefaultValue: DataTypes.NOW,
        allowNull: false,
    }
}, {
    timestamps: false,
});

module.exports = images;

// CREATE TABLE if not exists images (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     user_id INT NOT NULL,
//     title VARCHAR(255) NOT NULL,
//     url VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(id)
//   );