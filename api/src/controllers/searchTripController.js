var mysql = require('mysql');

var searchTripController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    var post = function(req, res) {

        var numberTrip = req.body.numberTrip;
        var dateInitial = req.body.dateInitial;
        var dateFinal = req.body.dateFinal;
        var truckSelect = req.body.truckSelect;
        var driverSelect = req.body.driverSelect;
        var cityDestinationId = req.body.cityDestinationId;
        var cityHomeId = req.body.cityHomeId;
        var company = req.body.company;

        var strNumberTrip = '';
        var strDateInitial = '';
        var strDateFinal = '';
        var strTruckSelect = '';
        var strDriverSelect = '';
        var strCityDestinationId = '';
        var strCityHomeId = '';

        if(numberTrip) {
            strNumberTrip = " AND v.viagem_id = " + numberTrip;
        }

        if(typeof truckSelect !== "undefined") {
            strTruckSelect = " AND v.viagem_carro_id = " + truckSelect;
        }

        if(typeof driverSelect !== "undefined") {
            strDriverSelect = " AND v.viagem_usuario_id = " + driverSelect;
        }

        if(typeof cityDestinationId !== "undefined") {
            strCityDestinationId = " AND v.viagem_cidade_destino_id = " + cityDestinationId;
        }

        if(typeof cityHomeId !== "undefined") {
            strCityHomeId = " AND v.viagem_cidade_origem_id = " + cityHomeId;
        }

        if(dateInitial) {
            strDateInitial = " AND v.viagem_data_saida >= '" + convertDate(dateInitial) + "'";
        }

        if(dateFinal) {
            strDateFinal = " AND v.viagem_data_chegada <= '" + convertDate(dateFinal) + "'";
        }

        connection.query("SELECT v.viagem_id, c.cidade_nome as cidade_origem, ci.cidade_nome as cidade_destino," +
            "DATE_FORMAT(v.viagem_data_saida, '%d/%m/%Y') as data_saida," +
            "DATE_FORMAT(v.viagem_data_chegada, '%d/%m/%Y') as data_chegada," +
            "u.usuario_nome, ca.carro_nome, ca.carro_frota, ca.carro_placa, ca.carro_placa_semi_reboque " +
            "FROM viagem v INNER JOIN cidade c ON v.viagem_cidade_origem_id = c.cidade_id " +
            "INNER JOIN cidade ci ON v.viagem_cidade_destino_id = ci.cidade_id " +
            "INNER JOIN usuario u ON u.usuario_id = v.viagem_usuario_id " +
            "INNER JOIN carro ca ON ca.carro_id = v.viagem_carro_id " +
            "WHERE v.viagem_empresa_id = 1 AND v.viagem_ativo = 1 AND v.viagem_empresa_id = ?" + strNumberTrip +
            strTruckSelect + strDriverSelect + strCityDestinationId + strCityHomeId + strDateInitial + strDateFinal +
            " ORDER BY v.viagem_data_ativacao DESC",[company], function(err, row) {

            if (err) {
                return res.json({
                    error: true,
                    message: 'Erro ao realizar a pesquisa!'
                });
            }

            if (!row.length) {
                return res.json({error: true, message: 'Nenhuma viagem foi encontrada.'});
            } else {
                res.json({error: false, trip: row});
            }
        });
    };

    return {
        post: post
    }
};

module.exports = searchTripController;

function convertDate(date) {
    var datePart = date.split('/');
    return datePart[2] + "-" + datePart[1] + "-" + datePart[0];
}