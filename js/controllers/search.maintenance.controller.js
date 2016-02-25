(function () {
    'use strict';

    angular
        .module('app')
        .controller('SearchMaintenanceController', SearchMaintenanceController);

    SearchMaintenanceController.$inject = ['$location'];

    function SearchMaintenanceController($location) {
        var vm = this;

        vm.submitSearchMaintenance = function(form){
            $location.path('/research-maintenance');
        }

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