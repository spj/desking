function pwdCtrl($scope) {
    $scope.submit = function () {
        $.post(String.format("{0}Account/ForgotPassword", desking.global.webroot), { email: this.email })
            .done(function (data) {
                $scope.notify('success', data);
            }).fail(function (xhr, status, error) {
                $scope.notify('danger', xhr.responseText);
            });
    }
};

//# sourceURL=bz.forgetPwd.js