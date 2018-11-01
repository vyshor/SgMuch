<template>
  <div>
    <div id="homepage_top">
      <div class="center">
        <img :src="image" class="brand-logo"/>
      </div>
      <div class="center row" id="login_field_container">
        <form action="">
          <div class="row">
            <label for="name" class="col l2 push-l3">Name</label>
            <div class="input-field col l4 push-l3">
              <input type="text" name="name" v-model="name" id="name_field" class="validate">
            </div>
          </div>
          <div class="row">
            <label for="email" class="col l2 push-l3">Email</label>
            <div class="input-field col l4 push-l3">
              <input type="email" name="email" v-model="email" id="email_field" class="validate">
              <span class="helper-text" data-error="Invalid email" data-success="Valid email"></span>
            </div>
          </div>
          <div class="row">
            <label for="password" class="col l2 push-l3">Password</label>
            <div class="input-field col l4 push-l3">
              <input type="password" name="password" v-model="password" id="password" class="validate">
              <meter max="4" id="password-strength-meter" v-bind:value="meter_value"></meter>
              <div id="password-strength-text-container">
                <p id="password-strength-text">{{ password_strength }}</p>
              </div>
              <span class="col l12 error_message" v-if="error_message">{{ error_message }}</span>
              <vue-recaptcha
                ref="recaptcha"
                @verify="onCaptchaVerified"
                @expired="onCaptchaExpired"
                sitekey="6LeTW3cUAAAAAKHuXqpMOU5k_oP4ywr_oqMJIU_o" ></vue-recaptcha>
            </div>
          </div>
          <input class="btn btn-large grey_btn" type="Submit" value="Sign up" v-on:click="signUp"></input>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import image from "../../assets/logo.png";
  import SHA256 from "crypto-js/sha256";
  import VueRecaptcha from "vue-recaptcha";

  export default {
    name: "signUp",
    components: {
      VueRecaptcha
    },
    data() {
      return {
        image,
        name: '',
        email: '',
        password: '',
        recaptchaBool: false,
        strength: {
          0: "Worst",
          1: "Bad",
          2: "Weak",
          3: "Good",
          4: "Strong"
        },
        password_score: '',
        error_message: ''
      }
    },
    computed: {
      meter_value: function() {
        return zxcvbn(this.password).score;
      },
      password_strength: function() {
        if (this.password !== "") {
          return "Strength: " + this.strength[this.meter_value];
        } else {
          return "";
        }
      }
    },

    mounted() {
    },

    methods: {
      signUp: function (e) {
        e.preventDefault();
        let self = this;
        this.error_message = "";
        // Check if input fields are empty : Please check your input. All must be filled
        if (this.name === "" || this.email === "" || this.password === "") {
          self.error_message = "Please check your input. All fields must be filled";
          return;
        } else if (this.meter_value <= 2) {
          self.error_message = "Please choose a stronger password";
          return;
        } else if (this.recaptchaBool === false) {
          self.error_message = "Please tick reCAPTCHA checkbox";
          return;
        }
        // If the strength/meter value is 2 and below, reject : Please choose a stronger password

        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            // console.log(user.user.uid);

            const uid = user.user.uid;
            const name = self.name;
            const email = self.email;
            const password = self.password;
            self.post(uid, name, email, password);

            self.$router.replace('dashboard');
          },
          (err) => {
            // alert("Oops. " + err.message);
            console.log(err);

            if (err.code === "auth/weak-password") {
              self.error_message = "Password should at least be 6 characters";
            } else if (err.code === "auth/weak-password") {
              self.error_message = "You are already registered under our system";
              // auth/weak-password : Password should at least be 6 characters
              // auth/email-already-in-use : You are already registered under our system.
            } else if (err.code === "auth/invalid-email") {
              self.error_message = "Please check your input. Please enter a valid email"
            }
          }
        );
      },
      post: function (uid, name, email, password) {
        var db = firebase.firestore();

        db.settings({
          timestampsInSnapshots: true
        });

        // Initialise the user info
        db.collection('users').doc('' + uid).set({name:name, email:email, password: SHA256(password).toString(), planCount: 0});
      },
      onCaptchaVerified: function () {
        this.recaptchaBool = true;
      },
      onCaptchaExpired: function () {
        this.$refs.recaptcha.reset();
        this.recaptchaBool = false;
      }

    }
  }
</script>

<style scoped>
  .grey_btn {
    margin-top: 3%;
    height: 7%;
    width: 20%;
    line-height: 200%;
    border-radius: 15px;

    font-family: 'Hobo Std';
    font-size: 2.25rem;
    color: #000;

    background-color: #BFB2BF;
  }

  #homepage_top {
    height: 840px;

    background-image: url('../../assets/backdrop_clear.png');
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: cover;

  }

  #login_field_container {
    width: 50%;
    height: 75%;
    background-color: #FFF;
    opacity: 0.9;
    border: 1px solid #707070;

  }

  label {
    font-family: 'Hobo Std';
    font-size: 2.25rem;
    color: #272A43;
    line-height: 250%;
    text-align: right;
  }

  form {
    padding-top: 5%;
  }

  meter {
    width: 100%;
  }

  #password-strength-text {
    font-weight: bold;
  }

  #password-strength-text-container {
    height: 20px;
  }

  .error_message {
    font-size: 1.2rem;
    font-family: 'Arial';
    color: red;
  }

</style>
