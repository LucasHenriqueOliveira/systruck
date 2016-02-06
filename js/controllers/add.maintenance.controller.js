(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddMaintenanceController', AddMaintenanceController);

    AddMaintenanceController.$inject = ['$location', '$localstorage', 'DataService'];

    function AddMaintenanceController($location, $localstorage, DataService) {
        var vm = this;
        vm.message = '';
        vm.qtd_km = '';
        vm.part = {};
        vm.part.message_price = '';
        vm.part.price = '';
        vm.view_status = false;
        vm.view_date = false;
        vm.parts = DataService.getPart();

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

        vm.parts_maintenance = [
            {
                id: 1,
                name: 'Óleo',
                price: "1200"
            },
            {
                id: 2,
                name: 'Pneu',
                price: "2400"
            },
            {
                id: 3,
                name: 'Suspensão',
                price: "1350"
            },
            {
                id: 4,
                name: 'Feixe de molas',
                price: "3000"
            },
            {
                id: 5,
                name: 'Amortecedores',
                price: "4350"
            },
            {
                id: 6,
                name: 'Sistema de Freio',
                price: "1570"
            },
            {
                id: 7,
                name: 'Molas Pneumáticas',
                price: "1240"
            },
            {
                id: 8,
                name: 'Rolamento de roda',
                price: "3200"
            },
            {
                id: 9,
                name: 'Barra de direção',
                price: "1200"
            },
            {
                id: 10,
                name: 'Braços tensores',
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
            if(vm.part.part_select) {
                vm.part.message_price = 'Preço: ';
                vm.part.price = vm.parts_maintenance[vm.part.part_select - 1].price;
            } else {
                vm.part.message_price = '';
                vm.part.price = '';
            }
        };

        vm.updatePrice = function() {
            if(vm.part.part_select && vm.part.qtd) {
                vm.part.message_price = 'Preço: ';
                vm.part.price = parseInt(vm.parts_maintenance[vm.part.part_select - 1].price) * vm.part.qtd;
            }
        };

        vm.submitPart = function(part) {
            vm.parts = $localstorage.getObject('parts');
            var part_name = vm.parts_maintenance[vm.part.part_select - 1].name;

            if(JSON.stringify(vm.parts) === '{}'){
                $localstorage.setObject('parts', [{
                    name: part_name,
                    qtd: part.qtd,
                    price: part.price
                }]);
            } else{
                vm.parts.push({
                    name: part_name,
                    qtd: part.qtd,
                    price: part.price
                });
                $localstorage.setObject('parts', vm.parts);
            }

            vm.parts = DataService.getPart();
            vm.part = {};
            jQuery(document).ready(function(){
                jQuery("#myParts").modal("hide");

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.submitAddMaintenance = function(form) {
            $localstorage.remove('maintenance');
            $localstorage.setObject('maintenance', form);
            $location.path('/add-maintenance-confirm');
        };

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();

            jQuery('.default-date-picker').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                language: 'pt-BR'
            });
        });

        vm.checkKm = function(km, qtd_km) {
            if(km <= qtd_km) {
                vm.view_status = true;
            } else {
                vm.view_status = false;
            }
        };

        vm.checkStatus = function(status) {
            if(status == 2) {
                vm.view_date = true;
            } else {
                vm.view_date = false;
            }
        };

    }

})();