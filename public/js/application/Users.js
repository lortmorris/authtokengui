
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




/**
 * Users
 */
myapp.controller("users", function ($scope, $filter, ngTableParams, $http) {

    $scope.nUser = {};
    $scope.btnAction = "+ Add";

    $scope.addOrEdit = function () {

        if($scope.nUser._id){
            //edit user
        }else{
            //new user
            myapp.addUser($http, $scope.nUser, function (err, data) {
                if (err) {

                } else {
                    $scope.rowCollectionUsers.push(data);
                    $scope.tableParamsUsers.reload();
                }
            });
        }

    };

    $scope.reset  = function(){
        $scope.nUser = {};
    }

    $scope.edit = function(user){
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
