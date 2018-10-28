<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <div class="row container" id="profile_container">
      <div id="profile_details" class="center row">
        <div class="row">
          <p class="col l4 push-l1 info_text">Name</p>
          <div class="input-field col l3 push-l1">
            <input :disabled="!changingDetails" v-model="name" type="text" name="name" id="name_field"
                   class="validate"/>
          </div>
        </div>
        <div class="row">
          <p class="col l4 push-l1 info_text">Email</p>
          <div class="input-field col l3 push-l1">
            <input :disabled="!changingDetails" v-model="email" type="email" name="email" id="email_field"
                   class="validate"/>
          </div>
        </div>
        <div class="row" v-show="changingDetails">
          <p class="col l4 push-l1 info_text">Current Password</p>
          <div class="input-field col l3 push-l1">
            <input v-model="password" type="password" name="password" id="password_field" class="validate"/>
          </div>
        </div>
      </div>
      <div class="center row">
        <a class="btn btn-large" id="change_details" v-on:click="changeDetails" v-if="!changingDetails">Change
          Details</a>
        <a class="btn btn-large" id="change_details" v-on:click="saveChanges" v-else>Save</a>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import logo_dashboard from "../dashboard/logo_dashboard";
  import navbar_dashboard from "../dashboard/navbar_dashboard";
  import processFireBase from "../../mixins/processFireBase";
  import SHA256 from 'crypto-js/sha256';

  export default {
    components: {
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard
    },
    mixins: [processFireBase],
    data() {
      return {
        user_id: firebase.auth().currentUser.uid,
        name: '',
        email: '',
        password: '',
        hashed_password: '',
        changingDetails: false
      }
    },
    methods: {
      changeDetails: function () {
        this.changingDetails = true;
      },
      saveChanges: function() {
        let self = this;
        if (SHA256(this.password).toString() === this.hashed_password) {
          // Correct current password
          // Update firebase own account
          const user = firebase.auth().currentUser;
          user.updateEmail(this.email).then(function() {
            console.log("success");
            // Then update own database
            this.updateUserDetails(self.name, self.email);
          }).catch(function(error) {
            // An error happened.
            console.log(error);
          })

        } else {
          // Invalid correct password
          this.password = '';
        }
      }
    },
    mounted() {
      let self = this;
      this.getUserDetails().then(
        function (res) {
          const details = res.data();
          self.email = details["email"];
          self.name = details["name"];
          self.hashed_password = details["password"];
        }
      )
    }
  }
</script>

<style scoped>
  #profile_container {
    margin-bottom: 0;
  }

  #change_details {
    padding: 1%;
    width: 30%;
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

  div .input-field {
    margin-top: 0;
    padding-bottom: 3%;
  }

  #profile_details p {
    font-family: 'Hobo Std';
    font-size: 2.3rem;
    color: #272A43;
    margin: 0 1% 0 0;
  }

  #profile_details {
    margin-top: 7%;
  }

  .info_text {
    text-align: right;
  }
</style>
