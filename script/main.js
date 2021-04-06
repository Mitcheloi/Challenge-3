// Set api token for mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZW1tYS1tIiwiYSI6ImNrbWtsOGYwZDEyNDYyeG1xaG52bTJ0OTgifQ.FC0AL2WhxSFsxbV8ejH51Q';

// api token for openWeatherMap
var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = 'f57233de29c501a132e63d0a308debab';

// Determine cities
var city = [
  {
    name: 'Vranje',
    coordinates: [21.900270, 42.545033]
  },
  {
    name: 'Subotica',
    coordinates: [19.667587, 46.100376]
  },
  {
    name: 'Novi Sad',
    coordinates: [19.833549, 45.267136]
  },
  {
    name: 'Belgrado',
    coordinates: [20.457273, 44.787197]
  },
  {
    name: 'Nis',
    coordinates: [21.90333, 43.32472]
  },
  {
    name: 'Kragujevac',
    coordinates: [20.91667, 44.01667]
  },
];

console.log(city[3]);

// Initiate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: [20.437273, 44.787197],
  zoom: 9
});

// EXTRA TEKST ONDER DE LANDEN
map.on('load', function () {
map.setLayoutProperty('country-label', 'text-field', [
'format',
['get', 'name_en'],
{ 'font-scale': 1.2 },
'\n',
{},
['get', 'name'],
{
'font-scale': 0.8,
'text-font': [
'literal',
['DIN Offc Pro Italic', 'Arial Unicode MS Regular']
]
}
]);
});


// get weather data and plot on map
map.on('load', function () {
  city.forEach(function(city) {
    // Usually you do not want to call an api multiple times, but in this case we have to
    // because the openWeatherMap API does not allow multiple lat lon coords in one request.
    var request = openWeatherMapUrl + '?' + 'appid=' + openWeatherMapUrlApiKey + '&lon=' + city.coordinates[0] + '&lat=' + city.coordinates[1];

    // Get current weather based on cities' coordinates
    fetch(request)
      .then(function(response) {
        if(!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(function(response) {
        // Then plot the weather response + icon on MapBox
        plotImageOnMap(response.weather[0].icon, city)
      })
      .catch(function (error) {
        console.log('ERROR:', error);
      });
  });
});

function plotImageOnMap(icon, city) {
  map.loadImage(
    'http://openweathermap.org/img/w/' + icon + '.png',
    function (error, image) {
      if (error) throw error;
      map.addImage("weatherIcon_" + city.name, image);
      map.addSource("point_" + city.name, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: city.coordinates
            }
          }]
        }
      });
      map.addLayer({
        id: "points_" + city.name,
        type: "symbol",
        source: "point_" + city.name,
        layout: {
          "icon-image": "weatherIcon_" + city.name,
          "icon-size": 1.3
        }
      });
    }
  );
}



var input = {
    "lat": "50.2111",
    "lon": "134.1233"
};




var popupMelding = new Array ();

function getAPIdata(lat, lon, locatie) {
// construct request
var request = 'http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + openWeatherMapUrlApiKey;

// get current weather
fetch(request)
// parse to JSON format
.then(function(response) {
if(!response.ok) throw Error(response.statusText);
return response.json();
})
// render weather per day
.then(function(response) {
// render weatherCondition
onAPISucces(response, locatie);
})
// catch error
.catch(function (error) {
onAPIError(error);
});
}

function onAPISucces(response, locatie) {
// get type of weather in string format
var wind = response.wind.speed;

// get temperature in Celcius
var degC = Math.floor(response.main.temp - 273.15);

// render weather in DOM
popupMelding[locatie] =  wind;
}

function onAPIError(error) {
console.error('Request failed', error);
}


getAPIdata(19.8026367894, 45.7736435721, 0);
getAPIdata(20.93231, 44.66278, 1);
getAPIdata(21.94611, 42.99806, 2);


// GEOCODER
document.getElementById('locatie1').addEventListener('click', function () {
// Fly to a random location by offsetting the point -74.50, 40
// by up to 5 degrees.
if (popupMelding[0] <= 4){
  var popup1 = new mapboxgl.Popup().setHTML('<h3 id="introtekst">De windsnelheid in Noord Servi&#235; is ' + popupMelding[2] + ' meter per seconde.</h3><p id="veilig"> Het is veilig om te landen.</p>');

} else {
  var popup1 = new mapboxgl.Popup().setHTML('<h3 id="introtekst">De windsnelheid in Noord Servi&#235; is ' + popupMelding[2] + ' meter per seconde.</h3><p id="gevaarlijk"> Dit is niet veilig om te landen.</p>');
}

var marker1 = new mapboxgl.Marker({color: "#2c2e5c"})
.setLngLat([19.8026367894, 45.7736435721])
.setPopup(popup1)
.addTo(map);

map.flyTo({
center: [19.8026367894, 45.7736435721],
essential: true // this animation is considered essential with respect to prefers-reduced-motion
});
});

document.getElementById('locatie2').addEventListener('click', function () {
// Fly to a random location by offsetting the point -74.50, 40
// by up to 5 degrees.

if (popupMelding[1] <= 4){
  var popup2 = new mapboxgl.Popup().setHTML('<h3 id="introtekst">De windsnelheid in Noord Servi&#235; is ' + popupMelding[2] + ' meter per seconde.</h3><p id="veilig"> Het is veilig om te landen.</p>');

} else {
  var popup2 = new mapboxgl.Popup().setHTML('<h3 id="introtekst">De windsnelheid in Noord Servi&#235; is ' + popupMelding[2] + ' meter per seconde.</h3><p id="gevaarlijk"> Dit is niet veilig om te landen.</p>');
}

var marker2 = new mapboxgl.Marker({color: "#2c2e5c"})
.setLngLat([20.93231, 44.66278])
.setPopup(popup2)
.addTo(map);


map.flyTo({
center: [20.93231, 44.66278],
essential: true // this animation is considered essential with respect to prefers-reduced-motion
});
});

document.getElementById('locatie3').addEventListener('click', function () {
// Fly to a random location by offsetting the point -74.50, 40
// by up to 5 degrees.

if (popupMelding[2] <= 4){
  var popup3 = new mapboxgl.Popup().setHTML('<h3 id="introtekst">De windsnelheid in Noord Servi&#235; is ' + popupMelding[2] + ' meter per seconde.</h3><p id="veilig"> Het is veilig om te landen.</p>');

} else {
  var popup3 = new mapboxgl.Popup().setHTML('<h3 id="introtekst">De windsnelheid in Noord Servi&#235; is ' + popupMelding[2] + ' meter per seconde.</h3><p id="gevaarlijk"> Dit is niet veilig om te landen.</p>');
}

var marker3 = new mapboxgl.Marker({color: "#2c2e5c"})
.setLngLat([21.94611, 42.99806])
.setPopup(popup3)
.addTo(map);


map.flyTo({
center: [21.94611, 42.99806],
essential: true // this animation is considered essential with respect to prefers-reduced-motion
});
});