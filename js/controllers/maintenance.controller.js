(function () {
    'use strict';

    angular
        .module('app')
        .controller('MaintenanceController', MaintenanceController);

    MaintenanceController.$inject = ['$window', 'PartService', '$location', '$routeParams', 'DataService'];

    function MaintenanceController($window, PartService, $location, $routeParams, DataService) {
        var vm = this;
        vm.loading = true;
        vm.maintenance = {};

        vm.back = function(){
            $window.history.back();
        };

        vm.maintenance = PartService.getCurrentPart();

        if(JSON.stringify(vm.maintenance) === '{}'){
            DataService.getMaintenanceById($routeParams.id).then(function (data) {
                if(!data.error) {
                    vm.maintenance = data.getMaintenance;
                } else {
                    toastr.error(data.message, 'Manutenção', {timeOut: 3000});
                }
                vm.loading = false;
            });
        } else {
            vm.loading = false;
        }

        vm.editMaintenance = function(maintenance) {
            PartService.setCurrentPart(maintenance);
            $location.path('/edit-maintenance/' + maintenance.revisao_id);
        };

    }

})();