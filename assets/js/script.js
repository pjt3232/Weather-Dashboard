$(document).ready(function() {

    function displayCurrentWeather(city) {
        apiKey = "f50566f98e836f619d28a18fec37bb50";
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
 
            var temperature = $("<p>").addClass("card-text").html("<strong>Temperature: </strong>" + response.main.temp + " &deg;C");
            var humidity = $("<p>").addClass("card-text").html("<strong>Humidity: </strong>" + response.main.humidity + "%");
            var windSpeed = $("<p>").addClass("card-text").html("<strong>Wind Speed: </strong>" + response.wind.speed + " m/s");
            currentWeatherCardBody.append(temperatureEl, humidityEl, windSpeedEl);

            currentWeatherCard.append(currentWeatherCardBody);
            $("#current-weather").empty().append(currentWeatherCard);

            saveCityToLocalStorage(city);
            updateSearchHistory();
        });
    }
    
    function displayForecast(city) {
        apiKey = "f50566f98e836f619d28a18fec37bb50";
        queryUrl = "api.openweathermap.org/data/2.5/forecast?" + city + "&appid=" + apiKey + "&units=metric";

        $.ajax({
            url: queryUrl,
            method: "GET"
        }) .then(function(response) {
            console.log(response);
            var forecastCardDeck = $("<div>").addClass("card-deck forecast-card-deck");

            for(var i = 0; i <response.list.length; i++) {
                var forecastCard = $("<div>").addClass("card");
                var forecastCardBody = $("<div>").addClass("card-body");
                var date = new Date(response.list[i].dt * 1000).toLocaleDateString();
                var heading = ("<h5>").addClass("card-title").text(date);

                forecastCardBody.append(heading);

                var iconUrl = "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png";
                var iconImg = $("<img").addClass("weather-icon").attr("src", iconUrl);
                forecastCardBody.append(iconImg);

                var temperatureEl = $("<p>").addClass("card-text").html("<strong>Temp: </strong>" + response.lsit.main.temp + " &deg;C");
                var humidityEl = $("<p>").addClass("card-text").html("<strong>Humidity: </strong>" + response.lsit.main.humidity + "%");
                var windSpeedEl = $("<p>").addClass("card-text").html("<strong>Wind Speed: </strong>" + response.lsit.main.wind.speed + " m/s");

                forecastCardBody.append(temperatureEl, humidityEl, windSpeedEl);
                forecastCard.append(forecastCardBody);
                forecastCardDeck.append(forecastCard);
            }
            $("forecast").empty().append(forecastCardDeck);
        });

        function saveCityToLocalStorage(city) {
            var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) ;
            
            if (searchHistory.indexOf(city) === -1) {
                searchHistory.unshift(city);
                if (searchHistory.length > 10) {
                    searchHistory.pop();
                }

                localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            }
        }

        function updateSearchHistory() {
            var serchHistory = JSON.parse(localstorage.getItem("searchHistory"));
            var searchHistoryList = $("<ul>").addCLass("list-group");

            for(var i = 0; i < searchHistory.length; i++) {
                var searchHistoryItem = $("<li>").addClass("list-group-item").text(searchHistory[i]);
                searchHistoryItem.on("click", function() {
                    var city = $(this).text();
                    displayCurrentWeather(city);
                    displayForecast(city);
                });
                searchHistoryList.append(searchHistoryItem);
            }
            $("search-history").empty().append(searchHistoryList);
        }

        $("search-form").submit(function(event){
            event.preventDefault();

            var city = $("city-input").val();
            displayCurrentWeather();
            displayForecast();

            $("city-input").val("");
        })
    }
});