(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditTruckController', EditTruckController);

    EditTruckController.$inject = ['$location', 'TruckService', '$routeParams', '$filter', '$localstorage', 'PartService', '$scope', '$rootScope'];

    function EditTruckController($location, TruckService, $routeParams, $filter, $localstorage, PartService, $scope, $rootScope) {
        var vm = this;
        vm.loading = true;
        vm.truck = {};
        vm.partEdit = {};
        vm.part = {};
        vm.parts = {};
        vm.message_part = '';
        vm.message_part_edit = '';

        vm.back = function(){
            $location.path('/trucks');
        };

        vm.truck = TruckService.getCurrentTruck();

        if(!vm.truck) {
            TruckService.getById($routeParams.id).then(function (data) {
                vm.truck = data.getTruck;
                vm.parts_truck = data.getTruckPart;
                vm.loading = false;
            });
        } else {
            TruckService.getTruckPart(vm.truck.carro_id).then(function (data) {
                vm.parts_truck = data.getTruckPart;
                vm.loading = false;
            });
        }

        vm.getAllParts = function() {
            PartService.getAllParts().then(function (data) {
                vm.parts = data.getParts;
            });
        };

        vm.getAllParts();

        vm.addPart = function() {
            vm.part.partSelect = {};
            vm.part.options = {};
            vm.part.lastChange = '';
            vm.part.timeChange = '';

            jQuery(document).ready(function(){
                jQuery("#myModal").modal("show");
            });
        };

        vm.checkPart = function() {

            if(vm.part.partSelect.parts.length) {
                vm.part.options = vm.part.partSelect.parts;
            } else {
                vm.part.options = {};
            }
        };

        vm.submitPart = function(form) {

            if(form.truck.carro_km < form.part.lastChange) {
                vm.message_part = 'Km da última troca da peça/item deve ser menor ou igual a km atual do caminhão.';
                return false;
            }

            if(vm.part.partSelect.parts.length && !form.part.part_option_select){
                vm.message_part = 'Selecione uma peça/item do estoque.';
                return false;
            }

            if(!vm.part.partSelect.parts.length) {
                form.part.part_option_select = {
                    estoque_id: null,
                    estoque_descricao: null
                };
            }

            vm.parts_truck.push({
                carro_item_id: null,
                item_nome : form.part.partSelect.name,
                carro_item_item_id : form.part.partSelect.id,
                carro_item_vida_util : form.part.timeChange,
                carro_item_ultima_km: form.part.lastChange,
                estoque_id: form.part.part_option_select.estoque_id,
                estoque_descricao: form.part.part_option_select.estoque_descricao
            });

            vm.part = {};
            vm.message_part = '';
            $scope.formPart.$setPristine();

            jQuery(document).ready(function(){
                jQuery("#myModal").modal("hide");

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.editPart = function(part, index) {
            vm.partEdit.partSelect = {
                id: part.carro_item_item_id,
                name: part.item_nome
            };
            vm.partEdit.carroItemId = part.carro_item_id;
            vm.partEdit.timeChange = part.carro_item_vida_util;
            vm.partEdit.lastChange = part.carro_item_ultima_km;
            vm.partEdit.index = index;

            if(!part.estoque_id) {
                vm.partEdit.options = {
                    length: 0
                };
            } else {
                for(var i = 0; i < vm.parts.length; i++) {
                    if(vm.parts[i].id === part.carro_item_item_id){
                        vm.part.options = vm.parts[i].parts;
                    }
                }

                vm.partEdit.part_option_select = {
                    estoque_id: part.estoque_id,
                    estoque_descricao: part.estoque_descricao
                };
            }

            jQuery(document).ready(function(){
                jQuery("#myModalEdit").modal("show");
            });
        };

        vm.submitEditPart = function(form) {

            if(form.truck.carro_km < form.partEdit.lastChange) {
                vm.message_part_edit = 'Km da última troca da peça/item deve ser menor ou igual a km atual do caminhão.';
                return false;
            }

            if(!form.partEdit.part_option_select) {
                form.partEdit.part_option_select = {
                    estoque_id: null,
                    estoque_descricao: null
                };
            }

            var parts = vm.parts_truck;

            if (form.partEdit.index !== -1) {
                parts[form.partEdit.index]['carro_item_id'] = form.partEdit.carroItemId;
                parts[form.partEdit.index]['carro_item_item_id'] = form.partEdit.partSelect.id;
                parts[form.partEdit.index]['item_nome'] = form.partEdit.partSelect.name;
                parts[form.partEdit.index]['carro_item_vida_util'] = form.partEdit.timeChange;
                parts[form.partEdit.index]['carro_item_ultima_km'] = form.partEdit.lastChange;
                parts[form.partEdit.index]['estoque_id'] = form.partEdit.part_option_select.estoque_id;
                parts[form.partEdit.index]['estoque_descricao'] = form.partEdit.part_option_select.estoque_descricao;

                vm.parts_truck = parts;
                jQuery(document).ready(function(){
                    jQuery("#myModalEdit").modal("hide");
                });
            } else {
                toastr.error('Erro ao alterar a peça/item', 'Alteração de peça/item', {timeOut: 3000});
            }
        };

        vm.removePart = function(part) {

            var isConfirm = confirm('Confirma a exclusão?');

            if(isConfirm != true){
                return false;
            }

            var parts = vm.parts_truck;

            var found = $filter('filter')(parts, part, true);

            if (found.length) {

                if(part.carro_item_id){
                    var data = {
                        id: $localstorage.getObject('id')
                    };
                    TruckService.removeTruckPart(part.carro_item_id, data).then(function (data) {
                        if(data.error) {
                            toastr.error('Erro ao excluir a peça/item', 'Exclusão de peça/item', {timeOut: 3000});
                            return false;
                        } else {
                            toastr.success(data.message, 'Exclusão de peça/item', {timeOut: 3000});
                        }
                    });
                }

                for(var i = 0; i < parts.length; i++) {
                    var obj = parts[i];

                    if(found.indexOf(obj) !== -1) {
                        parts.splice(i, 1);
                        i--;
                    }
                }

                vm.parts_truck = parts;

            } else {
                toastr.error('Erro ao excluir a peça/item', 'Exclusão de peça/item', {timeOut: 3000});
            }
        };

        vm.submitEditTruck = function(form) {

            var postData = {
                id: form.truck.carro_id,
                frota: form.truck.carro_frota,
                nome: form.truck.carro_nome,
                placa: form.truck.carro_placa,
                placa_semi_reboque: form.truck.carro_placa_semi_reboque,
                km: form.truck.carro_km,
                qtd_part: form.parts_truck.length,
                usuario_ativacao: $localstorage.getObject('id'),
                empresa: $localstorage.getObject('company')
            };

            var idx = 0;

            Object.keys(form.parts_truck).forEach(function(partId) {
                postData['id_car_item_' + idx] = form.parts_truck[partId].carro_item_id;
                postData['id_part_' + idx] = form.parts_truck[partId].carro_item_item_id;
                postData['time_part_' + idx] = form.parts_truck[partId].carro_item_vida_util;
                postData['last_part_' + idx] = form.parts_truck[partId].carro_item_ultima_km;
                postData['stock_' + idx] = form.parts_truck[partId].estoque_id;
                idx++;
            });

            TruckService.update(postData).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Caminhão', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Caminhão', {timeOut: 3000});
                    $localstorage.remove('truck_parts');
                    vm.truck = {};
                    $scope.formTruck.$setPristine();
                    $rootScope.$broadcast("login-done");
                    $location.path('/trucks');
                }
            });
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