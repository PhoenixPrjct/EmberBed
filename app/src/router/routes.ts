import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    props: true,
    children: [{ path: '', component: () => import('src/pages/IndexPage.vue') }],
  },
  {
    path: '/admin',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/admin/DashPage.vue') }],
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/new',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/admin/AddCollectionPage.vue') }],
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/user/DashPage.vue') }],
    props: true,
  },
  {
    path: '/c/:id',
    component: () => import('layouts/CollectionLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/collections/CollectionHome.vue') }],
    props: true,
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
