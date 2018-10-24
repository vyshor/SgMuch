<template>
  <div>
    <div id="homepage_top">
      <div class="center">
        <img :src="image" class="brand-logo"/>
      </div>
      <div class="center" id="login_btn_container">
        <a href="login" class="btn btn-large" id="login_btn">Login</a>
        <br>
        <div class="center" id="sign-up_textbox" >
          <a href="signup" id="sign-up_text">No account? Sign up for free</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import image from "../assets/logo.png";

  export default {
    data: function () {
      return {
        image
      }
    }
  }
</script>

<style scoped>
  #homepage_top {
    height: 840px;

    background-image: url('../assets/backdrop_blur.png');
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: cover;

  }

  #login_btn_container {
    height: 100%;
  }

  #login_btn {
    margin-top: 12%;
    height: 11%;
    width: 17.5%;
    line-height: 250%;
    border-radius: 15px;

    font-family: 'Hobo Std';
    font-size: 2.75rem;
    color: #FF39E5;

    background-color: #272A43;
  }

  #sign-up_textbox {
    position: relative;
    margin-top: 2.5%;
    border-radius: 15px;
    background-color: #FFF;
    width: 15%;
    left: 42.5%;
  }

  #sign-up_text {

    text-decoration: underline;
    font-weight: bold;
    color: #FF39E5;
  }
</style>
