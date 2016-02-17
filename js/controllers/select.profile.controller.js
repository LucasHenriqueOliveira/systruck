(function () {
    'use strict';

    angular
        .module('app')
        .controller('SelectProfileController', SelectProfileController);

    SelectProfileController.$inject = ['$location', '$timeout', '$localstorage', 'UserService'];

    function SelectProfileController($location, $timeout, $localstorage, UserService) {
        var vm = this;
        vm.loading = true;
        vm.init = init();
        vm.profiles = {};

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        function init() {
            var id = $localstorage.get('id');

            UserService.GetById(id).then(function (data) {
                vm.profiles = data;
            });
        }

        vm.login = function(form) {
            var res = form.option.split("_");
            $localstorage.set('company', res[0]);
            $localstorage.set('roles', res[1]);

            $location.path('/');
        };
    }
})();