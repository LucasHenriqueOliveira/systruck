var mysql = require('mysql');

var addTripController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    var post = function(req, res) {

        var company = req.body.company;
        var id_user = req.body.id_user;
        var cityDestinationId = req.body.cityDestinationId;
        var cityHomeId = req.body.cityHomeId;
        var comments = req.body.comments;
        var dateArrival = req.body.dateArrival;
        var dateOutput = req.body.dateOutput;
        var driverSelect = req.body.driverSelect;
        var kmArrival = req.body.kmArrival;
        var kmOutput = req.body.kmOutput;
        var kmPaid = req.body.kmPaid;
        var moneyCompany = req.body.moneyCompany;
        var moneyComplement = req.body.moneyComplement;
        var totalMoney = req.body.totalMoney;
        var truckSelect = req.body.truckSelect;
        var fuelsNumber = req.body.fuelsNumber;
        var expensesNumber = req.body.expensesNumber;
        var connectionsNumber = req.body.connectionsNumber;
        var date = new Date();

        dateArrival = convertDate(dateArrival);
        dateOutput = convertDate(dateOutput);

        connection.beginTransaction(function(err) {
            if (err) {
                return res.json({
                    error: true,
                    message: 'Erro ao iniciar a transação'
                });
            }

            connection.query("INSERT INTO viagem (viagem_cidade_origem_id, viagem_cidade_destino_id, viagem_data_saida, " +
                "viagem_data_chegada, viagem_km_saida, viagem_km_chegada, viagem_carro_id, viagem_empresa_id, viagem_usuario_id, " +
                "viagem_valor_km, viagem_frete, viagem_adiantamento, viagem_complemento, viagem_observacao, " +
                "viagem_usuario_id_ativacao, viagem_data_ativacao) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[cityHomeId,
                cityDestinationId, dateOutput, dateArrival, kmOutput, kmArrival, truckSelect, company, driverSelect, kmPaid,
                totalMoney, moneyCompany, moneyComplement, comments, id_user, date], function(err, row) {
                if (err) {
                    connection.rollback(function() {
                        return res.json({
                            error: true,
                            message: 'Erro ao inserir a viagem'
                        });
                    });
                }

                var viagem_id = row.insertId;
                var name_fuel = "";
                var price_fuel = "";
                var qtd_fuel = "";
                var date_fuel = "";
                var name_expense = "";
                var type_expense = "";
                var value_expense = "";
                var date_expense = "";
                var city_destination = "";
                var city_home = "";
                var date_arrival = "";
                var date_output = "";
                var km_arrival = "";
                var km_output = "";
                var km_paid = "";
                var money_company = "";
                var money_complement = "";
                var total_money = "";
                var km_fuel = "";
                var tank_fuel = "";

                for(var i = 0; i < connectionsNumber; i++) {
                    city_destination = req.body["city_destination_" + i];
                    city_home = req.body["city_home_" + i];
                    date_arrival = convertDate(req.body["date_arrival_" + i]);
                    date_output = convertDate(req.body["date_output_" + i]);
                    km_arrival = req.body["km_arrival_" + i];
                    km_output = req.body["km_output_" + i];
                    km_paid = req.body["km_paid_" + i];
                    money_company = req.body["money_company_" + i];
                    money_complement = req.body["money_complement_" + i];
                    total_money = req.body["total_money_" + i];

                    connection.query("INSERT INTO conexao (conexao_viagem_id, conexao_carro_id, " +
                        "conexao_cidade_origem_id, conexao_cidade_destino_id, conexao_data_saida, " +
                        "conexao_data_chegada, conexao_km_saida, conexao_km_chegada, conexao_valor_km, " +
                        "conexao_frete, conexao_adiantamento, conexao_complemento, " +
                        "conexao_usuario_id_ativacao, conexao_data_ativacao) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[viagem_id,
                        truckSelect, city_home, city_destination, date_output, date_arrival, km_output, km_arrival,
                        km_paid, total_money, money_company, money_complement, id_user, date], function(err, row) {
                        if (err) {
                            connection.rollback(function() {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao realizar a conexão'
                                });
                            });
                        }

                    });
                }

                for(var i = 0; i < fuelsNumber; i++) {
                    name_fuel = req.body["name_fuel_" + i];
                    price_fuel = req.body["price_fuel_" + i];
                    qtd_fuel = req.body["qtd_fuel_" + i];
                    date_fuel = convertDate(req.body["date_fuel_" + i]);
                    km_fuel = req.body["km_fuel_" + i];
                    tank_fuel = req.body["tank_fuel_" + i];

                    connection.query("INSERT INTO abastecimento (abastecimento_nome, abastecimento_valor, " +
                        "abastecimento_litros, abastecimento_data, abastecimento_carro_id, abastecimento_viagem_id, abastecimento_km, abastecimento_tanque_cheio, " +
                        "abastecimento_usuario_id_ativacao, abastecimento_data_ativacao) values(?,?,?,?,?,?,?,?,?,?)",[name_fuel,
                        price_fuel, qtd_fuel, date_fuel, truckSelect, viagem_id, km_fuel, tank_fuel, id_user, date], function(err, row) {
                        if (err) {
                            connection.rollback(function() {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao realizar os abastecimentos'
                                });
                            });
                        }

                    });
                }

                for(i = 0; i < expensesNumber; i++) {
                    name_expense = req.body["name_expense_" + i];
                    type_expense = req.body["type_expense_" + i];
                    value_expense = req.body["value_expense_" + i];
                    date_expense = convertDate(req.body["date_expense_" + i]);

                    connection.query("INSERT INTO despesa (despesa_nome, despesa_tipo, " +
                        "despesa_valor, despesa_data, despesa_carro_id, despesa_viagem_id, " +
                        "despesa_usuario_id_ativacao, despesa_data_ativacao) values(?,?,?,?,?,?,?,?)",[name_expense,
                        type_expense, value_expense, date_expense, truckSelect, viagem_id, id_user, date], function(err, row) {
                        if (err) {
                            connection.rollback(function() {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao salvar as despesas'
                                });
                            });
                        }
                    });
                }

                connection.query("UPDATE carro SET carro_km = ? WHERE carro_id = ?",[kmArrival, truckSelect], function(err, row) {
                    if (err) {
                        connection.rollback(function() {
                            return res.json({
                                error: true,
                                message: 'Erro ao atualizar a km'
                            });
                        });
                    }
                });

                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            return res.json({
                                error: true,
                                message: 'Erro ao realizar a transação'
                            });
                        });
                    }
                    connection.end();
                    res.json({
                        error: false,
                        viagem_id: viagem_id
                    });
                });
            });
        });
    };

    var get = function(req, res) {

        var id = req.params.id;

        connection.query("CALL getTrip(?)",[id], function(err, rows) {
            if (err) {
                return res.json({
                    error: true,
                    message: err
                });
            }

            var getTrip = {};
            var getConnection = {};
            var getFuel = {};
            var getExpense = {};

            if(rows[0].length) {
                getTrip = rows[0][0];
            }

            if(rows[1].length) {
                getConnection = rows[1];
            }

            if(rows[2].length) {
                getFuel = rows[2];
            }

            if(rows[3].length) {
                getExpense = rows[3];
            }

            res.json({
                getTrip: getTrip,
                getConnection: getConnection,
                getFuel: getFuel,
                getExpense: getExpense
            });

        });
    };

    var put = function(req, res) {

        var id = req.params.id;
        var id_user = req.body.id_user;
        var company = req.body.company;
        var cityDestinationId = req.body.cityDestinationId;
        var cityHomeId = req.body.cityHomeId;
        var comments = req.body.comments;
        var dateArrival = req.body.dateArrival;
        var dateOutput = req.body.dateOutput;
        var driverSelect = req.body.driverSelect;
        var kmArrival = req.body.kmArrival;
        var kmOutput = req.body.kmOutput;
        var kmPaid = req.body.kmPaid;
        var moneyCompany = req.body.moneyCompany;
        var moneyComplement = req.body.moneyComplement;
        var totalMoney = req.body.totalMoney;
        var truckSelect = req.body.truckSelect;
        var fuelsNumber = req.body.fuelsNumber;
        var expensesNumber = req.body.expensesNumber;
        var connectionsNumber = req.body.connectionsNumber;

        dateArrival = convertDate(dateArrival);
        dateOutput = convertDate(dateOutput);

        connection.beginTransaction(function(err) {
            if (err) {
                return res.json({
                    error: true,
                    message: 'Erro ao iniciar a transação'
                });
            }

            connection.query("UPDATE viagem SET viagem_cidade_origem_id = ?, viagem_cidade_destino_id = ?, viagem_data_saida = ?, viagem_data_chegada = ?, " +
                "viagem_km_saida = ?, viagem_km_chegada = ?, viagem_carro_id = ?, viagem_empresa_id = ?, viagem_usuario_id = ?, viagem_valor_km = ?" +
                "viagem_frete = ?, viagem_adiantamento = ?, viagem_complemento = ?, viagem_observacao = ?, viagem_usuario_id_ativacao = ?" +
                "viagem_data_ativacao = NOW() WHERE viagem_id = ?", [cityHomeId, cityDestinationId, dateOutput, dateArrival, kmOutput, kmArrival, truckSelect, company,
                driverSelect, kmPaid, totalMoney, moneyCompany, moneyComplement, comments, id_user, id], function (err, car) {
                if (err) {
                    connection.rollback(function () {
                        return res.json({
                            error: true,
                            message: 'Erro ao editar a viagem'
                        });
                    });
                }
            });

            for(var i = 0; i < connectionsNumber; i++) {

                var id_connection = req.body['id_connection_' + i];
                var city_destination = req.body['city_destination_' + i];
                var city_home = req.body['city_home_' + i];
                var date_arrival = convertDate(req.body['date_arrival_' + i]);
                var date_output = convertDate(req.body['date_output_' + i]);
                var km_arrival = req.body['km_arrival_' + i];
                var km_output = req.body['km_output_' + i];
                var km_paid = req.body['km_paid_' + i];
                var money_company = req.body['money_company_' + i];
                var money_complement = req.body['money_complement_' + i];
                var total_money = req.body['total_money_' + i];

                if(id_connection) {

                    connection.query("UPDATE conexao SET conexao_cidade_origem_id = ?, conexao_cidade_destino_id = ?, conexao_data_saida = ?, " +
                        "conexao_data_chegada = ?, conexao_km_saida = ?, conexao_km_chegada = ?, conexao_valor_km = ?, conexao_frete = ?, conexao_adiantamento = ?, " +
                        "conexao_complemento = ?, conexao_viagem_id = ?, conexao_carro_id = ? WHERE conexao_id = ?", [id, city_home, city_destination,
                        date_output, date_arrival, km_output, km_arrival, km_paid, total_money, money_company, money_complement, id, truckSelect, id_connection], function (err, row) {
                        if (err) {
                            connection.rollback(function () {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao editar a conexão'
                                });
                            });
                        }
                    });
                } else {
                    connection.query("INSERT INTO revisao (conexao_cidade_origem_id, conexao_cidade_destino_id, conexao_data_saida, conexao_data_chegada," +
                        "conexao_km_saida, conexao_km_chegada, conexao_valor_km, conexao_frete, conexao_adiantamento, conexao_complemento, conexao_viagem_id" +
                        "conexao_carro_id, conexao_ativo, conexao_usuario_id_ativacao, conexao_data_ativacao) " +
                        "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,1,?,NOW())", [city_home, city_destination, date_output, date_arrival, km_output, km_arrival,
                        km_paid, total_money, money_company, money_complement, id, truckSelect, id_user], function (err, row) {
                        if (err) {
                            connection.rollback(function () {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao inserir a conexão'
                                });
                            });
                        }
                    });
                }
            }

            for(var i = 0; i < fuelsNumber; i++) {

                var id_fuel = req.body['id_fuel_' + i];
                var date_fuel = convertDate(req.body['date_fuel_' + i]);
                var name_fuel = req.body['name_fuel_' + i];
                var price_fuel = req.body['price_fuel_' + i];
                var qtd_fuel = req.body['qtd_fuel_' + i];
                var km = req.body['km_' + i];
                var tank = req.body['tank_' + i];

                if(id_fuel) {

                    connection.query("UPDATE abastecimento SET abastecimento_nome = ?, abastecimento_data = ?, abastecimento_valor = ?, " +
                        "abastecimento_litros = ?, abastecimento_km = ?, abastecimento_tanque_cheio = ?, abastecimento_viagem_id = ?, " +
                        "abastecimento_carro_id = ? WHERE abastecimento_id = ?", [name_fuel, date_fuel, price_fuel, qtd_fuel, km, tank,
                        id, truckSelect, id_fuel], function (err, row) {
                        if (err) {
                            connection.rollback(function () {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao editar o abastecimento'
                                });
                            });
                        }
                    });
                } else {
                    connection.query("INSERT INTO abastecimento (abastecimento_nome, abastecimento_data, abastecimento_valor, abastecimento_litros, " +
                        "abastecimento_km, abastecimento_tanque_cheio, abastecimento_viagem_id, abastecimento_carro_id, abastecimento_ativo, " +
                        "abastecimento_usuario_id_ativacao, abastecimento_data_ativacao) " +
                        "VALUES(?,?,?,?,?,?,?,?,1,?,NOW())", [name_fuel, date_fuel, price_fuel, qtd_fuel, km, tank,
                        id, truckSelect, id_user], function (err, row) {
                        if (err) {
                            connection.rollback(function () {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao inserir o abastecimento'
                                });
                            });
                        }
                    });
                }
            }

            for(var i = 0; i < expensesNumber; i++) {

                var id_expense = req.body['id_expense_' + i];
                var date_expense = convertDate(req.body['date_expense_' + i]);
                var name_expense = req.body['name_expense_' + i];
                var type_expense = req.body['type_expense_' + i];
                var value_expense = req.body['value_expense_' + i];

                if(id_expense) {

                    connection.query("UPDATE despesa SET despesa_nome = ?, despesa_tipo = ?, despesa_valor = ?, despesa_data = ?, " +
                        "despesa_carro_id = ?, despesa_viagem_id = ? WHERE despesa_id = ?", [name_expense, type_expense, value_expense, date_expense,
                        truckSelect, id, id_expense], function (err, row) {
                        if (err) {
                            connection.rollback(function () {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao editar a despesa'
                                });
                            });
                        }
                    });
                } else {
                    connection.query("INSERT INTO despesa (despesa_nome, despesa_tipo, despesa_valor, despesa_data, " +
                        "despesa_carro_id, despesa_viagem_id, despesa_ativo, despesa_usuario_id_ativacao, despesa_data_ativacao) " +
                        "VALUES(?,?,?,?,?,?,1,?,NOW())", [name_expense, type_expense, value_expense, date_expense, truckSelect, id,
                        id_user], function (err, row) {
                        if (err) {
                            connection.rollback(function () {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao inserir a despesa'
                                });
                            });
                        }
                    });
                }
            }

            connection.commit(function(err) {
                if (err) {
                    connection.rollback(function() {
                        return res.json({
                            error: true,
                            message: 'Erro ao realizar a transação'
                        });
                    });
                }
                connection.end();
                res.json({
                    error: false,
                    viagem_id: viagem_id
                });
            });
        });


    };

    var putRemoveFuel = function(req, res) {

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE abastecimento SET abastecimento_ativo = 0, abastecimento_usuario_id_desativacao = ?, " +
            "abastecimento_data_desativacao = NOW() WHERE abastecimento_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar o abastecimento."});

            res.json({"error": false, "message": "Abastecimento desativado com sucesso."});
        });

    };

    var putRemoveExpense = function(req, res) {

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE despesa SET despesa_ativo = 0, despesa_usuario_id_desativacao = ?, " +
            "despesa_data_desativacao = NOW() WHERE despesa_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar a despesa."});

            res.json({"error": false, "message": "Despesa desativado com sucesso."});
        });

    };

    var putRemoveConnection = function(req, res) {

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE conexao SET conexao_ativo = 0, conexao_usuario_id_desativacao = ?, " +
            "conexao_data_desativacao = NOW() WHERE conexao_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar a conexão."});

            res.json({"error": false, "message": "Conexão desativado com sucesso."});
        });

    };

    return {
        post: post,
        get: get,
        put: put,
        putRemoveFuel: putRemoveFuel,
        putRemoveExpense: putRemoveExpense,
        putRemoveConnection: putRemoveConnection
    }
};

module.exports = addTripController;

function convertDate(date) {
    var datePart = date.split('/');
    return datePart[2] + "-" + datePart[1] + "-" + datePart[0];
}