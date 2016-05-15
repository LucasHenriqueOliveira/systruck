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

            res.json({
                getCompany: rows[0][0]
            });

        });
    };

    return {
        post: post,
        get: get
    }
};

module.exports = addTripController;

function convertDate(date) {
    var datePart = date.split('/');
    return datePart[2] + "-" + datePart[1] + "-" + datePart[0];
}