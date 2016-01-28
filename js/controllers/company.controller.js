(function () {
    'use strict';

    angular
        .module('app')
        .controller('CompanyController', CompanyController);

    CompanyController.$inject = ['$location'];

    function CompanyController($location) {
        var vm = this;

        vm.editCompany = function(){
            $location.path('/edit-company');
        };

        vm.initialize = function(){
            var myLatlng = new google.maps.LatLng(-19.9660024, -44.1337994);
            var mapOptions = {
                zoom: 15,
                scrollwheel: false,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: 'Hello World!'
            });
        };
    }

})();


