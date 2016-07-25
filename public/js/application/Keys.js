
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


myapp.updateKey = function ($http, model, cb) {
    $http({
        'method': 'POST',
        url: myapp.endpoint +'/keys/edit',
        data: model
    })
        .success(function (data, status, headers, config) {
            cb(null, data);
        })
        .error(function (data, status, headers, config) {
            cb(data, null);
        });
}

myapp.deleteKey = function($http, id, cb){
    $http({
        'method': 'POST',
        url: myapp.endpoint + '/keys/del',
        data: {id:id}
    })
        .success(function (data, status, headers, config) {
            cb(null, data);
        })
        .error(function (data, status, headers, config) {
            cb(data, null);
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
    $scope.nKey.userid = null;

    $scope.btnAction = "+ Add";


    myapp.currentUsers = {};
    $scope.addOrEdit = function () {


        console.log("addOrEdit: ", $scope.nKey);

        var model = {
            allow: $scope.nKey.allow && Object.prototype.toString.call($scope.nKey.allow)=="[object String]" ? $scope.nKey.allow.split(",") : [],
            deny: $scope.nKey.deny && Object.prototype.toString.call($scope.nKey.deny) == "[object String]" ? $scope.nKey.deny.split(",") : [],
            userid: $scope.nKey.userid._id,
            apikey: $scope.nKey.apikey,
            secret: $scope.nKey.secret,
            ratelimit: ""+$scope.nKey.ratelimit

        };

        if($scope.nKey._id){
            model._id = $scope.nKey._id;
            myapp.updateKey($http, model, function(err, dat){
                if(err) return alert("Error while updating");
                alert("Key was updated");
            });

        }else{

            myapp.addKey($http, model, function (err, data) {
                if (err) {

                } else {
                    $scope.rowCollectionKeys.push(data);
                    $scope.tableParamsKeys.reload();
                }
            });
        }//end else

    }



    $scope.delete = function(id){
        var r = confirm('You are sure? ');
        if(r){
            myapp.deleteKey($http, id, function(err, ok){
                if(err) return alert("Error while trying to delete");

                for(var x=0; x<$scope.rowCollectionKeys.length; x++){
                    if($scope.rowCollectionKeys[x]._id==id) $scope.rowCollectionKeys.splice(x,1);
                }

                $scope.tableParamsKeys.reload();
                alert("Key was deleted");
            });
        }
    }

    $scope.reset = function () {
        $scope.nKey = {};
    }

    $scope.edit = function (key) {
        $scope.nKey = key;
        $scope.btnAction = "Edit";
        $scope.nKey.userid = myapp.currentUsers[key.userid];
        console.log($scope.nKey);
    };




    myapp.getUsers($http, function (err, data) {
        if (err) {

        } else {

            $scope.users = data;

            for(var x=0; x<data.length; x++) myapp.currentUsers[data[x]._id] = data[x];

            $scope.nKey.userid = $scope.users[0];

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

