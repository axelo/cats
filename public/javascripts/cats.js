angular.module('cats', ['ui.state'])
  .config(function($stateProvider) {

    $stateProvider
      .state('cats', {
        url: '/cats',
        templateUrl : '/assets/views/cats.html',
        controller: CatsCtrl
      });
  });


  function CatsCtrl($scope, $http) {
    console.log("CatsCtrl");

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
