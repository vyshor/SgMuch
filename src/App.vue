<template>
  <div>
    <router-view></router-view>
    <bottom_bar></bottom_bar>
  </div>
</template>

<script>
  import bottom_bar from './components/bottom_bar.vue';

  export default {
    components: {
      'bottom_bar' : bottom_bar
    },
    data() {
      return {}
    }
  }
</script>

<style>
</style>
