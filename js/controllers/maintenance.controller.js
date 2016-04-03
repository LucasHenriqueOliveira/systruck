(function () {
    'use strict';

    angular
        .module('app')
        .controller('MaintenanceController', MaintenanceController);

    MaintenanceController.$inject = ['$window', 'PartService'];

    function MaintenanceController($window, PartService) {
        var vm = this;
        vm.loading = true;
        vm.maintenance = {};

        vm.back = function(){
            $window.history.back();
        };

        vm.maintenance = PartService.getCurrentPart();

        if(!vm.maintenance) {
            //TruckService.getById($routeParams.id).then(function (data) {
            //    vm.truck = data.getTruck;
            //    vm.truckPart = data.getTruckPart;
            //    vm.loading = false;
            //});
        } else {
            vm.loading = false;
        }

    }

})();