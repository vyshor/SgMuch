<template>
  <div id="logo_dashboard">
    <div class="container center">
      <img :src="image" class="brand-logo"/>
    </div>
  </div>

</template>

<script>
  export default {
    data: function () {
      return {
        image: 'https://github.com/vyshor/SgMuch/blob/master/assets/logo.png?raw=true'
      }
    }
  }
</script>

<style scoped>
  #logo_dashboard {
    background-color: #2B1B2B;
  }
</style>
