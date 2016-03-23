(function () {
    'use strict';

    angular
        .module('app')
        .controller('StockController', StockController);

    StockController.$inject = ['$location', 'PartService', 'DataService', '$scope', '$localstorage'];

    function StockController($location, PartService, DataService, $scope, $localstorage) {
        var vm = this;
        vm.partEdit = {};

        vm.getParts = function() {
            PartService.getParts().then(function (data) {
                vm.partsAvailable = data.getPartsAvailable;
                vm.partsUnavailable = data.getPartsUnavailable;
            });
        };

        vm.getAllParts = function() {
            DataService.getParts().then(function (data) {
                vm.parts = data.getParts;
            });
        };

        vm.getParts();
        vm.getAllParts();

        vm.submitPart = function(part) {
            var postData = {
                id: part.partSelect.id,
                desc: part.desc,
                preco: part.price,
                qtd: part.qtd,
                usuario_ativacao: $localstorage.getObject('id'),
                empresa: $localstorage.getObject('company')
            };

            PartService.create(postData).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Peça/Item', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Peça/Item', {timeOut: 3000});
                    vm.part = {};
                    $scope.formPart.$setPristine();
                    vm.getParts();
                    jQuery(document).ready(function(){
                        jQuery("#myModal").modal("hide");
                    });
                }
            });
        };

        vm.editPart = function(part) {

        };

        vm.removePart = function(part) {
            var partRemove = {
                id: $localstorage.getObject('id')
            };
            PartService.removePart(part.estoque_id, partRemove).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Peça/Item', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Peça/Item', {timeOut: 3000});
                }
                vm.getParts();
            });
        };

        vm.activePart = function(part) {
            var partActive = {
                id: $localstorage.getObject('id')
            };
            PartService.activePart(part.estoque_id, partActive).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Peça/Item', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Peça/Item', {timeOut: 3000});
                }
                vm.getParts();
            });
        };

        vm.editPart = function(part) {
            vm.partEdit.partSelect = {
                id: part.estoque_item_id,
                name: part.item_nome
            };
            vm.partEdit.id = part.estoque_id;
            vm.partEdit.desc = part.estoque_descricao;
            vm.partEdit.qtd = part.estoque_qtd;
            vm.partEdit.price = part.estoque_preco_unitario;

            jQuery(document).ready(function(){
                jQuery("#myModalEdit").modal("show");
            });
        };

        vm.submitEditPart = function(part) {
            var postData = {
                id: part.id,
                item_id: part.partSelect.id,
                desc: part.desc,
                price: part.price,
                qtd: part.qtd,
                company: $localstorage.getObject('company')
            };

            PartService.update(postData).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Peça/Item', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Peça/Item', {timeOut: 3000});

                    vm.getParts();
                    jQuery(document).ready(function(){
                        jQuery("#myModalEdit").modal("hide");
                    });
                }
            });
        };

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();
        });
    }

})();
