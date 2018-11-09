<template>
  <div id="overalldiv">
    <router-view id="router-view"></router-view>
    <footer class="page-footer">
    <bottom_bar id="bottom_bar"></bottom_bar>
    </footer>
  </div>
</template>

<script>
  import bottom_bar from './components/bottom_bar.vue';
  import "./fonts.css";

  export default {
    components: {
      'bottom_bar': bottom_bar
    },
    data() {
      return {}
    }
  }
</script>

<style>
  #overalldiv {
    overflow-x: hidden;
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  #router-view {
    flex: 1 0 auto;
  }

  .page-footer {
    padding-top: 0;
  }

</style>
