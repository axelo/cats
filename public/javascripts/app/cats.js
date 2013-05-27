var app = angular.module('cats', ['ui.state', '$strap'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/cats');

    $stateProvider
      .state('cats', {
        url : '/cats',
        templateUrl: '/assets/views/cats.html', 
        controller: CatsCtrl,
        resolve: {
          cats: CatsCtrl.resolve
        }
      })
      .state('cats.upload', {
        url: '/upload',  
        templateUrl : '/assets/views/upload.html',
        controller: UploadCtrl            
      });
  });

function CatsCtrl($scope, $http, cats) {
  $scope.cats = cats.data;
  $scope.isSortPopular = true;

  $scope.sortOrder = [{
    "text" : "Most Popular",
    "click" : "sortByMostPopular(true)"
  }, {
    "text" : "Least Popular",
    "click" : "sortByMostPopular(false)"
  }]

  $scope.$watch('isSortPopular', function() {
    $scope.sortingBy = $scope.isSortPopular ?  $scope.sortOrder[0].text : $scope.sortOrder[1].text;
  });

  $scope.$on('cat-uploaded', function(e, cat) {
    $scope.cats.push(cat);
  });

  function updateCat(cat) {
    var copyOfCat = angular.copy(cat);
    delete copyOfCat.expandera;

    $http.put('/cats', copyOfCat)
      .success(function(data, status) {})
      .error(function(data, status) { alert(status) });
  }

  function vote(cat, value) {
    cat.score += value;

    updateCat(cat);
  }

  $scope.voteUp = function(cat) {
    vote(cat, 1);
  }

  $scope.voteDown = function(cat) {
    vote(cat, -1);
  }

  $scope.toggle = function(cat) {
    cat.expandera = !cat.expandera;
  }

  $scope.sortByMostPopular = function(val) {
    $scope.isSortPopular = val;
  }
}

CatsCtrl.resolve = function($http) {
  return $http.get('/cats');
}

function UploadCtrl($scope, $http, $state) {
  $scope.cat = {};

  $scope.close = function() {
    $state.transitionTo('cats');
  }

  $scope.upload = function() {
    $http.post('/cats', $scope.cat)
      .success(function(data, status, headers) {
        $scope.$emit('cat-uploaded', data);
        $state.transitionTo('cats');
      })
      .error(function(data, status) {
        alert(status);
      });
  }
}
