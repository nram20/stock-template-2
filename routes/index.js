'use strict';

var express = require('express');
var path = require('path');
var router = express.Router();

var User = require('../models/user');

router.get('/', (req, res) => {
  var indexPath = path.join(__dirname, '../index.html');
  res.sendFile(indexPath);
});

router.get('/secret', User.auth(), (req, res) => {
  res.send('Only users!');
});

module.exports = router;
