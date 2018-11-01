<template>
  <div>
    <div id="homepage_top">
      <div class="center">
        <img :src="image" class="brand-logo"/>
      </div>
      <div class="center row" id="login_field_container">
        <form action="">
          <div class="row">
            <label for="email" class="col l2 push-l3">Email</label>
            <div class="input-field col l4 push-l3">
              <input v-model="email" type="email" name="email" id="email_field" class="validate"/>
            </div>
          </div>
          <div class="row">
            <label for="password" class="col l2 push-l3">Password</label>
            <div class="input-field col l4 push-l3">
              <input v-model="password" type="password" name="password" id="password_field" class="validate"/>
            </div>
            <router-link to="/signup" class="col l12 error_message" v-if="no_account_message">{{ no_account_message }}</router-link>
            <p class="col l12 error_message" v-if="error_message">{{ error_message }}</p>
          </div>
          <input class="btn btn-large grey_btn" type="Submit" value="Login" v-on:click="signIn"></input>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import image from "../../assets/logo.png"

  export default {
    name: 'login',
    data() {
      return {
        image,
        email: 'hara@hara.com',
        password: 'dingdong',
        no_account_message: '',
        error_message: ''
      }
    },
    methods: {
      signIn: function(e) {
        e.preventDefault();
        let self = this;
        this.no_account_message = "";
        this.error_message = "";
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.replace('dashboard')
          },
          (err) => {
            // console.log(err);
            // alert('Oops. ' + err.message)
            if (err.code === 'auth/user-not-found') {
              // no such account
              self.no_account_message = "Account does not exist. Sign up?";
            } else if (err.code === "auth/wrong-password") {
              self.error_message = "Error! Please check your input";
            }
          }
        )
      }
    }
  }
</script>

<style scoped>
  .grey_btn {
    margin-top: 12%;
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
    height: 70%;
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
    padding-top: 10%;
  }

  .error_message {
    font-size: 1.2rem;
    font-family: 'Arial';
    color: red;
  }
</style>
