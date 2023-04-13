$(document).ready(function() {

    function displayCurrentWeather(city) {
        apiKey = "f50566f98e836f619d28a18fec37bb50";
        queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

        fetch(queryUrl)

        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
         return response.json();
        }).then(function(response) {
            console.log(response);
            var currentDateTime = dayjs().format("dddd, MMMM D, YYYY h:mm A");
            var currentWeatherCard = $("<div>").addClass("card current-weather-card");
            var currentWeatherCardBody = $("<div>").addClass("card-body");
            var cityNameEl = $("<h2>").addClass("card-title").text(response.city.name);
            var currentDateTimeEl = $("<h3>").addClass("card-subtitle mb-2 text-muted").text(currentDateTime);   
            currentWeatherCardBody.append(cityNameEl, currentDateTimeEl);

            var weatherIconCode = response.list[0].weather[0].icon;
            var weatherIconUrl = "http://api.openweathermap.org/img/w/" + weatherIconCode + ".png";
            var weatherIconEl = $("<img>").addClass("weather-icon").attr("src", weatherIconUrl);
            currentWeatherCardBody.append(weatherIconEl);
 
            var temperature = $("<p>").addClass("card-text").html("<strong>Temperature: </strong>" + response.list[0].main.temp + " ºF");
            var humidity = $("<p>").addClass("card-text").html("<strong>Humidity: </strong>" + response.list[0].main.humidity + "%");
            var windSpeed = $("<p>").addClass("card-text").html("<strong>Wind Speed: </strong>" + response.list[0].wind.speed + " MPH");
            currentWeatherCardBody.append(temperature, humidity, windSpeed);

            currentWeatherCard.append(currentWeatherCardBody);
            $("#current-weather").empty().append(currentWeatherCard);

            saveCityToLocalStorage(city);
            updateSearchHistory();
        });
    }
    
    function displayForecast(city) {
        apiKey = "f50566f98e836f619d28a18fec37bb50";
        queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

        fetch(queryUrl)

        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
         return response.json();
        }).then(function(response) {
            console.log(response);
            forecastList = $("<div>").addClass("row row-grid w-100");
            var forecastCardDeck = $("<div>").addClass("card-deck forecast-card-deck");

            for(var i = 0; i < response.list.length; i+=8) {
                var forecastCard = $("<div>").addClass("card mb-3");
                var forecastCardBody = $("<div>").addClass("card-body");
                var date = new Date(response.list[i].dt * 1000).toLocaleDateString();
                var heading = $("<h5>").addClass("card-title").text(date);

                forecastCardBody.append(heading);

                var iconCode = response.list[i].weather[0].icon;
                var iconUrl = "http://api.openweathermap.org/img/w/" + iconCode + ".png";
                var iconImg = $("<img>").addClass("weather-icon").attr("src", iconUrl);
                forecastCardBody.append(iconImg);

                var temperatureEl = $("<p>").addClass("card-text").html("<strong>Temp: </strong>" + response.list[i].main.temp + " ºF");
                var humidityEl = $("<p>").addClass("card-text").html("<strong>Humidity: </strong>" + response.list[i].main.humidity + "%");
                var windSpeedEl = $("<p>").addClass("card-text").html("<strong>Wind Speed: </strong>" + response.list[i].wind.speed + " MPH");

                forecastCardBody.append(temperatureEl, humidityEl, windSpeedEl);
                forecastCard.addClass("col-12");
                forecastCard.append(forecastCardBody);
                forecastCardDeck.append(forecastCard);
                forecastList.append(forecastCardDeck);
            }
            $("#forecast").empty().append(forecastList);
        });
    }

        function saveCityToLocalStorage(city) {
            var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
            
            if (searchHistory.indexOf(city) === -1) {
                searchHistory.unshift(city);
                if (searchHistory.length > 10) {
                    searchHistory.pop();
                }

                localStorage.setItem("search-history", JSON.stringify(searchHistory));
            }
        }

        function updateSearchHistory() {
            var searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];
            var searchHistoryList = $("<ul>").addClass("list-group");

            for(var i = 0; i < searchHistory.length; i++) {
                var searchHistoryItem = $("<li>").addClass("list-group-item").text(searchHistory[i]);
                searchHistoryItem.on("click", function() {
                    var city = $(this).text();
                    displayCurrentWeather(city);
                    displayForecast(city);
                });
                searchHistoryList.append(searchHistoryItem);
            }
            $("#search-history").empty().append(searchHistoryList);
        }

        $(".btn-primary").on("click", function(event) {
            event.preventDefault();
            console.log(event)

            var city = $("#city-input").val();
            console.log(city)
            displayCurrentWeather(city);
            displayForecast(city);

            $("#city-input").val("");
        })
});