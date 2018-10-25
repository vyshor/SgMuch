<template>
  <div>
    <div id="homepage_top">
      <div class="center">
        <img :src="image" class="brand-logo"/>
      </div>
      <div class="center" id="logged_out_text_container">
        <div class="center row" id="logged_out_textbox">
          <p>You have successfully logged out</p>
        </div>
        <a href="login" class="btn btn-large" id="login_btn">Login</a>

      </div>
    </div>
  </div>
</template>

<script>
  import image from "../../assets/logo.png";

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

    background-image: url('../../assets/backdrop_blur.png');
    background-position: center bottom;
    background-repeat: no-repeat;
    background-size: cover;

  }

  #logged_out_text_container {
    height: 100%;
  }

  #logged_out_textbox {
    width: 25%;
    height: auto;
    background-color: #FFF;
    opacity: 0.9;
    border: 1px solid #707070;
    border-radius: 35px;

  }


  #logged_out_textbox p {
    font-family: 'Hobo Std';
    font-size: 3.9rem;
  }

  #login_btn {
    margin-top: 5%;
    height: 11%;
    width: 17.5%;
    line-height: 250%;
    border-radius: 15px;

    font-family: 'Hobo Std';
    font-size: 2.75rem;
    color: #FF39E5;

    background-color: #272A43;
  }
</style>
