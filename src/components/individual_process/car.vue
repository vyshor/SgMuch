<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <progressbar v-bind:currentState="currentState"></progressbar>
    <nextbar v-bind:info="{currentState, path, plan_id, currentStatus}"></nextbar>
    <div id="dashboard_main">
      <div id="price_car">
        <!--<img src="../../assets/ImagesFolder/BMW/bmw-1-series.jpg">-->
        <div id="car_images_container" class="center carousel" ref="car_images">
            <a class="carousel-item" href="" v-for="(url, idx) of allmodelurl_list"><img v-bind:src="url"></a>
          <!--<a class="carousel-item" href="#two!"><img src="https://lorempixel.com/250/250/nature/2"></a>-->
          <!--<a class="carousel-item" href="#three!"><img src="https://lorempixel.com/250/250/nature/3"></a>-->
          <!--<a class="carousel-item" href="#four!"><img src="https://lorempixel.com/250/250/nature/4"></a>-->
          <!--<a class="carousel-item" href="#five!"><img src="https://lorempixel.com/250/250/nature/5"></a>-->
        </div>
        <form id="car_info" class="center row">
          <div class="row">
            <p class="col l4 info_text">Brand:</p>
            <div class="input-field browser-default col l6">
              <select name="brand" class="browser-default" id="car_brand" v-model="selected_brand"
                      v-on:change="updateModelDropdown">
                <option v-for="carBrand in car_list" :value="carBrand.carBrand">{{ carBrand.carBrand }}</option>
              </select>
            </div>
          </div>
          <div class="row">
            <p class="col l4 info_text">Model:</p>
            <div class="input-field browser-default col l6">
              <select name="model" class="browser-default" id="car_model" v-model="selected_model"
                      v-on:change="updateCarousel">
                <option v-for="carModel in model_list" :value="carModel.carModel">{{ carModel.carModel }}</option>
              </select>
            </div>
          </div>
          <div class="row">
            <p class="col l4 info_text">Price:</p>
            <p class="col l6" id="car_price">S$ {{ calculatedPrice.toLocaleString() }}</p>
          </div>
          <div class="row">
            <input class="btn color_btn" type="Submit" value="Calculate" v-on:click="getPrice"
                   id="get_price_btn"></input>
          </div>
        </form>
      </div>
      <div id="bank_details_container" v-show="show_bank_details" class="container center">
        <!--<div id="bank_details_container" class="container center">-->
        <slick class="" ref="bank_details_slider" :options="slickOptions" @afterChange="handleAfterChangeBank">
          <div class="card" href="#one!">
            <div class="card-content">
              <span class="card-title">Bank 1</span>
              <p>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.</p>
            </div>
            <div class="card-action" id="bank_details_0">
              <a class="btn color_btn" type="Submit" v-on:click="printSelectedBank"
                 v-bind:class="{disabled: selectedBank !== 0}">Save Plan</a>
            </div>
          </div>
          <div class="card" href="#one!">
            <div class="card-content">
              <span class="card-title">Bank 2</span>
              <p>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.</p>
            </div>
            <div class="card-action">
              <a class="btn color_btn" type="Submit" v-on:click="printSelectedBank"
                 v-bind:class="{disabled: selectedBank !== 1}">Save Plan</a>
            </div>
          </div>
          <div class="card" href="#one!">
            <div class="card-content">
              <span class="card-title">Bank 3</span>
              <p>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.</p>
            </div>
            <div class="card-action">
              <a class="btn color_btn" type="Submit" v-on:click="printSelectedBank"
                 v-bind:class="{disabled: selectedBank !== 2}">Save Plan</a>
            </div>
          </div>
          <div class="card" href="#one!">
            <div class="card-content">
              <span class="card-title">Bank 4</span>
              <p>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.</p>
            </div>
            <div class="card-action">
              <a class="btn color_btn" type="Submit" v-on:click="printSelectedBank"
                 v-bind:class="{disabled: selectedBank !== 3}">Save Plan</a>
            </div>
          </div>

        </slick>
      </div>

    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  import logo_dashboard from "../dashboard/logo_dashboard";
  import navbar_dashboard from "../dashboard/navbar_dashboard";
  import progressbar from "../dashboard/progressbar";
  import nextbar from "../dashboard/nextbar";
  import Slick from 'vue-slick';
  import 'slick-carousel/slick/slick.css';
  import 'slick-carousel/slick/slick-theme.css';
  import * as M from "materialize-css";
  import processFireBase from "../../mixins/processFireBase";

  export default {
    components: {
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'progressbar': progressbar,
      'nextbar': nextbar,
      Slick
    },
    mixins: [processFireBase],
    data() {
      return {
        user_id: firebase.auth().currentUser.uid,
        plan_id: this.$route.params.plan_id,
        currentState: "car",
        currentStatus: 0,
        path: ['/dashboard/expenses', '/dashboard/housing', '/dashboard/expenses'],
        car_list: [],
        selected_brand: '',
        model_table: {},
        allmodelurl_list: [],
        model_list: [],
        selected_model: '',
        calculatedPrice: '',
        show_bank_details: false,
        saved_bank_details: false,
        selectedBank: 0,
        interest_rate: 0,
        monthly_repay: 0,
        tenure: 5,
        slickOptions: {
          centerMode: true,
          centerPadding: '60px',
          slidesToShow: 3,
          responsive: [
            {
              breakpoint: 768,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 3
              }
            },
            {
              breakpoint: 480,
              settings: {
                arrows: false,
                centerMode: true,
                centerPadding: '40px',
                slidesToShow: 1
              }
            }
          ]
        }
      }

    },
    methods: {
      getPrice: function (e) {
        e.preventDefault();
        this.updateCarousel();
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
            self.calculatedPrice = parseInt(parseFloat(reply_data['carPrice'][0]['carprice']) * 0.042);
            self.saveToFireBase();
            self.getLoanDetails(self.prepMoneySmartURL());
          }
        });

        xhr.open("POST", "https://microservice.dev.bambu.life/api/generalCalculator/carPriceCalculators/getCarPrice", true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.send(data);
      },
      getLoanDetails: function (url) {
        let data = JSON.stringify(false);
        let xhr = new XMLHttpRequest();
        let self = this;
        // xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            let loan_info = console.log(this.responseText);
            self.show_bank_details = true;
            self.$refs.bank_details_slider.reSlick();
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
            // self.model_table = data;
            for (let [key, value] of Object.entries(data)) {
              self.model_table = Object.assign({}, self.model_table, {[key]: value});
              for (let [modelName, ccData] of Object.entries(value)) {
                self.allmodelurl_list.push('../../src/assets/ImagesFolder/' + key + '/' + modelName + '.jpg');
              }
            }
            console.log(self.allmodelurl_list);
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
      prepMoneySmartURL: function () {
        let amount = this.calculatedPrice;
        amount = amount.toLocaleString().replace(/,/g, '%2C');
        return 'https://cors-anywhere.herokuapp.com/' + "https://www.moneysmart.sg/ajax/singlewiz/getSingleWizTableData?channel=car-loan&channelSlug=car-loan&page=1&sort=&order=&limit=5&filters%5Bloan_amount%5D=" + amount + "&filters%5Bloan_tenure_unit%5D=years&filters%5Bloan_tenure%5D=5";
      },
      printSelectedBank: function () {
        // console.log(this.selectedBank);
        console.log($(this.$refs.bank_details_slider))
        // Save all bank details into the variables
        // Then save into firebase
        this.saveToFireBase();
      },
      handleAfterChangeBank(event, slick, currentSlide) {
        this.selectedBank = currentSlide;
      },
      updateCarousel: function () {
        let instance = M.Carousel.getInstance(this.$refs.car_images);
        let brand_index = Object.keys(this.model_table).findIndex(x => x === this.selected_brand);
        let model_index = Object.keys(this.model_table[this.selected_brand]).findIndex(x => x === this.selected_model);
        let slide_index = (brand_index - 1) * 2 + model_index;
        instance.set(slide_index);
      },
      getImgUrl: function(url) {
        // let images = requireContext('url', false, /\.jpg$/);
        // return images('./' + url + ".jpg");
        return url + '.jpg'
      }
    }
    ,
    mounted() {
      this.getCarList();
      let self = this;
      $(this.$refs.car_images).carousel({
        onCycleTo: function (ele, dragge) {
          let idx = $(ele).index();
          let brand_index = Math.floor(idx / 2);
          let model_index = idx % 2;
          if (Object.keys(self.model_table).length) {
            self.selected_brand = Object.keys(self.model_table)[brand_index];
            self.selected_model = Object.keys(Object.values(self.model_table)[brand_index])[model_index];
          }
        }
      });
    },
    computed: {
      saved_data: function () {
        return {
          brand: this.selected_brand,
          model: this.selected_model,
          price: this.calculatedPrice,
          loanBool: this.saved_bank_details,
          interestRate: this.interest_rate,
          monthlyRepay: this.monthly_repay,
          tenure: this.tenure
        }
      }

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

  .color_btn {
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

  #bank_details_container {
    height: 50%;
  }

  .slick-slide.slick-current.slick-active > div > div.card {
    border: 4px #FF39E5 solid;
  }

  .card-content > p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
  }

  .slick-slide.slick-current.slick-active > div > div.card > .card-content {
    color: #FF39E5;
  }


</style>
