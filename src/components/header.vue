<template>
    <nav class="nav-wrapper blue">
      <div class="container">
        <a href="" class="brand-logo">Dorothy</a>
        <a href="" class="sidenav-trigger" data-target="mobile-menu"><i class="material-icons">menu</i></a>
        <ul class="right hide-on-med-and-down">
          <li><router-link to="/" exact>Guess</router-link></li>
          <li><router-link to="/pollresults" exact>Check Poll Results</router-link></li>
        </ul>
        <ul class="sidenav grey lighten-2" id="mobile-menu">
          <li><router-link to="/" exact>Guess</router-link></li>
          <li><router-link to="/pollresults" exact>Check Poll Results</router-link></li>
        </ul>
      </div>
    </nav>

</template>

<script>
    export default {

    }
    $(document).ready(() => {
      $('.sidenav').sidenav();
    });
</script>

<style scoped>
  .router-link-active{
    background: #eee;
    color: #444;
  }
</style>
