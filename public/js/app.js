var myapp = angular.module('myapp', ['ngRoute', 'ngAnimate', 'ngTable']);

myapp.$http = null;
myapp.endpoint = endpoint;

myapp.basepath = "/";

myapp.galax = function (title) {
    return {
        other: ["$location", function ($location) {
        }]
        , delay: function ($q, $timeout) {
            var _this = this;
            var delay = $q.defer();
            $("#loading").show();
            $(document.body).css("opacity", "0.5");

            $timeout(function () {
                delay.resolve();
                $("#loading").hide();
                $(document.body).css("opacity", "1");
            }, 250);
            return delay.promise;

        }
    };
};


myapp.constant('_START_REQUEST_', '_START_REQUEST_');
myapp.constant('_END_REQUEST_', '_END_REQUEST_');


function tableFactory(ngTableParams, $filter, $scope, index, data) {


    $scope["rowCollection" + index] = data;
    return $scope["tableParams" + index] = new ngTableParams({
        page: 1,            // show first page
        count: 50,          // count per page
        sorting: {
            date: 'desc'     // initial sorting
        }
    }, {
        total: $scope["rowCollection" + index].length, // length of data
        getData: function ($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                $filter('orderBy')($scope["rowCollection" + index], params.orderBy()) :
                $scope["rowCollection" + index];

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));

        }
    });//end tablaParams


}

myapp.config(function ($routeProvider, $locationProvider) {
    $("#loading").hide();

    $routeProvider
        .when("/", {
            templateUrl: './pages/home.html',
            controller: 'bodyCtrl',
            resolve: myapp.galax("Stats")
        })
        .when("/users", {
            templateUrl: './pages/users.html',
            resolve: myapp.galax("Users")
        })
        .when("/", {
            templateUrl: './pages/home.html',
            controller: 'bodyCtrl',
            resolve: myapp.galax("Stats")
        })
        .when("/keys", {
            templateUrl: './pages/keys.html',
            controller: 'bodyCtrl',
            resolve: myapp.galax("Keys")
        })

        .when(myapp.basepath + '404', {
            templateUrl: function () {
                return "./pages/404.html";
            }
            , resolve: myapp.galax("Error 404, invalid page.")
        })

        .otherwise({
            redirectTo: '404'
        });

});



myapp.controller("bodyCtrl", function ($scope, $http, $location) {

    $scope.location = $location;
    myapp.$http = $http;
    myapp.$scope = $scope;
    $scope.loginURL = myapp.loginURL;


});


myapp.controller("home", function ($scope, $filter, ngTableParams) {
    console.log("home");
});

