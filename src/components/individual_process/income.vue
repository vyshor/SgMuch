<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <progressbar v-bind:currentState="currentState"></progressbar>
    <nextbar v-bind:info="{currentState, path, plan_id, currentStatus}"></nextbar>
    <div class="row" id="dashboard_main">
      <div id="monthly_income_container" class="col l5 push-l1">
        <div v-if="!(uni_checked)">
          <p class="center">Enter your monthly income*<br>
            (estimated)</p>
          <div class="center">
            <form action="" class="row" id="monthly_income_field_container">
              <p class="col l1 push-l1">S$</p>
              <div class="col l8 push-l1">
                <div class="input-field">
                  <input v-model="monthly_income" type="number" name="monthly_income" class="validate"
                         id="monthly_income_field" step="0.01" min="0" oninput="validity.valid||(value='');"/>
                </div>
                <!--<label for="monthly_income"></label>-->
                <input class="btn" type="Submit" value="Calculate" v-on:click="calculateIncome" id="calculate_btn"></input>
              </div>
            </form>
          </div>
        </div>
        <p class="center" v-on:change="loadCourses">
          <label>
            <input type="checkbox" v-model="uni_checked"/>
            <span>Estimate based on university and course</span>
          </label>
        </p>
        <div v-if="uni_checked">
          <p>University</p>
          <div class="input-field browser-default" id="uni">
            <select name="Uni" ref="select_uni" v-model="uni_selected" v-on:change="loadCourses"
                    class="browser-default">
              <option value="NUS">NUS</option>
              <option value="NTU">NTU</option>
              <option value="SMU">SMU</option>
            </select>
          </div>
          <p>Course</p>
          <div class="input-field">
            <select name="Course" id="course" ref="select_course" class="browser-default"
                    v-model="course_selected"></select>
          </div>
          <div class="row" id="estimate_income_container">
            <p class="col 6l">Estimated Monthly Income:</p>
            <p class="col 6l" id="estimated_income">{{ estimated_income }}</p>
          </div>
        </div>

      </div>
      <div id="income_info" class="col l4 push-l2">
        <div class="row">
          <p class="col l6 info_text">Annual Income:</p>
          <p class="col l6" id="annual_income">S$ {{ annual_income.toLocaleString() }}</p>
        </div>
        <div class="row">
          <p class="col l6 info_text">Income Tax:</p>
          <p class="col l6" id="income_tax">S$ {{ income_tax.toLocaleString() }}</p>
        </div>
        <div class="row">
          <p class="col l6 info_text">Net Income:</p>
          <p class="col l6" id="net_income">S$ {{ net_income.toLocaleString() }}</p>
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
  import dashboardPlansMethods from "../../mixins/dashboardPlansMethods";

  let GITRAW = "https://raw.githubusercontent.com/vyshor/university_expense/master/";

  export default {
    components: {
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'progressbar': progressbar,
      'nextbar': nextbar
    },
    mixins: [processFireBase, dashboardPlansMethods],

    data() {
      return {
        user_id: firebase.auth().currentUser.uid,
        plan_id: this.$route.params.plan_id,
        currentState: "income",
        currentStatus: 0,
        planCount: 0,
        uni_checked: false,
        monthly_income: 0,
        uni_selected: 'NUS',
        course_selected: 'Architecture',
        path: ['/dashboard/housing', 'invalid', 'invalid'],
        annual_income: '',
        income_tax: '',
        net_income: ''
      }
    },
    methods: {
      loadCourses: function () {
        if (this.uni_checked) {
          $.ajax(GITRAW + "Python/uni/" + this.uni_selected + "_courses.json", {
            async: true, success: function (fees) {
              $('#course')
                .find('option')
                .remove()
                .end();
              fees = JSON.parse(fees);
              $.each(fees, function (i, item) {
                $('#course').append($('<option>', {
                  value: item,
                  text: item
                }));
              });
            }
          });
        } else {
          this.calculateIncome(); // auto calculates and save their income once they untick checkbox
        }
      },
      getSalary: function (uni_selected) {
        return Promise.resolve($.ajax(GITRAW + "Python/uni/" + uni_selected + "_cost_salary.json", {
          async: true
        }))
      },
      calculateIncome: function(e = null) {
        if (e !== null) e.preventDefault();
        let income_data = this.calculateTaxAndIncome(this.monthly_income);
        this.annual_income = income_data.annual_income;
        this.income_tax = income_data.income_tax;
        this.net_income = income_data.net_income;
        // function that takes the monthly income and returns annual income, income tax, and net income
        this.saveToFireBase();
      },
      calculateTaxAndIncome: function(monthly_income) {
        let data = {};
        let annual_income = monthly_income * 12.00;
        let income_tax = 0;
        // income tax
        if (annual_income <= 20000) {
          income_tax = 0;
        } else if (20000 < annual_income && annual_income <= 30000) {
          income_tax = (annual_income - 20000) * (0.02);
        } else if (30000 < annual_income && annual_income <= 40000) {
          income_tax = 200 + (annual_income - 30000) * (0.035);
        } else if (40000 < annual_income && annual_income <= 80000) {
          income_tax = 550 + (annual_income - 40000) * (0.07);
        } else if (80000 < annual_income && annual_income <= 120000) {
          income_tax = 3350 + (annual_income - 80000) * (0.115);
        } else if (120000 < annual_income && annual_income <= 160000) {
          income_tax = 7950 + (annual_income - 120000) * (0.15);
        } else if (160000 < annual_income && annual_income <= 200000) {
          income_tax = 1395. + (annual_income - 160000) * (0.18);
        } else if (200000 < annual_income && annual_income <= 240000) {
          income_tax = 21150 + (annual_income - 200000) * (0.19);
        } else if (240000 < annual_income && annual_income <= 280000) {
          income_tax = 28750 + (annual_income - 240000) * (0.195);
        } else if (280000 < annual_income && annual_income <= 320000) {
          income_tax = 36550 + (annual_income - 280000) * (0.2);
        } else if (annual_income > 320000) {
          income_tax = 44550 + (annual_income - 320000) * (0.22);
        } else {
          income_tax = 'invalid number';
        }
        const net_income = annual_income - income_tax;

        data.annual_income = Math.floor(annual_income);
        data.income_tax = Math.floor(income_tax);
        data.net_income = Math.floor(net_income);
        return data;
      },
      loadSavedIncomeInformation: function() {
        let self = this;
        this.loadPlanFromFireBase(this.user_id, this.plan_id).then(
          function(res) {
            const overall_data = res.data()[self.currentState];
            self.currentStatus = overall_data.status;
            const income_data = overall_data[self.currentState + '_data'];
            if (income_data !== undefined) {
              self.monthly_income = income_data.monthlyIncome;
              self.annual_income = income_data.annualIncome;
              self.income_tax = income_data.incomeTax;
              self.net_income = income_data.netIncome;
              self.uni_checked = income_data.estimatedBool;
              self.uni_selected = income_data.university;
              self.course_selected = income_data.course;
            }

            if (self.uni_checked === true) {
              self.loadCourses();
            }

          }
        ).catch( function (err) { // redirects if such plan does not exist
          console.log(err);
          self.$router.push('/dashboard');
          }
        )
      }
    },
    asyncComputed: {
      async estimated_income() {
        if (!this.uni_checked) return "";
        let selected_course = this.course_selected;
        const selected_uni = this.uni_selected;
        const data = await this.getSalary(selected_uni);
        const cost_salary = JSON.parse(data);
        if (cost_salary[selected_course] === undefined) {
          switch (selected_uni) {
            case 'NUS':
              selected_course = 'Architecture';
              this.course_selected = 'Architecture';
              break;
            default:
              selected_course = 'Accountancy';
              this.course_selected = 'Accountancy';
          }
        }
        const estimated_salary = cost_salary[selected_course]["median_salary"];
        this.monthly_income = estimated_salary;
        this.calculateIncome();
        return "S$ " + parseInt(estimated_salary).toLocaleString();
      }
    },
    computed: {
      saved_data: function () {
        return {
          monthlyIncome: parseInt(this.monthly_income),
          annualIncome: this.annual_income,
          incomeTax: this.income_tax,
          netIncome: this.net_income,
          estimatedBool: this.uni_checked,
          university: this.uni_selected,
          course: this.course_selected
        }
      }

    },
    mounted() {
      this.preloadUserDetails();
      this.loadSavedIncomeInformation();
    },
    beforeDestroy() {
      // To include cases where user just create a plan, but does not save any income yet, and just quit,
      // so then you delete the plan, cus the plan must have income for it to exist
      if (this.currentStatus === 0) {
        this.deletePlan(this.plan_id);
      }
    }
  }

</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }

  #income_info {
    background-color: #BFB2BF;
    height: 100%;
    padding-top: 1%;
    padding-bottom: 1%;
  }

  #income_info div {
    margin-bottom: 0;
  }

  #income_info p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;
    margin: 0;
  }

  .info_text {
    text-align: right;
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

  #calculate_btn {
    font-family: 'Helvetica Rounded';
    text-transform: none;
    font-weight: bold;
    color: #97CAEC;
    background-color: #272A43;
    border: solid 1px #707070;
  }

  #estimate_income_container p {
    text-align: right;
    color: #BFB2BF;
    font-size: 1.5rem;
  }

  #estimated_income {
    text-align: left;
  }
</style>
