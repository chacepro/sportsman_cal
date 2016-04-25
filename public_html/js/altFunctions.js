/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor
 
 ZIP CODES: http://federalgovernmentzipcodes.us/
 */

function initMap(gLat, gLng) {
   gLat = gLat || 0;
   gLng = gLng || 0;
   $(window).off('focus');
   var map;
   var mapOptions = {
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.TERRAIN
   };
   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
     // Try HTML5 geolocation
   if(gLat == 0 && gLng == 0) {
      
      if(navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
            gLat = position.coords.latitude
            gLng = position.coords.longitude
            var pos = new google.maps.LatLng(gLat,gLng);
            initForecast(gLat,gLng);

            $("div#weather",$("body")).slideToggle();
            $("div.chunk",$("body")).slideToggle();
            getCity(gLat,gLng);
            var marker = new google.maps.Marker({
               map: map,
               position: new google.maps.LatLng(gLat,gLng),
               title: 'BangBang'
            });
            map.setCenter(pos);
         }, function(error) {
            handleNoGeolocation(true);
         }, {
            maximumAge: 600000, 
            timeout: 10000
         });
      } else {
         handleNoGeolocation(false);
      }
      
   } else {
         var pos = new google.maps.LatLng(gLat,gLng);
         initForecast(gLat,gLng);

         //$("div#weather",$("body")).slideToggle();
         //$("div.chunk",$("body")).slideToggle();
         getCity(gLat,gLng);
         var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(gLat,gLng),
            title: 'BangBang'
         });
         map.setCenter(pos);
   }
   $(window).on("focus", function() {
      initForecast(gLat,gLng); 
   });
}

function handleNoGeolocation(errorFlag) {
   if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
   } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
   }

   var options = {
      map: map,
      position: new google.maps.LatLng(0,0),
      content: content
   };

   var infowindow = new google.maps.InfoWindow(options);
   map.setCenter(options.position);
}

function initForecast(myLat,myLon) {
   var myForecastUrl = "https://api.forecast.io/forecast/4622c57823e29abcdf49adb804575e48/" + myLat + "," + myLon;
   $.ajax({
      url: myForecastUrl,
      dataType: 'jsonp',
      success: function(data){
          switch (data.currently.summary.toUpperCase()) {
            case "FLURRIES":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/snow.png' />");
               break;
            case "SNOW":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/snow.png' />");
               break;
            case "LIGHT SNOW":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/sleet.png' />");
               break;
            case "SLEET":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/sleet.png' />");
               break;
            case "FOGGY":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/fog.png' />");
               break;
            case "MOSTLY CLOUDY":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/cloudy.png' />");
               break;
            case "PARTLY CLOUDY":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/partly-cloudy-day.png' />");
               break;
            case "OVERCAST":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/cloudy.png' />");
               break;
            case "CLEAR":
               $('span#wSummary', $('body')).html("<img class='wImage' src='icons/clear-day.png' />");
               break;
            default: 
               $('span#wSummary', $('body')).text(data.currently.summary.toUpperCase());
          }
          $('span#wTemp', $('body')).text(Math.round(data.currently.temperature));
          $('span#wPreProb', $('body')).text(convertToPercent(data.currently.precipProbability));
          $('span#wPreType', $('body')).text(data.currently.precipType);
          $('span#wDewPoint', $('body')).text(data.currently.dewPoint + '°');
          $('span#wWindSpeed', $('body')).text(data.currently.windSpeed + 'mph');
          $('span#wWindBearing', $('body')).text(data.currently.windBearing + '°');
          $('span#wCloudCover', $('body')).text(convertToPercent(data.currently.cloudCover));
          $('span#wHumidity', $('body')).text(convertToPercent(data.currently.humidity));
          $('span#wPressure', $('body')).text(data.currently.pressure);
          $('span#wVisibility', $('body')).text(data.currently.visibility + 'mi');
          $('span#wSunrise', $('body')).text(unixToTime(data.daily.data[0].sunriseTime));
          $('span#wSunset', $('body')).text(unixToTime(data.daily.data[0].sunsetTime));
          $('span#wMoon', $('body')).text(getMoonPhase(getMoonAge(data.daily.data[0].time)));
          $('span#fDay1', $('body')).text("Today");
          $('span#fDay2', $('body')).text(unixToDate(data.daily.data[1].time));
          $('span#fDay3', $('body')).text(unixToDate(data.daily.data[2].time));
          $('span#fDay4', $('body')).text(unixToDate(data.daily.data[3].time));
          $('span#fDay5', $('body')).text(unixToDate(data.daily.data[4].time));
          $('span#fSumm1', $('body')).text(data.daily.data[0].summary);
          $('span#fSumm2', $('body')).text(data.daily.data[1].summary);
          $('span#fSumm3', $('body')).text(data.daily.data[2].summary);
          $('span#fSumm4', $('body')).text(data.daily.data[3].summary);
          $('span#fSumm5', $('body')).text(data.daily.data[4].summary);
          $('span#fHigh1', $('body')).text(Math.round(data.daily.data[0].temperatureMax) + '°');
          $('span#fHigh2', $('body')).text(Math.round(data.daily.data[1].temperatureMax) + '°');
          $('span#fHigh3', $('body')).text(Math.round(data.daily.data[2].temperatureMax) + '°');
          $('span#fHigh4', $('body')).text(Math.round(data.daily.data[3].temperatureMax) + '°');
          $('span#fHigh5', $('body')).text(Math.round(data.daily.data[4].temperatureMax) + '°');
          $('span#fLow1', $('body')).text(Math.round(data.daily.data[0].temperatureMin) + '°');
          $('span#fLow2', $('body')).text(Math.round(data.daily.data[1].temperatureMin) + '°');
          $('span#fLow3', $('body')).text(Math.round(data.daily.data[2].temperatureMin) + '°');
          $('span#fLow4', $('body')).text(Math.round(data.daily.data[3].temperatureMin) + '°');
          $('span#fLow5', $('body')).text(Math.round(data.daily.data[4].temperatureMin) + '°');
          $('span#fMoon1', $('body')).text(getMoonPhase(getMoonAge(data.daily.data[0].time)));
          $('span#fMoon2', $('body')).text(getMoonPhase(getMoonAge(data.daily.data[1].time)));
          $('span#fMoon3', $('body')).text(getMoonPhase(getMoonAge(data.daily.data[2].time)));
          $('span#fMoon4', $('body')).text(getMoonPhase(getMoonAge(data.daily.data[3].time)));
          $('span#fMoon5', $('body')).text(getMoonPhase(getMoonAge(data.daily.data[4].time)));
          
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
         console.log(textStatus, errorThrown);
         return true;
      }
   });
}

function get_nth_suffix(date) {
   switch (date) {
      case 1:
      case 21:
      case 31:
         return 'st';
      case 2:
      case 22:
         return 'nd';
      case 3:
      case 23:
         return 'rd';
      default:
         return 'th';
   }
}

function unixToTime(unixTime) {
   var date = new Date(unixTime*1000);
   var hours = date.getHours();
   var minutes = date.getMinutes();
   var seconds = date.getSeconds();
   var formattedTime = hours + ':' + minutes + ':' + seconds;
   return formattedTime;
}

function unixToDate(unixTime){
   var a = new Date(unixTime*1000);
   var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
   var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
   var year = a.getFullYear();
   var month = months[a.getMonth()];
   var date = a.getDate();
   var day = days[a.getDay()];
   var formattedDate = day + ' ' + date + get_nth_suffix(date);
   return formattedDate;
 }

function convertToPercent(fraction) {
   if (fraction == " ") fraction = 0;
   return Math.round((fraction * 100) * 100)/100 + '%';
}

function getMoonAge(unixTime) {	
   var a = new Date(unixTime*1000);
   var year = a.getFullYear();
   var month = a.getMonth();
   var day = a.getDate();
   
   d = Math.floor(year/20);
   r = year-(d*20);
   while (r>9) {
      r = r-19;
   }
   r = r*11;
   while (r>29) {
      r = r-30;
   }
   if (month<3) month = month + 2;
   r = r + month + day;
   if (year<100) {
      r = r-4;
   } else {
      r = r-8.3;
   }
   while(r>29) {
      r = r-30;
   }
   while(r<0) {
      r = r+30;
   }
   return r;
}
		
function getMoonPhase(moonAge) {	
   if (moonAge<1) return "New";
   if (moonAge<6) return "Waxing Crescent";
   if (moonAge<9) return "First Quarter";
   if (moonAge<13) return "Waxing Gibbous";
   if (moonAge<16) return "Full";
   if (moonAge<20) return "Waning Gibbous";
   if (moonAge<23) return "Last Quarter";
   if (moonAge<25) return "Waning Crescent";
   if (moonAge<29) return "Waning Crescent";
   if (moonAge>29) return "New";
}

function getCity(lat, lng) {
   var geocoder = new google.maps.Geocoder();
   var latlng = new google.maps.LatLng(lat, lng);
   geocoder.geocode({'latLng': latlng}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
         if (results[1]) {
            for (var i=0; i<results[0].address_components.length; i++) {
               for (var b=0;b<results[0].address_components[i].types.length;b++) {
                  //alert(i + '-' + results[0].address_components[i].short_name);
                  //if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                  house = results[0].address_components[0];
                  street = results[0].address_components[1];
                  city = results[0].address_components[3];
                  county = results[0].address_components[4];
                  state = results[0].address_components[5];
                  country = results[0].address_components[6];
                  zip = results[0].address_components[7];
               }
            }
            //state.long_name = Long State Name
            $('span#gLocation', $('body')).text(house.short_name + ' ' + street.short_name);
            $('span#gCity', $('body')).text(city.short_name);
            $('span#gCounty', $('body')).text(county.short_name);
            $('span#gState', $('body')).text(state.short_name);
            $('span#gCountry', $('body')).text(country.short_name);
            if (zip) {
               $('span#gZip', $('body')).text(zip.short_name);
            }
            $('span#gLat', $('body')).text(lat);
            $('span#gLng', $('body')).text(lng);
            $("div#geoLoc",$("body")).slideToggle();
         } else {
            alert("No results found");
         }
      } else {
         alert("Geocoder failed due to: " + status);
      }
   });
}

 function updateMetrics() {
     windowWidth = $(window).width();
     windowHeight = $(window).height();
     documentWidth = $(document).width();
     documentHeight = $(document).height();
     scrollV = $(document).scrollTop();
     scrollH = $(document).scrollLeft();
     $("span#winH").text(windowHeight);
     $("span#winW").text(windowWidth);
     $("span#docH").text(documentHeight);
     $("span#docW").text(documentWidth);
     $("span#scrH").text(scrollV);
     $("span#scrW").text(scrollH);
 }
 function updateStyleSheet() {
     var mWidth = $(window).width();
     var ua = navigator.userAgent.toLowerCase();
     browser = {
         iPad: /ipad/.test(ua),
         iPhone: /iphone/.test(ua),
         Android: /android/.test(ua)
     };
     if (browser.iPhone) {
         $("span#yDevice").text("iPhone's stink...");
         $("link[class=main]").attr({ href: "css/sportsman1_iphone.css" });
     } else if (browser.Android) {
         $("span#yDevice").text("Android");
         $("link[class=main]").attr({ href: "css/sportsman1_small.css" });
     } else {
         $("span#yDevice").text("Desktop");
         if (mWidth <= 640) {
             $("link[class=main]").attr({ href: "css/sportsman1_small.css" });
        } else if (mWidth > 640 && mWidth <= 800) {
             $("link[class=main]").attr({ href: "css/sportsman1_small.css" });
         } else {
             $("link[class=main]").attr({ href: "css/sportsman1.css" });
         }
     }
 }
