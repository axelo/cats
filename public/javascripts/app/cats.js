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

app.animation('myanim', function() {
  return {
    setup: function(el) {
      /*var up = el[0];
      var down = el[0].nextSibling;

      var height = jQuery(up).outerHeight(true);

      var diff = up.offsetTop - down.offsetTop;

      console.log(diff);

      up.style.top = height + "px";
      down.style.top = -height + "px";*/

      //console.log(height);

      //jQuery(up).css({'top': height + "px"});
      //jQuery(down).css({'top': -height + "px"});
    },
    start: function(el, done, memo) {
      /*console.log("start");
      var up = el[0];
      var down = el[0].nextSibling;

      var upDone = false;
      var downDone = false;

      jQuery(up).animate({
        'top':0
      }, function() {
        upDone = true;
        if (upDone && downDone) done(); 
      });

      jQuery(down).animate({
        'top':0
      }, function() {
        downDone = true;
        if (upDone && downDone) done(); 
      });*/
    },
    cancel: function(el, done) {
      console.log("cancel");
    }
  };
});

function CatsCtrl($scope, $http, cats) {
  $scope.cats = cats.data;
  sortCats();

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

  $scope.$watch('cats', function(newVal, oldVal, scope) {
    sortCats();

    /*console.log(newVal, oldVal);
    console.log(scope.$index, scope);
    sortCats();*/
  }, true);

  function sortCats() {
    $scope.cats.sort(function(a, b) {
      /*var compare = b.score - a.score;

      if (compare === 0 && a.order && b.order) {
        console.log(a.order);
        console.log(b.order);
        console.log(b.order - a.order);

        var h = (b.order - a.order) + "";
        console.log("h", h)
        //return parseInt(h);
        return 1;
      }*/

      /*if (compare === 0) {
        //compare = b.order - a.order;v
        var s = b.order;
        var t = a.order;
        compare = s - t;
      }*/

      return 1;
    });

    $scope.cats.forEach(function(cat, i) {
      cat.order = i;
    });
  }

  function updateCat(cat) {
    var copyOfCat = angular.copy(cat);
    delete copyOfCat.expandera;
    delete copyOfCat.order;

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
