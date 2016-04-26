var mysql = require('mysql');

var dashController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the user
    var post = function(req, res){

        var company = req.body.company;
        var roles = req.body.roles;
        var date = new Date();
        var firstDay = (new Date(date.getFullYear(), date.getMonth(), 1)).toISOString().split('T')[0];
        var lastDay = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).toISOString().split('T')[0];

        connection.query("CALL dashboard(?, ?, ?, ?)",[firstDay, lastDay, company, roles], function(err, rows) {
            if (err)
                return res.send(err);

            var rank_truck = {};
            var rank_driver = {};
            var qtd_viagens = 0;
            var result = 0;
            var resultado = 0;
            var despesa_geral = 0;
            var qtd_abastecimento = 0;
            var qtd_manutencao = 0;
            var qtd_carros = 0;

            if(rows[0][0].qtd_viagens)
                qtd_viagens = rows[0][0].qtd_viagens;

            if (rows[2][0].total_abastecimento)
                qtd_abastecimento = (rows[2][0].total_abastecimento).toFixed(2);

            if (rows[3][0].total_manutencao)
                qtd_manutencao = (rows[3][0].total_manutencao).toFixed(2);

            if(rows[6].length) {
                rank_truck = rows[6];
            }

            if(rows[7].length) {
                rank_driver = rows[7];
            }

            if (roles == 1){
                if (rows[5][0].resultado)
                    resultado = Number(rows[5][0].resultado);

                if(rows[4][0].despesa_geral)
                    despesa_geral = Number(rows[4][0].despesa_geral);

                result = (resultado - despesa_geral - qtd_abastecimento - qtd_manutencao).toFixed(2);

                res.json({
                    qtd_viagens: qtd_viagens,
                    resultado: result,
                    qtd_abastecimento: qtd_abastecimento,
                    qtd_manutencao: qtd_manutencao,
                    rank_truck: rank_truck,
                    rank_driver: rank_driver
                });
            } else {

                qtd_carros = rows[1][0].qtd_carros | qtd_carros;

                res.json({
                    qtd_viagens: qtd_viagens,
                    qtd_carros: qtd_carros,
                    qtd_abastecimento: qtd_abastecimento,
                    qtd_manutencao: qtd_manutencao,
                    rank_truck: rank_truck,
                    rank_driver: rank_driver
                });
            }
        });

    };

    return {
        post: post
    }
};

module.exports = dashController;