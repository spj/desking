function pwdCtrl($scope) {
    $scope.submit = function () {
        $.post(String.format("{0}Account/ForgotPassword", desking.global.webroot), { email: this.email })
            .done(function (data) {
                $scope.notify({ content: data });
            }).fail(function (xhr, status, error) {
                $scope.notify({ content: xhr.responseText });
            });
    }
};

//# sourceURL=bz.forgetPwd.js