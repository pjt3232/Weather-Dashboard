//makes the function un when the page loads completely
$(document).ready(function() {

    function displayCurrentWeather(city) {
        //grabs the api with given criteria 
        apiKey = "f50566f98e836f619d28a18fec37bb50";
        queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

        //fetches the api data
        fetch(queryUrl)

        //checks if the response is a 200 and throws an error if it isn't
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
         return response.json();
        }).then(function(response) {
            console.log(response);
            // these variables create the divs for the current weather and then adds the appropiate classes
            var currentDateTime = dayjs().format("dddd, MMMM D, YYYY h:mm A");
            var currentWeatherCard = $("<div>").addClass("card current-weather-card");
            var currentWeatherCardBody = $("<div>").addClass("card-body");
            var cityNameEl = $("<h2>").addClass("card-title").text(response.city.name);
            var currentDateTimeEl = $("<h3>").addClass("card-subtitle mb-2 text-muted").text(currentDateTime);   
            currentWeatherCardBody.append(cityNameEl, currentDateTimeEl);

            //this grabs the weather icon using the API and then appends it to the card body
            var weatherIconCode = response.list[0].weather[0].icon;
            var weatherIconUrl = "http://api.openweathermap.org/img/w/" + weatherIconCode + ".png";
            var weatherIconEl = $("<img>").addClass("weather-icon").attr("src", weatherIconUrl);
            currentWeatherCardBody.append(weatherIconEl);
 
            // creates the tempertature, humidiity, and wind speed data for the current weather
            var temperature = $("<p>").addClass("card-text").html("<strong>Temperature: </strong>" + response.list[0].main.temp + " ºF");
            var humidity = $("<p>").addClass("card-text").html("<strong>Humidity: </strong>" + response.list[0].main.humidity + "%");
            var windSpeed = $("<p>").addClass("card-text").html("<strong>Wind Speed: </strong>" + response.list[0].wind.speed + " MPH");
            currentWeatherCardBody.append(temperature, humidity, windSpeed);

            //appends all the divs to the current-weather id in the HTML and removes the previous information in the HTML
            currentWeatherCard.append(currentWeatherCardBody);
            $("#current-weather").empty().append(currentWeatherCard);

            //runs function to save city to local storage and then update the search history
            saveCityToLocalStorage(city);
            updateSearchHistory();
        });
    }
    
    function displayForecast(city) {
        //grabs the api with the given criteria
        apiKey = "f50566f98e836f619d28a18fec37bb50";
        queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey + "&units=imperial";

        //fetches the API URL
        fetch(queryUrl)

        //checks if response is a 200 and throws an error if it isn't
        .then(function (response) {
          if (!response.ok) {
            throw response.json();
          }
         return response.json();
        }).then(function(response) {
            console.log(response);
            //creates card deck to hold all of the 5 day forecast
            var forecastCardDeck = $("<div>").addClass("card-deck forecast-card-deck");

            // creates a for loop to loop through the 5 days of the forecast and is i+=8 to grab only one time period from the API becuase it works in 3 hour intervals
            for(var i = 0; i < response.list.length; i+=8) {
                //creates divs to hold the information about the forecast
                var forecastCard = $("<div>").addClass("card mb-3");
                var forecastCardBody = $("<div>").addClass("card-body");
                //creates a new Date object from the Unix timestamp value that is given by the response and the formats it the local date string using the ending method
                var date = new Date(response.list[i].dt * 1000).toLocaleDateString();
                var heading = $("<h5>").addClass("card-title").text(date);

                forecastCardBody.append(heading);

                //creates 5 icons for each day and appends them to their respective day
                var iconCode = response.list[i].weather[0].icon;
                var iconUrl = "http://api.openweathermap.org/img/w/" + iconCode + ".png";
                var iconImg = $("<img>").addClass("weather-icon").attr("src", iconUrl);
                forecastCardBody.append(iconImg);

                //creates the temperature, humidity, and wind speed data for each day of the forecast
                var temperatureEl = $("<p>").addClass("card-text").html("<strong>Temp: </strong>" + response.list[i].main.temp + " ºF");
                var humidityEl = $("<p>").addClass("card-text").html("<strong>Humidity: </strong>" + response.list[i].main.humidity + "%");
                var windSpeedEl = $("<p>").addClass("card-text").html("<strong>Wind Speed: </strong>" + response.list[i].wind.speed + " MPH");

                //appends the variables to their respective forecast card
                forecastCardBody.append(temperatureEl, humidityEl, windSpeedEl);
                forecastCard.addClass("col-12");
                forecastCard.append(forecastCardBody);
                forecastCardDeck.append(forecastCard);
            }
            //appends the card deck to the HTML and clears the previous data that was there
            $("#forecast").empty().append(forecastCardDeck);
        });
    }

        function saveCityToLocalStorage(city) {
            //creates a JavaScript array that grabs the local storage item tht is assigned the key "search-history"
            var searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];
            
            //if the searchHistory doesn't include the specific city add it as the first item in the array and only allow amaximum of 10 items in the search history
            if (searchHistory.indexOf(city) === -1) {
                searchHistory.unshift(city);
                if (searchHistory.length > 10) {
                    searchHistory.pop();
                }

                //create a string of the searchHisotry items with the key search-history and saves them to the local storage
                localStorage.setItem("search-history", JSON.stringify(searchHistory));
            }
        }

        function updateSearchHistory() {
            //creates a JavaScript array that grabs the local storage item tht is assigned the key "search-history"
            var searchHistory = JSON.parse(localStorage.getItem("search-history")) || [];
            var searchHistoryList = $("<ul>").addClass("list-group");

            // creates a for loop to create a list of the search history items in the HTML 
            for(var i = 0; i < searchHistory.length; i++) {
                var searchHistoryItem = $("<li>").addClass("list-group-item").text(searchHistory[i]);
                //evetn listener for the search history item so that you can go to the city from the search history items
                searchHistoryItem.on("click", function() {
                    var city = $(this).text();
                    displayCurrentWeather(city);
                    displayForecast(city);
                });
                searchHistoryList.append(searchHistoryItem);
            }
            //appends the search history list items to the HTML
            $("#search-history").empty().append(searchHistoryList);
        }

        //event listener for the search button click that runs the functions to display the weather and forecast
        $(".btn-primary").on("click", function(event) {
            event.preventDefault();
            console.log(event)

            //city is the city input value
            var city = $("#city-input").val();
            console.log(city)
            displayCurrentWeather(city);
            displayForecast(city);

            //clears city input value after search button is clicked
            $("#city-input").val("");
        })
});