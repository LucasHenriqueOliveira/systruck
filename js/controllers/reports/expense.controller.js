(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportExpenseController', ReportExpenseController);

    ReportExpenseController.$inject = ['$location', '$timeout', 'DataService'];

    function ReportExpenseController($location, $timeout, DataService) {
        var vm = this;
        vm.loading = false;
        vm.chart_select = false;
        vm.chart = '0';
        vm.showDates = true;
        vm.qtdTitles = '';

        vm.submitChartExpense = function(form) {
            vm.loading = true;
            vm.chart_select = true;

            $timeout(function() {
                vm.loading = false;
                var chart = '';

                if(form.chart == 1) {
                    chart = DataService.getChartExpenseTotal();
                } else if(form.chart == 2) {
                    chart = DataService.getChartExpenseTruck(vm.from, vm.to);
                } else if(form.chart == 3) {
                    chart = DataService.getChartExpenseDriver(vm.from, vm.to);
                }

                vm.highchartsNG = chart.highchartsNG;
                vm.data = chart.data;
                vm.qtdTitles = vm.data.title.length - 1;

            }, 2000);
        };

        vm.getChart = function(type) {
            if(type == 1) {
                vm.showDates = false;
            } else {
                vm.showDates = true;
            }
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