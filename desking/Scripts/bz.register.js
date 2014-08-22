function registerCtrl($scope, $http, userService,$q) {
    $scope.minLength = 4;
    $scope.submitData = ["dealer", "userName", "email", "phoneNumber","password"];
    $scope.dealerCheck = function (dealer) {
        return angular.isUndefined(dealer) || angular.isUndefined($scope.data)|| _.some($scope.data.dealers, function (d) { return dealer == d.DealerID; }) ? null : "Invalid dealer";
    }
    $scope.getDealers = function (dealer) {
        if (angular.isUndefined(dealer) || dealer.length < this.minLength) return;
        var deferred = $q.defer();
        userService.getDealers(dealer).then(function (dealers) {
            $scope.data.dealers = dealers;
            deferred.resolve(dealers);
        });
        return deferred.promise;
    };
    $scope.submit = function () {
        this.data.password = AESencrypt(this.data.clearPassword);
        $.post(String.format("{0}Account/Register", desking.global.webroot), { data: submitData( this.data, this.submitData) }).done(function (data) {
            if (data)
                $scope.notify({ content: data });
            else
                window.location = String.format("{0}", desking.global.webroot);
        });
    };
    $scope.reset = function () {
        $scope = {};
    }
};
//# sourceURL=bz.register.js