import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path:'/fundamental',
      name: '基本',
      component: () => import('../views/CommonView.vue'),
      children: [
        {
          path:'JiChu',
          name: '基础',
          component: () => import('../views/fundamental/JiChu.vue'),
        },
        {
          path:'ZhiHuTutorial',
          name: '知乎入门',
          component: () => import('../views/fundamental/ZhiHuTutorial.vue'),
        }
      ]
    },
    {
      path:'/basic',
      name: '基础',
      component: () => import('../views/CommonView.vue'),
      children: [
        {
          path:'scene',
          name: '场景图',
          component: () => import('../views/basic/scene.vue'),
        },
        
      ]
    }
  ],
})

export default router
