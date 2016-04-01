(function () {
    'use strict';

    angular
        .module('app')
        .controller('RealizedMaintenanceController', RealizedMaintenanceController);

    RealizedMaintenanceController.$inject = ['$location', 'DataService', 'PartService'];

    function RealizedMaintenanceController($location, DataService, PartService) {
        var vm = this;

        vm.getRealizedMaintenance = function() {
            DataService.getRealizedMaintenance().then(function (data) {
                vm.maintenances = data.getRealizedMaintenance;
            });
        };

        vm.getRealizedMaintenance();

        vm.getMaintenance = function(maintenance) {
            PartService.setCurrentPart(maintenance);
            $location.path('/maintenance/' + maintenance.revisao_id);
        };

        vm.editMaintenance = function(maintenance) {
            PartService.setCurrentPart(maintenance);
            $location.path('/edit-maintenance/' + maintenance.revisao_id);
        };
    }

})();