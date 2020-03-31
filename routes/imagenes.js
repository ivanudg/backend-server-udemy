// imports
var express = require('express');

// inicializar vairbales
var app = express();

const path = require('path');
const fs = require('fs');

// Rutas
app.get('/:tipo/:img', (req, res) => {

    var tipo = req.params.tipo;
    var img = req.params.img;
    var pathImagen = path.resolve(__dirname, `../uploads/${ tipo }/${ img }`);
    var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        res.sendFile(pathNoImage);
    }
});

module.exports = app;