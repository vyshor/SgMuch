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
              <meter max="4" id="password-strength-meter"></meter>
              <div id="password-strength-text-container">
                <p id="password-strength-text"></p>
              </div>
              <div id="recaptcha">
                <div class="g-recaptcha" data-sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"></div>
                <noscript>
                  <div>
                    <div style="width: 302px; height: 422px; position: relative;">
                      <div style="width: 302px; height: 422px; position: absolute;">
                        <iframe
                          src="https://www.google.com/recaptcha/api/fallback?k=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                          frameborder="0" scrolling="no"
                          style="width: 302px; height:422px; border-style: none;">
                        </iframe>
                      </div>
                    </div>
                    <div style="width: 300px; height: 60px; border-style: none;
                   bottom: 12px; left: 25px; margin: 0px; padding: 0px; right: 25px;
                   background: #f9f9f9; border: 1px solid #c1c1c1; border-radius: 3px;">
      <textarea id="g-recaptcha-response" name="g-recaptcha-response"
                class="g-recaptcha-response"
                style="width: 250px; height: 40px; border: 1px solid #c1c1c1;
                          margin: 10px 25px; padding: 0px; resize: none;">
      </textarea>
                    </div>
                  </div>
                </noscript>
              </div>
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

  export default {
    name: "signUp",
    data() {
      return {
        image,
        name: '',
        email: '',
        password: ''

      }
    },

    mounted() {
      var strength = {
        0: "Worst",
        1: "Bad",
        2: "Weak",
        3: "Good",
        4: "Strong"
      };

      var password = document.getElementById('password');
      var meter = document.getElementById('password-strength-meter');
      var text = document.getElementById('password-strength-text');

      password.addEventListener('input', function () {
        var val = password.value;
        var result = zxcvbn(val);

        // Update the password strength meter
        meter.value = result.score;

        // Update the text indicator
        if (val !== "") {
          text.innerHTML = "Strength: " + strength[result.score];
        } else {
          text.innerHTML = "";
        }
      });
    },

    methods: {
      signUp: function (e) {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.replace('dashboard');
            console.log(user.user.uid);

            const uid = user.user.uid;
            const name = this.name;
            const email = this.email;
            const password = this.password;
            this.post(uid, name, email, password);
          },
          (err) => {
            alert("Oops. " + err.message);
          }
        )
      },

      post: function (uid, name, email, password) {
        var db = firebase.firestore();

        db.settings({
          timestampsInSnapshots: true
        });

        // Initialise the user info
        db.collection('users').doc('' + uid).set({name:name, email:email, password: password, planCount: 0});
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

</style>
