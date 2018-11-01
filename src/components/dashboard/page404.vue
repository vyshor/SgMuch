<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <div id="dashboard_main">
      <img src="../../assets/meerkat.jpg" class="col l6">
      <div class="col l6">
        <p>We didn't you expect to be here</p>
        <p>You also probably didn't expect to see us here too</p>
      </div>
    </div>
  </div>

</template>

<script>
  import logo_dashboard from "./logo_dashboard";
  export default {
    components: {
      'logo_dashboard': logo_dashboard
    }
  }

</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }

  p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 2rem;
    text-align: center;
  }


</style>
