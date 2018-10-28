<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <flex class="row" id="dashboard_main">
      <div id="plan_details" class="col l9">
        <div class="center row">
          <a class="btn btn-large" id="start_new_plan" v-on:click="startNewPlan">Start new plan</a>
        </div>
      </div>
      <flex column class="col l3 flex_box_el" id="sidebar_container">
      <sidebar_dashboard v-bind:info="{planInfo, planCount, activePlanId}" @deletePlan="deletePlan"></sidebar_dashboard>
      </flex>
    </flex>
  </div>
</template>

<script>
  import firebase from 'firebase'; // needed for dashboardPlansMethods mixins
  import Vue from 'vue'; // needed for dashboardPlansMethods mixins
  import logo_dashboard from "./logo_dashboard";
  import navbar_dashboard from "./navbar_dashboard";
  import sidebar_dashboard from"./sidebar_dashboard";
  import processFireBase from "../../mixins/processFireBase";
  import dashboardPlansMethods from "../../mixins/dashboardPlansMethods";
  import FlexRow from "vue-flex/lib/components/FlexRow";
  import FlexCol from "vue-flex/lib/components/FlexCol";
  import Flex from "vue-flex/lib/components/Flex";

  export default {
    components: {
      Flex,
      FlexRow,
      FlexCol,
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'sidebar_dashboard': sidebar_dashboard
    },
    mixins: [processFireBase, dashboardPlansMethods],
    data() {
      return {
        user_id: firebase.auth().currentUser.uid,
        planCount: 0,
        planInfo: {},
        activePlanId: ''
      }
    },
    methods: {
    },
    mounted() {
      this.preloadUserDetails();
      this.preloadPlanDetails();
    }
  }
</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }

  #plan_details {
    min-height: 787px;
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
    text-transform: capitalize;

    color: #3B46A2;
    background-color: #fff;

    border-style: solid;
    border-width: 8px;
    border-color: #FF39E5;
    border-radius: 25px;
  }

  #sidebar_container {
    min-height: 787px;
    background-color: #BFB2BF;
    padding: 0;
  }


</style>
