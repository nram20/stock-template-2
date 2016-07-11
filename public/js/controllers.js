'use strict';

var app = angular.module('beerApp');

app.controller('mainCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('mainCtrl');
  $scope.isLoggedIn = !!$sessionStorage.currentUser;
  $scope.$watch(function() {
    return $sessionStorage.currentUser;
  }, function(newVal, oldVal) {
    $scope.isLoggedIn = !!newVal;
  });

  $scope.logOut = () => {
    User.logout()
      .then(res => {
        console.log(res);
        $sessionStorage.currentUser = null;
        $state.go('home');
      });
  }
});

app.controller('homeCtrl', function($scope, User, $state) {
  console.log('homeCtrl');
});

app.controller('regCtrl', function($scope, User, $state, $timeout) {
  console.log('regCtrl');
  $scope.registration = {};
  $scope.success = false;
  $scope.passwordsNotMatch = false;
  $scope.register = () => {
    if($scope.registration.password1 !== $scope.registration.password2) return $scope.passwordsNotMatch = true;
    var newUser = {
      email: $scope.registration.email,
      password: $scope.registration.password1
    }
    $scope.success = true;
    User.signup(newUser)
      .then((res) => {
          $state.go('login')
      })
  }
});

app.controller('loginCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('loginCtrl');
  $scope.credentials = {};
  $scope.login = () => {
    User.login($scope.credentials)
          .then(() => {
            $state.go('profile');
          });
  }
});

app.controller('profileCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('profileCtrl');
  $scope.user = {};
  User.getPerson($sessionStorage.currentUser)
    .then((res) => {
      $scope.user = res.data;
    })
  $scope.editProfile = () => {
    $state.go('editProfile');
  }
});

app.controller('editProfileCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('editProfileCtrl');
  $scope.editing = {};
  User.getPerson($sessionStorage.currentUser)
    .then((res) => {
      $scope.editing = res.data;
    })
  $scope.cancel = () => {
    $state.go('profile');
  }

  $scope.save = () => {
    if($scope.editing.password1 !== $scope.editing.password2) return;
    var newUser;
    if($scope.editing.password1 !== undefined) {
      newUser = {
        email: $scope.editing.email,
        password: $scope.editing.password1
      }
    } else {
      newUser = {
        email: $scope.editing.email
      }
    }
    User.editprofile(newUser)
      .then((res) => {
        User.logout()
          .then(res => {
            console.log(res);
            $sessionStorage.currentUser = null;
            $state.go('home');
          });
    })
  }
});

app.controller('myStocksCtrl', function($scope, User, $state, $sessionStorage, StoreData) {
  console.log('myStocksCtrl');
  $scope.stocks = {};
  User.getPerson($sessionStorage.currentUser)
    .then((res) => {
      $scope.stocks = res.data.stocks;
      console.log($scope.stocks);
      $scope.stocks = $scope.stocks.filter((stock) => {
        return stock.price !== undefined;
      })
    })
  $scope.deleteStock = (id) => {
    User.deleteStock(id)
      .then((res) => {
        User.getPerson($sessionStorage.currentUser)
          .then((res) => {
            $scope.stocks = res.data.stocks;
            console.log($scope.stocks);
            $scope.stocks = $scope.stocks.filter((stock) => {
              return stock.price !== undefined;
            })
          })
      })
  }

  $scope.sortBy = (order) => {
    if($scope.sortOrder === order) {
      $scope.sortOrder = "-" + order;
    } else {
      $scope.sortOrder = order;
    }
  };

//   $scope.editStock = (id, score, comment) => {
//     StoreData.set({'edited': true, "load": { "score": score, "comment": comment }});
//     $state.go('inspectspecific', { "id": id });
//   }
// });

app.controller('allStocksCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('allStocksCtrl');
  // $scope.notSampled = [];

  $scope.startinspect = () => {
    $state.go('inspect');
  }

  $scope.inspectThis = (id) => {
    $state.go('inspectspecific', { "id": id });
  }


});


});
app.controller('inspectspecificCtrl', function($scope, User, $state, $sessionStorage, StockAPI, $stateParams, StoreData) {
  console.log('inspectspecificCtrl');
  $scope.stock = {};
  $scope.loading = true;
  $scope.stock = {};

  StockAPI.getById($stateParams.id)
    .then((res) => {
      $scope.stock = res.data;
      $scope.loading = false;
      var info = StoreData.get();
      if(info.edited) {
        console.log(info.load.score);
        $scope.stock.price = info.load.price;
      }
    })


  $scope.rate = () => {
    var stockObj = {
      stockId: $scope.stock.id,
      stockName: $scope.stock.name,
      price: $scope.stock.price
    }
    User.addStockToSpecific(stockObj.stockId, stockObj)
      .then((res) => {
        var info = StoreData.get();

        if(info.edited) return $state.go('myStocks');
        $state.go('allStocks')
      })
  }

  $scope.notsampled = () => {
    $state.go('allStocks')
  }

});
