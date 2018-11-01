<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <router-link to="/"><div id="dashboard_main" class="">
      <!--<img src="https://images5.alphacoders.com/407/407870.jpg" class="col l6">-->
      <div>
        <p>We didn't you expect to be here</p>
        <p>You also probably didn't expect to see us here too</p>
        <p>I know you are finding something,</p>
        <p>we are finding for it too</p>
        <p>Just keep finding</p>
        <p>Just maybe one day we can find it</p>
        <p>Just maybe...</p>
        <p>Since you are here, why not appreciate this picture of meerkats</p>
        <p>They are finding it for you too.</p>
      </div>
    </div>
    </router-link>
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
    background-image: url("https://images5.alphacoders.com/407/407870.jpg");
    background-size: cover;
    background-position: center;
  }

  p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    color: white;
    font-size: 2rem;
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
    padding-bottom: 2%;
    -webkit-text-stroke: 1px black;
  }


</style>
