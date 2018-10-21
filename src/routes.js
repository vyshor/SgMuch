import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import homepage from './components/homepage.vue'
import login from './components/login.vue'
import signup from './components/signup.vue'
import loggedout from './components/loggedout.vue'
import dashboard from './components/dashboard.vue'

Vue.use(Router);

let router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login'
    },
    {
      path: '/',
      name: 'Homepage',
      component: homepage
    },
    {
      path: '/login',
      name: 'Login',
      component: login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: signup
    },
    {
      path: '/loggedout',
      name: 'LoggedOut',
      component: loggedout
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: dashboard,
      meta: {
        requiresAuth: true
      }
    }
  ],
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // console.log(currentUser.uid);

  if (requiresAuth && !currentUser) next('login');
  else if ((to.name === "Login" || to.name === "SignUp") && currentUser) next('dashboard');
  else if (!requiresAuth && currentUser ) next();
  else next()
});

export default router
