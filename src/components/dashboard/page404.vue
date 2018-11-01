<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <div id="dashboard_main">
      <p>We didn't you expect to be here</p>
      <p>You also probably didn't expect to see us here</p>
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
    background: url('../../assets/meerkat.jpg')
  }

  p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 2rem;
    text-align: center;
  }


</style>
