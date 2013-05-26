angular.module('cats', ['ui.state'])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider
      .otherwise('/');

    $stateProvider
      .state('enter', {
        url : '/',
        templateUrl: '/assets/views/cats.html',
        controller: CatsCtrl
      })
  });

function CatsCtrl($scope, $stateParams, $http) {
  console.log("CatsCtrl", $stateParams);

  $scope.isSortByCat = $stateParams.sortby ? $stateParams.sortby === 'cats' : true;
  
  var direction = $scope.isSortByCat ? 1 : -1;

  $scope.getScore = function(cat) {
    return cat.score * direction;
  }

  $scope.voteUp = function(cat) {
    cat.score += 1 * direction;
  }

  $scope.voteDown = function(cat) {
    cat.score -= 1 * direction;
  }

  $scope.otherSide = $scope.isSortByCat ? '/#/cats?sortby=bread' : '/#/cats?sortby=cats';

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
}
