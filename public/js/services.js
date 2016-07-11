'use strict';

var app = angular.module('beerApp');

app.service('User', function($http, $sessionStorage) {

  this.signup = (newUserObj) => {
    return $http.post('./api/users/register', newUserObj);
  }

  this.login = (loginDetailsObj) => {
    return $http.post('./api/users/login', loginDetailsObj)
                .then((res) => {
                  console.log(res);
                  $sessionStorage.currentUser = res.data;
                });
  }
  this.logout = (loginDetailsObj) => {
    return $http.delete('./api/users/logout', loginDetailsObj);
  }

  this.loadprofile = () => {
    return $http.get('./api/users/profile');
  }

  this.editprofile = (editedUserObj) => {
    return $http.put('./api/users/profile', editedUserObj);
  }

  this.getPeople = () => {
    return $http.get('./api/users/people');
  }

  this.getPerson = (id) => {
    return $http.get('./api/users/people/' + id);
  }

  this.addStock = (ratingObj) => {
    return $http.post('./api/users/addStock/', stockObj);
  }

  this.deleteStock = (id) => {
    return $http.delete('./api/users/deleteStock/' + id);
  }

  this.addStockToSpecific = (stockId, obj) => {
    return $http.post('./api/users/addStockToSpecific/' + stockId, obj);
  }



})

app.service('StockAPI', function($http) {

  this.getRandom = () => {
    return $http.get("./api/stocks/getRandom");
  }

  this.getById = (id) => {
    return $http.get("./api/stocks/getById/" + id);
  }

})

app.service('StoreData', function() {
  var storeData = {};
  this.get = () => { return storeData }
  this.set = (data) => { storeData = data }
})
