(function () {
    'use strict';

    angular
        .module('app')
        .controller('EditMaintenanceController', EditMaintenanceController);

    EditMaintenanceController.$inject = ['$location', 'DataService', 'PartService', '$window', 'TruckService', '$scope', '$filter', '$localstorage', '$rootScope'];

    function EditMaintenanceController($location, DataService, PartService, $window, TruckService, $scope, $filter, $localstorage, $rootScope) {
        var vm = this;
        vm.maintenance = {};
        vm.message = 'Km atual é ';
        vm.unit = 'km';
        vm.part = {};
        vm.maintenance = {};
        vm.part.message_price = '';
        vm.part.price = '';
        vm.view_status = false;
        vm.view_date = false;
        vm.field_price = false;

        vm.back = function(){
            $window.history.back();
        };

        vm.result = PartService.getCurrentPart();

        if(!vm.maintenance) {
            alert('Erro ao buscar a manutenção.');
            $window.history.back();
        }

        vm.maintenance.truck = {carro_id: vm.result.carro_id, carro_km: vm.result.carro_km};
        vm.maintenance.km = vm.result.revisao_km;
        vm.maintenance.status = vm.result.revisao_status;
        vm.view_status = vm.maintenance.status ? true : false;
        vm.maintenance.date = vm.result.revisao_data;
        vm.view_date = vm.maintenance.date ? true : false;
        vm.maintenance.price = vm.result.revisao_valor;
        vm.qtd_km = vm.result.carro_km;
        vm.maintenance.parts = vm.result.parts;
        vm.maintenance.comments = vm.result.revisao_observacao;
        vm.revisao_id = vm.result.revisao_id;
        vm.revisao_manual = vm.result.revisao_manual;

        TruckService.getTrucks().then(function (data) {
            vm.trucks = data.getTrucksAvailable;
        });

        vm.addPart = function() {
            vm.part.part_select = {};
            vm.part.options = {};
            vm.field_price = false;
            vm.part.message_price = '';
            vm.part.price = '';
            vm.part.qtd = '';

            jQuery(document).ready(function(){
                jQuery("#myParts").modal("show");
            });
        };

        vm.submitPart = function(form) {

            vm.maintenance.parts.push({
                revisao_item_id : null,
                revisao_item_revisao_id: vm.revisao_id,
                estoque_descricao: form.part_option_select.estoque_descricao,
                estoque_id: form.part_option_select.estoque_id,
                item_nome: form.part_select.name,
                item_id: form.part_select.id,
                revisao_item_qtd : form.qtd,
                revisao_item_valor: form.price
            });

            vm.part = {};
            $scope.formParts.$setPristine();

            jQuery(document).ready(function(){
                jQuery("#myParts").modal("hide");

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.editPart = function(part, index) {

            vm.part = {};
            vm.part.part_select = {
                id: part.item_id,
                name: part.item_nome
            };
            vm.part.index = index;

            if(!part.estoque_id) {

                vm.field_price = true;
                if(vm.revisao_manual == 1){
                    vm.part.options = {
                        length: 0
                    };
                } else {
                    for(var i = 0; i < vm.parts.length; i++) {
                        if(vm.parts[i].id === part.item_id){
                            vm.part.options = vm.parts[i].parts;
                        }
                    }

                    if(vm.part.options.length) {
                        vm.field_price = false;
                    }
                }

                vm.part.price_unit = (part.revisao_item_valor/part.revisao_item_qtd);
                vm.part.price = part.revisao_item_valor;
                vm.part.qtd = part.revisao_item_qtd;

            } else {
                vm.field_price = false;

                for(var i = 0; i < vm.parts.length; i++) {
                    if(vm.parts[i].id === part.item_id){
                        vm.part.options = vm.parts[i].parts;
                    }
                }

                vm.part.price = part.revisao_item_valor;
                vm.part.qtd = part.revisao_item_qtd;
                var price_unit = vm.part.price/vm.part.qtd;

                vm.part.part_option_select = {
                    estoque_id: part.estoque_id,
                    estoque_descricao: part.estoque_descricao,
                    estoque_preco_unitario: price_unit
                }
            }

            vm.part.revisao_id = part.revisao_item_revisao_id;
            vm.part.revisao_item_id = part.revisao_item_id;
            vm.part.message_price = 'Preço: ';

            jQuery(document).ready(function(){
                jQuery("#myPartsEdit").modal("show");
            });
        };

        vm.submitEditPart = function(part) {

            if(!part.part_option_select) {
                part.part_option_select = {
                    estoque_id: null,
                    estoque_descricao: null
                };
            }

            var parts = vm.maintenance.parts;

            if (part.index !== -1) {
                parts[part.index]['item_id'] = part.part_select.id;
                parts[part.index]['item_nome'] = part.part_select.name;
                parts[part.index]['revisao_item_qtd'] = part.qtd;
                parts[part.index]['revisao_item_valor'] = part.price;
                parts[part.index]['estoque_preco_unitario'] = part.price_unit;
                parts[part.index]['estoque_id'] = part.part_option_select.estoque_id;
                parts[part.index]['estoque_descricao'] = part.part_option_select.estoque_descricao;
                parts[part.index]['revisao_id'] = part.revisao_id;
                parts[part.index]['revisao_item_id'] = part.revisao_item_id;

                vm.maintenance.parts = parts;
                vm.part = {};
                $scope.formParts.$setPristine();

                jQuery(document).ready(function(){
                    jQuery("#myPartsEdit").modal("hide");
                });
            } else {
                toastr.error('Erro ao alterar a peça/item. Exclua a peça/item e inclua novamente.', 'Alteração de peça/item', {timeOut: 3000});
            }
        };

        vm.removePart = function(part) {
            var parts = vm.maintenance.parts;

            var found = $filter('filter')(parts, part, true);

            if (found.length) {

                if(part.revisao_item_id){
                    var data = {
                        id: $localstorage.getObject('id')
                    };
                    PartService.removePartMaintenance(part.revisao_item_id, data).then(function (data) {
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

                vm.maintenance.parts = parts;

            } else {
                toastr.error('Erro ao excluir a peça/item', 'Exclusão de peça/item', {timeOut: 3000});
            }
        };

        vm.getKm = function() {
            if(vm.maintenance.truck.carro_km){
                vm.message = 'Km atual é ';
                vm.unit = 'km';
                vm.qtd_km = vm.maintenance.truck.carro_km;
            } else {
                vm.message = '';
                vm.unit = '';
                vm.qtd_km = '';
            }
            vm.maintenance.km = '';
            vm.maintenance.status = '';
            vm.view_status = false;
            vm.view_date = false;
        };

        vm.checkPart = function() {

            if(vm.part.part_select.parts.length) {
                vm.part.options = vm.part.part_select.parts;
                vm.part.qtd = 0;
                vm.field_price = false;
            } else {
                vm.field_price = true;
                vm.part.price = '';
                vm.part.price_unit = '';
                vm.part.qtd = 0;
                vm.part.options = {};
            }
        };

        vm.checkPrice = function() {

            if(vm.part.part_option_select) {
                vm.part.message_price = 'Preço: ';
                vm.part.price = vm.part.part_option_select.estoque_preco_unitario;
                vm.part.qtd = 0;
            } else {
                vm.part.qtd = 0;
            }
        };

        vm.updatePrice = function() {
            if(vm.part.part_select && vm.part.qtd && vm.part.part_option_select) {
                vm.part.message_price = 'Preço: ';
                vm.part.price = parseInt(vm.part.part_option_select.estoque_preco_unitario) * vm.part.qtd;
                vm.part.price_unit = vm.part.part_option_select.estoque_preco_unitario;
            } else {
                vm.part.message_price = 'Preço: ';
                vm.part.price = parseInt(vm.part.price_unit) * vm.part.qtd;
            }
        };

        vm.checkKm = function() {
            if(vm.maintenance.km <= vm.maintenance.truck.carro_km) {
                vm.view_status = true;
            } else {
                vm.view_status = false;
            }
        };

        vm.checkStatus = function(status) {
            if(status == 2) {
                vm.view_date = true;

                jQuery(document).ready(function(){
                    var bodyHeight = jQuery(this).height();
                    jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                    jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
                });

            } else {
                vm.view_date = false;
            }
        };

        vm.submitAddMaintenance = function(maintenance) {
            var price = null;
            var date = null;

            if(!maintenance.parts.length) {
                toastr.error('Erro ao alterar a peça/item. Informe uma peça/item', 'Alteração de peça/item', {timeOut: 3000});
                return false;
            }

            if(maintenance.status != 1){
                price = maintenance.price;
                date = maintenance.date;
            }

            var postData = {
                revisao_id: vm.revisao_id,
                revisao_manual: vm.revisao_manual,
                revisao_comments: maintenance.comments,
                revisao_date: date,
                revisao_km: maintenance.km,
                revisao_price: price,
                revisao_status: maintenance.status,
                carro_id: maintenance.truck.carro_id
            };

            var idx = 0;

            Object.keys(maintenance.parts).forEach(function(partId) {

                if(!maintenance.parts[partId].revisao_item_qtd || !maintenance.parts[partId].revisao_item_valor) {
                    toastr.error('Erro ao alterar a peça/item. Informe valor e preço de todas peças/itens', 'Alteração de peça/item', {timeOut: 3000});
                    return false;
                }

                postData['estoque_id_' + idx] = maintenance.parts[partId].estoque_id;
                postData['item_id_' + idx] = maintenance.parts[partId].item_id;
                postData['revisao_item_id_' + idx] = maintenance.parts[partId].revisao_item_id;
                postData['revisao_item_qtd_' + idx] = maintenance.parts[partId].revisao_item_qtd;
                postData['revisao_item_valor_' + idx] = maintenance.parts[partId].revisao_item_valor;
                idx++;
            });

            PartService.updateMaintenance(vm.revisao_id, postData).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Manutenção', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Manutenção', {timeOut: 3000});

                    vm.maintenance = {};
                    $rootScope.$broadcast("login-done");
                    $location.path('/add-maintenance');
                }
            });
        };

        vm.getAllParts = function() {
            PartService.getAllParts().then(function (data) {
                vm.parts = data.getParts;
            });
        };

        vm.getAllParts();

        jQuery(document).ready(function(){
            jQuery('.popovers').popover();
        });

    }

})();