<template>
  <div>
    <h2>Faça uma Nova Reserva</h2>
    <form @submit.prevent="makeReservation">
      <label for="roomSelect">Escolha uma sala:</label>
      <select v-model="selectedRoom" id="roomSelect">
        <option v-for="room in rooms" :key="room.id" :value="room.id">
          Sala {{ room.id }} - {{ room.name }}
        </option>
      </select>
      <label for="dateInput">Escolha a data:</label>
      <input type="date" v-model="selectedDate" id="dateInput">
      <label for="timeInput">Escolha o horário de início:</label>
      <input type="time" v-model="selectedStartTime" id="timeInput">
      <button type="submit">Fazer Reserva</button>
    </form>
  </div>
</template>

<script>
	import moment from 'moment'
export default {
  data() {
    return {
      rooms: [],
      selectedRoom: null,
      selectedDate: null,
      selectedStartTime: null,
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
    makeReservation() {
      if (!this.selectedRoom || !this.selectedDate || !this.selectedStartTime) {
        alert('Por favor, preencha todos os campos.');
        return;
      }

      const startDateTime = `${this.selectedDate} ${this.selectedStartTime}`;
      const endDateTime = moment(startDateTime).add(2, 'hours'); // Reserva de 2 horas

      const reservationData = {
        roomId: this.selectedRoom,
        startDateTime: startDateTime,
        endDateTime: endDateTime.format(),
      };

      // Substitua esta URL pela URL da sua API de criação de reserva
      const apiUrl = 'http://localhost:3000/reserve';
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData),
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message);
					location.reload();
          this.$emit('reservationMade'); // Emitir um evento para notificar a atualização das reservas
          this.selectedRoom = null;
          this.selectedDate = null;
          this.selectedStartTime = null;
        })
        .catch(error => {
          alert('Ocorreu um erro ao fazer a reserva.');
          console.error(error);
        });
    },
  },
};
</script>

