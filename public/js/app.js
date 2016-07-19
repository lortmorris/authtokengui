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


myapp.getUsers = function ($http, cb) {
    $http.get(myapp.endpoint + '/users/').
        success(function (data, status, headers, config) {
            if (typeof data.error != "undefined" && data.error != null) {
                cb(data.error, null);
            } else {
                cb(null, data);
            }//end else
        })
        .error(function (data, status, headers, config) {
            cb(status, null);
        });
}

myapp.addUser = function ($http, model, cb) {
    $http({
        'method': 'POST',
        url: myapp.endpoint + '/users/add',
        data: model
    })
        .success(function (data, status, headers, config) {
            cb(null, data);
        })
        .error(function (data, status, headers, config) {
            console.log("Error adding: ", data);
        });
}


myapp.getKeys = function ($http, cb) {
    $http.get(myapp.endpoint + '/keys').
        success(function (data, status, headers, config) {
            if (typeof data.error != "undefined" && data.error != null) {
                cb(data.error, null);
            } else {


                for(var x=0; x<data.length; x++){
                    if(data[x].userid){
                        data[x].fname = myapp.currentUsers[data[x].userid].fname;
                        data[x].lname = myapp.currentUsers[data[x].userid].lname;
                    }else{
                        data[x].fname = "nouser";
                        data[x].lname = "nouser";
                    }

                }
                cb(null, data);
            }//end else
        })
        .error(function (data, status, headers, config) {
            cb(status, null);
        });
}


myapp.addKey = function ($http, model, cb) {
    $http({
        'method': 'POST',
        url: myapp.endpoint + '/keys/add',
        data: model
    })
        .success(function (data, status, headers, config) {
            cb(null, data);
        })
        .error(function (data, status, headers, config) {
            cb(status, null);
        });
}


myapp.controller("bodyCtrl", function ($scope, $http, $location) {

    $scope.location = $location;
    myapp.$http = $http;
    myapp.$scope = $scope;
    $scope.loginURL = myapp.loginURL;


});


myapp.controller("home", function ($scope, $filter, ngTableParams) {
    console.log("home");
});


/**
 * Keys
 */
myapp.controller("keys", function ($scope, $filter, ngTableParams, $http) {

    $scope.nKey = {};
    $scope.users = [];
    $scope.requred = true;
    myapp.currentUsers = {};
    $scope.add = function () {


        var model = {
            allow: $scope.nKey.allow ? $scope.nKey.allow.split(",") : [],
            deny: $scope.nKey.deny ? $scope.nKey.deny.split(",") : [],
            userid: $scope.nKey.userid._id,
            apikey: $scope.nKey.apikey,
            secret: $scope.nKey.secret,
            ratelimit: $scope.nKey.ratelimit

        };

        myapp.addKey($http, model, function (err, data) {
            if (err) {

            } else {
                $scope.rowCollectionKeys.push(data);
                $scope.tableParamsKeys.reload();
            }


        });

    }


    myapp.getUsers($http, function (err, data) {
        if (err) {

        } else {

            $scope.users = data;

            for(var x=0; x<data.length; x++) myapp.currentUsers[data[x]._id] = data[x];
            myapp.getKeys($http, function (err, data) {
                if (err) {

                } else {
                    $scope.keys = data;
                    tableFactory(ngTableParams, $filter, $scope, "Keys", data);
                }
            });

        }
    });


});


/**
 * Users
 */
myapp.controller("users", function ($scope, $filter, ngTableParams, $http) {

    $scope.nUser = {};

    $scope.add = function () {

        myapp.addUser($http, $scope.nUser, function (err, data) {
            if (err) {

            } else {
                $scope.rowCollectionUsers.push(data);
                $scope.tableParamsUsers.reload();
            }
        });
    }

    myapp.getUsers($http, function (err, data) {
        if (err) {

        } else {
            $scope.profile = data;
            tableFactory(ngTableParams, $filter, $scope, "Users", data);
        }
    });

});
