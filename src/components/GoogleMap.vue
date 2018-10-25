<template>
  <div>
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
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
  export default {
    name: "GoogleMap",
    data() {
      return {
        // default to Montreal to keep it simple
        // change this to whatever makes sense
        center: {lat: 1.290270, lng: 103.851959},
        zoom: 11,
        markers: [],
        places: [],
        currentPlace: null,
        map: null
      };
    },

    mounted() {
      this.geolocate();
      this.test();
      // this.map = $(this.$refs.myMap).$mapObject;
      // let self = this;
      // this.$refs.myMap.$mapPromise.then(() => {
      //   self.kml = new google.maps.KmlLayer(
      //     {url: 'https://sites.google.com/site/sgzonemapkml/home/kml/version0.04.kml'}
      //   );
      //   self.kml.setMap(self.$refs.gmap.$mapObject)
      //
      // });

    },

    methods: {
      // receives a place object via the autocomplete component
      setPlace(place) {
        this.currentPlace = place;
      },
      addMarker() {
        if (this.currentPlace) {
          const marker = {
            lat: this.currentPlace.geometry.location.lat(),
            lng: this.currentPlace.geometry.location.lng()
          };
          this.markers.push({position: marker});
          this.places.push(this.currentPlace);
          this.center = marker;
          this.currentPlace = null;
        }
      },
      geolocate: function () {
        navigator.geolocation.getCurrentPosition(position => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        });
      },
      test: function() {
        let self = this;
        console.log((this.$refs.myMap));
        this.$refs.myMap.$mapPromiseDeferred.resolve(
          function() {
            var options = {
              // NOTE: may only work if zoom and center are already set
              preserveViewport: true,
              clickable: false,
              visibility: "visible",
              // version without embedded PNG legend on left:
              url: 'https://sites.google.com/site/sgzonemapkml/home/kml/version0.04.kml'
            };
            self.kml = new google.maps.KmlLayer(options);
            self.kml.setMap(self.$refs.map.$mapObject);
          });
      }
    }
  };
</script>
