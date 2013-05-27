var app = angular.module('cats', ['ui.state', '$strap'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
      .otherwise('/cats');

    $stateProvider
      .state('cats', {
        url : '/cats',
        templateUrl: '/assets/views/cats.html',
        controller: CatsCtrl
      })
      .state('cats.upload', {
        url: '^/upload',
        templateUrl : '/assets/views/upload.html',
        controller: UploadCtrl
      })
      /*.state('cats.cat', {

      })*/;
  });

app.directive('scrollIf', function () {
  return function (scope, element, attributes) {
    setTimeout(function () {
      if (scope.$eval(attributes.scrollIf)) {
        window.scrollTo(0, element[0].offsetTop - 100)
      }
    });
  }
});

function CatsCtrl($scope, $state, $stateParams, $http) {
  console.log("CatsCtrl", $stateParams);

  $scope.$on('refresh', function(e, data) {
    $scope.cats = data;
    $scope.selectedId = $scope.cats[$scope.cats.length - 1].id;
  });
  
  var direction = $scope.isSortByCat ? 1 : -1;
  $scope.sortingBy = "Cats";
  
  $scope.getScore = function(cat) {
    return cat.score * direction;
  }

  $scope.voteUp = function(cat) {
    cat.score += 1 * direction;
    $scope.selectedId = cat.id;
  }

  $scope.voteDown = function(cat) {
    cat.score -= 1 * direction;
    $scope.selectedId = cat.id;
  }

  $http.get('/cats')
    .success(function(data, status) {
      $scope.cats = data;
    })
    .error(function(data, status) {
      console.log("wtf");
    });

   $scope.toggle = function(cat) {
      cat.expandera = cat.expandera ? false : true;
    }



  $scope.selectOrder = [
  {
    "text" : "Cats",
    "click" : "sortByCat()"
  },
  {
    "text" : "Bread Rage Abuse",
    "click" : "sortByBread()"
  }]

  $scope.sortByCat = function() {
    $scope.isSortByCat = true;
    direction = 1;
    $scope.sortingBy = "Cats";
  }

  $scope.sortByBread = function() {
    $scope.isSortByCat = false;
    direction = -1;
    $scope.sortingBy = "Bread Rage Abuse";
  }
}


function UploadCtrl($scope, $http, $state) {
  console.log("Upload ctrl")

  $scope.cat = {};

  $scope.upload = function() {
    console.log("Laddar upp: " + $scope.cat.name, $scope.cat);

    $http.post('/cats', $scope.cat)
      .success(function(data, status) {

        $http.get('/cats') // temp hack :P
          .success(function(data, status) {
            $scope.$emit('refresh', data);
            $state.transitionTo('cats');
          })
          .error(function(data, status) {
            console.log("wtf");
          });
      })
      .error(function(data, status) {
        console.log("fan: " + status);
      });
  }

}

