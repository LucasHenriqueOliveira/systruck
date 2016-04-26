(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddMaintenanceConfirmController', AddMaintenanceConfirmController);

    AddMaintenanceConfirmController.$inject = ['$location', '$timeout', 'DataService', '$rootScope'];

    function AddMaintenanceConfirmController($location, $timeout, DataService, $rootScope) {
        var vm = this;
        vm.loading = false;

        $rootScope.$broadcast("login-done");

        vm.maintenance = DataService.getMaintenance();

        var sumPricePart = 0;
        vm.maintenance.parts.forEach(function(part) {
            sumPricePart = sumPricePart + parseFloat(part.price);
        });
        vm.maintenance.sumPricePart = sumPricePart;
    }

})();