import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '../views/Dashboard/AdminView.vue'
import TpkView from '../views/Tpk/TpkView.vue'
import CreateView from '@/views/Tpk/CreateView.vue'
import EditView from '@/views/Tpk/EditView.vue'
import QuizView from '@/views/Ujian/QuizView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'admin',
      component: AdminView,
    },
    {
      path: '/tpk',
      name: 'tpk',
      component: TpkView,
    },
    {
      path: '/tpk/tambah',
      name: 'tambah tpk',
      component: CreateView,
    },
    {
      path: `/tpk/edit/:id`,
      name: 'edit tpk',
      component: EditView,
    },
    {
      path: '/student/cbt/tpk',
      name: 'Test',
      component: QuizView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
