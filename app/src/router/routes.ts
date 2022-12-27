import { RouteRecordRaw } from 'vue-router';
// import AddCollectionPage from './pages/admin/AddCollectionPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/IndexPage.vue') }],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/admin/DashPage.vue') }],
  },
  {
    path: '/admin/new',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/admin/AddCollectionPage.vue') }]
  },
  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/user/DashPage.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
