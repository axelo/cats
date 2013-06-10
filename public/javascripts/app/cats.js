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

function CatsCtrl($scope, $http, $timeout, cats) {
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
    sortCats();
  });

  $scope.$on('cat-uploaded', function(e, cat) {
    $scope.cats.push(cat);
    sortCats();
  });

  sortCats();

  function sortCats() {
    $scope.cats.sort(function(a, b) {
      return $scope.isSortPopular ? (b.score - a.score) : (a.score - b.score);
    });

    $timeout(function() {
      $scope.cats.forEach(function(cat, i) {
        cat.order = i;
      });
    }, 0);
  }

  function updateCat(cat) {
    var copyOfCat = angular.copy(cat);
    delete copyOfCat.expandera;
    delete copyOfCat.order;

    $http.put('/cats', copyOfCat)
      .success(function(data, status) {})
      .error(function(data, status) { alert(status) });

    sortCats();
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

  $scope.catComparator = function(cat) {
    return cat.score;
  }

  $scope.setPos = function(cat) {
    return {
      top: cat.order * 208 + 'px'
    };
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
