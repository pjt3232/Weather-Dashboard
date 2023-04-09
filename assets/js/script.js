$(document).ready(function() {

    function displayCurrentWeather(city) {
        apiKey = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=";
        queryUrl = "api.openweathermap.org/data/2.5/forecast?" + city + "&appid=" + apiKey + "&units=metric";

        $.ajax({
            url: queryUrl,
            method: "GET"
        }) .then(function(response) {
            console.log(response);
            var currentDateTime = dayjs().format("dddd, MMMM D, YYYY h:mm A");
            var currentWeatherCard = $("<div>").addClass("card current-weather-card");
            var currentWeatherCardBody = $("<div>").addClass("card-body");
            var cityNameEl = $("<h2>").addClass("card-title").text(response.name);
            var currentDateTimeEl = $("<h3>").addClass("card-subtitle mb-2 text-muted").text(currentDateTime);   
            currentWeatherCardBody.append(cityNameEl, currentDateTimeEl);

            var weatherIconCode = response.weather[0].icon;
            var weatherIconUrl = "https://openweathermap.org/img/w/" + weatherIconCode + ".png";
            var weatherIconEl = $("<img>").addClass("weather-icon").attr("src", weatherIconUrl);
            currentWeatherCardBody.append(weatherIconEL);
 
            var temperatureEl = $("<p>").addClass("card-text").html("<strong>Temperature: </strong>" + response.main.temp + " &deg;C");
            var humidityEl = $("<p>").addClass("card-text").html("<strong>Humidity: </strong>" + response.main.humidity + "%");
            var windSpeedEl = $("<p>").addClass("card-text").html("<strong>Wind Speed: </strong>" + response.wind.speed + " m/s");
            currentWeatherCardBody.append(temperatureEl, humidityEl, windSpeedEl);

            currentWeatherCard.append(currentWeatherCardBody);
            $("#current-weather").empty().append(currentWeatherCard);

            saveCityToLocalStorage(city);
            updateSearchHistory();
        });
    }
    
    function displayForecas(city) {
        apiKey = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=";
        queryUrl = "api.openweathermap.org/data/2.5/forecast?" + city + "&appid=" + apiKey + "&units=metric";

        $.ajax({
            url: queryUrl,
            method: "GET"
        }) .then(function(response) {
            console.log(response);
            var forecastCardDeck = $("<div>").addClass("card-deck forecast-card-deck");

            for(var i = 0; i <response.list.length; i++) {
                
            }
        })
    }
})