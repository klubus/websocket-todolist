const express = require('express');
const socket = require('socket.io');

const app = express();
const io = socket(server);

const tasks = [];

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  socket.on('addTask', ({ taskId, taskName }) => {
    tasks.push({ taskId, taskName });
    socket.broadcast.emit('addTask', { taskId, taskName });
  });
  socket.on('removeTask', (taskId) => {
    const index = tasks.findIndex((e) => e.id === taskId);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
    socket.broadcast.emit('removeTask', taskId);
  });
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});
