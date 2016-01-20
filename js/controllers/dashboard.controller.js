(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$location'];

    function DashboardController($location) {
        var vm = this;

        jQuery(document).ready(function(){
            if (jQuery.fn.slimScroll) {
                jQuery('.to-do-list').slimscroll({
                    height: '300px',
                    wheelStep: 35
                });
            }
        });
    }

})();
