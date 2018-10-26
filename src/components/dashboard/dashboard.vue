<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <div class="row" id="dashboard_main">
      <div id="plan_details" class="col l9">
        <div class="center row">
          <!--<router-link to="/dashboard/income">-->
          <a class="btn btn-large" id="start_new_plan" v-on:click="startNewPlan">Start new plan</a>
          <!--</router-link>-->
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
  import firebase from 'firebase';
  import logo_dashboard from "./logo_dashboard";
  import navbar_dashboard from "./navbar_dashboard";

  export default {
    components: {
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard
    },
    data() {
      return {
        user_id: firebase.auth().currentUser.uid
        // currentState: "housing"
      }
    },
    methods: {
      startNewPlan: function () {
        let db = firebase.firestore();

        db.settings({
          timestampsInSnapshots: true
        });

        const emptyProcesses = { // status 0 = uniniialised, 1 = skipped, 2 = saved
          income: {
            status: 0, income_data: {
              monthlyIncome: 0,
              annualIncome: 0,
              incomeTax: 0,
              netIncome: 0,
              estimatedBool: false,
              university: '',
              course: ''
            }
          },
          housing: {
            status: 0, housing_data: {
              location: '',
              houseType: '',
              housePrice: 0,
              loanBool: false,
              interestRate: 0,
              monthlyRepay: 0,
              loanPeriod: 0
            }
          },
          car: {
            status: 0, car_data: {
              brand: '',
              model: '',
              price: 0,
              loanBool: false,
              interestRate: 0,
              monthlyRepay: 0,
              tenure: 0
            }
          },
          expenses: {status: 0, expenses_data: {}}

        };


        const docRef = db.collection('users').doc('' + this.user_id).collection('saved_plans').doc();
        const plan_id = docRef.id;
        const self = this;

        docRef.set({
          planName: 'untitled',
          process: emptyProcesses
        }).then(function(){
          self.$router.push({path: `/dashboard/income/${plan_id}`})
        })

        // set({[process_name]: process_object});
      }
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
