<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <progressbar v-bind:currentState="currentState"></progressbar>
    <nextbar v-bind:info="{currentState, path}"></nextbar>
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
                         id="monthly_income_field" step="0.01"/>
                </div>
                <!--<label for="monthly_income"></label>-->
                <input class="btn" type="Submit" value="Calculate" v-on:click="" id="calculate_btn"></input>
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
          <p class="col l6" id="annual_income"></p>
        </div>
        <div class="row">
          <p class="col l6 info_text">Income Tax:</p>
          <p class="col l6" id="income_tax"></p>
        </div>
        <div class="row">
          <p class="col l6 info_text">Net Income:</p>
          <p class="col l6" id="net_income"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import logo_dashboard from "./logo_dashboard";
  import navbar_dashboard from "./navbar_dashboard";
  import progressbar from "./progressbar";
  import nextbar from "./nextbar";

  let GITRAW = "https://raw.githubusercontent.com/vyshor/university_expense/master/";

  export default {
    components: {
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'progressbar': progressbar,
      'nextbar': nextbar
    },
    data() {
      return {
        currentState: "income",
        uni_checked: false,
        monthly_income: 0,
        uni_selected: 'NUS',
        course_selected: 'Architecture',
        path: ['/dashboard/housing', 'invalid', 'invalid']
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
        }
      },
      getSalary: function (uni_selected) {
        return Promise.resolve($.ajax(GITRAW + "Python/uni/" + uni_selected + "_cost_salary.json", {
          async: true
        }))
      }
    },
    asyncComputed: {
      async estimated_income() {
        let selected_course = this.course_selected;
        const selected_uni = this.uni_selected;
        const data = await this.getSalary(selected_uni);
        const cost_salary = JSON.parse(data);
        if (cost_salary[selected_course] === undefined) {
          switch(selected_uni){
            case 'NUS': selected_course = 'Architecture';
                        this.course_selected = 'Architecture';
              break;
            default: selected_course = 'Accountancy';
              this.course_selected = 'Accountancy';
          }
        }
        return "S$ " + cost_salary[selected_course]["median_salary"];
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
