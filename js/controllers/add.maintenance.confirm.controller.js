(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddMaintenanceConfirmController', AddMaintenanceConfirmController);

    AddMaintenanceConfirmController.$inject = ['$location', '$timeout'];

    function AddMaintenanceConfirmController($location, $timeout) {
        var vm = this;

        vm.loading = true;

        $timeout(function() {
            vm.loading = false;
        }, 2000);
    }

})();