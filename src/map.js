var kml_to_locations;
var map;
var select_region_markers = [];
var info_markers = [];

jQuery.ajax(GITRAW + "Python/google_map/" + "kml_to_locations.json", {
  async: false, success: function (kml_location_JSON) {
    kml_to_locations = kml_location_JSON;
    if (!LOCALISED) {
      kml_to_locations = JSON.parse(kml_location_JSON);
    }
    // console.log(kml_to_locations);
    // console.log(typeof kml_to_locations);
  }});

function initMap() {
  var mapDiv = document.getElementById('map');
  // Bounds for Singapore
  var allowedBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(1.2310071515725387, 103.59436081438548),
    new google.maps.LatLng(1.4712844146613928, 104.11023204991352));
  var minZoomLevel = 11;
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: minZoomLevel,
    center: {lat: 1.290270, lng: 103.851959},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var kmlLayer = new google.maps.KmlLayer({
    url: 'https://sites.google.com/site/sgzonemapkml/home/kml/version0.04.kml',
    preserveViewport: true,
    suppressInfoWindows: true,
    map: map
  });

  // Listen for the dragend event
  google.maps.event.addListener(map, 'dragend', function () {
    if (allowedBounds.contains(map.getCenter())) return;

    // Out of bounds - Move the map back within the bounds
    var c = map.getCenter(),
      x = c.lng(),
      y = c.lat(),
      maxX = allowedBounds.getNorthEast().lng(),
      maxY = allowedBounds.getNorthEast().lat(),
      minX = allowedBounds.getSouthWest().lng(),
      minY = allowedBounds.getSouthWest().lat();

    if (x < minX) x = minX;
    if (x > maxX) x = maxX;
    if (y < minY) y = minY;
    if (y > maxY) y = maxY;

    map.setCenter(new google.maps.LatLng(y, x));
  });

  // Limit the zoom level
  google.maps.event.addListener(map, 'zoom_changed', function () {
    if (map.getZoom() < minZoomLevel)
      map.setZoom(minZoomLevel);
  });

  google.maps.event.addListener(kmlLayer, 'click', openIW);
  // google.maps.
  // google.maps.event.addListener(kmlLayer, "mouseover" ,function(layerEvt){
  //     console.log("test");
  //     layerEvt.featureData.setOptions({fillColor: "#00FF00"});
  // });
}

function organise_marker_text(data_lst) {
  var house_types_groups = {};
  jQuery.each(data_lst, function (i, item) {
    if (item !== 'All') {
      const house_type = item.split(' ')[1];
      const house_info = item.split(' ')[0];
      if (Object.keys(house_types_groups).indexOf(house_type) === -1) {
        house_types_groups[house_type]  = [house_info];
      } else {
        house_types_groups[house_type].push(house_info);
      }
    }
  });
  var return_msg = "";
  Object.keys(house_types_groups).forEach(function (key) {
    const value = house_types_groups[key];
    return_msg += key + ": ";
    value.forEach(function (valueB) {
      return_msg += valueB + " | "
    });
    return_msg = return_msg.slice(0, -2) + "<br>";
  });
  return return_msg.slice(0, -4);

}

// Choose location from dropdown menu and the location is picked on the map for you
function location_dropdown_to_kml(location) {
  const key_array = Object.keys(kml_to_locations);
  for (var idx = 0; idx < key_array.length; idx++) { // loop around the variable, because you have to find a match with the location, which is the key
    if (Object.keys(kml_to_locations[key_array[idx]]).indexOf(location) !== -1) { // means the location in this kml region
      // Close all info window
      info_markers.forEach(function (element) {
        element.close();
      });
      // Reset all the markers first
      select_region_markers.forEach(function (element, idx) {
        element.setMap(null);
        select_region_markers[idx].setMap(null);
      });
      select_region_markers = [];
      info_markers = [];
      // Create the one and only marker
      const myLatlng = new google.maps.LatLng(kml_to_locations[key_array[idx]][location][1], kml_to_locations[key_array[idx]][location][0]);
      let marker = new google.maps.Marker({ // let is used so that the variable is local inside the loop
        position: myLatlng,
        title: location // The name of the location
        // setMap : map
        // map: map
        // icon: iconBase + 'parking_lot_maps.png' // for customising the landmarks
      });
      let info_window;
      jQuery.ajax(GITRAW + "Python/house_locations/" + location + ".json", {
        async: false, success: function (houses) {
          if (!LOCALISED) {
            houses = JSON.parse(houses);
          }
          const housing_selector = '<select name="Housing" class="housing"></select>';
          const get_price_selector = '<input name="House Price" type="button" value="Get Price" onclick="get_house_price()">';
          const loan_period_selector = 'Loan Period: <input type="text" class="loan_period" readonly style="border:0; color:#f6931f; font-weight:bold;">\n' +
            '<div class="slider-range-loan_period"></div>';
          info_window = new google.maps.InfoWindow({
            content: "<b>" + location + "</b><br>" + "Houses Available:<br>" + organise_marker_text(houses) + "<br>" + housing_selector + get_price_selector + loan_period_selector
          });
        }
      });

      const val_idx = idx;
      jQuery.ajax(GITRAW + "Python/house_locations/" + location + ".json", {
        async: true, success: function (houses) {
          const housing_original_value = jQuery('#housing').val();
          jQuery('.housing')
            .find('option')
            .remove()
            .end();
          if (!LOCALISED) {
            houses = JSON.parse(houses);
          }
          jQuery.each(houses, function (i, item) {
            jQuery('.housing').append(jQuery('<option>', {
              value: item,
              text: item
            }));
          });
          jQuery('.housing').val(housing_original_value);
          housing_on_change(); // new update on_change_housing event for all the dropdown menu of house_types
        }
      });
      map.setCenter(myLatlng);
      marker.setMap(map);
      select_region_markers.push(marker);
      info_markers.push(info_window);
      info_window.open(map, marker);
      update_slider_loan_period(); // update for the slider also

    }
  }
}

function openIW(layerEvt) {
  if (layerEvt.row) {
    var content = layerEvt.row['admin'].value;
  } else if (layerEvt.featureData) {
    var content = layerEvt.featureData.name;
  }

  // console.log(content);
  // console.log(layerEvt.latLng.lat());
  if (Object.keys(kml_to_locations).indexOf(content) !== -1) {
    // Means the click kml point is a valid entry
    if (Object.keys(kml_to_locations[content]).length > 0) {
      // Means there is at least one valid  location in the kml region
      select_region_markers.forEach(function (element, idx) {
        element.setMap(null);
        select_region_markers[idx].setMap(null);
      });
      select_region_markers = [];
      info_markers = [];
      for (var idx = 0; idx < Object.keys(kml_to_locations[content]).length; idx++) {
        //Now need to create a landmark on each valid point
        // var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        // console.log(kml_to_locations[content][Object.keys(kml_to_locations[content])[idx]][1]);
        const myLatlng = new google.maps.LatLng(kml_to_locations[content][Object.keys(kml_to_locations[content])[idx]][1],kml_to_locations[content][Object.keys(kml_to_locations[content])[idx]][0]);
        let marker = new google.maps.Marker({ // let is used so that the variable is local inside the loop
          position: myLatlng,
          title: Object.keys(kml_to_locations[content])[idx] // The name of the location
          // setMap : map
          // map: map
          // icon: iconBase + 'parking_lot_maps.png' // for customising the landmarks
        });
        let info_window;
        jQuery.ajax(GITRAW + "Python/house_locations/" + Object.keys(kml_to_locations[content])[idx] + ".json", {
          async: false, success: function (houses) {
            if (!LOCALISED) {
              houses = JSON.parse(houses);
            }
            const housing_selector = '<select name="Housing" class="housing"></select>';
            const get_price_selector = '<input name="House Price" type="button" value="Get Price" onclick="get_house_price()">';
            const loan_period_selector = 'Loan Period: <input type="text" class="loan_period" readonly style="border:0; color:#f6931f; font-weight:bold;">\n' +
              '<div class="slider-range-loan_period"></div>';
            info_window = new google.maps.InfoWindow({
              content: "<b>" + Object.keys(kml_to_locations[content])[idx] + "</b><br>" + "Houses Available:<br>" + organise_marker_text(houses) + "<br>" + housing_selector + get_price_selector + loan_period_selector
            });
          }});

        const val_idx = idx;
        marker.addListener('click', function() {
          info_markers.forEach(function (element) {
            element.close();
          });
          jQuery.ajax(GITRAW + "Python/house_locations/" + Object.keys(kml_to_locations[content])[val_idx] + ".json", {
            async: true, success: function (houses) {
              jQuery('.housing')
                .find('option')
                .remove()
                .end();
              if (!LOCALISED) {
                houses = JSON.parse(houses);
              }
              jQuery.each(houses, function (i, item) {
                jQuery('.housing').append(jQuery('<option>', {
                  value: item,
                  text : item
                }));
              });
              jQuery('.housing').val("All");
              housing_on_change(); // new update on_change_housing event for all the dropdown menu of house_types
            }
          });
          jQuery.ajax(GITRAW + "Python/room_types/" + "All" + ".json", {
            async: true, success: function (location) {
              if (!LOCALISED) {
                location = JSON.parse(location);
              }
              jQuery.each(location, function (i, item) {
                jQuery('#location').append(jQuery('<option>', {
                  value: item,
                  text: item
                }));
              });
              jQuery('#location').val(Object.keys(kml_to_locations[content])[val_idx]);
            }
          });
          info_window.open(map, marker);
          update_slider_loan_period(); // update for the slider also
        });
        marker.setMap(map);
        select_region_markers.push(marker);
        info_markers.push(info_window);

      }
    }
  }

}




