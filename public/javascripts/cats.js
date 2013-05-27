var app = angular.module('cats', ['ui.state', '$strap'])
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .otherwise('/cats');

    $stateProvider
      .state('cats', {
        url : '/cats',
        controller: CatsCtrl,
        views: { 
          'cats-view': { 
            templateUrl: '/assets/views/cats.html',
            controller: CatsCtrl,
            resolve: {
              cats : CatsCtrl.resolve
            }
          }
        }
      })
      .state('cats.upload', {
        url: '^/upload',
        views : {
          'upload-view@' : {
            templateUrl : '/assets/views/upload.html',
            controller: UploadCtrl            
          }
        }
      });
  })
  .directive('scrollIf', function () {
    return function (scope, element, attributes) {
      setTimeout(function () {
        if (scope.$eval(attributes.scrollIf)) {
          window.scrollTo(0, element[0].offsetTop - 500)
        }
      });
    }
  })
  .value('$anchorScroll', angular.noop); // Disable scroll to top when changing ui states

function CatsCtrl($scope, $http, cats) {
  $scope.cats = cats.data;

  $scope.selectOrder = [{
    "text" : "Cats",
    "click" : "sortByCat()"
  }, {
    "text" : "Bread Rage Abuse",
    "click" : "sortByBread()"
  }]

  $scope.$watch('isSortByCat', function() {
    $scope.sortingBy = $scope.isSortByCat ?  $scope.selectOrder[0].text : $scope.selectOrder[1].text;
    $scope.direction = $scope.isSortByCat ? 1 : -1;
  });

  $scope.isSortByCat = true;

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

  function vote(cat, direction) {
    cat.score += direction;

    updateCat(cat);
  }

  $scope.getScore = function(cat) {
    return cat.score * $scope.direction;
  }

  $scope.voteUp = function(cat) {
    vote(cat, $scope.direction);
  }

  $scope.voteDown = function(cat) {
    vote(cat, -$scope.direction);
  }

  $scope.toggle = function(cat) {
    cat.expandera = !cat.expandera;
  }

  $scope.sortByCat = function() {
    $scope.isSortByCat = true;
  }

  $scope.sortByBread = function() {
    $scope.isSortByCat = false;
  }
}

CatsCtrl.resolve = function($http) {
  return $http.get('/cats');
}

function UploadCtrl($scope, $rootScope, $http, $state) {
  $scope.cat = {};

  $scope.close = function() {
    $state.transitionTo('cats');
  }

  $scope.upload = function() {
    $http.post('/cats', $scope.cat)
      .success(function(data, status, headers) {
        $rootScope.$broadcast('cat-uploaded', data);
        $state.transitionTo('cats');
      })
      .error(function(data, status) {
        alert(status);
      });
  }
}
