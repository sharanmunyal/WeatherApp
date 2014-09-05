var express = require('express'),
    router = express.Router(),
    store = require('../stores/weather-store'),
    data;

router.get('/', function(req, res) {
    data = store.getWeatherData(function(err, data){
      if(err) {
        data = null;
      }
      res.render('index', { title: 'Weather Data', data: data });
  });
});

module.exports = router;
