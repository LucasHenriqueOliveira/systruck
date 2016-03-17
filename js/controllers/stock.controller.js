(function () {
    'use strict';

    angular
        .module('app')
        .controller('StockController', StockController);

    StockController.$inject = ['$location'];

    function StockController($location) {
        var vm = this;

        //vm.getParts = function() {
        //    TruckService.getTrucks().then(function (data) {
        //        vm.trucksAvailable = data.getTrucksAvailable;
        //        vm.trucksUnavailable = data.getTrucksUnavailable;
        //    });
        //};
        //
        //vm.getParts();

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();
        });
    }

})();
