<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <div class="row" id="dashboard_main">
      <div id="plan_details" class="col l9">
        <div class="center row">
          <a class="btn btn-large" id="start_new_plan">Start new plan</a>
        </div>
      </div>
      <div id="savedplans" class="col l3">
        <div id="no_saved_plans" class="center">
          <p>You have not created any plans yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import logo_dashboard from "./logo_dashboard";
  import navbar_dashboard from "./navbar_dashboard";

  export default {
    components: {
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard
    }
  }
</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }
  #savedplans {
    background-color: #BFB2BF;
    height: 100%;
    min-height: 787px;
  }

  #plan_details {
    min-height: 787px;
  }

  #no_saved_plans {
    width: 70%;
  }
  #no_saved_plans p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 3rem;
  }

  #start_new_plan {
    padding: 1%;
    margin-top: 20%;
    width: 25%;
    height: auto;

    font-family: 'Hobo Std';
    font-size: 2.25rem;

    color: #3B46A2;
    background-color: #fff;

    border-style: solid;
    border-width: 8px;
    border-color: #FF39E5;
    border-radius: 25px;
  }
</style>
