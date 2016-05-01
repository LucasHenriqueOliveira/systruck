(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', '$timeout', 'AuthenticationService'];

    function ProfileController($location, $timeout, AuthenticationService) {
        var vm = this;
        vm.loading = true;

        vm.useremail = AuthenticationService.GetEmail();
        vm.username = AuthenticationService.GetName();
        if(AuthenticationService.GetRoles() == 1){
            vm.userfunction = 'Gerente';
        } else {
            vm.userfunction = 'Administrativo';
        }

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        vm.selectProfile = function() {
            $location.path("/select-profile");
        };

        vm.changePassword = function() {
            $location.path("/change-password");
        };
    }

})();