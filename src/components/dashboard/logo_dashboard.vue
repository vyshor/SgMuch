<template>
  <div id="logo_dashboard">
    <div class="container center">
      <img :src="image" class="brand-logo"/>
    </div>
  </div>

</template>

<script>
  import image from "../../assets/logo.png"

  export default {
    data: function () {
      return {
        image
      }
    }
  }
</script>

<style scoped>
  #logo_dashboard {
    background-color: #2B1B2B;
  }
</style>
