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


// Function for the circles returning colors based on depth
function colorDisplay(depth) {
  if (depth > -10 && depth < 10) {
      return "#E0FFFF"
  }else if (depth >= 10 && depth < 30) {
      return "#FFB6C1"
  }else if (depth >= 30 && depth < 50) {
      return "#6495ED"
  }else if (depth >= 50 && depth < 70) {
      return "#00008B"
  }else if (depth >= 70 && depth < 90) {
      return "#A52A2A"
  }else {
      return "#8A2BE2"}
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
