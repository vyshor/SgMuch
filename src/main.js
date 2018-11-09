import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import router from './routes'
import firebase from 'firebase'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.css'
import AsyncComputed from 'vue-async-computed'
import 'babel-polyfill'
import * as VueGoogleMaps from "vue2-google-maps"
import VueGoogleCharts from 'vue-google-charts'
import VueFlex from "vue-flex";
import "vue-flex/dist/vue-flex.css";
import "./style.css";

Vue.use(VueResource);
Vue.use(AsyncComputed);
Vue.use(VueGoogleCharts);
Vue.use(VueFlex);
Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyANzkX8usvRMGp7TJSLFVaFtq-rCXSXfQ0",
    libraries: "places" // necessary for places input
  }
});

//Custom directives
//Global directives
Vue.directive('rainbow', {
  bind(el, binding, vnode) {
    el.style.color = '#' + Math.random().toString().slice(2, 8);
  }
});

Vue.directive('theme', {
  bind(el, binding, vnode) {
    if (binding.value === 'wide') {
      el.style.maxWidth = "1200px";
    } else if (binding.value === 'narrow') {
      el.style.maxWidth = "560px";
    }
    if (binding.arg === 'column') {
      el.style.background = '#ddd';
      el.style.padding = '20px';
    }
  }
});


// Filters
// Vue.filter('to-uppercase', (value) =>{
//   return value.toUpperCase();
// });

Vue.filter('snippet', (value) => {
  return value.slice(0, 100) + "...";
});

let app;
var config = {
  apiKey: "AIzaSyDuxspVlezFgqxi9ejPzjhQTfp8c8xi5Rk",
  authDomain: "sgmuch2018.firebaseapp.com",
  databaseURL: "https://sgmuch2018.firebaseio.com",
  projectId: "sgmuch2018",
  storageBucket: "sgmuch2018.appspot.com",
  messagingSenderId: "495669894026"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      el: '#app',
      render: h => h(App),
      router
    });

    global.vm = app; //Define you app variable globally
  }
});

