(function () {
    'use strict';

    angular
        .module('app')
        .controller('PartsController', PartsController);

    PartsController.$inject = ['$location'];

    function PartsController($location) {
        var vm = this;

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();
        });
    }

})();
