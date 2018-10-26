import firebase from 'firebase';

export default{
  methods: {
    postToFireBase: function (uid, plan_id, process_name, process_object) {
      var db = firebase.firestore();

      db.settings({
        timestampsInSnapshots: true
      });

      // Initialise the user info
      db.collection('users').doc('' + uid).collection(plan_id).set({[process_name]: process_object});
    }
  }
}
