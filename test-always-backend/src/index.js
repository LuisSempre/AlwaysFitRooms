const express = require('express');
const moment = require('moment');
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const rooms = [
  { id: 1, name: 'Sala A', capacity: 10, reserved: [] },
  { id: 2, name: 'Sala B', capacity: 8, reserved: [] },
  // Adicione mais salas aqui
];


app.use(express.json());


app.get('/rooms', (req, res) => {
  res.json(rooms);
});


app.post('/reserve', (req, res) => {
  const { roomId, startDateTime, endDateTime } = req.body;

  const room = rooms.find(room => room.id === roomId);
  if (!room) {
    return res.status(404).json({ error: 'Sala não encontrada.' });
  }

  const reservationOverlap = room.reserved.some(reservation => {
    const startMoment = moment(startDateTime);
    const endMoment = moment(endDateTime);
    const resStartMoment = moment(reservation.startDateTime);
    const resEndMoment = moment(reservation.endDateTime);
    return (
      (startMoment.isAfter(resStartMoment) && startMoment.isBefore(resEndMoment)) ||
      (endMoment.isAfter(resStartMoment) && endMoment.isBefore(resEndMoment))
    );
  });

  if (reservationOverlap) {
    return res.status(400).json({ error: 'Já existe uma reserva nesse horário.' });
  }

  room.reserved.push({ startDateTime, endDateTime });
  res.status(201).json({ message: 'Reserva feita com sucesso!' });
});


app.get('/reservations/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const userReservations = [];
  rooms.forEach(room => {
    room.reserved.forEach(reservation => {
      if (reservation.userId === userId) {
        userReservations.push({
          roomId: room.id,
          roomName: room.name,
          startDateTime: reservation.startDateTime,
          endDateTime: reservation.endDateTime
        });
      }
    });
  });
  res.json(userReservations);
});

app.delete('/cancel/:reservationId', (req, res) => {
  const reservationId = parseInt(req.params.reservationId);

  for (const room of rooms) {
    const index = room.reserved.findIndex(reservation => reservation.id === reservationId);
    if (index !== -1) {
      room.reserved.splice(index, 1);
      return res.json({ message: 'Reserva cancelada com sucesso.' });
    }
  }

  return res.status(404).json({ error: 'Reserva não encontrada.' });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
