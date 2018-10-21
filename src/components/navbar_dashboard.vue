<template>
    <nav class="nav-wrapper">
      <div class="container">
        <a href="" class="sidenav-trigger" data-target="mobile-menu"><i class="material-icons">menu</i></a>
        <ul class="center hide-on-med-and-down">
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/profile">Profile</router-link></li>
          <li><a v-on:click="logout">Logout</a></li>
        </ul>
        <ul class="sidenav grey lighten-2" id="mobile-menu">
          <li><router-link to="/dashboard">Dashboard</router-link></li>
          <li><router-link to="/profile">Profile</router-link></li>
          <li><a v-on:click="logout">Logout</a></li>
        </ul>
      </div>
    </nav>

</template>

<script>
    import firebase from 'firebase';

    export default {
      methods: {
        logout: function(e) {
          e.preventDefault();
          firebase.auth().signOut().then(() => {
            this.$router.replace('loggedout');
          })
        }
      }
    }
    $(document).ready(() => {
      $('.sidenav').sidenav();
    });
</script>

<style scoped>
  .nav-wrapper{
    background-color: #2B1B2B;
  }
  ul.center.hide-on-med-and-down {
    height: 100%;
    line-height: 100%;
  }
  ul.center.hide-on-med-and-down li{
    height: 100%;
    width: 33%;
    line-height: 100%;
  }

  a{
    font-family: "Hobo Std";
    color: #3B46A2;
    line-height: 150%;
    font-size: 2.25rem;
  }
  .router-link-active{
    color: #272A43;
    -webkit-text-stroke-color: #707070;
    -webkit-text-stroke-width: 1px;
  }
</style>

