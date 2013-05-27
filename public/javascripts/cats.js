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
          //$rootScope.selectedId = $stateParams.id;
        }
      });
  });

  app.directive('scrollIf', function () {
    return function (scope, element, attributes) {
      setTimeout(function () {
        if (scope.$eval(attributes.scrollIf)) {
          window.scrollTo(0, element[0].offsetTop - 500)
        }
      });
    }
  });

app.value('$anchorScroll', angular.noop); // Disable scroll to top when changing ui states

function CatsCtrl($scope, $state, $stateParams, $http, $rootScope) {

  console.log("CatsCtrl", $state.params);

  $scope.isSortByCat = true;
  var direction = 1 ;
  $scope.sortingBy = "Cats";

  //$rootScope.selectedId = 0;

  function scrollToCat(id) {
    setTimeout(function () {
      var element = $("a[href$='cats/" + id + "']").get();
      //if (element.length > 0)  window.scrollTo(0, element[0].offsetTop - 100)
    });
  }

  function updateCat(cat) {
    var copyOfCat = angular.copy(cat);
    delete copyOfCat.expandera;

    $http.put('/cats', copyOfCat)
      .success(function(data, status) {  })
      .error(function(data, status) { alert(status) });
  }

  function vote(cat, direction) {
    cat.score += direction;

    updateCat(cat);

    //$state.transitionTo('cats.cat', {id: cat.id});
    
    //scrollToCat(cat.id);
  }

  $rootScope.$watch('selectedId', function() {
    //scrollToCat($rootScope.selectedId);
  });

  $scope.$on('refresh', function(e, data) {
    $scope.cats = data;
    $scope.selectedId = $scope.cats[$scope.cats.length - 1].id;
  });
  
  $scope.getScore = function(cat) {
    return cat.score * direction;
  }

  $scope.voteUp = function(cat) {
    vote(cat, direction);
  }

  $scope.voteDown = function(cat) {
    vote(cat, -direction);
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


function UploadCtrl($scope, $rootScope, $http, $state) {
  console.log("Upload ctrl")

  $scope.cat = {};

  $scope.close = function() {
    $state.transitionTo('cats');
  }

  $scope.upload = function() {
    console.log("Laddar upp: " + $scope.cat.name, $scope.cat);

    $http.post('/cats', $scope.cat)
      .success(function(data, status, headers) {
        $scope.cats.push(data);
        $state.transitionTo('cats.cat', {id:data.id});
      })
      .error(function(data, status) {
        console.log("fan: " + status);
      });
  }

}

