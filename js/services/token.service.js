(function () {
    'use strict';

    angular
        .module('app')
        .factory('TokenInterceptor', TokenInterceptor);

    TokenInterceptor.$inject = ['$localstorage', '$q'];

    function TokenInterceptor($localstorage, $q){
        return {
            request: function(config) {
                config.headers = config.headers || {};
                if ($localstorage.get('token')) {
                    config.headers['x-access-token'] = $localstorage.get('token');
                    config.headers['x-key'] = $localstorage.get('email');
                    config.headers['Content-Type'] = "application/json";
                }
                return config || $q.when(config);
            },

            response: function(response) {
                return response || $q.when(response);
            }
        };
    }
})();