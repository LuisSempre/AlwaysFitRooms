<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username">
      <input type="password" v-model="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://localhost:3000/login', {
          // ...
        });

        if (response.ok) {
        
          this.$router.push({ name: 'Home' }); 
        } else {
          console.error('Invalid credentials');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  }
};
</script>
