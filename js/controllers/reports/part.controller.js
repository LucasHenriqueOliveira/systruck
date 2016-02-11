(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportPartController', ReportPartController);

    ReportPartController.$inject = ['$location', '$timeout'];

    function ReportPartController($location, $timeout) {
        var vm = this;
        vm.loading = false;
        vm.chart_select = false;

        vm.dataLabels = {
            enabled: true,
            color: 'black',
            formatter: function () {
                return 'R$ ' + this.y;
            }
        };

        vm.data = [{ name: 'HGL-1909', data: [5245.7], dataLabels: vm.dataLabels},
            { name:'HTT-0109', data: [5236.1], dataLabels: vm.dataLabels},
            { name:'HHL-2123', data: [5124.2], dataLabels: vm.dataLabels},
            { name:'HOL-2338', data: [5234.0], dataLabels: vm.dataLabels},
            { name:'HGL-2432', data: [5012.5], dataLabels: vm.dataLabels},
            { name:'HGL-1914', data: [4912.1], dataLabels: vm.dataLabels},
            { name:'HQR-4234', data: [5111.8], dataLabels: vm.dataLabels},
            { name:'HGL-1909', data: [5211.7], dataLabels: vm.dataLabels},
            { name:'HGL-6474', data: [5111.1], dataLabels: vm.dataLabels},
            { name:'HFB-5758', data: [5311.1], dataLabels: vm.dataLabels}];

        vm.submitChartPart = function(form) {
            vm.loading = true;

            $timeout(function() {
                vm.loading = false;

                vm.highchartsNG = {
                    options: {
                        chart: {
                            type: 'bar'
                        },
                        tooltip: {
                            valuePrefix: 'R$'
                        }
                    },
                    title: {
                        text: 'Resultado por caminhão'
                    },
                    subtitle: {
                        text: '01/01/2016 a 31/01/2016'
                    },
                    xAxis: {
                        categories: [
                            'Caminhão'
                        ]
                    },
                    yAxis: {
                        min: 0,
                        allowDecimals: true,
                        title: {
                            text: 'Resultado (R$)'
                        }
                    },
                    series: vm.data,
                    func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
                };
            }, 2000);

            vm.chart_select = true;
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