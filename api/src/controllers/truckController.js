var mysql = require('mysql');
var Q = require('q');

var truckController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // create the user
    var post = function(req, res){

        var frota = req.body.frota;
        var nome = req.body.nome;
        var placa = (req.body.placa).toUpperCase();
        var placa_semi_reboque = (req.body.placa_semi_reboque).toUpperCase();
        var km = req.body.km;
        var qtd_part = req.body.qtd_part;
        var id_usuario = req.body.usuario_ativacao;
        var empresa = req.body.empresa;

        connection.beginTransaction(function(err) {
            if (err) {
                return res.json({
                    error: true,
                    message: 'Erro ao iniciar a transação do cadastro de caminhão'
                });
            }

            connection.query("INSERT INTO carro (carro_nome, carro_frota, carro_placa, carro_placa_semi_reboque, " +
                "carro_km, carro_empresa_id, carro_data_ativacao, carro_usuario_id_ativacao) VALUES(?,?,?,?,?,?,NOW(),?)",
                [nome, frota, placa, placa_semi_reboque, km, empresa, id_usuario], function(err, car) {
                if (err) {
                    connection.rollback(function() {
                        return res.json({
                            error: true,
                            message: 'Erro ao inserir o caminhão'
                        });
                    });
                }

                var carro_id = car.insertId;
                var km = "";
                var part_id = "";
                var stock_id = "";
                var last_part = "";
                var time_part = "";

                for(var i = 0; i < qtd_part; i++) {

                    km = req.body['last_part_' + i] + req.body['time_part_' + i];
                    part_id = req.body['id_part_' + i];
                    stock_id = req.body['stock_' + i];
                    last_part = req.body['last_part_' + i];
                    time_part = req.body['time_part_' + i];

                    var revisao_id = '';
                    Q.all([revisao(km, part_id, stock_id, time_part, last_part)]).then(function (data) {

                        if(data[0].error){
                            connection.rollback(function() {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao criar a revisão do caminhão'
                                });
                            });
                        }

                        revisao_id = data[0].revisao_id;
                        part_id = data[0].part_id;
                        stock_id = data[0].stock_id;
                        time_part = data[0].time_part;
                        last_part = data[0].last_part;

                        Q.all([revisao_item(revisao_id, part_id, stock_id), carro_item(revisao_id, part_id, time_part, last_part)]).then(function (data) {
                            // INCLUSAO DOS DADOS DO CAMINHAO SEM ERRO

                        }, function(error) {

                            connection.rollback(function() {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao criar o item da revisão do caminhão'
                                });
                            });
                        });
                    });

                    function revisao(km, part_id, stock_id, time_part, last_part) {

                        var deferred = Q.defer();

                        connection.query("INSERT INTO revisao (revisao_carro_id, revisao_km, revisao_empresa_id, revisao_status," +
                            "revisao_usuario_id_ativacao, revisao_data_ativacao) " +
                            "VALUES(?,?,?,1,?,NOW())", [carro_id, km, empresa, id_usuario], function (err, row) {
                            if (err) {
                                deferred.resolve({error: true, message: err});
                            } else {
                                deferred.resolve({
                                    error: false,
                                    revisao_id: row.insertId,
                                    part_id: part_id,
                                    stock_id: stock_id,
                                    time_part: time_part,
                                    last_part: last_part
                                });
                            }
                        });
                        return deferred.promise;
                    }

                    function revisao_item(revisao_id, part_id, stock_id){
                        var deferred = Q.defer();

                        connection.query("INSERT INTO revisao_item (revisao_item_revisao_id, revisao_item_item_id, " +
                            "revisao_item_estoque_id, revisao_item_usuario_id_ativacao, revisao_item_data_ativacao)" +
                            "VALUES(?,?,?,?,NOW())",[revisao_id, part_id, stock_id, id_usuario], function(err, rows) {
                            if (err) {
                                deferred.resolve({error: true, message: err});
                            } else {
                                deferred.resolve({error: false});
                            }
                        });

                        return deferred.promise;
                    }

                    function carro_item(revisao_id, part_id, time_part, last_part){
                        var deferred = Q.defer();

                        connection.query("INSERT INTO carro_item (carro_item_carro_id, carro_item_item_id, carro_item_vida_util," +
                            "carro_item_revisao_id, carro_item_ultima_km, carro_item_usuario_id_ativacao, carro_item_data_ativacao) " +
                            "VALUES(?,?,?,?,?,?,NOW())",[carro_id, part_id, time_part, revisao_id, last_part, id_usuario], function(err, car_item) {
                            if (err) {

                                deferred.resolve({error: true, message: err});
                            } else {
                                deferred.resolve({error: false});
                            }
                        });

                        return deferred.promise;
                    }
                }

                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            return res.json({
                                error: true,
                                message: 'Erro ao realizar a transação do cadastro de caminhão'
                            });
                        });
                    }

                    res.json({
                        error: false,
                        message: 'Caminhão adicionado com sucesso'
                    });
                });
            });
        });

    };

    // get the truck
    var get = function(req, res){

        var id = req.params.id;

        connection.query("CALL getTruck(?)",[id], function(err, rows) {
            if (err)
                return res.send(err);

            var getTruck = {};
            var getTruckPart = {};

            if(rows[0].length) {
                getTruck = rows[0];
            }

            if(rows[1].length) {
                getTruckPart = rows[1];
            }

            res.json({
                getTruck: getTruck,
                getTruckPart: getTruckPart
            });
        });
    };

    // get the truck part
    var getTruckPart = function(req, res){

        var id = req.params.id;

        connection.query("SELECT ci.carro_item_id, ci.carro_item_item_id, ci.carro_item_vida_util, " +
            "ci.carro_item_ultima_km, i.item_nome, e.estoque_descricao, e.estoque_id " +
            "FROM carro_item ci INNER JOIN item i ON ci.carro_item_item_id = i.item_id " +
            "INNER JOIN revisao_item ri ON ci.carro_item_revisao_id = ri.revisao_item_revisao_id " +
            "LEFT JOIN estoque e ON e.estoque_id = ri.revisao_item_estoque_id " +
            "WHERE ci.carro_item_carro_id = ? AND ci.carro_item_ativo = 1 AND ri.revisao_item_ativo = 1",[id], function(err, rows) {
            if (err)
                return res.send(err);

            res.json({
                getTruckPart: rows
            });
        });
    };

    // get the trucks
    var getAll = function(req, res){

        var id = req.params.id;

        connection.query("CALL getTrucks(?)",[id], function(err, rows) {
            if (err)
                return res.send(err);

            var getTrucksAvailable = {};
            var getTrucksUnavailable = {};

            if(rows[0].length) {
                getTrucksAvailable = rows[0];
            }

            if(rows[1].length) {
                getTrucksUnavailable = rows[1];
            }

            res.json({
                getTrucksAvailable: getTrucksAvailable,
                getTrucksUnavailable: getTrucksUnavailable
            });

        });
    };

    // edit the truck
    var put = function(req, res) {

        var id = req.params.id;
        var frota = req.body.frota;
        var nome = req.body.nome;
        var placa = req.body.placa;
        var placa_semi_reboque = req.body.placa_semi_reboque;
        var km = req.body.km;
        var qtd_part = req.body.qtd_part;
        var id_usuario = req.body.usuario_ativacao;
        var empresa = req.body.empresa;

        connection.beginTransaction(function (err) {
            if (err) {
                return res.json({
                    error: true,
                    message: 'Erro ao iniciar a transação de editar o caminhão'
                });
            }

            connection.query("UPDATE carro SET carro_nome = ?, carro_frota = ?, carro_placa = ?, carro_placa_semi_reboque = ?, " +
                "carro_km = ? WHERE carro_id = ?", [nome, frota, placa, placa_semi_reboque, km, id], function (err, car) {
                    if (err) {
                        connection.rollback(function () {
                            return res.json({
                                error: true,
                                message: 'Erro ao editar o caminhão'
                            });
                        });
                    }

                    for(var i = 0; i < qtd_part; i++) {
                        var last_part = req.body['last_part_' + i];
                        var time_part = req.body['time_part_' + i];
                        var km = last_part + time_part;
                        var part_id = req.body['id_part_' + i];
                        var car_item_id = req.body['id_car_item_' + i];
                        var stock_id = req.body['stock_' + i];

                        if(car_item_id) {

                            connection.query("UPDATE carro_item SET carro_item_carro_id = ?, carro_item_item_id = ?, carro_item_vida_util = ?," +
                                "carro_item_ultima_km = ? WHERE carro_item_id = ?", [id, part_id, time_part, last_part, car_item_id], function (err, car_item) {
                                if (err) {
                                    connection.rollback(function () {
                                        return res.json({
                                            error: true,
                                            message: 'Erro ao editar o item do caminhão'
                                        });
                                    });
                                }
                            });

                            connection.query("UPDATE revisao r INNER JOIN revisao_item ri ON r.revisao_id = ri.revisao_item_revisao_id SET r.revisao_km = ?, ri.revisao_item_estoque_id = ? " +
                                "WHERE ri.revisao_item_item_id = ? AND r.revisao_status = 1 AND r.revisao_ativo = 1 AND ri.revisao_item_ativo = 1 " +
                                "AND r.revisao_carro_id = ? AND r.revisao_empresa_id = ?",[km, stock_id, part_id, id, empresa], function(err, row) {
                                if (err) {
                                    connection.rollback(function() {
                                        return res.json({
                                            error: true,
                                            message: 'Erro ao pesquisar a revisão do caminhão'
                                        });
                                    });
                                }
                            });


                        } else {

                            var revisao_id = '';
                            Q.all([revisao(km, part_id, stock_id, time_part, last_part)]).then(function (data) {

                                if(data[0].error){
                                    connection.rollback(function() {
                                        return res.json({
                                            error: true,
                                            message: 'Erro ao criar a revisão do caminhão'
                                        });
                                    });
                                }

                                revisao_id = data[0].revisao_id;
                                part_id = data[0].part_id;
                                stock_id = data[0].stock_id;
                                time_part = data[0].time_part;
                                last_part = data[0].last_part;

                                Q.all([revisao_item(revisao_id, part_id, stock_id), carro_item(revisao_id, part_id, time_part, last_part)]).then(function (data) {
                                    // INCLUSAO DOS DADOS DO CAMINHAO SEM ERRO

                                }, function(error) {

                                    connection.rollback(function() {
                                        return res.json({
                                            error: true,
                                            message: 'Erro ao criar o item da revisão do caminhão'
                                        });
                                    });
                                });
                            });

                            function revisao(km, part_id, stock_id, time_part, last_part) {

                                var deferred = Q.defer();

                                connection.query("INSERT INTO revisao (revisao_carro_id, revisao_km, revisao_empresa_id, revisao_status," +
                                    "revisao_usuario_id_ativacao, revisao_data_ativacao) " +
                                    "VALUES(?,?,?,1,?,NOW())", [id, km, empresa, id_usuario], function (err, row) {
                                    if (err) {
                                        deferred.resolve({error: true, message: err});
                                    } else {
                                        deferred.resolve({
                                            error: false,
                                            revisao_id: row.insertId,
                                            part_id: part_id,
                                            stock_id: stock_id,
                                            time_part: time_part,
                                            last_part: last_part
                                        });
                                    }
                                });
                                return deferred.promise;
                            }

                            function revisao_item(revisao_id, part_id, stock_id){
                                var deferred = Q.defer();

                                connection.query("INSERT INTO revisao_item (revisao_item_revisao_id, revisao_item_item_id, " +
                                    "revisao_item_estoque_id, revisao_item_usuario_id_ativacao, revisao_item_data_ativacao)" +
                                    "VALUES(?,?,?,?,NOW())",[revisao_id, part_id, stock_id, id_usuario], function(err, rows) {
                                    if (err) {
                                        deferred.resolve({error: true, message: err});
                                    } else {
                                        deferred.resolve({error: false});
                                    }
                                });

                                return deferred.promise;
                            }

                            function carro_item(revisao_id, part_id, time_part, last_part){
                                var deferred = Q.defer();

                                connection.query("INSERT INTO carro_item (carro_item_carro_id, carro_item_item_id, carro_item_vida_util," +
                                    "carro_item_revisao_id, carro_item_ultima_km, carro_item_usuario_id_ativacao, carro_item_data_ativacao) " +
                                    "VALUES(?,?,?,?,?,?,NOW())",[id, part_id, time_part, revisao_id, last_part, id_usuario], function(err, car_item) {
                                    if (err) {

                                        deferred.resolve({error: true, message: err});
                                    } else {
                                        deferred.resolve({error: false});
                                    }
                                });

                                return deferred.promise;
                            }
                        }
                    }

                    connection.commit(function (err) {
                        if (err) {
                            connection.rollback(function () {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao realizar a transação da edição de caminhão'
                                });
                            });
                        }

                        res.json({
                            error: false,
                            message: 'Caminhão alterado com sucesso'
                        });
                    });
                });
        });
    };

    // remove the truck
    var putRemove = function(req, res){

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE carro SET carro_ativo = 0, carro_usuario_id_desativacao = ?, " +
            "carro_data_desativacao = NOW() WHERE carro_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar o caminhão."});
        });

        connection.query("UPDATE revisao SET revisao_ativo = 0, revisao_usuario_id_desativacao = ?, " +
            "revisao_data_desativacao = NOW() WHERE revisao_carro_id = ? AND revisao_ativo = 1",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar o caminhão."});
        });

        connection.query("UPDATE carro_item SET carro_item_ativo = 0, carro_item_usuario_id_desativacao = ?, " +
            "carro_item_data_desativacao = NOW() WHERE carro_item_carro_id = ? AND carro_item_ativo = 1",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar o caminhão."});
        });

        res.json({"error": false, "message": "Caminhão desativado com sucesso."});
    };

    // remove the part truck
    var putRemovePart = function(req, res){

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE carro_item SET carro_item_ativo = 0, carro_item_usuario_id_desativacao = ?, " +
            "carro_item_data_desativacao = NOW() WHERE carro_item_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar o item/peça."});

            res.json({"error": false, "message": "Item/peça desativado com sucesso."});
        });
    };

    // active the truck
    var putActive = function(req, res){

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE carro SET carro_ativo = 1, carro_usuario_id_desativacao = NULL, " +
            "carro_data_desativacao = null, carro_usuario_id_ativacao = ?, carro_data_ativacao = NOW() " +
            "   WHERE carro_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao ativar o caminhão."});

            res.json({"error": false, "message": "Caminhão ativado com sucesso."});
        });
    };

    return {
        post: post,
        get: get,
        getTruckPart: getTruckPart,
        put: put,
        getAll: getAll,
        putRemove: putRemove,
        putRemovePart: putRemovePart,
        putActive: putActive
    }
};

module.exports = truckController;