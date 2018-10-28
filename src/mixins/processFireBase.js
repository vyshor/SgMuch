import firebase from 'firebase';

export default {
  methods: {
    postToFireBase: function (uid, plan_id, process_name, process_data, new_status) {
      let db = firebase.firestore();

      db.settings({
        timestampsInSnapshots: true
      });

      let process_details = {
        status: new_status,
        [process_name + "_data"]: process_data
      };

      db.collection('users').doc('' + uid).collection("saved_plans").doc(plan_id).update({[process_name]: process_details});
      this.updateSavedDate(uid, plan_id);
    },
    loadPlanFromFireBase: function (uid, plan_id) {
      let db = firebase.firestore();
      let docRef = db.collection("users").doc(uid).collection("saved_plans").doc(plan_id);

      db.settings({
        timestampsInSnapshots: true
      });

      return docRef.get(); // return the promise
    },
    saveToFireBase: function () {
      this.currentStatus = 2; // cus status = saved

      this.postToFireBase(this.user_id, this.plan_id, this.currentState, this.saved_data, this.currentStatus);
    },
    getUserDetails: function() {
      let db = firebase.firestore();

      db.settings({
        timestampsInSnapshots: true
      });

      let docRef = db.collection("users").doc(this.user_id);
      return docRef.get(); // return the promise
    },
    updateUserDetails: function(name, email) {
      let db = firebase.firestore();
      let updated_data = {
        name: name,
        email: email
      };
      return db.collection('users').doc(this.user_id).update(updated_data); // return promise
    },
    updateUserPlanCount: function(planCount) {
      let db = firebase.firestore();
      let updated_data = {
        planCount: planCount
      };
      db.collection('users').doc(this.user_id).update(updated_data);
    },
    updateSavedDate: function(uid, plan_id){
      let db = firebase.firestore();
      db.collection('users').doc('' + uid).collection("saved_plans").doc(plan_id).update({lastSaved: Date.now()});
    },
    getAllPlansFromFireBase: function() {
      let db = firebase.firestore();
      db.settings({
        timestampsInSnapshots: true
      });
      return db.collection("users").doc(this.user_id).collection("saved_plans").get(); // return promise of all the documents
    },
    deletePlanFromFireBase: function(plan_id) {
      let db = firebase.firestore();
      return db.collection("users").doc(this.user_id).collection("saved_plans").doc(plan_id).delete(); // return promise
    },
    getPlanDetailsFromFireBase: function(plan_id) {
      let db = firebase.firestore();
      db.settings({
        timestampsInSnapshots: true
      });

      let docRef = db.collection("users").doc(this.user_id).collection("saved_plans").doc(plan_id);
      return docRef.get(); // return the promise
    }

  }
}
