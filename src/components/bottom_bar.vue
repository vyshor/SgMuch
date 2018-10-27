<template>
  <div>
  <div id="bottombar_top">
      <div class="container">
        <div class="hide-on-med-and-down row" id="botbar_text">
        <div class="col l5">
          <h5>ABOUT</h5>
          <p>Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries</p>
        </div>
        <div class="col push-l2 l4">
          <h5>STAY CONNECTED</h5>
          <p>Email: sgmuch18@gmail.com<br>
            Office No.: +65 6123 4567<br>
            Office Hours ( 8 am to 6 pm) </p>
        </div>

        </div>
      </div>
  </div>
  <div id="bottombar_bot"></div>
  </div>

</template>

<script>
    export default {

    }
</script>

<style scoped>
  #bottombar_top {
    background-color: #272A43;
    margin-bottom: 0;
  }
  #bottombar_bot {
    background-color: #BFB2BF;
    height: 2rem;
    margin-top: 0;
  }

  #botbar_text{
    color: #FFF;
    font-family: "Calibri";
    margin-bottom: 0;
  }

  #botbar_text h5{
    font-weight: bold;
  }


</style>

