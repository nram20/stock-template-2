'use strict';

var app = angular.module('beerApp', ['ui.router', 'ui.bootstrap', 'angularSpinner', 'ngStorage']);

app.config(function($stateProvider, $urlRouterProvider){

  $stateProvider
    .state('home', {
      url:'/',
      templateUrl: '/html/home.html',
      controller: 'homeCtrl'
    })
    .state('login', {
      url:'/login',
      templateUrl: '/html/login.html',
      controller: 'loginCtrl'
    })
    .state('register', {
      url:'/register',
      templateUrl: '/html/registration.html',
      controller: 'regCtrl'
    })
    .state('profile', {
      url:'/profile',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl'
    })
    .state('editProfile', {
      url:'/editProfile',
      templateUrl: '/html/editProfile.html',
      controller: 'editProfileCtrl'
    })
    .state('myStocks', {
      url:'/myStocks',
      templateUrl: '/html/myStocks.html',
      controller: 'myStocksCtrl'
    })
    .state('allStocks', {
      url:'/allStocks',
      templateUrl: '/html/allStocks.html',
      controller: 'allStocksCtrl'
    })
    .state('inspect', {
      url:'/inspect',
      templateUrl: '/html/inspect.html',
      controller: 'inspectCtrl'
    })
    .state('inspectspecific', {
      url:'/inspectspecific/:id',
      templateUrl: '/html/inspectspecific.html',
      controller: 'inspectspecificCtrl'
    })

  $urlRouterProvider.otherwise('/');
});
