(function () {
    'use strict';

    angular
        .module('app')
        .controller('TruckController', TruckController);

    TruckController.$inject = ['$location', '$window', '$timeout'];

    function TruckController($location, $window, $timeout) {
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