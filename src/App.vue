<template>
  <div>
    <!--<homepage></homepage>-->
    <!--<logo_dashboard></logo_dashboard>-->
    <!--<navbar_dashboard></navbar_dashboard>-->
    <router-view></router-view>
    <bottom_bar></bottom_bar>
  </div>
</template>

<script>
  import logo_dashboard from './components/logo_dashboard.vue';
  import navbar_dashboard from './components/navbar_dashboard.vue';
  import bottom_bar from './components/bottom_bar.vue';
  import homepage from './components/homepage.vue';
  import header from './components/header.vue';

  export default {
    components: {
      'logo_dashboard' : logo_dashboard,
      'navbar_dashboard' : navbar_dashboard,
      'bottom_bar' : bottom_bar,
      'homepage' : homepage,
      'app-header': header
    },
    data() {
      return {}
    }
  }
</script>

<style>
</style>
