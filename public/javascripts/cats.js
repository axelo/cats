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
      .state('cats.cat', {
        url: '/:id',
        controller: function($stateParams, $rootScope) {
          console.log("cats ctrl")
          $rootScope.selectedId = $stateParams.id;
        }
      });
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


function CatsCtrl($scope, $state, $stateParams, $http, $rootScope) {

  console.log("CatsCtrl", $state.params);

  //$rootScope.selectedId = 0;

  function scrollToCat(id) {
    setTimeout(function () {
      var element = $("a[href$='cats/" + id + "']").get();
      if (element.length > 0)  window.scrollTo(0, element[0].offsetTop - 100)
    });
  }

  $rootScope.$watch('selectedId', function() {
    scrollToCat($rootScope.selectedId);
  });

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
    $state.transitionTo('cats.cat', {id: cat.id});
    scrollToCat(cat.id);
  }

  $scope.voteDown = function(cat) {
    cat.score -= 1 * direction;
    $state.transitionTo('cats.cat', {id: cat.id});
    scrollToCat(cat.id);
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

  $scope.close = function() {
    //if ()
    $state.transitionTo('cats');
    //console.log("tja", $state);
  }
}


function UploadCtrl($scope, $http, $state) {
  console.log("Upload ctrl")

  $scope.cat = {};

  $scope.upload = function() {
    console.log("Laddar upp: " + $scope.cat.name, $scope.cat);

    $http.post('/cats', $scope.cat)
      .success(function(data, status, headers) {

        headers().location
        console.log();

      })
      .error(function(data, status) {
        console.log("fan: " + status);
      });
  }

}

