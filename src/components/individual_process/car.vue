<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <progressbar v-bind:currentState="currentState"></progressbar>
    <nextbar v-bind:info="{currentState, path}"></nextbar>
    <div id="dashboard_main">
      <div id="car_images_container" class="center carousel" ref="car_images">
        <a class="carousel-item" href="#one!"><img src="https://lorempixel.com/250/250/nature/1"></a>
        <a class="carousel-item" href="#two!"><img src="https://lorempixel.com/250/250/nature/2"></a>
        <a class="carousel-item" href="#three!"><img src="https://lorempixel.com/250/250/nature/3"></a>
        <a class="carousel-item" href="#four!"><img src="https://lorempixel.com/250/250/nature/4"></a>
        <a class="carousel-item" href="#five!"><img src="https://lorempixel.com/250/250/nature/5"></a>
      </div>
      <form id="car_info" class="center row">
        <div class="row">
          <p class="col l4 info_text">Brand:</p>
          <div class="input-field browser-default col l6">
            <select name="brand" class="browser-default" id="car_brand" v-model="selected_brand" v-on:change="updateModelDropdown">
              <option v-for="carBrand in car_list" :value="carBrand.carBrand">{{ carBrand.carBrand }}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <p class="col l4 info_text">Model:</p>
          <div class="input-field browser-default col l6">
            <select name="model" class="browser-default" id="car_model" v-model="selected_model">
              <option v-for="carModel in model_list" :value="carModel.carModel">{{ carModel.carModel }}</option>
            </select>
          </div>
        </div>
        <div class="row">
          <p class="col l4   info_text">Price:</p>
          <p class="col l6" id="car_price">{{ calculatedPrice }}</p>
        </div>
        <div class="row">
          <input class="btn" type="Submit" value="Calculate" v-on:click="getPrice" id="get_price_btn"></input>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import logo_dashboard from "../dashboard/logo_dashboard";
  import navbar_dashboard from "../dashboard/navbar_dashboard";
  import progressbar from "../dashboard/progressbar";
  import nextbar from "../dashboard/nextbar";

  export default {
    components: {
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'progressbar': progressbar,
      'nextbar': nextbar
    },
    data() {
      return {
        currentState: "car",
        path: ['/dashboard/expenses', '/dashboard/housing', '/dashboard/expenses'],
        car_list: [],
        selected_brand: '',
        model_table: {},
        model_list: [],
        selected_model: '',
        calculatedPrice: ''
      }
    },
    methods: {
      getPrice: function (e) {
        e.preventDefault();
        let data = JSON.stringify({
          country: "Thailand",
          brand: this.selected_brand,
          size: this.model_table[this.selected_brand][this.selected_model]
        });
        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        let self = this;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            let reply_data = JSON.parse(this.responseText);
            self.calculatedPrice = "S$ " + parseInt(parseFloat(reply_data['carPrice'][0]['carprice'])*0.042).toLocaleString();
            self.getLoanDetails(self.prepMoneySmartURL());
          }
        });

        xhr.open("POST", "https://microservice.dev.bambu.life/api/generalCalculator/carPriceCalculators/getCarPrice", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
      },
      getLoanDetails: function(url) {
        let data = JSON.stringify(false);
        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            let loan_info = console.log(this.responseText);
          }
        });

        xhr.open("GET", url);
        xhr.send(data);
      },
      getCarList: function () {
        const carListURL = "https://raw.githubusercontent.com/vyshor/sgmuch/master/src/assets/car_avail.json";
        const self = this;
        $.ajax(carListURL, {
          async: true, success: function (data) {
            data = JSON.parse(data);
            for (let carBrand of Object.keys(data)) {
              self.car_list.push({carBrand})
            }
            self.model_table = data;
            self.selected_brand = 'BMW';
            self.updateModelDropdown();
          }
        });

      },
      updateModelDropdown: function () {
        this.model_list.pop();
        this.model_list.pop();
        for (let carModel of Object.keys(this.model_table[this.selected_brand])) {
          this.model_list.push({carModel});
          this.selected_model = carModel;
        }
      },
      prepMoneySmartURL: function() {
        let amount = this.calculatedPrice;
        amount = amount.replace('S$ ', '').toLocaleString().replace(/,/g, '%2C');
        return 'https://cors-anywhere.herokuapp.com/' + "https://www.moneysmart.sg/ajax/singlewiz/getSingleWizTableData?channel=car-loan&channelSlug=car-loan&page=1&sort=&order=&limit=5&filters%5Bloan_amount%5D=" + amount + "&filters%5Bloan_tenure_unit%5D=years&filters%5Bloan_tenure%5D=5";
      }
    },
    mounted() {
      $(this.$refs.car_images).carousel();
      this.getCarList();
    }
  }

</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }

  #car_info {
    background-color: #BFB2BF;
    height: 100%;
    padding-top: 1%;
    padding-bottom: 1%;
    width: 50%;
  }

  #car_info div {
    margin-bottom: 0;
  }

  #car_info p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.9rem;
    margin: 0;
  }

  .info_text {
    text-align: right;
  }

  #get_price_btn {
    font-family: 'Helvetica Rounded';
    text-transform: none;
    font-weight: bold;
    color: #97CAEC;
    background-color: #272A43;
    border: solid 1px #707070;
    margin-top: 1%;
  }

  div .input-field {
    margin-top: 0;
    padding-bottom: 3%;
  }

  #car_price {
    text-align: left;
  }

</style>
