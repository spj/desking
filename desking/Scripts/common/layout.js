$.ajaxSetup({ cache: true })
var deskingApp = angular.module('deskingApp', ['ui.router', 'mgcrea.ngStrap', 'ui.mask', 'bz.Directives'])
.config(function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {
    deskingApp.controllerProvider = $controllerProvider;
    deskingApp.compileProvider = $compileProvider;
    deskingApp.filterProvider = $filterProvider;
    deskingApp.provide = $provide;
    // For any unmatched url, redirect to /state1
   // $urlRouterProvider.otherwise(desking.global.isAuthenticated ? "/home" : "/index");
    //$urlRouterProvider.otherwise(function ($injector, $location) {
    //    return '/partials/contacts.' + '.html';
    //});
    // Now set up the states
    $stateProvider
      .state('index', {
          url: "/index",
          templateUrl: String.format("{0}{1}/GetView/{2}", desking.global.webroot, "Home", "Index")
      })
      .state('home', {
          url: "^/home",
          templateUrl: String.format("{0}{1}/GetView/{2}", desking.global.webroot, "Home", "Home")
      })
      .state('register', {
          url: "^/register",
          templateUrl: String.format("{0}{1}/GetView/{2}", desking.global.webroot, 'Account', 'Register'),
          controller: function ($scope, $http, userService, $q) {
              registerCtrl.call(this, $scope, $http, userService, $q);
          }
      })
      .state('login', {
          url: "^/login",
          templateUrl: String.format("{0}{1}/GetView/{2}", desking.global.webroot, 'Account', 'Login'),
      })
      .state('roles', {
          url: "^/roles",
          templateUrl: String.format("{0}{1}/GetView/{2}", desking.global.webroot, 'RolesAdmin', 'Index'),
      })
    .state('users', {
        url: "/users",
        templateUrl: String.format("{0}{1}/GetView/{2}", desking.global.webroot, 'UsersAdmin', 'List'),
        controller: function ($scope, userService) {
            usersCtrl.call(this, $scope, userService);
        }
    })
    .state('user', {
        url: "/user/:uid",
        templateUrl: String.format("{0}{1}/GetView/{2}", desking.global.webroot, 'UsersAdmin', 'Details'),
        controller: function ($scope, $http, $stateParams, userService, $state,$q) {
            userCtrl.call(this, $scope, $http, userService,$state,$q, $stateParams.uid);
        }
    }).
    state('forgetPassword', {
        url: "/forgetPassword",
        templateUrl: String.format("{0}{1}/GetView/{2}", desking.global.webroot, 'Account', 'ForgotPassword'),
        controler: function ($scope) {
            pwdCtrl.call(this, $scope);
        }
    })
})
//.run(function ($rootScope) {
//    $rootScope.alerts = [
//    //{ type: 'danger', msg: 'Oh snap! Change a few things up and try submitting again.' },
//    //{ type: 'success', msg: 'Well done! You successfully read this important alert message.' }
//    ];
//    $rootScope.closeAlert = function (index) {
//        this.alerts.splice(index, 1);
//    };
//    $rootScope.$on("notify", function (event,args) {
//        $rootScope.$apply(function () {
//            $rootScope.alerts.push({ type: args.type, msg: args.msg });
//        });
//    });
//})
.run([
  '$templateCache',
  function ($templateCache) {
      $templateCache.put('popover/confirmation.tpl.html', '<div class="popover" tabindex="-1"><div class="arrow"></div><h3 class="popover-title" ng-bind-html="title" ng-show="title"></h3><div class="popover-content"><button type="button" class="btn" ng-click="$hide()">Cancel</button> <button type="button" class="btn btn-primary" ng-click="popover.del();$hide()">Go Ahead</button></div></div>');
  }
])
.controller("rootCtrl", function ($scope, $alert) {
    $scope.notify = function (config) {
        config = $.extend({type:"info",placement: 'top-right', show:true},config);
        $alert(config);
    }
})
.controller("accountCtrl", function ($scope, $http, $rootScope, userService,$q) {
    $scope.minLength = 4;
    $scope.getMyDealers = function (user) {
        $.getJSON(String.format("{0}Independent/GetUserDealers", desking.global.webroot), { user: user }).done(function (data) {
            $scope.$apply(function () {
                $scope.data = { email: user, fullname: data.UserFullName, dealer: data.Dealers[0], dealers: data.Dealers };
                $scope.selectedDealer = angular.copy($scope.data.dealer);
            });
            $.extend(desking.global.currentuser,angular.copy( $scope.data));
        })
    };
    $scope.dealerCheck = function (dealer) {
        return angular.isUndefined(dealer) || angular.isUndefined(desking.global.currentuser.dealer) || _.some($scope.data.dealers, function (d) { return dealer == d.Name; }) ? null : "Invalid dealer";
    }
    function dealerChange(scope, value, index) {
        var dealer =angular.copy( $scope.data.dealers[index]);
        $rootScope.$broadcast("dealerChanged", {
            dealer: dealer
        });
        desking.global.currentuser.dealer = dealer;
        $scope.selectedDealer = angular.copy(dealer);
    }
    $scope.$on("$select.select", function (scope, value, index) {
        dealerChange(scope, value, index);
    });
    $scope.$on("$typeahead.select", function (scope, value, index) {
        dealerChange(scope, value, index);
    });
    $scope.getDealers = function (dealer) {
        if (angular.isUndefined(dealer) || dealer.length < this.minLength || angular.isUndefined(desking.global.currentuser.dealer) || dealer == desking.global.currentuser.dealer.DealerID) return;
        var deferred = $q.defer();
        userService.getDealers(dealer).then(function (dealers) {
            $scope.data.dealers = dealers;
            deferred.resolve(dealers);
        });
        return deferred.promise;
    };
    $scope.getMyDealers(desking.global.currentuser.email);
});

deskingApp.service('userService', function ($http, $q) {
    return ({
        getRoles: getRoles,
        getUserDealersAndRoles: getUserDealersAndRoles,
        getDealers: getDealers,
        getDealerUsers: getDealerUsers
    });
    function getDealerUsers(dealer) {
        var request = $http({
            method: "get",
            url: String.format("{0}GetDealerUsers/{1}",desking.global.webroot, dealer),
            params: {
                action: "get"
            }
        });

        return (request.then(handleSuccess, handleError));
    }
    function getRoles() {
        var request = $http({
            method: "get",
            url: String.format("{0}GetRoles", desking.global.webroot),
            params: {
                action: "get"
            }
        });

        return (request.then(handleSuccess, handleError));
    }
    function getUserDealersAndRoles(uid) {
        var request = $http({
            method: "get",
            url: String.format("{0}GetUserDealersAndRoles/{1}", desking.global.webroot, uid),
            params: {
                action: "get"
            }
        });

        return (request.then(handleSuccess, handleError));
    }
    function getDealers(dealer) {
        var request = $http({
            method: "get",
            url: String.format("{0}Dealers/{1}", desking.global.webroot, dealer),
            params: {
                action: "get"
            }
        });

        return (request.then(handleSuccess, handleError));
    }
    function handleError(response) {
        // The API response from the server should be returned in a
        // nomralized format. However, if the request was not handled by the
        // server (or what not handles properly - ex. server error), then we
        // may have to normalize it on our end, as best we can.
        if (
            !angular.isObject(response.data) ||
            !response.data.message
            ) {

            return ($q.reject("An unknown error occurred."));

        }

        // Otherwise, use expected error message.
        return ($q.reject(response.data.message));

    }

    function handleSuccess(response) {

        return (response.data);

    }
});