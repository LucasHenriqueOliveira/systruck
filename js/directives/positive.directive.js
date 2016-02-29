(function () {
    'use strict';

    angular
        .module('app')
        .filter('positive', function() {
            return function(input) {
                if (!input) {
                    return 0;
                }

                return Math.abs(input);
            };
        });

})();