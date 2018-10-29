import firebase from 'firebase'; // needed for dashboardPlansMethods mixins
import Vue from 'vue'; // needed for dashboardPlansMethods mixins

export default{
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
            selectedBank: '',
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
            selectedBank: '',
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
        querySnapshot.forEach(function (doc) {
          // doc.data() is never undefined for query doc snapshots
          let planDetails = doc.data();
          self.planInfo = Object.assign({}, self.planInfo, {
            [doc.id]:
              {
                planName: planDetails["planName"],
                lastSaved: planDetails["lastSaved"]
              }
          });
        });
      });
    },
    deletePlan: function (plan_id) {
      let self = this;
      this.deletePlanFromFireBase(plan_id).then(function () {
        Vue.delete(self.planInfo, plan_id);
        self.updateUserPlanCount(--self.planCount);
      }).catch(function (error) {
        console.error("Error removing document: ", error);
      });
    }
  }
}
