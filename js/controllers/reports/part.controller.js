(function () {
    'use strict';

    angular
        .module('app')
        .controller('ReportPartController', ReportPartController);

    ReportPartController.$inject = ['$location', '$timeout', 'DataService'];

    function ReportPartController($location, $timeout, DataService) {
        var vm = this;
        vm.loading = true;

        $timeout(function() {
            vm.loading = false;
            vm.highchartsNG = DataService.getChartPart();
        }, 2000);

    }

})();