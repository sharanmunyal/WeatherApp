var request = require('request'),
  async = require('async'),
  config = require('./config.json'),
  WeatherStore = {},
  api = config.api,
  host = api.host,
  key = api.key,
  timeout = config.timeout || 10000,
  followRedirect = config.followRedirect && true,
  maxRedirects = config.maxRedirects || 10,
  noResultCounter = 0;

function prepareResponse (data) {
  var processedData = null;
  if (data) {
    data = JSON.parse(data);
    if (data.current_observation && data.current_observation.display_location) {
      processedData = {
        city: data.current_observation.display_location.full,
        temp_f: data.current_observation.temp_f,
        temp_c: data.current_observation.temp_c
      }
    }
    else {
      noResultCounter++;
    }
  }
  return processedData;
}

function makeRequest (location, callback) {
  var processedResponse = null;
  request({
    uri: host + key + "/conditions/q/"+ location.state + "/" + location.city + ".json",
    method: "GET",
    timeout: timeout,
    followRedirect: followRedirect,
    maxRedirects: maxRedirects
    }, function (error, response, body) {
      if(error) {
        callback(error, null);
      }
      processedResponse = prepareResponse(body);
      callback (null, processedResponse);
  });
}
 function filter(arr, ch) {
   var newArray = [],
    arrLength = arr && arr.length;
   for(var i = 0; i < arrLength; i++) {
     if(arr[i] !== ch) {
       newArray.push(arr[i]);
     }
   }
   return newArray;
 }
WeatherStore.getWeatherData = function (callback) {
  var processedResponse,
    locationInformation,
    locations = config.locations;

    //make parallel requests for data
    async.map(locations, makeRequest, function (error, result) {
        if (error) {
          callback(error, null);
        }
        if (noResultCounter === locations.length) {
          result = null;
        }
        result = filter(result, null); //remove any information for cities with no data
        callback(null, result)
    });
}

module.exports = WeatherStore;
