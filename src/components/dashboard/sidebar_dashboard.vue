<template>
  <div>
    <div id="savedplans">
      <div id="no_saved_plans" class="center" v-show="!this.info.planCount">
        <p>You have not created any plans yet</p>
      </div>
      <div class="center savedPlan" v-for="(value, key) in this.info.planInfo"
           v-bind:class="{active: activePlanId === key}">
        <p class="planName">
          <router-link v-bind:to="'/dashboard/viewplan/' + key" class="routerName"
                       v-bind:class="{active: activePlanId === key}">{{ value.planName }}
          </router-link>
          <i class="small material-icons delete_entry right waves-effect"
             @click="$emit('deletePlan', key)">close</i></p>
        <p class="lastSaved">Last saved on {{ convertDate(value.lastSaved) }}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import processFireBase from "../../mixins/processFireBase";

  export default {
    props: ["info", "activePlanId"]
    ,
    mixins: [processFireBase],
    data() {
      return {}
    },
    methods: {
      convertDate: function (inputFormat) {
        function pad(s) {
          return (s < 10) ? '0' + s : s;
        }

        let d = new Date(inputFormat);
        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
      }
    },
    mounted() {
    }
  }
</script>

<style scoped>

  #savedplans {
    height: 100%;
    width: 100%;
  }

  #no_saved_plans {
    width: 70%;
  }

  #no_saved_plans p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 3rem;
  }

  .savedPlan {
    background-color: white;
    border: #707070 solid 1px;
    margin-top: 5%;
    margin-left: 3%;
    margin-right: 3%;
  }

  .savedPlan.active {
    border: #FF39E5 solid 3px;
  }

  .planName {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    text-align: left;
    font-size: 2rem;
    margin: 2% 0 0 5%;
  }

  .lastSaved {
    font-family: 'Segoe UI';
    text-align: left;
    font-size: 1rem;
    margin: 0 0 5% 5%;
    color: #707070;
  }

  .delete_entry {
    color: #707070;
    margin-top: -2%;
  }

  .routerName {
    color: black;
  }

  .routerName.active {
    color: #FF39E5;
  }


</style>
