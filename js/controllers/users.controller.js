(function () {
    'use strict';

    angular
        .module('app')
        .controller('UsersController', UsersController);

    UsersController.$inject = ['$location'];

    function UsersController($location) {
        var vm = this;
        vm.show_driver = false;

        vm.getFunction = function(function_user) {
            if(function_user == 3){
                vm.show_driver = true;
            } else {
                vm.show_driver = false;
            }
        };

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