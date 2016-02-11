(function () {
    'use strict';

    angular
        .module('app')
        .controller('UserController', UserController);

    UserController.$inject = ['$location', '$window', '$timeout'];

    function UserController($location, $window, $timeout) {
        var vm = this;
        vm.loading = true;

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        vm.back = function(){
            $window.history.back();
        };
    }

})();