const express = require("express");
const router = express.Router();
const fs = require('fs');


router.post('/data', (req, res) => {
    const funciones = req.body;

    if (!funciones || funciones.length === 0) {
        return res.status(400).send('No se recibieron datos');
    }

    fs.writeFile('data.json', JSON.stringify(funciones, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error saving data');
        }
        res.status(200).send('Datos recibidos con éxito');
    });
});

router.get('/getData', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, datos) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }
        res.status(200).json({ datos: JSON.parse(datos), status: 1, message: "Datos encontrados" });
    });
});

module.exports = router;