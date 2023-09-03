const express = require('express');
const cors = require('cors');
const config = require('./config.js');
const routes = require('./routes.js');
const path = require('path');

const app = express();

// Config
app.set('port', config.port);

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'pages'))); // Servir contenido estático

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Resto de las rutas y lógica del servidor
app.use(routes);

module.exports = app;
