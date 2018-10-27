import firebase from 'firebase';

export default{
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
    },

    loadPlanFromFireBase: function (uid, plan_id) {
      let db = firebase.firestore();
      let docRef = db.collection("users").doc(uid).collection("saved_plans").doc(plan_id);

      return docRef.get(); // return the promise
    }
  }
}
