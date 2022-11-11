import { route } from 'quasar/wrappers';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {path: '',name: 'Index', component: () => import('pages/IndexPage.vue') },
      {path: '/member',name: 'MemberIndex', component: () => import('pages/members/MemberIndex.vue') },
      {path: '/blog',name: 'BlogIndex', component: () => import('pages/blogs/BlogIndex.vue') },
      {path: '/message',name: 'MessageIndex', component: () => import('pages/messages/MessageIndex.vue') },
      {path: '/comment',name: 'CommentIndex', component: () => import('pages/comments/CommentIndex.vue') }
    ],
      meta: { auth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('pages/Login.vue'),
    meta: { guess: true },
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
