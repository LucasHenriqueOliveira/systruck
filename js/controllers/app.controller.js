(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$location', '$scope', 'AuthenticationService', '$rootScope'];

    function AppController($location, $scope, AuthenticationService, $rootScope) {

        if(AuthenticationService.IsLogged()) {
            $location.path('/');
        } else {
            $location.path('/login');
        }

        $scope.showResult = false;

        $scope.username = AuthenticationService.GetName();
        if(AuthenticationService.GetRoles() == 1){
            $scope.showResult = true;
        } else {
            $scope.showResult = false;
        }

        $rootScope.$on("login-done", function() {
            $scope.username = AuthenticationService.GetName();

            if(AuthenticationService.GetRoles() == 1){
                $scope.showResult = true;
            } else {
                $scope.showResult = false;
            }
        });

        $scope.logout = function() {
            AuthenticationService.ClearCredentials();
            $location.path('/login');
        };

        jQuery(document).ready(function(){
            jQuery("html").css('background-image', 'none');
        });

    }

})();