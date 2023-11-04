import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      props: true,
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/dashboard',
      props: true,
      component: () => import('../views/Choice.vue')
    },
    {
      path: '/register',
      props: true,
      component: () => import('../views/register.vue')
    },

    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router;
