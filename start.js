const app = require('./server');
const port = 8080;
const ip = '0.0.0.0';

app.listen(port, ip, () => {
    console.log(`Serwer działa na http://${ip}:${port}`);
    console.log('Aby uzyskać dostęp:');
    console.log('1. Na tym komputerze: http://localhost:8080');
    console.log('2. Z innych komputerów: http://192.168.68.51:8080');
});
