(function () {
    'use strict';

    angular
        .module('app')
        .controller('MaintenanceController', MaintenanceController);

    MaintenanceController.$inject = ['$window', 'PartService', '$location'];

    function MaintenanceController($window, PartService, $location) {
        var vm = this;
        vm.loading = true;
        vm.maintenance = {};

        vm.back = function(){
            $window.history.back();
        };

        vm.maintenance = PartService.getCurrentPart();

        if(!vm.maintenance) {
            //PartService.getById($routeParams.id).then(function (data) {
            //    vm.truck = data.getTruck;
            //    vm.truckPart = data.getTruckPart;
            //    vm.loading = false;
            //});
        } else {
            vm.loading = false;
        }

        vm.editMaintenance = function(maintenance) {
            PartService.setCurrentPart(maintenance);
            $location.path('/edit-maintenance/' + maintenance.revisao_id);
        };

    }

})();