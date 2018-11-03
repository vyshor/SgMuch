<template>
  <div id="nextbar" class="row">
    <router-link v-bind:to="leftPath" v-bind:class="{ disabled : !(leftPath) }">
      <i class="material-icons col l1 large" id="left_arrow_disabled" v-if="incomeActive">arrow_back</i>
      <i class="material-icons col l1 large" id="left_arrow" v-else>arrow_back</i></router-link>
    <router-link v-bind:to="skipPath" v-bind:class="{ disabled : !(skipPath) }">
      <a class="col l2 push-l7 btn btn-large" v-if="!(incomeActive)">Skip</a>
    </router-link>
    <router-link v-bind:to="rightPath" v-bind:class="{ disabled : !(rightPath)}">
      <i class="material-icons col l1 push-l10 large" id="right_arrow" v-if="incomeActive">arrow_forward</i>
      <i class="material-icons col l1 push-l8 large" id="right_arrow" v-else>arrow_forward</i>
    </router-link>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import processFireBase from "../../mixins/processFireBase";
  import dashboardPlansMethods from "../../mixins/dashboardPlansMethods";

  export default {
    mixins: [processFireBase, dashboardPlansMethods],
    data() {
      return {
        user_id: firebase.auth().currentUser.uid,
        planCount: 0,
        currentPlan: "",
        currentProgress: ""
      }
    },
    props: {
      info: {
        currentState: 'currentState',
        path: 'path',
        plan_id: 'plan_id',
        currentStatus: 'currentStatus'
      }
    },
    computed: {
      incomeActive: function () {
        return this.info.currentState === "income"
      },
      housingActive: function () {
        return this.info.currentState === "housing"
      },
      carActive: function () {
        return this.info.currentState === "car"
      },
      expensesActive: function () {
        return this.info.currentState === "expenses"
      },
      leftPath: function () {
        if (this.info.path[1] !== "invalid") return this.info.path[1] + '/' + this.info.plan_id; else return '';
      },
      rightPath: function () {
        if (this.info.path[0] !== "invalid" && (this.info.currentStatus)) return this.info.path[0] + '/' + this.info.plan_id; else return '';
      },
      skipPath: function () {
        if (this.info.path[2] !== "invalid") return this.info.path[2] + '/' + this.info.plan_id; else return '';
      },
      plan_id: function () {
        return this.info.plan_id;
      },
      currentState: function () {
        return this.info.currentState;
      }
    },
    mounted() {
      this.preloadUserDetails();
    },
    updated() {
      // console.log("update");
      // console.log(this.currentPlan);
      // console.log(this.currentProgress);
      this.updateCurrentProgressInProcess();
    }
  }
</script>

<style scoped>
  #left_arrow_disabled {
    color: #BFB2BF;
    margin-left: 1%;
  }

  #left_arrow {
    color: #000;
    margin-left: 1%;
  }

  #right_arrow {
    color: #000;
    margin-right: 1%;
  }

  .btn {
    font-family: 'Helvetica Rounded';
    font-size: 2rem;
    border-radius: 30px;
    color: #272A43;
    background-color: #FF39E5;
    margin-top: 1%;
  }

  .disabled > #right_arrow {
    color: #BFB2BF;
  }
</style>

