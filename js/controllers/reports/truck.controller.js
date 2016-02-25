(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportTruckController', ReportTruckController);

    ReportTruckController.$inject = ['$location', '$timeout', 'DataService'];

    function ReportTruckController($location, $timeout, DataService) {
        var vm = this;
        vm.loading = false;
        vm.chart_select = false;
        vm.chart = '0';
        vm.showDates = true;
        vm.qtdTitles = '';

        vm.submitChartTruck = function(form) {
            vm.loading = true;
            vm.chart_select = true;

            $timeout(function() {
                vm.loading = false;
                var chart = '';

                if(form.chart == 1) {
                    chart = DataService.getChartTruckAverage(vm.from, vm.to);
                } else if(form.chart == 2) {
                    chart = DataService.getChartTruckKm(vm.from, vm.to);
                } else if(form.chart == 3) {
                    chart = DataService.getChartTruckTravel(vm.from, vm.to);
                } else if(form.chart == 4) {
                    chart = DataService.getChartMaintenanceTruck(vm.from, vm.to);
                } else if(form.chart == 5) {
                    chart = DataService.getChartExpenseTruck(vm.from, vm.to);
                }

                vm.highchartsNG = chart.highchartsNG;
                vm.data = chart.data;
                vm.qtdTitles = vm.data.title.length - 1;

            }, 2000);
        };

        jQuery(document).ready(function(){
            jQuery('.default-date-picker').datepicker({
                format: 'dd/mm/yyyy',
                autoclose: true,
                language: 'pt-BR'
            });
        });

    }

})();