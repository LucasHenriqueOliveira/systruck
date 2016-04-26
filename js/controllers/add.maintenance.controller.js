(function () {
    'use strict';

    angular
        .module('app')
        .controller('AddMaintenanceController', AddMaintenanceController);

    AddMaintenanceController.$inject = ['$location', '$localstorage', 'PartService', 'TruckService', 'DataService', '$scope', '$filter', '$rootScope'];

    function AddMaintenanceController($location, $localstorage, PartService, TruckService, DataService, $scope, $filter, $rootScope) {
        var vm = this;
        vm.message = '';
        vm.qtd_km = '';
        vm.part = {};
        vm.maintenance = {};
        vm.part.message_price = '';
        vm.part.price = '';
        vm.view_status = false;
        vm.view_date = false;
        vm.field_price = false;

        vm.maintenance.parts = DataService.getPart();

        TruckService.getTrucks().then(function (data) {
            vm.trucks = data.getTrucksAvailable;
        });

        vm.getAllParts = function() {
            PartService.getAllParts().then(function (data) {
                vm.parts = data.getParts;
            });
        };

        vm.getAllParts();

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

        vm.submitPart = function(part) {
            vm.maintenance.parts = $localstorage.getObject('parts');

            if(!part.part_option_select){
                part.part_option_select = {
                    estoque_id: null,
                    estoque_descricao: null
                }
            }

            if(JSON.stringify(vm.maintenance.parts) === '{}'){
                $localstorage.setObject('parts', [{
                    id_part: part.part_select.id,
                    name_part: part.part_select.name,
                    qtd: part.qtd,
                    price: part.price,
                    price_unit: part.price_unit,
                    id_stock: part.part_option_select.estoque_id,
                    desc_stock: part.part_option_select.estoque_descricao
                }]);
            } else{
                vm.maintenance.parts.push({
                    id_part: part.part_select.id,
                    name_part: part.part_select.name,
                    qtd: part.qtd,
                    price: part.price,
                    price_unit: part.price_unit,
                    id_stock: part.part_option_select.estoque_id,
                    desc_stock: part.part_option_select.estoque_descricao
                });
                $localstorage.setObject('parts', vm.maintenance.parts);
            }

            vm.maintenance.parts = DataService.getPart();
            vm.part = {};
            $scope.formParts.$setPristine();

            jQuery(document).ready(function(){
                jQuery("#myParts").modal("hide");

                var bodyHeight = jQuery(this).height();
                jQuery("html, body").animate({ scrollTop: 0 }, "slow");
                jQuery(".content .clearfix").parent().animate({ height: (bodyHeight/2) }, "slow");
            });
        };

        vm.editPart = function(part) {

            vm.part.part_select = {
                id: part.id_part,
                name: part.name_part
            };

            if(!part.id_stock) {
                vm.field_price = true;
                vm.part.price_unit = part.price_unit;
                vm.part.options = {
                    length: 0
                };
            } else {
                vm.field_price = false;

                for(var i = 0; i < vm.parts.length; i++) {
                    if(vm.parts[i].id === part.id_part){
                        vm.part.options = vm.parts[i].parts;
                    }
                }

                vm.part.part_option_select = {
                    estoque_id: part.id_stock,
                    estoque_descricao: part.desc_stock,
                    estoque_preco_unitario: part.price_unit
                }
            }

            vm.part.message_price = 'Preço: ';
            vm.part.price = part.price;
            vm.part.qtd = part.qtd;

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

            var parts = $localstorage.getObject('parts');
            var found = $filter('filter')(parts, {id_part: part.part_select.id,
                id_stock: part.part_option_select.estoque_id}, true);

            if (found.length) {
                for(var i = 0; i < parts.length; i++) {
                    var obj = parts[i];

                    if(found.indexOf(obj) !== -1) {
                        parts[i]['id_part'] = part.part_select.id;
                        parts[i]['name_part'] = part.part_select.name;
                        parts[i]['qtd'] = part.qtd;
                        parts[i]['price'] = part.price;
                        parts[i]['price_unit'] = part.price_unit;
                        parts[i]['id_stock'] = part.part_option_select.estoque_id;
                        parts[i]['desc_stock'] = part.part_option_select.estoque_descricao;
                    }
                    $localstorage.setObject('parts', parts);
                    vm.maintenance.parts = DataService.getPart();
                    vm.part = {};
                    $scope.formParts.$setPristine();

                    jQuery(document).ready(function(){
                        jQuery("#myPartsEdit").modal("hide");
                    });
                }
            } else {
                toastr.error('Erro ao alterar a peça/item. Exclua a peça/item e inclua novamente.', 'Alteração de peça/item', {timeOut: 3000});
            }
        };

        vm.removePart = function(part) {
            var parts = $localstorage.getObject('parts');

            var found = $filter('filter')(parts, part, true);

            if (found.length) {
                for(var i = 0; i < parts.length; i++) {
                    var obj = parts[i];

                    if(found.indexOf(obj) !== -1) {
                        parts.splice(i, 1);
                        i--;
                    }
                }
                $localstorage.setObject('parts', parts);
                vm.maintenance.parts = DataService.getPart();

            } else {
                toastr.error('Erro ao excluir a peça/item', 'Exclusão de peça/item', {timeOut: 3000});
            }
        };

        vm.submitAddMaintenance = function(form) {

            var price = null;
            var date = null;

            if(form.status == 2) {
                var price = form.price;
                var date = form.date;

                if(!price || !date) {
                    toastr.error('Informe a data e preço da manutenção.', 'Adicionar manutenção', {timeOut: 3000});
                    return false;
                }
            }

            var postData = {
                carro_id: form.truck.carro_id,
                revisao_km: form.km,
                empresa: $localstorage.getObject('company'),
                revisao_status: form.status,
                revisao_data: date,
                revisao_preco: price,
                revisao_observacao: form.comments,
                id_usuario: $localstorage.getObject('id'),
                qtd_parts: form.parts.length
            };

            var idx = 0;

            Object.keys(form.parts).forEach(function(partId) {
                postData['id_part_' + idx] = form.parts[partId].id_part;
                postData['id_stock_' + idx] = form.parts[partId].id_stock;
                postData['qtd_' + idx] = form.parts[partId].qtd;
                postData['price_' + idx] = form.parts[partId].price;
                idx++;
            });

            PartService.createMaintenance(postData).then(function (data) {
                if(data.error) {
                    toastr.error(data.message, 'Manutenção', {timeOut: 3000});
                } else {
                    toastr.success(data.message, 'Manutenção', {timeOut: 3000});
                    $localstorage.remove('parts');
                    $scope.form.$setPristine();
                    $localstorage.remove('maintenance');
                    $rootScope.$broadcast("login-done");

                    var date_add = new Date();
                    form.date_add = date_add.getDate() + '/' + (date_add.getMonth() + 1) + '/' +  date_add.getFullYear();
                    $localstorage.setObject('maintenance', form);
                    vm.maintenance = {};
                    $location.path('/add-maintenance-confirm');
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

    }

})();