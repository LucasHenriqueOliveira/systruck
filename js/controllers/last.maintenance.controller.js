(function () {
    'use strict';

    angular
        .module('app')
        .controller('LastMaintenanceController', LastMaintenanceController);

    LastMaintenanceController.$inject = ['$location'];

    function LastMaintenanceController($location) {
        var vm = this;

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();
        });

    }

})();