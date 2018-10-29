<template>
  <div>

  </div>
</template>

<script>
  let GITRAW = "https://raw.githubusercontent.com/vyshor/university_expense/master/";

  export default {
    name: "GoogleMap",
    data() {
      return {
        center: {lat: 1.290270, lng: 103.851959},
        zoom: 11,
        markers: [],
        places: [],
        currentPlace: null,
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
        infoContent: null,
        infoOpened: false,
        infoCurrentKey: null
      };
    },

    mounted() {
      this.geolocate();
      this.preloadKmlToLocations();
      this.renderKml();
    },

    methods: {
      getPosition: function(marker) {
        return {
          lat: parseFloat(marker.lat),
          lng: parseFloat(marker.lng)
        }
      },
      addMarker(lat, lng, place_name, infotext) {
        const marker = {
          lat: lat,
          lng: lng
        };
        this.markers.push({
          position: marker,
          infoText: infotext
        });
        this.places.push(place_name);
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
        console.log(region_name);
        if (Object.keys(this.kml_to_locations).indexOf(region_name) !== -1) {
          // Means the click kml point is a valid entry
          const region_data = this.kml_to_locations[region_name];
          if (Object.keys(region_data).length > 0) {
            // Means there is at least one valid  location in the kml region
            this.markers = [];
            for (let [key, value] of Object.entries(region_data)) {
              //Now need to create a landmark on each valid point
              this.addMarker(value[1], value[0], key, "hello");

            }
          }
        }
      },
      renderKml: function () {
        let self = this;
        console.log((this.$refs.myMap));
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
            console.log(self.kml_to_locations);
          }
        });
      },
      toggleInfo: function(marker, idx) {
        this.infoPosition = this.getPosition(marker.position);
        this.infoContent = marker.infoText;
        if (this.infoCurrentKey === idx) {
          this.infoOpened = !this.infoOpened;
        } else {
          this.infoOpened = true;
          this.infoCurrentKey = idx;
        }
      }
    }
  };
</script>
