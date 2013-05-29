angular.module("cats", ["ui.state", "$strap"])
  .config(($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise "/cats"

    $stateProvider
      .state("cats",
        url: "/cats"
        templateUrl: "/assets/views/cats.html"
        controller: CatsCtrl
        resolve:
          cats: CatsCtrl.resolve
      )
      .state("cats.upload",
        url: "/upload"
        templateUrl: "/assets/views/upload.html"
        controller: 
          UploadCtrl
      )
  )

CatsCtrl = ($scope, $http, cats) ->
  $scope.cats = cats.data
  $scope.isSortPopular = true

  $scope.sortOrder = [
    text: "Most Popular"
    click: "sortByMostPopular(true)"
  ,
    text: "Least Popular"
    click: "sortByMostPopular(false)"
  ]

  $scope.$watch "isSortPopular", -> $scope.sortingBy = (if $scope.isSortPopular then $scope.sortOrder[0].text else $scope.sortOrder[1].text)

  $scope.$on "cat-uploaded", (e, cat) -> $scope.cats.push cat

  updateCat = (cat) ->
    copyOfCat = angular.copy cat
    delete copyOfCat.expandera

    $http.put("/cats", copyOfCat)
      .success((data, status) -> )
      .error((data, status) -> alert status)

  vote = (cat, value) ->
    cat.score += value
    updateCat cat

  $scope.voteUp = (cat) -> vote cat, 1

  $scope.voteDown = (cat) -> vote cat, -1

  $scope.toggle = (cat) -> cat.expandera = not cat.expandera

  $scope.sortByMostPopular = (val) -> $scope.isSortPopular = val

CatsCtrl.resolve = ($http) -> $http.get "/cats"

UploadCtrl = ($scope, $http, $state) ->
  $scope.cat = {}

  $scope.close = -> $state.transitionTo "cats"

  $scope.upload = ->
    $http.post("/cats", $scope.cat)
      .success((data, status, headers) ->
        $scope.$emit "cat-uploaded", data
        $state.transitionTo "cats")
      .error (data, status) -> alert status
