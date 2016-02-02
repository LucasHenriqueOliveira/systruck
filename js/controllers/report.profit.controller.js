(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportProfitController', ReportProfitController);

    ReportProfitController.$inject = ['$location', '$timeout'];

    function ReportProfitController($location, $timeout) {
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

        vm.data = [{ name: '20.279', data: [5245.7], dataLabels: vm.dataLabels},
            { name:'20.280', data: [5236.1], dataLabels: vm.dataLabels},
            { name:'20.314', data: [5124.2], dataLabels: vm.dataLabels},
            { name:'20.654', data: [5234.0], dataLabels: vm.dataLabels},
            { name:'20.323', data: [5012.5], dataLabels: vm.dataLabels},
            { name:'20.259', data: [4912.1], dataLabels: vm.dataLabels},
            { name:'23.423', data: [5111.8], dataLabels: vm.dataLabels},
            { name:'20.675', data: [5211.7], dataLabels: vm.dataLabels},
            { name:'20.876', data: [5111.1], dataLabels: vm.dataLabels},
            { name:'20.856', data: [5311.1], dataLabels: vm.dataLabels}];

        vm.submitChartProfit = function(form) {
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
                        text: 'Lucro por caminhão'
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
                            text: 'Lucro (R$)'
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