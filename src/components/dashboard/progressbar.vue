<template>
  <div id="stages">
    <ul>
      <li v-bind:class="{ active: incomeActive }">Income</li>
      <li v-bind:class="{ active: housingActive }">Housing</li>
      <li v-bind:class="{ active: carActive }">Car</li>
      <li v-bind:class="{ active: expensesActive }">Expenses</li>
    </ul>
  </div>
</template>

<script>
    export default {
      props: ['currentState'],
      computed: {
        incomeActive: function(){
          return this.currentState === "income"
        },
        housingActive: function(){
          return this.currentState === "housing"
        },
        carActive: function(){
          return this.currentState === "car"
        },
        expensesActive: function(){
          return this.currentState === "expenses"
        },
      }
    }
</script>

<style scoped>
  #stages{
    width: 100%;
    height: 100%;
    margin-top: 0;
    padding-top: 4%;
    padding-bottom: 5%;
    background-color: #fff;
    font-family: verdana, "sans-serif";
    font-size: 9px;
  }
  #stages ul{
    list-style: none;
    padding: 0px;
    margin: 0px;
  }
  #stages li{
    float: left;
    width: 25%;
    text-align: center;
    color: #272A43;
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 2.25rem;
  }

  #stages li.active{
    color: #FF39E5;
  }
  #stages ul > li:before {
    content: "•";
    font-size: 10rem;
    line-height: 1.5rem;
    display: block;
    color: #272A43;
    background-color: #272A43;
    border-bottom: 0.5rem solid #272A43;
    margin: 0 0 1.5rem 0;
  }
  #stages ul > li.active:before {
    color: #FF39E5;
    text-shadow: 0px 0px 10px #56ff5f;
  }
</style>

