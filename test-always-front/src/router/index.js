import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    }
  ]
})

router.beforeEach((to, from, next) => {
  // Verifique se a rota requer autenticação
  if (to.matched.some(record => record.meta.requiresAuth)) {
  
    const isAuthenticated = true; 
   
    if (isAuthenticated) {
      next(); 
    } else {
      next({ name: 'Login' }); 
    }
  } else {
    next(); 
  }
});

export default router
