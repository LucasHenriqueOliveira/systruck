(function () {
    'use strict';

    angular
        .module('app')
        .controller('AppController', AppController);

    AppController.$inject = ['$location', '$scope', 'AuthenticationService', '$rootScope', 'DataService', 'UserService'];

    function AppController($location, $scope, AuthenticationService, $rootScope, DataService, UserService) {

        if(AuthenticationService.IsLogged()) {
            $location.path('/');
        } else {
            $location.path('/login');
        }

        $scope.showResult = false;

        $scope.getDataHeader = function() {
            DataService.getDataHeader().then(function (data) {
                if(data.error){
                    $location.path('/login');
                    return false;
                }
                $scope.numberLastTrip = data.getLastTrip.length;
                $scope.numberNextPeriodic = data.getNextPeriodic.length;
                $scope.numberNextMaintenance = data.getNextMaintenance.length;
                $scope.header = data;
            });
        };

        $scope.getDataHeader();

        $scope.getUser = function(perfil_id) {
            UserService.getById(perfil_id).then(function (data) {
                UserService.setCurrentUser(data.getUser);
                $location.path('/user');
            });
        };

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

            $scope.getDataHeader();
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