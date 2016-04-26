var mysql = require('mysql');

var companyController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the company
    var get = function(req, res) {

        var id = req.params.id;

        connection.query("CALL getCompany(?)",[id], function(err, rows) {
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

    // edit the company
    var put = function(req, res) {

        var id = req.body.id;
        var logradouro = req.body.logradouro;
        var numero = req.body.numero;
        var complemento = req.body.complemento;
        var bairro = req.body.bairro;
        var cidade_id = req.body.cidade_id;
        var cep = req.body.cep;
        var telefone1 = req.body.telefone1;
        var telefone2 = req.body.telefone2;

        connection.query("UPDATE empresa SET empresa_logradouro = ?, empresa_numero = ?, " +
            "empresa_complemento = ?, empresa_bairro = ?, empresa_cidade_id = ?, " +
            "empresa_cep = ?, empresa_telefone_1 = ?, empresa_telefone_2 = ? " +
            "WHERE empresa_id = ?",[logradouro, numero, complemento, bairro, cidade_id, cep, telefone1, telefone2, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao alterar os dados da empresa."});

            res.json({"error": false, "message": "Dados da empresa alterado com sucesso."});
        });
    };

    return {
        get: get,
        put: put
    }
};

module.exports = companyController;