(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngCookies'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'DashboardController',
                templateUrl: 'dashboard.html',
                controllerAs: 'vm'
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'login.html',
                controllerAs: 'vm'
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register.html',
                controllerAs: 'vm'
            })

            .when('/user', {
                controller: 'UserController',
                templateUrl: 'user.html',
                controllerAs: 'vm'
            })

            .when('/truck', {
                controller: 'TruckController',
                templateUrl: 'truck.html',
                controllerAs: 'vm'
            })

            .when('/parts', {
                controller: 'PartsController',
                templateUrl: 'parts.html',
                controllerAs: 'vm'
            })

            .when('/company', {
                controller: 'CompanyController',
                templateUrl: 'company.html',
                controllerAs: 'vm'
            })

            .when('/add-trip', {
                controller: 'AddTripController',
                templateUrl: 'add-trip.html',
                controllerAs: 'vm'
            })

            .when('/search-trip', {
                controller: 'SearchTripController',
                templateUrl: 'search-trip.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }

})();
