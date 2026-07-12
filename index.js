const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');

app.use(cors());

// Configuración estricta de CORS para evitar bloqueos con Ionic/Angular
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexiones desde tu app Ionic en localhost
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('Un usuario se ha conectado al salón: ' + socket.id);

  // Escuchamos cuando un cliente envía un mensaje nuevo
  socket.on('nuevo_mensaje', (data) => {
    console.log('Mensaje recibido:', data);
    // Emitimos el mensaje a TODOS los clientes conectados (incluyendo al que lo envió)
    io.emit('recibir_mensaje', data);
  });

  socket.on('disconnect', () => {
    console.log('Un usuario se ha desconectado');
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor de Chat Étnica corriendo en el puerto ${PORT}`);
});