(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddMaintenanceController', AddMaintenanceController);

    AddMaintenanceController.$inject = ['$location', '$localstorage'];

    function AddMaintenanceController($location, $localstorage) {
        var vm = this;
        vm.message = '';
        vm.qtd_km = '';
        vm.message_price = '';
        vm.part_price = '';

        vm.trucks = [
            {
                id: 1,
                km: "720877"
            },
            {
                id: 2,
                km: "1293043"
            },
            {
                id: 3,
                km: "380029"
            },
            {
                id: 4,
                km: "312904"
            },
            {
                id: 5,
                km: "834245"
            },
            {
                id: 6,
                km: "943726"
            },
            {
                id: 7,
                km: "314324"
            },
            {
                id: 8,
                km: "538945"
            },
            {
                id: 9,
                km: "349832"
            }
            ,
            {
                id: 10,
                km: "1298438"
            }
        ];

        vm.parts = [
            {
                id: 1,
                price: "1200"
            },
            {
                id: 2,
                price: "2400"
            },
            {
                id: 3,
                price: "1350"
            },
            {
                id: 4,
                price: "3000"
            },
            {
                id: 5,
                price: "4350"
            },
            {
                id: 6,
                price: "1570"
            },
            {
                id: 7,
                price: "1240"
            },
            {
                id: 8,
                price: "3200"
            },
            {
                id: 9,
                price: "1200"
            },
            {
                id: 10,
                price: "1870"
            }
        ];

        vm.getKm = function() {
            if(vm.truck_select){
                vm.message = 'Km atual é ';
                vm.unit = 'km';
                vm.qtd_km = vm.trucks[vm.truck_select - 1].km;
            } else {
                vm.message = '';
                vm.unit = '';
                vm.qtd_km = '';
            }
        };

        vm.getPrice = function() {
            if(vm.part_select) {
                vm.message_price = 'Preço: ';
                vm.part_price = vm.parts[vm.part_select - 1].price;
            } else {
                vm.message_price = '';
                vm.part_price = '';
            }
        };

        vm.updatePrice = function() {
            if(vm.part_select && vm.qtd) {
                vm.message_price = 'Preço: ';
                vm.part_price = parseInt(vm.parts[vm.part_select - 1].price) * vm.qtd;
            }
        };

        vm.submitAddMaintenance = function(form) {
            $localstorage.remove('maintenance');
            $localstorage.setObject('maintenance', form);
            $location.path('/add-maintenance-confirm');
        };

    }

})();