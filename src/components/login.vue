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
          </div>
          <input class="btn btn-large grey_btn" type="Submit" value="Login" v-on:click="signIn"></input>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';

  export default {
    name: 'login',
    data() {
      return {
        image: 'https://github.com/vyshor/SgMuch/blob/master/assets/logo.png?raw=true',
        email: 'hara@hara.com',
        password: 'dingdong'
      }
    },
    methods: {
      signIn: function(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.replace('dashboard')
          },
          (err) => {
            alert('Oops. ' + err.message)
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

    background-image: url('https://github.com/vyshor/SgMuch/blob/master/assets/backdrop_clear.png?raw=true');
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
</style>
