(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$location', '$timeout', 'UserService', '$localstorage'];

    function ProfileController($location, $timeout, UserService, $localstorage) {
        var vm = this;
        vm.loading = true;
        vm.user = {};
        var id = $localstorage.get('profile');

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        UserService.getById(id).then(function (data) {
            vm.user = data.getUser;
        });

        vm.selectProfile = function() {
            $location.path("/select-profile");
        };

        vm.changePassword = function() {
            $location.path("/change-password");
        };
    }

})();