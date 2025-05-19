const express = require('express');
const path = require('path');
const app = express();
const port = 8080;
const ip = '0.0.0.0';

// Obsługa plików statycznych
app.use(express.static('public'));

// Strona główna
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Uruchomienie serwera
app.listen(port, ip, () => {
    console.log(`Serwer działa na http://${ip}:${port}`);
    console.log('Aby uzyskać dostęp:');
    console.log('1. Na tym komputerze: http://localhost:8080');
    console.log('2. Z innych komputerów: http://192.168.68.51:8080');
});