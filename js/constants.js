(function () {
    'use strict';

    angular
        .module('app')
        .constant('CONFIG', {
            "url": "http://localhost:8081/api/v1/",
            "login": "http://localhost:8081/login"
        });
})();
