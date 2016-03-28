(function () {
    'use strict';

    angular
        .module('app')
        .controller('TruckController', TruckController);

    TruckController.$inject = ['$location', '$window', 'TruckService', '$routeParams'];

    function TruckController($location, $window, TruckService, $routeParams) {
        var vm = this;
        vm.loading = true;
        vm.truck = {};

        vm.back = function(){
            $window.history.back();
        };

        vm.truck = TruckService.getCurrentTruck();

        if(!vm.truck) {
            TruckService.getById($routeParams.id).then(function (data) {
                vm.truck = data.getTruck;
                vm.truckPart = data.getTruckPart;
                vm.loading = false;
            });
        } else {
            TruckService.getTruckPart(vm.truck.carro_id).then(function (data) {
                vm.truckPart = data.getTruckPart;
                vm.loading = false;
            });
        }

        vm.editTruck = function(truck) {
            TruckService.setCurrentTruck(truck);
            $location.path('/edit-truck/' + truck.carro_id);
        };
    }

})();