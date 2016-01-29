(function () {
    'use strict';

    angular
        .module('app')
        .controller('ResearchMaintenanceController', ResearchMaintenanceController);

    ResearchMaintenanceController.$inject = ['$location', '$window', '$timeout'];

    function ResearchMaintenanceController($location, $window, $timeout) {
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