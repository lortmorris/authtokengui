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


myapp.updateUser = function ($http, model, cb) {
    $http({
        'method': 'POST',
        url: myapp.endpoint +'/users/edit',
        data: model
    })
        .success(function (data, status, headers, config) {
            cb(null, data);
        })
        .error(function (data, status, headers, config) {
            cb(data, null);
        });
}

myapp.deleteUser = function($http, id, cb){
    $http({
        'method': 'POST',
        url: myapp.endpoint + '/users/del',
        data: {id:id}
    })
        .success(function (data, status, headers, config) {
            cb(null, data);
        })
        .error(function (data, status, headers, config) {
            cb(data, null);
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


/**
 * Users
 */
myapp.controller("users", function ($scope, $filter, ngTableParams, $http) {

    $scope.nUser = {};
    $scope.btnAction = "+ Add";

    $scope.addOrEdit = function () {

        if ($scope.nUser._id) {
            myapp.updateUser($http,$scope.nUser, function(err, dat){
                if(err) return alert("Error while trying to update user");
                $scope.tableParamsUsers.reload();
                alert("update was successful");
            });

        } else {
            //new user
            myapp.addUser($http, $scope.nUser, function (err, data) {
                if (err) {

                } else {
                    $scope.rowCollectionUsers.push(data);
                    $scope.tableParamsUsers.reload();
                    alert("New User was added");
                }
            });
        }

    };

    $scope.delete = function(id){
        var r = confirm('You are sure? All API Keys associated to this user will be delete');
        if(r){
            myapp.deleteUser($http, id, function(err, ok){
                if(err) return alert("Error while trying to delete");

                for(var x=0; x<$scope.rowCollectionUsers.length; x++){
                    if($scope.rowCollectionUsers[x]._id==id) $scope.rowCollectionUsers.splice(x,1);
                }

                $scope.tableParamsUsers.reload();

                alert("User was deleted");
            });
        }
    }

    $scope.reset = function () {
        $scope.nUser = {};
    }

    $scope.edit = function (user) {
        $scope.nUser = user;
        $scope.btnAction = "Edit";
    };

    myapp.getUsers($http, function (err, data) {
        if (err) {

        } else {
            $scope.profile = data;
            tableFactory(ngTableParams, $filter, $scope, "Users", data);
        }
    });

});
