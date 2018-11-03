<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <progressbar v-bind:currentState="currentState"></progressbar>
    <nextbar v-bind:info="{currentState, path, plan_id, currentStatus}"></nextbar>
    <div id="dashboard_main">
      <div id="price_car">
        <!--<img v-bind:src="getImgUrl('BMW/bmw-1-series')">-->
        <div id="car_images_container" class="center carousel" ref="car_images">
          <div class="carousel-item" v-for="(url, idx) of allmodelurl_list">
            <img v-bind:src="getImgUrl(url)">
            <p class="carousel-brand">{{ url.split("/")[0] }}</p>
            <p class="carousel-model">{{ url.split("/")[1].replace(/-/g, " ").replace(/_/g, " ") }}</p>
          </div>
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
                <option v-for="carModel in model_list" :value="carModel.carModel">{{ carModel.carModel.replace(/-/g, " ").replace(/_/g, " ") }}</option>
              </select>
            </div>
          </div>
          <div class="row">
            <p class="col l4 info_text">Price:</p>
            <p class="col l6" id="car_price" v-if="!car_price_loading">S$ {{ calculatedPrice.toLocaleString() }}</p>
            <div class="col l6" v-else>
              <div class="preloader-wrapper small active left">
                <div class="spinner-layer spinner-blue-only">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div>
                  <div class="gap-patch">
                    <div class="circle"></div>
                  </div>
                  <div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <input class="btn color_btn" type="Submit" value="Get Price" v-on:click="getPrice"
                   id="get_price_btn"></input>
          </div>
        </form>
      </div>
      <div id="bank_details_container" v-if="show_bank_details >= 1 && !bank_loading" class="container center">
        <!--<div id="bank_details_container" class="container center">-->
        <slick class="" ref="bank_details_slider" :options="slickOptions" @afterChange="handleAfterChangeBank">
          <div class="card" v-for="(details, bank) of all_bank_details">
            <div class="card-content">
              <span class="card-title">{{ bank }}</span>
              <p class="bank_info_text col l6">Interest Rate: </p>
              <p class="col l6">{{ details.interest_rate }} %</p>
              <p class="bank_info_text col l6">Tenure: </p>
              <p class="col l6">{{ details.tenure }} years</p>
              <p class="bank_info_text col l6">Monthly Repayment: </p>
              <p class="col l6">S$ {{ details.monthly_repay.toLocaleString() }}</p>
            </div>
            <div class="card-action center">
              <a class="btn color_btn" v-on:click="printSelectedBank"
                 v-bind:class="{disabled: selectedBank_idx !== Object.keys(all_bank_details).indexOf(bank)}">Save Plan</a>
            </div>
          </div>

        </slick>
      </div>
      <div class="container center row" v-else-if="bank_loading">
        <p class="animated pulse infinite loading_text">Loading Housing Loan Details...</p>
        <div class="progress">
          <div class="indeterminate"></div>
        </div>
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
  import Vue from 'vue';

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
        bank_loading: false,
        car_price_loading: false,
        show_bank_details: 0, // 0 means do not show, 1 means it is ready to be rendered, 2 means rendered to screen already
        saved_bank_details: false,
        all_bank_details: {},
        selectedBank_idx: -1,
        slickOptions: {
          dots: true,
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
        },
        initCarousel: false
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
        this.car_price_loading = true;

        xhr.addEventListener("readystatechange", function () {
          if (Math.floor(this.status/100) === 5) { // internal server error status
            console.log("API server down. Using some random value as dummy values");
            self.calculatedPrice = Math.floor(Math.random() * 50000 + 20000);
            self.car_price_loading = false;

            self.saveToFireBase();
            self.getLoanDetails(self.prepMoneySmartURL());
            self.updateCarousel();
            return; //terminates so that it does not keep waiting for its status
          }
          if (this.readyState === this.DONE) {
            let reply_data = JSON.parse(this.responseText);
            // console.log(reply_data);
            self.calculatedPrice = parseInt(parseFloat(reply_data['carPrice'][0]['carprice']) * 0.042);
            self.car_price_loading = false;
            self.saveToFireBase();
            self.getLoanDetails(self.prepMoneySmartURL());
            self.updateCarousel(); // this needed to inserted at the back because the updating of carousel will
            // rapidly change all the variables in a very short period
            // and plus its async thats why it will mess with the variables
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

        this.bank_loading = true;
        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            let loan_info = JSON.parse(this.responseText);
            const compiled_bank_info = self.parseBankHtml(loan_info.content);
            self.selectedBank_idx = -1;
            // Delete all the existing properties first (existing banks)
            self.show_bank_details = 0;
            for (let [key, value] of Object.entries(self.all_bank_details)) {
              Vue.delete(self.all_bank_details, key);
            }
            // Then add all the new banks
            self.show_bank_details = 1;
            for (let [key, value] of Object.entries(compiled_bank_info)) {
              self.all_bank_details = Object.assign({}, self.all_bank_details, {[key]: value});
            }
            self.selectedBank_idx = 0; // init to highlight the centre choice by default
            self.bank_loading = false;
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
                self.allmodelurl_list.push(key + '/' + modelName);
              }
            }
            // console.log(self.allmodelurl_list);
            // console.log(self.model_table);
            self.selected_brand = 'BMW';
            self.updateModelDropdown();
          }
        });

      },
      updateModelDropdown: function (selection = null) {
        this.model_list.pop();
        this.model_list.pop();
        for (let carModel of Object.keys(this.model_table[this.selected_brand])) {
          this.model_list.push({carModel});
          if (typeof(selection) === "object") {
            this.selected_model = carModel;
          }
        }
      },
      prepMoneySmartURL: function () {
        let amount = this.calculatedPrice;
        amount = amount.toLocaleString().replace(/,/g, '%2C');
        return 'https://cors-anywhere.herokuapp.com/' + "https://www.moneysmart.sg/ajax/singlewiz/getSingleWizTableData?channel=car-loan&channelSlug=car-loan&page=1&sort=&order=&limit=5&filters%5Bloan_amount%5D=" + amount + "&filters%5Bloan_tenure_unit%5D=years&filters%5Bloan_tenure%5D=5";
      },
      printSelectedBank: function () {
        let self = this;
        const plan_id = this.plan_id;
        this.saved_bank_details = true;
        // console.log(this.selectedBank);
        // console.log(this.saved_data);
        // Save all bank details into the variables
        // Then save into firebase
        this.saveToFireBase().then(function() {
          // push user to next page after saving
          self.$router.push({name: 'Expenses', params: { plan_id }});
        }).catch(function(err) {
          console.log(err);
        });
      },
      handleAfterChangeBank(event, slick, currentSlide) {
        this.selectedBank_idx = currentSlide;
        // console.log(this.selectedBank_idx);
      },
      updateCarousel: function () {
        // console.log(selected_model);
        // if (selected_model !== null) {
        //   this.selected_model = selected_model;
        // }
        let instance = M.Carousel.getInstance(this.$refs.car_images);
        let brand_index = Object.keys(this.model_table).findIndex(x => x === this.selected_brand);
        let model_index = Object.keys(this.model_table[this.selected_brand]).findIndex(x => x === this.selected_model);
        let slide_index = (brand_index) * 2 + model_index;
        instance.set(slide_index);
      },
      getImgUrl: function (url) {
        return 'https://raw.githubusercontent.com/vyshor/sgmuch/master/src/assets/ImagesFolder/' + url + '.jpg';
      },
      refreshCarousel: function () {
        let self = this;
        $(this.$refs.car_images).carousel({
          onCycleTo: function (ele, dragge) {
            // console.log($(ele).index());
            let idx = $(ele).index();
            let brand_index = Math.floor(idx / 2);
            let model_index = idx % 2;
            if (Object.keys(self.model_table).length) {
              self.selected_brand = Object.keys(self.model_table)[brand_index];
              self.selected_model = Object.keys(Object.values(self.model_table)[brand_index])[model_index];
              self.updateModelDropdown(self.selected_model);
              // console.log(self.selected_brand, self.selected_model);
            }
          }
        });
      },
      getElements: function (html, selector) {
          let div = document.createElement("div"); // the container element
          div.innerHTML = html; // set it's html to 'html'
          let elems = div.querySelectorAll(selector); // select the elements that match the CSS selector 'selector'
          // return their outerHTML (elems is an array like object so map is not defined thus we have to call it in this way)
          return Array.prototype.map.call(elems, function(e) {
            return e.innerHTML;
          });
        },
      parseBankHtml: function(html) {
        let compiled_bank_details = {};
        let bank_list = this.getElements(html, ".bank-title");
        let summary_list = this.getElements(html, ".summary-box");
        for (const [idx, bank] of Object.entries(bank_list)) {
          let extract_details = this.getElements(summary_list[idx], "span").slice(1,4);
          let bank_details = {};
          bank_details["monthly_repay"] = parseInt(extract_details[0].replace(/,/g, "").replace(/\$/g, ""));
          bank_details["interest_rate"] = parseFloat(extract_details[1].replace(/%/g, ""));
          bank_details["tenure"] = parseFloat(extract_details[2].replace(/( years)/g, ""));
          compiled_bank_details[bank] = bank_details;
        }
        return compiled_bank_details;
      },
      loadSavedCarInformation: function() {
        let self = this;
        this.loadPlanFromFireBase(this.user_id, this.plan_id).then(
          function(res) {
            const overall_data = res.data()[self.currentState];
            self.currentStatus = overall_data.status;
            const car_data = overall_data[self.currentState + '_data'];
            if (car_data !== undefined) {
              self.selected_brand = car_data.brand;
              self.selected_model = car_data.model;
              self.calculatedPrice = car_data.price;
              self.updateModelDropdown(car_data.model);
              self.updateCarousel();
              // self.saved_bank_details = car_data.loanBool;
            }

          }
        ).catch( function (err) { // redirects if such plan does not exist
            console.log(err);
            self.$router.push('/dashboard');
          }
        )
      }
    }
    ,
    mounted() {
      this.getCarList();
      this.loadSavedCarInformation();
      // self.$refs.car_images.reSlick();
      // console.log(this.$refs.car_images);
      // console.log($(this.$refs.car_images));

      // Had to do this, because slick creates separate new element that vue css cant touch
      $( "<style>.slick-arrow:before { color: #272A43 !important; }</style>" ).appendTo( "head" );

    },
    computed: {
      saved_data: function () {
        return {
          brand: this.selected_brand,
          model: this.selected_model,
          price: this.calculatedPrice,
          loanBool: this.saved_bank_details,
          selectedBank: this.selected_bank,
          interestRate: this.interest_rate,
          monthlyRepay: this.monthly_repay,
          tenure: this.tenure
        }
      },
      selected_bank: function() {
        if (this.selectedBank_idx !== -1 ) {
          return Object.keys(this.all_bank_details)[this.selectedBank_idx]
        } else return '';
      },
      interest_rate: function() {
        if (this.selectedBank_idx !== -1 ) {
          return this.all_bank_details[this.selected_bank].interest_rate;
        } else return 0;
      },
      monthly_repay: function() {
        if (this.selectedBank_idx !== -1 ) {
          return this.all_bank_details[this.selected_bank].monthly_repay;
        } else return 0;
      },
      tenure: function() {
        if (this.selectedBank_idx !== -1 ) {
          return this.all_bank_details[this.selected_bank].tenure;
        } else return 0;
      }
    },
    beforeUpdate() {
      // if (this.$refs.car_images) {
      //   this.$refs.car_images.destroy();
      // }
    },
    updated() {
      this.$nextTick(function () {
        if (!this.initCarousel && this.$refs.car_images) {
          // this.$refs.car_images.create(this.slickOptions);
          this.initCarousel = true;
          this.refreshCarousel();
        }

        if(this.show_bank_details === 1) {
          this.show_bank_details = 2;
          this.$refs.bank_details_slider.reSlick();
        }
      });
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

  .carousel-brand {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    visibility: hidden;
  }

  .carousel-model {
    font-family: 'Calibri';
    text-transform: capitalize;
    visibility: hidden
  }

  .active > p.carousel-brand {
    visibility: visible;
  }
  .active > p.carousel-model {
    visibility: visible;
  }

  #car_model {
    text-transform: capitalize;
    font-family: 'Calibri';
  }

  #car_brand {
    font-family: 'Calibri';
  }

  .card {
    min-height: 320px;
  }

  .card-action {
    width: 100%;
    position: absolute;
    bottom: 0;
  }

  .loading_text {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;
  }




</style>
