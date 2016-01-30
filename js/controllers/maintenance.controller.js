(function () {
    'use strict';

    angular
        .module('app')
        .controller('MaintenanceController', MaintenanceController);

    MaintenanceController.$inject = ['$location', '$timeout', '$window'];

    function MaintenanceController($location, $timeout, $window) {
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