import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import homepage from './components/pre_login/homepage.vue'
import login from './components/pre_login/login.vue'
import signup from './components/pre_login/signup.vue'
import loggedout from './components/pre_login/loggedout.vue'
import dashboard from './components/dashboard/dashboard.vue'
import income from './components/individual_process/income.vue'
import housing from './components/individual_process/housing.vue'
import car from './components/individual_process/car.vue'
import expenses from './components/individual_process/expenses.vue'
import profile from './components/profile/profile.vue'
import viewplan from './components/dashboard/viewplan.vue'
import generateinvestment from './components/individual_process/generateinvestment.vue'
import page404 from './components/dashboard/page404.vue'

Vue.use(Router);

let router = new Router({
  routes: [
    // {
    //   path: '*',
    //   redirect: '/login'
    // },
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
    },
    {
      path: '/dashboard/income/:plan_id',
      name: 'Income',
      component: income,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard/housing/:plan_id',
      name: 'Housing',
      component: housing,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard/car/:plan_id',
      name: 'Car',
      component: car,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard/expenses/:plan_id',
      name: 'Expenses',
      component: expenses,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard/viewplan/:plan_id',
      name: 'ViewPlan',
      component: viewplan,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard/generateinvestment/:plan_id',
      name: 'GenerateInvestment',
      component: generateinvestment,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/secret',
      name: 'Page404',
      component: page404
    }
  ],
mode: 'history'
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  // console.log(currentUser.uid);

  if (requiresAuth && !currentUser) next('/');
  else if ((to.name === "Homepage" || to.name === "Login" || to.name === "SignUp") && currentUser) next('dashboard');
  else if (!requiresAuth && currentUser ) next();
  else next()
});

export default router
