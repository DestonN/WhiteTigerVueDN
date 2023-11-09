import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      props: true,
      component: () => import('../views/Login.vue')
    },
    {
      path: '/dashboard',
      props: true,
      component: () => import('../views/Choice.vue')
    },
    {
      path: '/register',
      props: true,
      component: () => import('../views/Register.vue')
    }
  ]
})

export default router;
