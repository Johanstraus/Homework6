var fivedayEl = document.querySelector('#fiveday');
var buttonEl = document.querySelector('#searchcity');
var cityNameEl = document.querySelector('#cityname');
var currentDay = document.querySelector('#daily');
var cityHistory = []
var searchHistory = document.querySelector('#searchHistory');
var researchBtnEl = document.querySelector('#research-btn');
var callCity = function (cityname) {
var apiURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityname + "&appid=825f8c44f819c519c3d1ebb993400003&units=imperial";
var currentCity, onecall;
fetch(apiURL)
.then(function (response){
    return response.json();
})
.then(function (data) {
    console.log(data);
    var cityLat = data.city.coord.lat;
    var cityLon = data.city.coord.lon;
    currentCity = data;
    return fetch("https://api.openweathermap.org/data/3.0/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly&appid=825f8c44f819c519c3d1ebb993400003&units=imperial")
})
.then(function (response){
        return response.json();
})
.then (function (data){
    console.log(data);
   
    onecall = data;

   
    var actualName = currentCity.city.name;

    
   var currentDate = new Date(onecall.current.dt * 1000);
   var currentDateText = currentDate.toLocaleDateString("en-US");



   
    var iconcode = onecall.current.weather[0].icon
    var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

 
    $(cityNameEl).text(actualName + " (" + currentDateText + ")");
    $('#weathericon').attr("src", iconurl);

   
    $(currentDay).empty()
    $(currentDay).append("<p> Temp: " + onecall.current.temp + "°F </p>");
    $(currentDay).append("<p> Wind: " + onecall.current.wind_speed + " MPH </p>");
    $(currentDay).append("<p> Humidity: " + onecall.current.humidity + " % </p>");
    $(currentDay).append("<p> UV Index: <span class=uvi>" + onecall.daily[0].uvi + "</span></p>");
    
    
    if (onecall.current.uvi < 3){
        $(".uvi").addClass("uvi-low");
    } else if (onecall.current.uvi  >= 3 && onecall.current.uvi  <= 5){
        $(".uvi").addClass("uvi-moderate");
    } else if (onecall.current.uvi  >= 6 && onecall.current.uvi  <= 7){
        $(".uvi").addClass("uvi-high");
    } else if (onecall.current.uvi  >= 8 && onecall.current.uvi  <= 10){
        $(".uvi").addClass("uvi-very");
    } else $(".uvi").addClass("uvi-xtreme");

   
    $(".fivedaycard").remove()
    for (let i = 1; i < 6; i++) {
        var dayId= "#" + i;
        var formatDate = new Date(onecall.daily[i].dt * 1000);
        var dateEl = formatDate.toLocaleDateString("en-Us");

       
        $(fivedayEl).append("<div class='fivedaycard' id= "+ i + "></div>");
        $(dayId).append("<h3>" + dateEl + "</h3>");
        $(dayId).append("<img src=http://openweathermap.org/img/w/" + onecall.daily[i].weather[0].icon + ".png </img>");
        $(dayId).append("<p> Temp: " + onecall.daily[i].temp.day + "°F </p>");
        $(dayId).append("<p> Wind: " + onecall.daily[i].wind_speed + " MPH </p>");
        $(dayId).append("<p> Humidity: " + onecall.daily[i].humidity + " % </p>");
        $(dayId).append("<p class=uvi> UV Index: " + onecall.daily[i].uvi + "</p>");

        
        if (onecall.daily[i].uvi < 3){
            $(".uvi").addClass("uvi-low");
        } else if (onecall.daily[i].uvi >= 3 && onecall.daily[i].uvi < 6){
            $(".uvi").addClass("uvi-moderate");
        } else if (onecall.daily[i].uvi >= 6 && onecall.daily[i].uvi <= 7){
            $(".uvi").addClass("uvi-high");
        } else if (onecall.daily[i].uvi >= 8 && onecall.daily[i].uvi <= 10){
            $(".uvi").addClass("uvi-very");
        } else $(".uvi").addClass("uvi-xtreme");
    };

  

});
};



var buttonClickHandler = function (event) {
    event.preventDefault();
    var cityInput = document.querySelector('#cityinput').value;
    if (cityInput === undefined) {
        return;
    } else {
    callCity(cityInput);
    console.log(cityInput);

    
    if (cityHistory.indexOf(cityInput) === -1) {
    cityHistory.push(cityInput);
    $(searchHistory).append("<button id=research class='btn btn-secondary'>"+ cityInput + "</button>");
    }
    localStorage.setItem('history', JSON.stringify(cityHistory));
    console.log(cityHistory);
    }
};


var createCityButton = function () {
    var callHistory = JSON.parse(localStorage.getItem('history')) || [];
    console.log(callHistory);
    for (let i = 0; i < callHistory.length; i++) {
    $('#searchHistory').append("<button id=research-btn class='btn btn-secondary'>"+ callHistory[i] + "</button>");
}};


function researchButtonClick (event) {
    event.preventDefault();
    var cityResearch = event.target.innerText;
    if (!event.target.matches('#research-btn')) {
        return;
    } else {
    callCity(cityResearch);
    console.log(cityResearch);
}};



createCityButton();


buttonEl.addEventListener("click", buttonClickHandler);

searchHistory.addEventListener("click", researchButtonClick);