(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchMaintenanceController', SearchMaintenanceController);

    SearchMaintenanceController.$inject = ['$location', 'TruckService', 'PartService', 'DataService', '$localstorage', '$scope'];

    function SearchMaintenanceController($location, TruckService, PartService, DataService, $localstorage, $scope) {
        var vm = this;
        vm.maintenance = {};
        vm.trucks = {};
        vm.part = {};
        vm.results = '';
        vm.loading = false;
        vm.message = '';

        TruckService.getTrucks().then(function (data) {
            vm.trucks = data.getTrucksAvailable;
        });

        vm.getAllParts = function() {
            PartService.getAllParts().then(function (data) {
                vm.parts = data.getParts;
            });
        };

        vm.getAllParts();

        vm.checkPart = function() {
            if(vm.maintenance.part){
                if(vm.maintenance.part.parts.length) {
                    vm.part.options = vm.maintenance.part.parts;
                } else {
                    vm.part.options = {};
                }
            } else {
                vm.part.options = {};
            }

        };

        vm.submitSearchMaintenance = function(){
            vm.message = '';
            vm.loading = true;
            var option = undefined;
            var part = undefined;
            var status = undefined;
            var truck;

            if(vm.maintenance.option) {
                option = vm.maintenance.option.estoque_id
            }

            if(vm.maintenance.part) {
                part = vm.maintenance.part.id;
            }

            if(vm.maintenance.truck) {
                truck = vm.maintenance.truck.carro_id;
            }

            if(vm.maintenance.status) {
                status = vm.maintenance.status;
            }

            var postData = {
                dateInitial: vm.maintenance.from,
                dateFinal: vm.maintenance.to,
                truck: truck,
                part: part,
                option: option,
                status: status,
                company: $localstorage.getObject('company')
            };

            DataService.getSearchMaintenance(postData).then(function(response) {
                if(response.error === false) {
                    vm.results = response.maintenance;
                } else {
                    vm.message = response.message;
                }
                vm.loading = false;
            });
        };

        vm.resetForm = function() {
            vm.maintenance = {};
            $scope.formSearchMaintenance.$setPristine();
        };

        vm.getMaintenance = function(maintenance) {
            PartService.setCurrentPart(maintenance);
            $location.path('/maintenance/' + maintenance.revisao_id);
        };

        vm.editMaintenance = function(maintenance) {
            PartService.setCurrentPart(maintenance);
            $location.path('/edit-maintenance/' + maintenance.revisao_id);
        };

        vm.back = function(){
            vm.results = '';
            $location.path('/search-maintenance');
        };

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();

            jQuery('.default-date-picker').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                language: 'pt-BR'
            });
        });
    }

})();