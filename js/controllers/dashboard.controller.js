(function () {
    'use strict';

    angular
        .module('app')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$location', 'AuthenticationService', 'DataService'];

    function DashboardController($location, AuthenticationService, DataService) {
        var vm = this;
        vm.showResult = false;

        DataService.getDataDashboard().then(function (data) {
            vm.dash = data;
        });

        if(AuthenticationService.GetRoles() == 1){
            vm.showResult = true;
        } else {
            vm.showResult = false;
        }

        jQuery(document).ready(function(){

            jQuery("html").css('background-image', 'none');
        });
    }

})();
