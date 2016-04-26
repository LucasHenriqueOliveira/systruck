(function () {
    'use strict';

    angular
        .module('app')
        .controller('LastMaintenanceController', LastMaintenanceController);

    LastMaintenanceController.$inject = ['$location', 'DataService', 'PartService'];

    function LastMaintenanceController($location, DataService, PartService) {
        var vm = this;
        vm.maintenances = {};

        vm.getLastMaintenance = function() {
            DataService.getLastMaintenance().then(function (data) {
                vm.maintenances = data.getLastMaintenance;
            });
        };

        vm.getLastMaintenance();

        vm.getMaintenance = function(maintenance) {
            PartService.setCurrentPart(maintenance);
            $location.path('/maintenance/' + maintenance.revisao_id);
        };

        vm.editMaintenance = function(maintenance) {
            PartService.setCurrentPart(maintenance);
            $location.path('/edit-maintenance/' + maintenance.revisao_id);
        };

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();
        });

    }

})();