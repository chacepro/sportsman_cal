/* 
 * 6/12/15 - Updating geolocation logic to be more accurate. (Chace)
 */

function initMap() {
   var map;
   var mapOptions = {
      zoom: 13,
      //center: new google.maps.LatLng(myLat,myLon),
      mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
     // Try HTML5 geolocation
   if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
         var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
         initForecast(position.coords.latitude,position.coords.longitude);
         //$(document).focus(function(){ initForecast(position.coords.latitude,position.coords.longitude); });
         $(window).focus(function() { initForecast(position.coords.latitude,position.coords.longitude); });
         $("div#weather",$("body")).slideToggle();
         getCity(position.coords.latitude,position.coords.longitude);
         var marker = new google.maps.Marker({
            map: map,
            position: new google.maps.LatLng(position.coords.latitude,position.coords.longitude),
            title: 'Hi!'
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
               $('span#wSummary', $('body')).html("<img id='weathericon' src='icons/snow.png' />");
               break;
            case "SNOW":
               $('span#wSummary', $('body')).html("<img id='weathericon' src='icons/snow.png' />");
               break;
            case "LIGHT SNOW":
               $('span#wSummary', $('body')).html("<img id='weathericon' src='icons/snow.png' />");
               break;
            case 'MOSTLY CLOUDY':
               $('span#wSummary', $('body')).html("<img id='weathericon' src='icons/partly-cloudy-day.png' />");
               break;
            case 'CLOUDY':
               $('span#wSummary', $('body')).html("<img id='weathericon' src='icons/cloudy.png' />");
               break;
            case 'SUNNY':
               $('span#wSummary', $('body')).html("<img id='weathericon' src='icons/clear-day.png' />");
               break;
            default: 
               $('span#wSummary', $('body')).text(data.currently.summary);
               //$('span#wSummary', $('body')).html("<img src='icons/clear-day.png' />");
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
   if (fraction === " ") fraction = 0;
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
            $('span#gZip', $('body')).text(zip.short_name);
            $("div#geoLoc",$("body")).slideToggle();
         } else {
            alert("No results found");
         }
      } else {
         alert("Geocoder failed due to: " + status);
      }
   });
}

/** jQuery.browser.mobile will be true if the browser is a mobile device **/
(function(a){(jQuery.browser=jQuery.browser||{}).mobile=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);