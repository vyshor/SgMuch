<template>
  <div>
    <logo_dashboard></logo_dashboard>
    <navbar_dashboard></navbar_dashboard>
    <progressbar v-bind:currentState="currentState"></progressbar>
    <nextbar v-bind:info="{currentState, path}"></nextbar>
    <div class="row" id="dashboard_main">
      <div id="google_map_container" class="col l5 push-l1">
        <GoogleMap></GoogleMap>
      </div>
      <div id="income_info" class="col l4 push-l2">
        <div class="row">
          <p class="col l6 info_text">Annual Income:</p>
          <p class="col l6" id="annual_income"></p>
        </div>
        <div class="row">
          <p class="col l6 info_text">Income Tax:</p>
          <p class="col l6" id="income_tax"></p>
        </div>
        <div class="row">
          <p class="col l6 info_text">Net Income:</p>
          <p class="col l6" id="net_income"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import logo_dashboard from "../dashboard/logo_dashboard";
  import navbar_dashboard from "../dashboard/navbar_dashboard";
  import progressbar from "../dashboard/progressbar";
  import nextbar from "../dashboard/nextbar";
  import GoogleMap from "../GoogleMap";

  let GITRAW = "https://raw.githubusercontent.com/vyshor/university_expense/master/";

  export default {
    components: {
      GoogleMap,
      'logo_dashboard': logo_dashboard,
      'navbar_dashboard': navbar_dashboard,
      'progressbar': progressbar,
      'nextbar': nextbar
    },
    data() {
      return {
        currentState: "housing",
        uni_checked: false,
        monthly_income: 0,
        uni_selected: 'NUS',
        course_selected: 'Architecture',
        path: ['/dashboard/car', '/dashboard/income', '/dashboard/car'],
        // All the data need for GoogleMaps
        kml_to_locations: null,
        map: null,
        select_region_markers: [],
        info_markers: []

    }
    },
    methods: {
      // initMap: function () {
      //   let map = this.map;
      //   var mapDiv = document.getElementById('map');
      //   // Bounds for Singapore
      //   var allowedBounds = new google.maps.LatLngBounds(
      //     new google.maps.LatLng(1.2310071515725387, 103.59436081438548),
      //     new google.maps.LatLng(1.4712844146613928, 104.11023204991352));
      //   var minZoomLevel = 11;
      //   this.map = new google.maps.Map(document.getElementById('map'), {
      //     zoom: minZoomLevel,
      //     center: {lat: 1.290270, lng: 103.851959},
      //     mapTypeId: google.maps.MapTypeId.ROADMAP
      //   });
      //
      //   var kmlLayer = new google.maps.KmlLayer({
      //     url: 'https://sites.google.com/site/sgzonemapkml/home/kml/version0.04.kml',
      //     preserveViewport: true,
      //     suppressInfoWindows: true,
      //     map: map
      //   });
      //
      //   // Listen for the dragend event
      //   google.maps.event.addListener(map, 'dragend', function () {
      //     if (allowedBounds.contains(map.getCenter())) return;
      //
      //     // Out of bounds - Move the map back within the bounds
      //     var c = map.getCenter(),
      //       x = c.lng(),
      //       y = c.lat(),
      //       maxX = allowedBounds.getNorthEast().lng(),
      //       maxY = allowedBounds.getNorthEast().lat(),
      //       minX = allowedBounds.getSouthWest().lng(),
      //       minY = allowedBounds.getSouthWest().lat();
      //
      //     if (x < minX) x = minX;
      //     if (x > maxX) x = maxX;
      //     if (y < minY) y = minY;
      //     if (y > maxY) y = maxY;
      //
      //     map.setCenter(new google.maps.LatLng(y, x));
      //   });
      //
      //   // Limit the zoom level
      //   google.maps.event.addListener(map, 'zoom_changed', function () {
      //     if (map.getZoom() < minZoomLevel)
      //       map.setZoom(minZoomLevel);
      //   });
      //
      //   google.maps.event.addListener(kmlLayer, 'click', openIW);
      // },
      // loadCourses: function () {
      //   if (this.uni_checked) {
      //     $.ajax(GITRAW + "Python/uni/" + this.uni_selected + "_courses.json", {
      //       async: true, success: function (fees) {
      //         $('#course')
      //           .find('option')
      //           .remove()
      //           .end();
      //         fees = JSON.parse(fees);
      //         $.each(fees, function (i, item) {
      //           $('#course').append($('<option>', {
      //             value: item,
      //             text: item
      //           }));
      //         });
      //       }
      //     });
      //   }
      // },
      getSalary: function (uni_selected) {
        return Promise.resolve($.ajax(GITRAW + "Python/uni/" + uni_selected + "_cost_salary.json", {
          async: true
        }))
      },
      insertComma: function (str) {
        const strLength = str.length;
        return str.substr(0, strLength - 3) + "," + str.substr(strLength - 3, strLength);
      }
    },
    asyncComputed: {
      async estimated_income() {
        let selected_course = this.course_selected;
        const selected_uni = this.uni_selected;
        const data = await this.getSalary(selected_uni);
        const cost_salary = JSON.parse(data);
        if (cost_salary[selected_course] === undefined) {
          switch (selected_uni) {
            case 'NUS':
              selected_course = 'Architecture';
              this.course_selected = 'Architecture';
              break;
            default:
              selected_course = 'Accountancy';
              this.course_selected = 'Accountancy';
          }
        }
        const estimated_salary = '' + cost_salary[selected_course]["median_salary"];
        return "S$ " + this.insertComma(estimated_salary);
      }
    },
    mounted() {
      // this.initMap();
    }
  }

</script>

<style scoped>
  #dashboard_main {
    margin-bottom: 0;
  }

  #income_info {
    background-color: #BFB2BF;
    height: 100%;
    padding-top: 1%;
    padding-bottom: 1%;
  }

  #income_info div {
    margin-bottom: 0;
  }

  #income_info p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;
    margin: 0;
  }

  .info_text {
    text-align: right;
  }

  #monthly_income_container p {
    font-family: 'Helvetica Rounded';
    font-weight: bold;
    font-size: 1.5rem;
  }

  #monthly_income_field_container p {
    text-align: right;
    margin-top: 1%;
  }

  #calculate_btn {
    font-family: 'Helvetica Rounded';
    text-transform: none;
    font-weight: bold;
    color: #97CAEC;
    background-color: #272A43;
    border: solid 1px #707070;
  }

  #estimate_income_container p {
    text-align: right;
    color: #BFB2BF;
    font-size: 1.5rem;
  }

  #estimated_income {
    text-align: left;
  }
</style>
