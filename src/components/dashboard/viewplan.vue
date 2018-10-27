<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <a class="btn btn-large" id="start_new_plan" v-on:click="startNewPlan">Start new plan</a>
    <div class="row" id="dashboard_main">
      <div id="plan_details" class="col l9" v-show="!activePlanDetails.length">
        <p class="center" id="plan_name">{{ activePlanDetails.planName }}</p>
        <div class="display_box row center">
          <p class="col l6 info_text">Annual Income:</p>
          <p class="col l6 display_text">S$ {{ activePlanDetails.income.income_data.annualIncome }}</p>
          <p class="col l6 info_text">Income Tax:</p>
          <p class="col l6 display_text">S$ {{ activePlanDetails.income.income_data.incomeTax }}</p>
          <p class="col l6 info_text">Net Income:</p>
          <p class="col l6 display_text">S$ {{ activePlanDetails.income.income_data.netIncome }}</p>
          <div class="edit_btn_container">
            <router-link v-bind:to="'/dashboard/income/' + activePlanId" class="edit_btn right">Edit</router-link>
          </div>
        </div>
      </div>
      <sidebar_dashboard v-bind:info="{planInfo, planCount}" :activePlanId.sync="activePlanId" @deletePlan="deletePlan"
                         class="col l3"></sidebar_dashboard>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase'; // needed for dashboardPlansMethods mixins
  import Vue from 'vue'; // needed for dashboardPlansMethods mixins
  import logo_dashboard from "./logo_dashboard";
  import navbar_dashboard from "./navbar_dashboard";
  import sidebar_dashboard from "./sidebar_dashboard";
  import processFireBase from "../../mixins/processFireBase";
  import dashboardPlansMethods from "../../mixins/dashboardPlansMethods";

  export default {
    components: {
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
        activePlanId: this.$route.params.plan_id,
        activePlanDetails: {}
      }
    },
    methods: {
      preloadPickedPlanDetails: function () {
        let self = this;
        this.getPlanDetailsFromFireBase(this.activePlanId).then(function (res) {
          for (let [key, value] of Object.entries(res.data())) {
              self.activePlanDetails = Object.assign({}, self.activePlanDetails, {[key]: value});
          }
        })
      }
    },
    mounted() {
      this.preloadUserDetails();
      this.preloadPlanDetails();
      this.preloadPickedPlanDetails();
    },
    watch: {
      '$route' (to, from) {
        this.activePlanId = this.$route.params.plan_id;
        this.preloadPickedPlanDetails();
      }
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
    position: fixed;
    padding: 1%;
    margin-top: 20%;
    margin-right: 2%;
    width: 20%;
    height: auto;
    right: 0;
    bottom: 5%;

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

  #plan_name {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 2.5rem;
  }

  .display_box {
    width: 50%;
    margin: auto;
    border: #272A43 4px solid;
  }

  .display_box p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;

    margin: 0;
  }

  .info_text {
    text-align: right;
  }

  .display_text {
    text-align: left;
  }

  .edit_btn {
    font-family: 'Helvetica Rounded';
    font-size: 1.25rem;
    text-transform: none;
    font-weight: bold;
    color: #97CAEC;
    background-color: #272A43;
    border-radius: 3px;

    padding-right: 8%;
    padding-left: 8%;

  }
</style>
