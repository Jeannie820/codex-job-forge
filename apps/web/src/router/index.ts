import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import DeliveryView from '../views/DeliveryView.vue';
import InterviewsView from '../views/InterviewsView.vue';
import AssetsView from '../views/AssetsView.vue';
import AnalyticsView from '../views/AnalyticsView.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView
    },
    {
      path: '/delivery',
      name: 'delivery',
      component: DeliveryView
    },
    {
      path: '/interviews',
      name: 'interviews',
      component: InterviewsView
    },
    {
      path: '/assets',
      name: 'assets',
      component: AssetsView
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: AnalyticsView
    }
  ]
});
