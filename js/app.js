(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ui.utils.masks', 'ui.mask', 'ngAnimate', 'highcharts-ng', 'jkuri.slimscroll'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$httpProvider'];
    function config($routeProvider, $httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');

        $routeProvider
            .when('/', {
                controller: 'DashboardController',
                templateUrl: 'templates/dashboard.html',
                controllerAs: 'vm',
                cache: false,
                access: {
                    requiredLogin: true
                }
            })

            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'templates/login.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: false
                }
            })

            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'templates/register.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/select-profile', {
                controller: 'SelectProfileController',
                templateUrl: 'templates/select-profile.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/profile', {
                controller: 'ProfileController',
                templateUrl: 'templates/profile.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/users', {
                controller: 'UsersController',
                templateUrl: 'templates/users.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/user', {
                controller: 'UserController',
                templateUrl: 'templates/user.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/trucks', {
                controller: 'TrucksController',
                templateUrl: 'templates/trucks.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/truck/:id', {
                controller: 'TruckController',
                templateUrl: 'templates/truck.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/parts', {
                controller: 'PartsController',
                templateUrl: 'templates/parts.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/company', {
                controller: 'CompanyController',
                templateUrl: 'templates/company.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/edit-company', {
                controller: 'EditCompanyController',
                templateUrl: 'templates/edit-company.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/trip/:id', {
                controller: 'TripController',
                templateUrl: 'templates/trip.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/add-trip', {
                controller: 'AddTripController',
                templateUrl: 'templates/add-trip.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/add-trip-confirm', {
                controller: 'AddTripConfirmController',
                templateUrl: 'templates/add-trip-confirm.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/search-trip', {
                controller: 'SearchTripController',
                templateUrl: 'templates/search-trip.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/last-trip', {
                controller: 'LastTripController',
                templateUrl: 'templates/last-trip.html',
                controllerAs: 'vm',
                cache: false,
                access: {
                    requiredLogin: true
                }
            })

            .when('/maintenance/:id', {
                controller: 'MaintenanceController',
                templateUrl: 'templates/maintenance.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/add-maintenance', {
                controller: 'AddMaintenanceController',
                templateUrl: 'templates/add-maintenance.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/add-maintenance-confirm', {
                controller: 'AddMaintenanceConfirmController',
                templateUrl: 'templates/add-maintenance-confirm.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/search-maintenance', {
                controller: 'SearchMaintenanceController',
                templateUrl: 'templates/search-maintenance.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/research-maintenance', {
                controller: 'ResearchMaintenanceController',
                templateUrl: 'templates/research-maintenance.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/last-maintenance', {
                controller: 'LastMaintenanceController',
                templateUrl: 'templates/last-maintenance.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/realized-maintenance', {
                controller: 'RealizedMaintenanceController',
                templateUrl: 'templates/realized-maintenance.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/all-periodics', {
                controller: 'AllPeriodicsController',
                templateUrl: 'templates/all-periodics.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/report-profit', {
                controller: 'ReportProfitController',
                templateUrl: 'templates/reports/profit.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/report-expense', {
                controller: 'ReportExpenseController',
                templateUrl: 'templates/reports/expense.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/report-maintenance', {
                controller: 'ReportMaintenanceController',
                templateUrl: 'templates/reports/maintenance.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/report-truck', {
                controller: 'ReportTruckController',
                templateUrl: 'templates/reports/truck.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/report-driver', {
                controller: 'ReportDriverController',
                templateUrl: 'templates/reports/driver.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/report-travel', {
                controller: 'ReportTravelController',
                templateUrl: 'templates/reports/travel.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .when('/report-part', {
                controller: 'ReportPartController',
                templateUrl: 'templates/reports/part.html',
                controllerAs: 'vm',
                access: {
                    requiredLogin: true
                }
            })

            .otherwise({ redirectTo: '/login' });
    }

    run.$inject = ['$rootScope', '$location', 'AuthenticationService'];
    function run($rootScope, $location, AuthenticationService) {

        $rootScope.$on('$locationChangeStart', function (event, nextRoute, currentRoute) {
            $rootScope.location = $location;
            // redirect to login page if not logged in and trying to access a restricted page

            if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationService.IsLogged) {
                $location.path("/login");
            }
        });

        $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

            if ((nextRoute.access && nextRoute.access.requiredLogin) && !AuthenticationService.IsLogged()) {
                $location.path("/login");
            }
        });
    }

})();
