<template>
  <div>
    <h2>Faça uma Nova Reserva</h2>
    <form @submit.prevent="makeReservation" style="display: grid;">
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

      const startDateTime = moment(
        `${this.selectedDate} ${this.selectedStartTime}`,
        'YYYY-MM-DD HH:mm'
      );
      const endDateTime = startDateTime.clone().add(2, 'hours'); // Reserva de 2 horas

      const reservationData = {
        roomId: this.selectedRoom,
        startDateTime: startDateTime.format(),
        endDateTime: endDateTime.format(),
      };

      if (!this.checkReservationConflict(reservationData)) {
        return; // Retorna se há conflitos
      }

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
    checkReservationConflict(newReservation) {
      const startMoment = moment(newReservation.startDateTime);
      const endMoment = moment(newReservation.endDateTime);

      for (const room of this.rooms) {
        const reservationOverlap = room.reserved.some(reservation => {
          const resStartMoment = moment(reservation.startDateTime);
          const resEndMoment = moment(reservation.endDateTime);
          return (
            (startMoment.isAfter(resStartMoment) && startMoment.isBefore(resEndMoment)) ||
            (endMoment.isAfter(resStartMoment) && endMoment.isBefore(resEndMoment))
          );
        });

        if (reservationOverlap) {
          alert('Já existe uma reserva nesse horário.');
          return false;
        }
      }

      return true; // Não há conflitos
    },
  },
};
</script>

