'use strict';

var express = require('express');
var router = express.Router();
var request = require('request');

var User = require('../models/user');

// router.get('/getRandom', User.isLoggedIn, (req, res) => {
//   function getOneRandom() {
//     request.get({
//       url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=GOOGL&callback=myFunction',
//     }, (err, response, body) => {

//       User.findById(req.user.id, (err, user) => {
//         user.ratings.forEach((r) => {
//           if(r.stockId === JSON.parse(body).data.id) return getOneRandom();
//         })
//         return res.send(JSON.parse(body).data);
//       })
//     })
//   }

//   getOneRandom();
// });

router.get('/getRandom', User.isLoggedIn, function(req, res) {
  request(`http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=GOOGL&callback=myFunction`, function(err, response, body) {
    if (err) res.status(response.statusCode).send({'err': err});
    var randStock = JSON.parse(body);
    console.log(randStock);
    if(!randStock.LastPrice) {randStock.LastPrice = "DESCRIPTION UNAVAILABLE";}

    var newStock = {
        name: randStock.Name,
        user: req.user._id,
        price: randStock.LastPrice
      };

    Stock.create(newStock, function(err, dbStock) {
      User.findById(req.user._id, function(err, user) {
        if (err) res.status(400).send(err);
        user.stocks.push(dbStock);
        user.save(function(err, savedUser) {
          if (err) res.status({'Error saving user': err});
          res.send(dbStock);
        });
      });
    });
  });
});


router.get('/getById/:id', (req, res) => {
  request.get({
    url: 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/jsonp?symbol=' + req.params.id + '&callback=myFunction',
  }, (err, response, body) => {
    res.send(JSON.parse(body).data);
  })
});

module.exports = router;
