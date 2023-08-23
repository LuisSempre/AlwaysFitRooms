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
  },
};
</script>

