<template>
  <div>
    <h1>Disponibilidade de Salas</h1>
    <div v-for="room in rooms" :key="room.id">
      <h2>{{ room.name }}</h2>
      <p v-if="room.reserved.length === 0">Disponível o dia todo.</p>
      <div v-else>
        <p>Horários Reservados:</p>
        <ul>
          <li v-for="reservation in room.reserved" :key="reservation.id">
            De {{ reservation.startDateTime }} até {{ reservation.endDateTime }}
            <button @click="cancelReservation(reservation.id)">Cancelar Reserva</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rooms: [],
    };
  },
  mounted() {
    this.fetchRooms();
  },
  methods: {
    fetchRooms() {
      // Substitua esta URL pela URL da sua API de busca de salas
      const apiUrl = 'http://localhost:3000/rooms';
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          this.rooms = data;
        });
    },
    cancelReservation(reservationId) {
  // Substitua pela URL correta da sua API de cancelamento de reserva
  const apiUrl = `http://localhost:3000/cancel/${reservationId}`;

  fetch(apiUrl, {
    method: 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      // Atualizar a lista de reservas após o cancelamento
      // Pode emitir um evento para notificar o componente pai sobre a ação de cancelamento
    })
    .catch(error => {
      alert('Ocorreu um erro ao cancelar a reserva.');
      console.error(error);
    });
},

  },
};
</script>

