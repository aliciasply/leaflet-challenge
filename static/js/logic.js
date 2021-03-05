// Creating map object
var myMap = L.map("map", {
    center: [37.7749, -122.4194], //San Francisco Coordinates
    zoom: 3,
  });
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

  
// I picked the summary data of a 2.5 months (M2.5+ Earthquakes)
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson";
// console.log(url);


function colorDisplay(depth){
  if (depth > 90) return "purple";
  else if (depth > 70) return "Red";
  else if (depth > 50) return "Orange";
  else if (depth > 30) return "blue";
  else if (depth > 10) return  "Yellow";
  else if (depth < 10) return "pink";
  else return "green";
};


// Grab data with d3 and read it
d3.json(url, function(data) {
  console.log(data);
  console.log(data.features);

  // Create geoJSON layer to be applied to the map
  L.geoJSON(data, {

      // Defines what to do with each point in JSON
      pointToLayer: function (feature, latlng) {

          var depth = feature.geometry.coordinates[2]
          var mag = feature.properties.mag

          // Circle marker applied for each feature
          return L.circleMarker(latlng, {
              color: "blue", // the color of each circle

              // Show the fill color based on the depth 
              fillColor: colorDisplay(depth),
              fillOpacity: .9, 
              radius: mag * 4,
              weight: 1,
        })
      },
      // Create the function to show full information about the earth quake. 
      onEachFeature: function(feature, layer) {
          layer.bindPopup("<b>Location:</b> " + feature.properties.place + "<br><b>Magnitude:</b> " + feature.properties.mag +
           "<br><b>Depth:</b> " + feature.geometry.coordinates[2] + "<br><b>Time:</b> " + new Date(feature.properties.time));
        },
    
      // 
  // Add entire geoJSON layer to map
  }).addTo(myMap);
  

});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        depth = ["-10", "10", "30", "50", "70", "90"],
        color = ["pink", "green", "yellow", "blue", "orange", "red"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorDisplay(depth[i]) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
