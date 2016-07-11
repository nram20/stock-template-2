'use strict';

var request = require('request');

request.get({
    url: 'http://api.brewerydb.com/v2/beer/random?key=fb7c4e5814a97328a6d9f9702e095412&format=json',
}, (err, response, body) => {
    console.log(JSON.parse(body));
})
