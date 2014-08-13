function registerCtrl($scope, $http,userService) {
    $scope.submitData = ["dealer", "userName", "email", "phoneNumber","password"];
    $scope.phoneChecker = function (value) {        
        return null;
    }
    $scope.getDealers = function (dealer) {
        return userService.getDealers(dealer);
    };
    $scope.submit = function () {
        this.data.password = AESencrypt(this.data.clearPassword);
        $.post(String.format("{0}Account/Register", desking.global.webroot), { data: submitData( this.data, this.submitData) }).done(function (data) {
            if (data)
                $scope.notify('danger', data);
            else
                window.location = String.format("{0}", desking.global.webroot);
        });
    };
    $scope.reset = function () {
        $scope = {};
    }
};
//# sourceURL=bz.register.js