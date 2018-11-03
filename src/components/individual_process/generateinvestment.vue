<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <div class="row center" id="dashboard_main">
      <div class="container row infobox">
        <div class="row" id="back_btn_container">
          <router-link v-bind:to="'/dashboard/viewplan/' + user_id"><a class="btn left" type="Submit" value="Back" id="back_btn">Back</a></router-link>
        </div>
        <p class="col l7 info_text">
          Annual Net Income:
        </p>
        <p class="col l5 data_text">S$ {{ net_income.toLocaleString() }}</p>
        <p class="col l7 info_text">
          Annual Estimated Expenses:
        </p>
        <p class="col l5 data_text">S$ {{ annual_expense.toLocaleString() }}</p>
      </div>
      <div class="container row infobox">
        <div class="col l6 row">
          <p class="col l7 info_text">Annual Investment:</p>
          <div class="col l4 data_text_container">
            <p class="data_text">S$ {{ annual_investment.toLocaleString() }}</p>
          </div>
          <div class="row col l12 slider_container">
            <p class="range-field col l10 push-l1">
              <input type="range" class="slider_bar" min="1000" max="100000" step="1000" v-model="annual_investment"
                     v-on:change="getGraphData"/>
            </p>
          </div>
        </div>
        <div class="col l6 row">
          <p class="col l3 info_text">Period:</p>
          <div class="col l3 data_text_container">
            <p class="data_text">{{ investment_period }} years</p>
          </div>
          <div class="row col l12 slider_container">
            <p class="range-field col l10 push-l1">
              <input type="range" class="slider_bar" min="5" max="40" step="1" v-model="investment_period"
                     v-on:change="getGraphData"/>
            </p>
          </div>
        </div>
        <div class="col l12 row">
          <p class="col l11 push-l1 left-align container">Portfolio Risk:</p>
          <div class="row col l12 slider_container" id="risk_container">
            <p class="range-field col l12">
              <input type="range" class="slider_bar" min="1" max="10" step="1" v-model="portfolio_idx"
                     @change="getBreakdownPortfolio() + getGraphData()"/>
            </p>
          </div>
          <div class="rol col l12">
            <div class="risk col">
              <p>Full Fixed Income</p>
            </div>
            <div class="risk col">
              <p>Very Conservative</p>
            </div>
            <div class="risk col">
              <p>Conservative</p>
            </div>
            <div class="risk col">
              <p>Conservative plus</p>
            </div>
            <div class="risk col">
              <p>Balanced</p>
            </div>
            <div class="risk col">
              <p>Growth</p>
            </div>
            <div class="risk col">
              <p>Growth Plus</p>
            </div>
            <div class="risk col">
              <p>Aggressive</p>
            </div>
            <div class="risk col">
              <p>Aggressive Plus</p>
            </div>
            <div class="risk col">
              <p>Equity</p>
            </div>
          </div>
        </div>

      </div>
      <div class="container row">
        <a href="" class="col l8 push-l1" id="show_btn" v-if="!show_portfolio" v-on:click="changeShowPortfolio"><i
          class="medium material-icons">arrow_drop_down_circle</i>Show Portfolio Breakdown</a>
        <a href="" class="col l8 push-l1" id="show_btn" v-else v-on:click="changeShowPortfolio"><i
          class="medium material-icons">cancel</i>Hide Portfolio Breakdown</a>
        <div class="col l8" id="pie_container" v-if="show_portfolio">
          <GChart
            type="PieChart"
            :data="getChartDataForPortfolio"
            :options="pieChartOptions"
            class="center"
          />
        </div>
      </div>
      <div class="row">
        <div class="col l6">
          <p class="center graph_title">Accumulated Amount</p>
          <GChart
            type="LineChart"
            :data="getGraphDataForAccumulated"
            :options="accumulatedChartOptions"
            class="center line_graph"
          />
        </div>
        <div class="col l6">
          <p class="center graph_title">Expected Returns</p>
          <GChart
            type="LineChart"
            :data="getGraphDataForExpectedReturns"
            :options="expectedChartOptions"
            class="center line_graph"
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
  import processFireBase from "../../mixins/processFireBase";
  import {GChart} from 'vue-google-charts';
  import formatPieData from '../../mixins/formatPieData'

  export default {
    components: {
      GChart,
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'progressbar': progressbar,
      'nextbar': nextbar
    },
    mixins: [processFireBase, formatPieData],

    data() {
      return {
        user_id: firebase.auth().currentUser.uid,
        plan_id: this.$route.params.plan_id,
        currentState: "generateinvestment",
        net_income: '',
        annual_expense: '',
        investment_period: 10,
        annual_investment: 10000,
        table_data: [],
        rendered_status: false, // to check if the initial portfolio breakdown is rendered already or not
        show_portfolio: false,
        portfolio_idx: 5,
        portfolio_breakdown: [],
        portfolio_details: {},
        accumulated_amount: [],
        pieChartOptions: {
          chart: {
            title: 'Portfolio Breakdown',
            backgroundColor: {fill: 'transparent'}
          }
        },
        accumulatedChartOptions: {
          chart: {
            title: 'Accumulated Amount',
            backgroundColor: {fill: 'transparent'},
            width: '100%',
            height: '100%'
          },
          hAxis: {
            title: 'Time (Years)'
          },
          vAxis: {
            title: 'Accumulated Amount ($)'
          },
          series: {
            1: {curveType: 'function'}
          },
          legend: 'none'
        },
        expectedChartOptions: {
          chart: {
            title: 'Expected Returns',
            backgroundColor: {fill: 'transparent'},
            width: '100%',
            height: '100%'
          },
          hAxis: {
            title: 'Time (Years)'
          },
          vAxis: {
            title: 'Expected Returns ($)'
          },
          colors: ['#f1ca3a'],
          series: {
            1: {
              curveType: 'function',
            }
          },
          legend: 'none'
        }

      }
    },
    methods: {
      changeShowPortfolio: function (e) {
        e.preventDefault();
        this.show_portfolio = !this.show_portfolio;
      },
      getBreakdownPortfolio: function () {
        if (!this.rendered_status) return; // terminates if it is portfolio details not rendered yet
        let self = this;
        let portfolio_idx = this.portfolio_idx;
        let data = JSON.stringify(false);
        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            const pie_points = JSON.parse(this.responseText);
            self.portfolio_breakdown = [];
            // var data_grp = [["Product Name", "Percentage"]];
            for (let idx = 0; idx < pie_points.length; idx++) {
              self.portfolio_breakdown.push([pie_points[idx]["ProductName"], pie_points[idx]["ProductBreakdown"]]);
            }
          }
        });
        xhr.open("GET", 'https://cors-anywhere.herokuapp.com/' + "http://dev.bambu.life:8081/api/ModelPortfolioProductBreakdown/" + portfolio_idx);
        xhr.send(data);
      },
      prepareAccumulationApiInput: function (portfolio_idx, investment_period, annual_investment) {
        let portfolio = this.portfolio_details[portfolio_idx - 1];
        return JSON.stringify({
          "yearsToGoal": "" + investment_period,
          "compound": "12",
          "confidence": "0.95",
          "discreteExpectedVolatility": "" + portfolio['Volatility'],
          "discreteExpectedReturnPerAnnum": "" + portfolio['ExpectedReturn'],
          "initialInvestment": "0",
          "annualInvestment": "" + annual_investment,
          "currentYear": "2018"
        });
      },
      getPortfolioDetails: function () {
        let self = this;
        let data = JSON.stringify(false);
        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            self.portfolio_details = JSON.parse(this.responseText);
            self.rendered_status = true;
            // Run initialising functions to render at least some information
            self.getGraphData();
            self.getBreakdownPortfolio();
          }
        });

        xhr.open("GET", 'https://cors-anywhere.herokuapp.com/' + "http://dev.bambu.life:8081/api/ModelPortfolioList");
        xhr.send(data);
      },
      getGraphData: function () {
        if (!this.rendered_status) return; // terminates if it is portfolio details not rendered yet
        let self = this;
        let data = this.prepareAccumulationApiInput(this.portfolio_idx, this.investment_period, this.annual_investment);
        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            let graph_data = JSON.parse(this.responseText);
            graph_data = graph_data['response'];
            // self.accumulated_amount = [];
            graph_data = graph_data["graphArray"];
            self.accumulated_amount = graph_data;
            // for (let graph_data_part of graph_data) {
            //   self.accumulated_amount.push(graph_data_part);
            // }
          }
        });

        xhr.open("POST", "https://microservice.dev.bambu.life/api/graph/accumulators", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);

      },
      loadSavedInvestInformation: function() {
        let self = this;
        this.loadPlanFromFireBase(this.user_id, this.plan_id).then(
          function(res) {
            const expense_status = res.data().expenses.status;
            const income_data = res.data().income.income_data;
            if (income_data !== undefined) {
              self.net_income = income_data.netIncome;
            }
            if (!expense_status) { // if the status is 0, means not saved at all
              self.preloadEstimateYearlyExpense(income_data.monthlyIncome);
            } else { // else if there is expense data that is being saved
              let total_expenses = 0;

              // const car_status = res.data().car.status;
              // const housing_status = res.data().housing.status;
              // if (car_status) total_expenses += res.data().car.car_data.monthlyRepay * 12;
              // if (housing_status) total_expenses += res.data().housing.housing_data.monthlyRepay * 12;

              self.table_data = res.data().expenses.expenses_data;
              for (let [key, value] of Object.entries(self.monthlyBreakdown)) {
                total_expenses += value * 12;
              }
              self.annual_expense = total_expenses;
              self.annual_investment = Math.floor((self.net_income - total_expenses)/1000) * 1000;
            }

          }
        ).catch( function (err) { // redirects if such plan does not exist
            console.log(err);
            // self.$router.push('/dashboard');
          }
        )
      },
      preloadEstimateYearlyExpense(monthly_income) {
        let data = JSON.stringify(false);

        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        let self = this;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            const expense = parseInt(this.responseText);
            self.annual_expense = expense*12;
            self.annual_investment = Math.floor((self.net_income - self.annual_expense)/1000) * 1000;
          }
        });

        xhr.open("GET", 'https://cors-anywhere.herokuapp.com/' + "http://dev.bambu.life:8081/api/TotalExpenseEstimator?monthly_income=" + monthly_income);
        xhr.send(data);
      }
    },
    computed: {
      getChartDataForPortfolio: function () {
        const chartData = [["Product Name", "Percentage"]];
        for (let item of Object.values(this.portfolio_breakdown)) {
          chartData.push(item);
        }
        return chartData;
      },
      getGraphDataForAccumulated: function () {
        const chartData = [["Accumulated Amount ($)", "Time (Years)"]];
        for (let [idx, item] of Object.entries(this.accumulated_amount)) {
          chartData.push([parseInt(idx), item]);
        }
        return chartData;
      },
      getGraphDataForExpectedReturns: function () {
        const chartData = [["Expected Returns ($)", "Time (Years)"]];
        let previous_amount = 0;
        for (let [idx, item] of Object.entries(this.accumulated_amount)) {
          idx = parseInt(idx);
          if (idx !== 0) {
            chartData.push([idx - 1, parseInt(item) - previous_amount]);
          }
          previous_amount = parseInt(item);
        }
        return chartData;
      }
    },
    mounted() {
      this.loadSavedInvestInformation();
      this.getPortfolioDetails();

    }
  }

</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }

  .infobox {
    background-color: #BFB2BF;
    height: 100%;
    margin-top: 4%;
    padding-top: 1%;
    padding-bottom: 1%;
    border: #707070 3px solid;
  }

  .infobox div {
    margin-bottom: 0;
  }

  .infobox p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;
    margin: 0;
  }

  .info_text {
    text-align: right;
  }

  .data_text {
    text-align: left;
  }

  .data_text_container {
    background-color: whitesmoke;
    border-radius: 5px;
    color: #FF39E5;
  }

  #monthly_income_container p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;
  }

  #monthly_income_field_container p {
    text-align: right;
    margin-top: 1%;
  }

  #back_btn {
    font-family: 'Helvetica Rounded';
    text-transform: none;
    font-weight: bold;
    color: #97CAEC;
    background-color: #272A43;
    border: solid 1px #707070;
  }

  #back_btn_container {
    margin-top: -2%;
  }

  .slider_container {
    width: 100%;
    text-align: center;
  }

  .slider_bar {
    border: #97CAEC solid 3px;
  }

  input[type=range]::-webkit-slider-thumb {
    background-color: #272A43;
  }

  input[type=range]::-moz-range-thumb {
    background-color: #272A43;
  }

  input[type=range]::-ms-thumb {
    background-color: #272A43;
  }

  .risk {
    width: 10%;
  }

  .risk p {
    font-size: 1rem;
  }

  #risk_container {
    width: 95%;
    margin-left: 2.5%;
  }

  #show_btn {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 2.25rem;
    line-height: 150%;
    text-align: left;
  }

  #show_btn > i {
    vertical-align: middle;
  }

  .line_graph {
    height: 100%;
    min-height: 500px;
  }

  .graph_title {
    margin: 0;
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;
  }

</style>
