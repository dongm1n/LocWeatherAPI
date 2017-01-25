$(document).ready(function() {
  getLocation();

  // add a spinner icon to areas where data will be populated
  $('#condition').html('<i class="fa fa-spinner fa-pulse fa-3x"></i>');
  $('#wind-speed').html('<i class="fa fa-spinner fa-pulse fa-3x"></i>');
});

function getLocation() {
  // Using the GEO IP API due to HTTP restrictions from OpenWeatherMap
  $.getJSON('https://freegeoip.net/json/?callback=?', function(loc) {
    $('#city').text(loc.city + ', ' + loc.region_name + ', ' + loc.country_name);
    getWeather(loc.latitude, loc.longitude, loc.country_code);
  })
  .fail(function(err) {
    getWeather();
  });
}

function getWeather(lat, lon, countryCode) {
  var weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
    lat + '&lon=' + lon + '&units=imperial' + '&type=accurate' + callback;
  if(window.location.protocol === 'https:') weatherAPI = 'https://cors-anywhere.herokuapp.com/' + weatherAPI
  $.getJSON(weatherAPI, function(weatherData) {
      // Also used by convert();
      temp = weatherData.main.temp.toFixed(0);
      tempC = ((temp - 32) * (5 / 9)).toFixed(0);

      var condition = weatherData.weather[0].description,
        id = weatherData.weather[0].id,
        speed = Number((weatherData.wind.speed * 0.86897624190816).toFixed(1)),
        deg = weatherData.wind.deg,
        windDir,
        iconClass,
        bgIndex,
        backgroundId = [299, 499, 599, 699, 799, 800],
        backgroundIcon = [
          'thunderstorm',
          'sprinkle',
          'rain',
          'snow',
          'fog',
          'night-clear',
          'cloudy',
        ],
        backgroundImg = [
          'http://tylermoeller.github.io/local-weather-app/assets/img/thunderstorm.jpg',
          'https://tylermoeller.github.io/local-weather-app/assets/img/sprinkle.jpg',
          'https://tylermoeller.github.io/local-weather-app/assets/img/rain.jpg',
          'https://tylermoeller.github.io/local-weather-app/assets/img/snow.jpg',
          'https://tylermoeller.github.io/local-weather-app/assets/img/fog.jpg',
          'https://tylermoeller.github.io/local-weather-app/assets/img/clear.jpg',
          'https://tylermoeller.github.io/local-weather-app/assets/img/cloudy.jpg',
        ];

      backgroundId.push(id);
      bgIndex = backgroundId.sort().indexOf(id);
      $('body').css('background-image', 'url(' + backgroundImg[bgIndex] + ')');
      iconClass = backgroundIcon[bgIndex];

      //Get wind compass direction. If API returns null, assume 0 degrees.
      if (deg) {
        var index = Math.floor((deg / 22.5) + 0.5) % 16,
          compassDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
            'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
          ],
          windDir = compassDirections[index];

      } else {
        windDir = 'N';
      }

      //determine F or C based on country and add temperature to the page.
      var fahrenheit = ['US', 'BS', 'BZ', 'KY', 'PL'];
      if (fahrenheit.indexOf(countryCode) > -1) {
        $('#temperature').text(temp + '¡Æ F');
      } else {
        $('#temperature').text(tempC + '¡Æ C');
      }

      //write final weather conditions and wind information to the page
      $('#wind-speed').html(
        '<i class="wi wi-wind wi-from-' + windDir.toLowerCase() + '"></i><br>' +
        windDir + ' ' + speed + ' knots');
      $('#condition').html(
        '<i class="wi wi-' + iconClass + '"></i><br>' + condition);
    })
    .fail(function(err) {
      alert('There was an error retrieving your weather data. \n' +
        'Please try again later.');
    });
}

//toggle between celsius / fahrenheit
$('#convert-button').click(function() {
  if ($('#temperature').text().indexOf('F') > -1) {
    $('#temperature').text(tempC + '¡Æ C');
  } else {
    $('#temperature').text(temp + '¡Æ F');
  }

  this.blur(); // remove focus from the button
});



var callback = '&APPID=9b67d777fb8343a987c5f7c6a2ed149b';