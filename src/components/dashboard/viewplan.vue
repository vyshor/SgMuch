<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <a class="btn btn-large" id="start_new_plan" v-on:click="startNewPlan">Start new plan</a>
    <flex class="row" id="dashboard_main">
      <flex column id="loading_screen" class="col l9 flexbox_el" v-if="!doneLoading">
        Loading
      </flex>
      <flex column noWrap id="plan_details" class="col l9 flexbox_el" v-else>
        <p class="center" id="plan_name">{{ activePlanDetails.planName }}</p>
        <div class="display_box row center">
          <p class="col l12 process_title">Income</p>
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
        <div class="display_box row center" v-if="activePlanDetails.housing.status === 2">
          <p class="col l12 process_title">Housing</p>
          <p class="col l6 info_text">Location:</p>
          <p class="col l6 display_text">{{ activePlanDetails.housing.housing_data.location }}</p>
          <p class="col l6 info_text">House Type:</p>
          <p class="col l6 display_text">{{ activePlanDetails.housing.housing_data.houseType}}</p>
          <p class="col l6 info_text">House Price:</p>
          <p class="col l6 display_text">S$ {{ activePlanDetails.housing.housing_data.housePrice.toLocaleString() }}</p>
          <div class="bank_details" v-show="activePlanDetails.housing.housing_data.loanBool">
            <p class="col l6 info_text">Interest Rate:</p>
            <p class="col l6 display_text">{{ activePlanDetails.housing.housing_data.interestRate }} %</p>
            <p class="col l6 info_text">Monthly Repayment:</p>
            <p class="col l6 display_text">S$ {{ activePlanDetails.housing.housing_data.monthlyRepay.toLocaleString()
              }}</p>
            <p class="col l6 info_text">Loan Period:</p>
            <p class="col l6 display_text">{{ activePlanDetails.housing.housing_data.loanPeriod }} years</p>
          </div>
          <div class="edit_btn_container">
            <router-link v-bind:to="'/dashboard/housing/' + activePlanId" class="edit_btn right">Edit</router-link>
          </div>
        </div>
        <div class="display_box row center" v-if="activePlanDetails.car.status === 2">
          <p class="col l12 process_title">Car</p>
          <p class="col l6 info_text">Brand:</p>
          <p class="col l6 display_text">{{ activePlanDetails.car.car_data.brand }}</p>
          <p class="col l6 info_text">Model:</p>
          <p class="col l6 display_text">{{ activePlanDetails.car.car_data.model}}</p>
          <p class="col l6 info_text">Price:</p>
          <p class="col l6 display_text">S$ {{ activePlanDetails.car.car_data.price.toLocaleString() }}</p>
          <div class="bank_details" v-show="activePlanDetails.car.car_data.loanBool">
            <p class="col l6 info_text">Interest Rate:</p>
            <p class="col l6 display_text">{{ activePlanDetails.car.car_data.interestRate }} %</p>
            <p class="col l6 info_text">Monthly Repayment:</p>
            <p class="col l6 display_text">S$ {{ activePlanDetails.car.car_data.monthlyRepay.toLocaleString()
              }}</p>
            <p class="col l6 info_text">Tenure:</p>
            <p class="col l6 display_text">{{ activePlanDetails.car.car_data.tenure }} years</p>
          </div>
          <div class="edit_btn_container">
            <router-link v-bind:to="'/dashboard/car/' + activePlanId" class="edit_btn right">Edit</router-link>
          </div>
        </div>
        <div class="display_box row center" v-if="activePlanDetails.expenses.status === 2">
          <p class="col l12 process_title">Expenses</p>
          <div id="pie_container">
            <p class="center">Monthly Expenses Breakdown</p>
            <GChart
              type="PieChart"
              :data="getChartData"
              :options="chartOptions"
              class="center"
            />
          </div>
          <div class="edit_btn_container">
            <router-link v-bind:to="'/dashboard/expenses/' + activePlanId" class="edit_btn right">Edit</router-link>
          </div>
        </div>
      </flex>
      <flex column class="col l3 flex_box_el" id="sidebar_container">
      <sidebar_dashboard v-bind:info="{planInfo, planCount}" :activePlanId.sync="activePlanId" @deletePlan="deletePlan"></sidebar_dashboard>
      </flex>
    </flex>
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
  import {GChart} from 'vue-google-charts';
  import formatPieData from '../../mixins/formatPieData';
  import FlexRow from "vue-flex/lib/components/FlexRow";
  import FlexCol from "vue-flex/lib/components/FlexCol";
  import Flex from "vue-flex/lib/components/Flex";

  export default {
    components: {
      FlexCol,
      FlexRow,
      Flex,
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'sidebar_dashboard': sidebar_dashboard
    },
    mixins: [processFireBase, dashboardPlansMethods, formatPieData],
    data() {
      return {
        user_id: firebase.auth().currentUser.uid,
        planCount: 0,
        planInfo: {},
        activePlanId: this.$route.params.plan_id,
        activePlanDetails: {},
        doneLoading: false,
        chartOptions: {
          chart: {
            title: 'Monthly Expenses Breakdown',
            backgroundColor: {fill: 'transparent'}
          }
        }
      }
    },
    methods: {
      preloadPickedPlanDetails: function () {
        let self = this;
        this.getPlanDetailsFromFireBase(this.activePlanId).then(function (res) {
          for (let [key, value] of Object.entries(res.data())) {
            self.activePlanDetails = Object.assign({}, self.activePlanDetails, {[key]: value});
          }
          self.doneLoading = true;
        })
      }
    },
    mounted() {
      this.preloadUserDetails();
      this.preloadPlanDetails();
      this.preloadPickedPlanDetails();
    },
    watch: {
      '$route'(to, from) {
        this.activePlanId = this.$route.params.plan_id;
        this.doneLoading = false;
        this.preloadPickedPlanDetails();
      }
    },
    computed: {
      table_data: function () {
        return this.activePlanDetails.expenses.expenses_data;
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

    margin-top: 0;
    margin-bottom: 2%;
  }

  .display_box p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;

    margin: 0;
  }

  p.process_title {
    text-align: center;
    font-size: 2rem;
    text-decoration: underline;
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

  .flexbox_el {
    padding: 0;
  }

  #sidebar_container {
    min-height: 787px;
    background-color: #BFB2BF;
    padding: 0;
  }


</style>
