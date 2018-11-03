<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <progressbar v-bind:currentState="currentState"></progressbar>
    <nextbar v-bind:info="{currentState, path, plan_id, currentStatus}"></nextbar>
    <div id="dashboard_main">
      <div class="row">
        <div id="google_map_container" class="col l6 push-l1">
          <gmap-map
            :center="center"
            :zoom="zoom"
            style="width:100%;  height: 400px;"
            ref="myMap"
          >
            <gmap-marker
              :key="index"
              v-for="(m, index) in markers"
              :position="m.position"
              :clickable="true"
              @click="toggleInfo(m, index)"
            ></gmap-marker>
            <gmap-info-window :options="infoOptions" :position="infoPosition" :opened="infoOpened"
                              @closeclick="infoOpened=false">
              <p class="infoWindow_title">{{ location_selected }}</p>
              <div class="input-field browser-default row">
                <select name="house_type" class="browser-default col l7" v-model="house_type_selected" v-on:change="">
                  <option v-for="house_type of house_types" :value="house_type">{{ house_type }}</option>
                </select>
                <input class="btn btn-small color_btn col l5" type="Submit" value="Get Price"
                       v-on:click="getHousePrice"></input>
              </div>
            </gmap-info-window>

            <!--<gmap-marker v-for="(item, key) in coordinates" :key="key" :position="getPosition(item)" :clickable="true"-->
            <!--@click="toggleInfo(item, key)"/>-->

          </gmap-map>
        </div>
        <div id="house_info" class="col l4 push-l1">
          <div class="row">
            <p class="col l4 info_text">Location:</p>
            <div class="col l6 input-field browser-default">
              <select name="location" class="browser-default" v-model="location_selected"
                      v-on:change="updateHouseTypes">
                <option v-for="location of locations" :value="location">{{ location }}</option>
              </select>
            </div>
          </div>
          <div class="row">
            <p class="col l4 info_text">House Type:</p>
            <div class="col l6 input-field browser-default">
              <select name="house_type" class="browser-default" v-model="house_type_selected"
                      v-on:change="updateLocations">
                <option v-for="house_type of house_types" :value="house_type">{{ house_type }}</option>
              </select>
            </div>
          </div>
          <div class="row">
            <p class="col l4 info_text">House Price:</p>
            <p class="col l6" id="house_price">S$ {{ house_price.toLocaleString() }}</p>
          </div>
          <div class="row">
            <p class="col l4 info_text">Loan Period:</p>
            <div class="col l6 input-field">
              <p id="loan_period">{{ loan_period }} years</p>
            </div>
          </div>
          <div class="row" id="loan_period_container">
            <p class="range-field col l11 push-l1" id="loan_slider_p">
              <input type="range" id="loan_slider" min="5" max="40" step="1" v-model="loan_period"/>
            </p>
          </div>
          <div class="row center">
            <input class="btn color_btn" type="Submit" value="Get Price" v-on:click="getHousePrice"></input>
          </div>
        </div>
      </div>
      <div id="bank_details_container" v-if="show_bank_details >= 1" class="container center row">
        <!--<div id="bank_details_container" class="container center">-->
        <slick class="" ref="bank_details_slider" :options="slickOptions" @afterChange="handleAfterChangeBank">
          <div class="card" v-for="(details, bank) of all_bank_details">
            <div class="card-content">
              <span class="card-title">{{ bank }}</span>
              <p class="bank_info_text ">Interest Rate: </p>
              <p class="">{{ details.interest_rate }} %</p>
              <p class="bank_info_text ">Loan period: </p>
              <p class="">{{ details.loan_period }} years</p>
              <p class="bank_info_text ">Monthly Repayment: </p>
              <p class="">S$ {{ details.monthly_repay.toLocaleString() }}</p>
            </div>
            <div class="card-action center">
              <a class="btn color_btn" v-on:click="printSelectedBank"
                 v-bind:class="{disabled: selectedBank_idx !== Object.keys(all_bank_details).indexOf(bank)}">Save
                Plan</a>
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
  import processFireBase from "../../mixins/processFireBase";
  import Slick from 'vue-slick';
  import 'slick-carousel/slick/slick.css';
  import 'slick-carousel/slick/slick-theme.css';
  import Vue from 'vue';

  let GITRAW = "https://raw.githubusercontent.com/vyshor/university_expense/master/";

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
        currentState: "housing",
        currentStatus: 0,
        path: ['/dashboard/car', '/dashboard/income', '/dashboard/car'],
        house_type_selected: 'All',
        location_selected: 'All',
        locations: [],
        house_types: [],
        house_price: '',
        loan_period: 10,
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
        // All the data need for GoogleMaps
        center: {lat: 1.290270, lng: 103.851959}, // init centre of singapore
        zoom: 11, // init zoom
        markers: [],
        map: null,
        kml: null,
        kml_to_locations: {},
        infoOptions: {
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        infoPosition: null,
        infoOpened: false,
        infoCurrentKey: null
      }
    },
    mounted() {
      this.loadSavedHousingInformation();
      this.geolocate();
      this.preloadKmlToLocations();
      this.renderKml();
      this.updateHouseTypes(this.location_selected);
      this.updateLocations(this.house_type_selected);

      // Had to do this, because slick creates separate new element that vue css cant touch
      $("<style>.slick-arrow:before { color: #272A43 !important; }</style>").appendTo("head");
    },
    methods: {
      getPosition: function (marker) {
        return {
          lat: parseFloat(marker.lat),
          lng: parseFloat(marker.lng)
        }
      },
      addMarker(lat, lng, place_name) {
        const marker = {
          lat: lat,
          lng: lng
        };
        this.markers.push({
          position: marker,
          infoText: place_name
        });
        this.center = marker;
      },
      geolocate: function () {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
      },
      clickKml: function (layerEvt) {
        const region_name = layerEvt.featureData.name;
        this.zoom = 13;
        if (Object.keys(this.kml_to_locations).indexOf(region_name) !== -1) {
          // Means the click kml point is a valid entry
          const region_data = this.kml_to_locations[region_name];
          if (Object.keys(region_data).length > 0) {
            this.infoOpened = false; // close any info window
            // Means there is at least one valid  location in the kml region
            this.markers = [];
            for (let [key, value] of Object.entries(region_data)) {
              //Now need to create a landmark on each valid point
              this.addMarker(value[1], value[0], key);

            }
          }
        }
      },
      renderKml: function () {
        let self = this;
        this.$refs.myMap.$mapPromise.then(
          function () {
            var options = {
              preserveViewport: true,
              clickable: true,
              visibility: "visible",
              suppressInfoWindows: true,
              url: 'https://sites.google.com/site/sgzonemapkml/home/kml/version0.04.kml'
            };
            self.kml = new google.maps.KmlLayer(options);
            self.kml.setMap(self.$refs.myMap.$mapObject);
            google.maps.event.addListener(self.kml, 'click', self.clickKml);
          });
      },
      preloadKmlToLocations: function () {
        let self = this;
        $.ajax(GITRAW + "Python/google_map/" + "kml_to_locations.json", {
          async: true, success: function (kml_location_JSON) {
            self.kml_to_locations = JSON.parse(kml_location_JSON);
          }
        });
      },
      toggleInfo: function (marker, idx) {
        this.infoPosition = this.getPosition(marker.position);
        this.location_selected = marker.infoText;
        this.house_type_selected = 'All';
        this.updateHouseTypes();
        if (this.infoCurrentKey === idx) {
          this.infoOpened = !this.infoOpened;
        } else {
          this.infoOpened = true;
          this.infoCurrentKey = idx;
        }
      },
      updateHouseTypes: function (auto_select_first=false) {
        const location_selected = this.location_selected;
        let self = this;
        $.ajax(GITRAW + "Python/house_locations/" + location_selected + ".json", {
            async: true, success: function (res) {
              self.house_types = []; // clear original dropdown bar
              const house_types = JSON.parse(res);
              for (let house_type of house_types) {
                self.house_types.push(house_type);
              } // push them so that dropdown bar is updated

              if (auto_select_first) {
                if (self.house_type_selected === 'All') { // Auto selects a valid location other than All
                  for (let house_type of house_types) {
                    if (house_type !== 'All') {
                      self.house_type_selected = house_type;
                      break;
                    }
                  }
                  self.getHousePrice();
                }
              }
            }
          }
        );
      },
      updateLocations: function () {
        const house_type_selected = this.house_type_selected;
        let self = this;
        $.ajax(GITRAW + "Python/room_types/" + house_type_selected + ".json", {
            async: true, success: function (res) {
              self.locations = []; // clear original dropdown bar
              const locations = JSON.parse(res);
              for (let location of locations) {
                self.locations.push(location);
              } // push them so that dropdown bar is updated
            }
          }
        );
      },
      getHousePrice: function (e=null) {
        if (e !== null) {
          e.preventDefault();
        }
        if (this.location_selected === 'All') { // Auto selects a valid location other than All
          for (let location of this.locations) {
            if (location !== 'All') {
              this.location_selected = location;
              break;
            }
          }
        }
        if (this.house_type_selected === 'All') {
          this.updateHouseTypes(true);
        }


        let self = this;
        let data = JSON.stringify(false);
        let xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (Math.floor(this.status/100) === 5) { // internal server error status
            console.log("API server down. Using some random value as dummy values");
            self.house_price = Math.floor(Math.random() * 200000 + 600000);

            self.saveToFireBase();
            self.getLoanDetails(self.prepMoneySmartURL());
            return; //terminates so that it does not keep waiting for its status
          }
          if (this.readyState === this.DONE) {
            let house_price = JSON.parse(this.responseText);
            house_price = parseInt(house_price['housePrice'][0]['price']);
            self.house_price = house_price;
            self.saveToFireBase();
            self.getLoanDetails(self.prepMoneySmartURL());
          } else {
            // self.house_price = 800000; // dummy filler for now (because their API is down)
          }
        });

        const request_text = this.prepareApiInputsHousePrice(this.location_selected, this.house_type_selected); // In case if they put All or All in any of the dropdown
        if (request_text === " ")
          return;
        // console.log(request_text);

        xhr.open("GET", "https://microservice.dev.bambu.life/api/generalCalculator/houseCostCalculatorV2s/getHousePrice?" + request_text);

        xhr.send(data);
      },
      prepareApiInputsHousePrice: function (location_selected, house_type_selected) {
        let housing = house_type_selected.split(" ");
        if (location_selected === 'All' || housing[0] === 'All')
          return " "; // If you really want to put error message, you can put here
        // Process the housing picked
        if (housing[0] !== 'Executive') {
          housing[0] = housing[0][0].toLowerCase() + housing[0].substr(1);
        }
        if (housing[1] !== 'HDB') {
          housing[1] = housing[1][0].toLowerCase() + housing[1].substr(1);
        }
        // Process the location picked
        location_selected = location_selected.replace(/ /g, "%20");

        return "country=Singapore&locationInput=" + location_selected + "&houseTypeInput=" + housing[1] + "&roomTypeInput=" + housing[0];
      },
      prepMoneySmartURL: function () {
        let amount = this.house_price;
        let years = this.loan_period;
        amount = amount.toLocaleString().replace(/,/g, '%2C');
        return 'https://cors-anywhere.herokuapp.com/' + "https://www.moneysmart.sg/ajax/singlewiz/getSingleWizTableData?channel=home-loan&channelSlug=home-loan&page=1&sort=&order=&limit=50&filters%5Bloan_amount%5D=" + amount + "&filters%5Bloan_tenure_unit%5D=years&filters%5Bloan_tenure%5D=" + years;
      },
      getLoanDetails: function (url) {
        let data = JSON.stringify(false);
        let xhr = new XMLHttpRequest();
        let self = this;
        let loan_period = this.loan_period;
        // xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === this.DONE) {
            let loan_info = JSON.parse(this.responseText);
            const compiled_bank_info = self.parseBankHtml(loan_info.content, loan_period);
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
          }
        });

        xhr.open("GET", url);
        xhr.send(data);
      },
      parseBankHtml: function (html, loan_period) {
        let compiled_bank_details = {};
        let bank_chunk_list = this.getElements(html, ".filters-table-title");
        let bank_list = [];
        let rate_list = [];
        let instalment_list = [];
        let rate_chunk_list = this.getElements(html, ".rate");
        let instalment_chunk_list = this.getElements(html, ".instalment");
        for (let [idx, bank] of Object.entries(bank_chunk_list)) {
          let bank_name = bank.replace('/↵/g', '').replace(/(^\s+|\s+$)/g, '').split(' ')[0];
          if (bank_name === "Standard") bank_name = "Standard Chartered"; // cant find any ways to work around it
          if (!bank_list.includes(bank_name)) {
            bank_list.push(bank_name);
            rate_list.push(this.getElements(rate_chunk_list[idx], "b")[0]);
            instalment_list.push(this.getElements(instalment_chunk_list[idx], "b")[0]);
          }
        }
        for (const [idx, bank] of Object.entries(bank_list)) {
          let bank_details = {};
          bank_details["monthly_repay"] = parseInt(instalment_list[idx].replace(/,/g, "").replace(/\$/g, ""));
          bank_details["interest_rate"] = parseFloat(rate_list[idx].replace(/%/g, ""));
          bank_details["loan_period"] = loan_period;
          compiled_bank_details[bank] = bank_details;
        }

        return compiled_bank_details;
      },
      getElements: function (html, selector) {
        let div = document.createElement("div"); // the container element
        div.innerHTML = html; // set it's html to 'html'
        let elems = div.querySelectorAll(selector); // select the elements that match the CSS selector 'selector'
        // return their outerHTML (elems is an array like object so map is not defined thus we have to call it in this way)
        return Array.prototype.map.call(elems, function (e) {
          return e.innerHTML;
        });
      },
      handleAfterChangeBank(event, slick, currentSlide) {
        this.selectedBank_idx = currentSlide;
      },
      printSelectedBank: function () {
        let self = this;
        const plan_id = this.plan_id;
        this.saved_bank_details = true;
        // Save all bank details into the variables
        // Then save into firebase
        this.saveToFireBase().then(function () {
          // push user to next page after saving
          self.$router.push({name: 'Car', params: {plan_id}});
        }).catch(function (err) {
          console.log(err);
        });
      },
      loadSavedHousingInformation: function() {
        let self = this;
        this.loadPlanFromFireBase(this.user_id, this.plan_id).then(
          function(res) {
            const overall_data = res.data()[self.currentState];
            self.currentStatus = overall_data.status;
            const housing_data = overall_data[self.currentState + '_data'];
            if (housing_data !== undefined) {
              self.location_selected = housing_data.location;
              self.house_type_selected = housing_data.houseType;
              self.house_price = housing_data.housePrice;
              // self.saved_bank_details = housing_data.loanBool;
            }

          }
        ).catch( function (err) { // redirects if such plan does not exist
            console.log(err);
            self.$router.push('/dashboard');
          }
        )
      }
    },
    updated() {
      this.$nextTick(function () {
        if (this.show_bank_details === 1) {
          this.show_bank_details = 2;
          this.$refs.bank_details_slider.reSlick();
        }
      });
    },
    computed: {
      saved_data: function () {
        return {
          location: this.location_selected,
          houseType: this.house_type_selected,
          housePrice: this.house_price,
          loanBool: this.saved_bank_details,
          selectedBank: this.selected_bank,
          interestRate: this.interest_rate,
          monthlyRepay: this.monthly_repay,
          loanPeriod: this.picked_loan_period
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
      picked_loan_period: function() {
        if (this.selectedBank_idx !== -1 ) {
          return this.all_bank_details[this.selected_bank].loan_period;
        } else return 0;
      }
    }
  }

</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }

  #house_info {
    background-color: #BFB2BF;
    height: 100%;
    padding-top: 1%;
    padding-bottom: 1%;
  }

  #house_info div {
    margin-bottom: 0;
  }

  #house_info p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;
    margin: 1% 0 0;
  }

  .info_text {
    text-align: right;
  }

  #house_price {
    text-align: left;
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

  div.input-field {
    margin: 0;
  }

  .input-field > select {
    font-family: 'Calibri';
    font-weight: bold;
  }

  .infoWindow_title {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.2rem;
    margin: 3%;
  }

  #house_info > .row {
    margin-bottom: 1%;
  }

  #loan_period {
    background-color: whitesmoke;
    text-align: center;
    width: 50%;
    color: #FF39E5;
    border-radius: 5px;
  }

  #loan_period_container {
    width: 100%;
    text-align: center;
  }

  #loan_slider {
    border: #97CAEC solid 3px;
  }

  #loan_slider_p {
  }

  input[type=range]::-webkit-slider-thumb {
    background-color: #272A43;
  }

  input[type=range]::-moz-range-thumb {
    background-color: #272A43;
  }

  input[type=range]::-ms-thumb {
    background-color: #272A43;
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


  .card {
    min-height: 320px;
  }

  .card-action {
    width: 100%;
    position: absolute;
    bottom: 0;
  }


</style>
