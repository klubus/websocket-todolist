const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const tasks = [];

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', (task) => {
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (taskId) => {
    const index = tasks.findIndex((e) => e.id === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
    socket.broadcast.emit('removeTask', taskId);
  });
});

server.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
