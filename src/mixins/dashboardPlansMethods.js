import firebase from 'firebase'; // needed for dashboardPlansMethods mixins
import Vue from 'vue'; // needed for dashboardPlansMethods mixins

export default{
  methods: {
    startNewPlan: function () {
      if (this.planCount >= 3) {
        alert("The maximum number of plans has been reached. Delete an existing plan to continue.");
        return;
      }

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
            university: 'NUS',
            course: 'Architecture'
          }
        },
        housing: {
          status: 0, housing_data: {
            location: 'All',
            houseType: 'All',
            housePrice: 0,
            loanBool: false,
            selectedBank: '',
            interestRate: 0,
            monthlyRepay: 0,
            loanPeriod: 0
          }
        },
        car: {
          status: 0, car_data: {
            brand: 'BMW',
            model: 'bmw-1-series',
            price: 0,
            loanBool: false,
            selectedBank: '',
            interestRate: 0,
            monthlyRepay: 0,
            tenure: 0
          }
        },
        expenses: {status: 0, expenses_data: [{
            activity: "Grocery",
            amount: 50,
            frequency: "weekly"
          }]}

      };


      const docRef = db.collection('users').doc('' + this.user_id).collection('saved_plans').doc();
      const plan_id = docRef.id;
      const self = this;

      docRef.set({
        planName: 'untitled',
        lastSaved: Date.now(),
        income: emptyProcesses["income"],
        housing: emptyProcesses["housing"],
        car: emptyProcesses["car"],
        expenses: emptyProcesses["expenses"],
      }).then(function () {
        self.updateUserPlanCount(++self.planCount);
        self.$router.push({path: `/dashboard/income/${plan_id}`})
      });

      // set({[process_name]: process_object});
    },
    preloadUserDetails: function () {
      let self = this;
      this.getUserDetails().then(function (res) {
        const details = res.data();
        self.planCount = details["planCount"];
      });
    },
    preloadPlanDetails: function () {
      let self = this;
      this.getAllPlansFromFireBase().then(function (querySnapshot) {
        let planCount = 0;
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          planCount++;
          let planDetails = doc.data();
          self.planInfo = Object.assign({}, self.planInfo, {
            [doc.id]:
              {
                planName: planDetails["planName"],
                lastSaved: planDetails["lastSaved"]
              }
          });
        });
        self.planCount = planCount; // extra update planCount, in case abusers decides to quickly maneuver across url which breaks planCount
        self.updateUserPlanCount(planCount);
      });
    },
    deletePlan: function (plan_id) {
      let self = this;
      this.deletePlanFromFireBase(plan_id).then(function () {
        if (self.planInfo !== undefined) {
          Vue.delete(self.planInfo, plan_id);
        }
        self.updateUserPlanCount(--self.planCount);
        // redirects if delete the plan, that he is currently viewing
        if (self.$route.path === '/dashboard/viewplan/' + plan_id) {
          self.$router.push('/dashboard')
        }
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
    }
  }
}
