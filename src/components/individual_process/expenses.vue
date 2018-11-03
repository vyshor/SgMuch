<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <progressbar v-bind:currentState="currentState"></progressbar>
    <nextbar v-bind:info="{currentState, path, plan_id, currentStatus}"></nextbar>
    <div id="dashboard_main">
      <div id="entry_area">
        <form id="activity_info" class="center row">
          <div class="row">
            <p class="col l4 info_text">Activity:</p>
            <div class="input-field col l6">
              <input v-model="activity" type="text" name="amount" id="activity_field" class="validate"
                     aria-required="true"/>
            </div>
          </div>
          <div class="row">
            <p class="col l4 info_text">Amount:</p>
            <div class="input-field col l6">
              <input v-model="amount" type="number" name="amount" id="amount_field" class="validate" step="0.01"
                     aria-required="true"/>
              <label for="amount_field">S$</label>
            </div>
          </div>
          <div class="row">
            <p class="col l4 info_text">Frequency:</p>
            <div class="input-field browser-default col l6">
              <select name="frequency" class="browser-default" id="frequency_field" v-model="frequency">
                <option value="daily" selected>Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          <div class="row">
            <input class="btn color_btn" type="Submit" value="Add to list" v-on:click="addEntry" id="add_to_list_btn"/>
          </div>
        </form>
        <div class="container center">
          <button class="btn color_btn" type="Submit" v-on:click="estimateExpense" id="estimate_btn"><i
            class="large material-icons">add_shopping_cart</i>Estimate
            based on income
          </button>
        </div>
      </div>
      <div id="data_area" class="row container">
        <div class="col l7" id="table_container">
          <table class="striped highlight">
            <thead class="purple darken-2 waves-light">
            <tr>
              <th>Activity</th>
              <th>Amount</th>
              <th>Frequency</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="(item, idx) in table_data">
              <td>{{ item.activity }}</td>
              <td>S$ {{ item.amount }}</td>
              <td>{{ item.frequency }} <i class="small material-icons delete_entry right waves-effect"
                                          @click="deleteEntry(idx)">close</i></td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="col l5" id="pie_container">
          <p class="center">Monthly Expenses Breakdown</p>
          <GChart
            type="PieChart"
            :data="getChartData"
            :options="chartOptions"
            class="center"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import firebase from 'firebase';
  import logo_dashboard from "../dashboard/logo_dashboard";
  import navbar_dashboard from "../dashboard/navbar_dashboard";
  import progressbar from "../dashboard/progressbar";
  import nextbar from "../dashboard/nextbar";
  import {GChart} from 'vue-google-charts';
  import formatPieData from '../../mixins/formatPieData';
  import processFireBase from "../../mixins/processFireBase";

  export default {
    components: {
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'progressbar': progressbar,
      'nextbar': nextbar,
      GChart
    },
    mixins: [formatPieData, processFireBase],
    data() {
      return {
        user_id: firebase.auth().currentUser.uid,
        plan_id: this.$route.params.plan_id,
        currentState: "expenses",
        currentStatus: 0,
        path: ['/dashboard/viewplan', '/dashboard/car', '/dashboard/viewplan'],
        activity: '',
        amount: '',
        frequency: 'daily',
        table_data: [{
          activity: "Grocery",
          amount: 50,
          frequency: "weekly"
        }],
        preloaded_estimated_data: [],
        chartOptions: {
          chart: {
            title: 'Monthly Expenses Breakdown',
            backgroundColor: {fill: 'transparent'}
          }
        }
      }

    },
    methods: {
      deleteEntry(idx) {
        this.table_data.splice(idx, 1);
        this.saveToFireBase();
      },
      addEntry(e) {
        e.preventDefault();
        this.table_data.push({
          activity: this.activity,
          amount: this.amount,
          frequency: this.frequency
        });
        this.saveToFireBase();

        this.activity = '';
        this.amount = '';
        this.frequency = 'daily';
      },
      estimateExpense() {
        if (this.preloaded_estimated_data.length) {
          this.table_data = this.table_data.concat(this.preloaded_estimated_data);
          this.saveToFireBase();
        }
      },
      preloadEstimateExpense(monthly_income) {
        let data = JSON.stringify(false);

        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        let self = this;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            const expense = parseInt(this.responseText);
            self.estimateBreakdown(expense);
          }
        });

        xhr.open("GET", 'https://cors-anywhere.herokuapp.com/' + "http://dev.bambu.life:8081/api/TotalExpenseEstimator?monthly_income=" + monthly_income);
        xhr.send(data);
      },
      estimateBreakdown(expense) {
        let data = JSON.stringify(false);

        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        let self = this;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            const payload = JSON.parse(this.responseText);
            self.convertPayloadToData(payload);
          }
        });

        xhr.open("GET", 'https://cors-anywhere.herokuapp.com/' + "http://dev.bambu.life:8081/api/ExpenseEstimator?total_expense=" + expense);
        xhr.send(data);
      },
      convertPayloadToData(payload) {
        for (let expenseCategory of payload) {
          if (!expenseCategory["ExpenseName"].includes("Others")) {
            let data = {
              activity: expenseCategory["ExpenseName"],
              amount: parseInt(expenseCategory["IndividualExpense"]),
              frequency: "monthly"
            };
            this.preloaded_estimated_data.push(data);
          }
        }
        // console.log("preload completed");
      },
      loadSavedExpensesInformation: function() {
        let self = this;
        this.loadPlanFromFireBase(this.user_id, this.plan_id).then(
          function(res) {
            const overall_data = res.data()[self.currentState];
            self.currentStatus = overall_data.status;
            const expenses_data = overall_data[self.currentState + '_data'];
            if (expenses_data !== undefined) {
              self.table_data = expenses_data;
            }

          }
        ).catch( function (err) { // redirects if such plan does not exist
            console.log(err);
            self.$router.push('/dashboard');
          }
        )
      },
      preloadSavedMonthlyIncomeInformation: function() {
        let self = this;
        this.loadPlanFromFireBase(this.user_id, this.plan_id).then(
          function(res) {
            const overall_data = res.data().income.income_data;
            if (overall_data !== undefined) {
              const monthly_income = overall_data.monthlyIncome;
              self.preloadEstimateExpense(monthly_income);
            }

          }
        ).catch( function (err) { // redirects if such plan does not exist
            console.log(err);
            self.$router.push('/dashboard');
          }
        )
      }
    },
    mounted() {
      this.loadSavedExpensesInformation();
      this.preloadSavedMonthlyIncomeInformation();
    },
    computed: {
      saved_data: function () {
        return this.table_data;
      }
    }
  }

</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }

  #activity_info {
    background-color: #BFB2BF;
    height: 100%;
    padding-top: 1%;
    padding-bottom: 1%;
    width: 50%;
  }

  #activity_info div {
    margin-top: 1%;
    margin-bottom: 0;
  }

  #activity_info p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.9rem;
    margin: 0;
  }

  .info_text {
    text-align: right;
    vertical-align: middle;
    line-height: 200%;
  }

  .color_btn {
    font-family: 'Helvetica Rounded';
    text-transform: none;
    font-weight: bold;
    color: #97CAEC;
    background-color: #272A43;
    border: solid 1px #707070;
    margin-top: 1%;
  }

  div .input-field {
    margin-top: 0;
  }

  #activity_field {
    background: whitesmoke;
  }

  #amount_field {
    background: whitesmoke;
  }

  label {
    font-family: 'Helvetica Rounded';
    line-height: 100%;
    font-weight: bold;
    color: #272A43;
    font-size: 1.25rem;
  }

  select {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
  }

  #estimate_btn {
    border-radius: 50px;
    margin-top: 0;
    color: #fff;
    font-size: 1.5rem;
  }

  #estimate_btn i {
    font-size: 2rem;
    vertical-align: middle;
  }

  tbody > tr > td:first-letter {
    text-transform: capitalize;
  }

  .delete_entry {
    color: #BFB2BF;
  }

  #data_area {
    margin-top: 1%;
  }

  thead > tr > th {
    border: 1px #000 solid;
    color: #fff;
  }

  #pie_container p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.25rem;
    margin: 0;
  }

</style>
