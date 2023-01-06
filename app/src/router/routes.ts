import { RouteRecordRaw } from 'vue-router';
// import { useUserStore } from 'src/stores/userStore';


// const store = useUserStore();

// import AddCollectionPage from './pages/admin/AddCollectionPage.vue';
// const router = useRouter();
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
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin/new',
    component: () => import('layouts/AdminLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/admin/AddCollectionPage.vue') }],
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user',
    component: () => import('layouts/UserLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/user/DashPage.vue') }],
  },
  {
    path: '/c/:id',
    component: () => import('layouts/CollectionLayout.vue'),
    children: [{ path: '', component: () => import('src/pages/collections/CollectionHome.vue') }],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     if (store.getType !== 'Admin') return
//   }
//   next();
// })

export default routes;
