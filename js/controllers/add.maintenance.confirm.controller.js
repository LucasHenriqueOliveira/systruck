(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddMaintenanceConfirmController', AddMaintenanceConfirmController);

    AddMaintenanceConfirmController.$inject = ['$location', '$timeout', 'DataService', '$localstorage'];

    function AddMaintenanceConfirmController($location, $timeout, DataService, $localstorage) {
        var vm = this;
        vm.loading = true;

        $timeout(function() {
            vm.loading = false;
        }, 2000);

        vm.maintenance = DataService.getMaintenance();

        var sumPricePart = 0;
        vm.maintenance.parts.forEach(function(part) {
            sumPricePart = sumPricePart + parseFloat(part.price);
        });
        vm.maintenance.sumPricePart = sumPricePart;
        vm.maintenance.total = vm.maintenance.sumPricePart + vm.maintenance.price;
        var date_add = new Date();
        vm.maintenance.date_add = date_add.getDate() + '/' + (date_add.getMonth() + 1) + '/' +  date_add.getFullYear();

        $localstorage.remove('parts');
    }

})();