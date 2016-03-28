(function () {
    'use strict';

    angular
        .module('app')
        .controller('TrucksController', TrucksController);

    TrucksController.$inject = ['$location', 'TruckService', '$localstorage'];

    function TrucksController($location, TruckService, $localstorage) {
        var vm = this;

        vm.getTrucks = function() {
            TruckService.getTrucks().then(function (data) {
                vm.trucksAvailable = data.getTrucksAvailable;
                vm.trucksUnavailable = data.getTrucksUnavailable;
            });
        };

        vm.getTrucks();

        vm.getTruck = function(truck) {
            TruckService.setCurrentTruck(truck);
            $location.path('/truck/' + truck.carro_id);
        };

        vm.editTruck = function(truck) {
            TruckService.setCurrentTruck(truck);
            $location.path('/edit-truck/' + truck.carro_id);
        };

        vm.removeTruck = function(truck) {
            var truckRemove = {
                id: $localstorage.getObject('id')
            };
            TruckService.removeTruck(truck.carro_id, truckRemove).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Caminhão', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Caminhão', {timeOut: 3000});
                }
                vm.getTrucks();
            });
        };

        vm.activeTruck = function(truck) {
            var truckActive = {
                id: $localstorage.getObject('id')
            };
            TruckService.activeTruck(truck.carro_id, truckActive).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Caminhão', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Caminhão', {timeOut: 3000});
                }
                vm.getTrucks();
            });
        };

    }

})();

