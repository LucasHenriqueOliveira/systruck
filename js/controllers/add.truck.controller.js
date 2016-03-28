(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddTruckController', AddTruckController);

    AddTruckController.$inject = ['DataService', '$localstorage', '$location', '$scope', '$filter', 'TruckService', '$rootScope', 'PartService'];

    function AddTruckController(DataService, $localstorage, $location, $scope, $filter, TruckService, $rootScope, PartService) {
        var vm = this;
        vm.message_part = '';
        vm.message_part_edit = '';
        vm.part = {};
        vm.parts = {};
        vm.truck = {};
        vm.partEdit = {};

        vm.back = function(){
            $location.path('/trucks');
        };

        vm.getPartsTruck = function() {
            vm.parts_truck = DataService.getPartTruck();
        };

        vm.getAllParts = function() {
            PartService.getAllParts().then(function (data) {
                vm.parts = data.getParts;
            });
        };

        vm.getAllParts();
        vm.getPartsTruck();

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

            if(form.truck.km < form.part.lastChange) {
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

            vm.parts_truck = $localstorage.getObject('truck_parts');

            if(JSON.stringify(vm.parts_truck) === '{}'){
                $localstorage.setObject('truck_parts', [{
                    name : form.part.partSelect.name,
                    id : form.part.partSelect.id,
                    time : form.part.timeChange,
                    last: form.part.lastChange,
                    stock: form.part.part_option_select.estoque_id,
                    stock_name: form.part.part_option_select.estoque_descricao
                }]);
            } else{
                vm.parts_truck.push({
                    name : form.part.partSelect.name,
                    id : form.part.partSelect.id,
                    time : form.part.timeChange,
                    last: form.part.lastChange,
                    stock: form.part.part_option_select.estoque_id,
                    stock_name: form.part.part_option_select.estoque_descricao
                });
                $localstorage.setObject('truck_parts', vm.parts_truck);
            }

            vm.parts_truck = DataService.getPartTruck();
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

        vm.editPart = function(part) {
            vm.partEdit.partSelect = {
                id: part.id,
                name: part.name
            };
            vm.partEdit.timeChange = part.time;
            vm.partEdit.lastChange = part.last;

            if(!part.stock) {
                vm.partEdit.options = {
                    length: 0
                };
            } else {
                for(var i = 0; i < vm.parts.length; i++) {
                    if(vm.parts[i].id === part.id){
                        vm.part.options = vm.parts[i].parts;
                    }
                }

                vm.partEdit.part_option_select = {
                    estoque_id: part.stock,
                    estoque_descricao: part.stock_name
                };
            }

            jQuery(document).ready(function(){
                jQuery("#myModalEdit").modal("show");
            });
        };

        vm.submitEditPart = function(form) {
            if(form.truck.km < form.partEdit.lastChange) {
                vm.message_part_edit = 'Km da última troca da peça/item deve ser menor ou igual a km atual do caminhão.';
                return false;
            }

            if(!form.partEdit.part_option_select) {
                form.partEdit.part_option_select = {
                    estoque_id: null,
                    estoque_descricao: null
                };
            }

            var parts = $localstorage.getObject('truck_parts');
            var found = $filter('filter')(parts, {id: form.partEdit.partSelect.id,
                name: form.partEdit.partSelect.name, stock: form.partEdit.part_option_select.estoque_id}, true);

            if (found.length) {
                for(var i = 0; i < parts.length; i++) {
                    var obj = parts[i];

                    if(found.indexOf(obj) !== -1) {
                        parts[i]['id'] = form.partEdit.partSelect.id;
                        parts[i]['name'] = form.partEdit.partSelect.name;
                        parts[i]['time'] = form.partEdit.timeChange;
                        parts[i]['last'] = form.partEdit.lastChange;
                        parts[i]['stock'] = form.partEdit.part_option_select.estoque_id;
                        parts[i]['stock_name'] = form.partEdit.part_option_select.estoque_descricao;
                    }
                    $localstorage.setObject('truck_parts', parts);
                    vm.getPartsTruck();
                    jQuery(document).ready(function(){
                        jQuery("#myModalEdit").modal("hide");
                    });
                }
            } else {
                toastr.error('Erro ao alterar a peça/item', 'Alteração de peça/item', {timeOut: 3000});
            }
        };

        vm.removePart = function(part) {
            var parts = $localstorage.getObject('truck_parts');

            var found = $filter('filter')(parts, part, true);

            if (found.length) {
                for(var i = 0; i < parts.length; i++) {
                    var obj = parts[i];

                    if(found.indexOf(obj) !== -1) {
                        parts.splice(i, 1);
                        i--;
                    }
                }
                $localstorage.setObject('truck_parts', parts);
                vm.getPartsTruck();

            } else {
                toastr.error('Erro ao excluir a peça/item', 'Exclusão de peça/item', {timeOut: 3000});
            }
        };

        vm.submitAddTruck = function(form) {
            var postData = {
                frota: form.truck.frota,
                nome: form.truck.nome,
                placa: form.truck.placa,
                placa_semi_reboque: form.truck.placa_semi_reboque,
                km: form.truck.km,
                qtd_part: form.parts_truck.length,
                usuario_ativacao: $localstorage.getObject('id'),
                empresa: $localstorage.getObject('company')
            };

            var idx = 0;

            Object.keys(form.parts_truck).forEach(function(partId) {
                postData['id_part_' + idx] = form.parts_truck[partId].id;
                postData['time_part_' + idx] = form.parts_truck[partId].time;
                postData['last_part_' + idx] = form.parts_truck[partId].last;
                postData['stock_' + idx] = form.parts_truck[partId].stock;
                idx++;
            });

            TruckService.create(postData).then(function (data) {
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

