
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

