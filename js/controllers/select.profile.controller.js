(function () {
    'use strict';

    angular
        .module('app')
        .controller('SelectProfileController', SelectProfileController);

    SelectProfileController.$inject = ['$location', '$timeout', '$localstorage', 'UserService', '$rootScope', 'AuthenticationService', '$window'];

    function SelectProfileController($location, $timeout, $localstorage, UserService, $rootScope, AuthenticationService, $window) {
        var vm = this;
        vm.init = init();
        vm.profiles = {};
        vm.message = '';

        function init() {
            var id = $localstorage.get('id');

            UserService.getProfileById(id).then(function (data) {

                if(data.error) {
                    vm.message = data.message;
                    AuthenticationService.ClearCredentials();
                } else {
                    vm.profiles = data;
                }
            });
        }

        vm.login = function(form) {
            var res = form.option.split("_");
            $localstorage.set('company', res[0]);
            $localstorage.set('roles', res[1]);

            $rootScope.$broadcast("login-done");

            $location.path('/');
        };

        vm.back = function(){
            $window.history.back();
        };
    }
})();