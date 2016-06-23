var mysql = require('mysql');
var NodeGeocoder = require('node-geocoder');
var Q = require('q');

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
        var cidade_nome = req.body.cidade_nome;

        var cep = req.body.cep;
        var telefone1 = req.body.telefone1;
        var telefone2 = req.body.telefone2;

        function getCoordenadas(logradouro,cidade_nome,cep){

            var deferred = Q.defer();

            //API do NodeGeocoder (https://www.npmjs.com/package/node-geocoder)
         
            var options = {
             provider: 'google',
            };
            var geocoder = NodeGeocoder(options);
              geocoder.geocode({ address: logradouro + ' ' + cidade_nome, zipcode: cep.replace(/\D+/g, '')})
                .then(function(res) {
    
                    deferred.resolve({
                                    latitude:  res[0].latitude,
                                    longitude: res[0].longitude
                                });
 
                })
                .catch(function(err) {
                    console.log(err);
                });
        //*************************
             return deferred.promise;

        }

       Q.all([getCoordenadas(logradouro,cidade_nome,cep)]).then(function (data) {

            if(data[0].error){
                return res.send({"error": true, "message": "Erro ao alterar os dados da empresa."});
            }
            console.log(id);
             connection.query("UPDATE empresa SET empresa_logradouro = ?, empresa_numero = ?, " +
                "empresa_complemento = ?, empresa_bairro = ?, empresa_cidade_id = ?, " +
                "empresa_cep = ?, empresa_telefone_1 = ?, empresa_telefone_2 = ?, " +
                "empresa_latitude = ?, empresa_longitude = ? " +
                " WHERE empresa_id = ?",[logradouro, numero, complemento, bairro, cidade_id, cep, telefone1, telefone2, data[0].latitude, data[0].longitude, id], function(err, rows) {
                 
                    if(err){
                        console.log(err);
                        return res.send({"error": true, "message": "Erro ao alterar os dados da empresa."});
                    }
                    res.json({"error": false, "message": "Dados da empresa alterado com sucesso."});
            });  
                        
        });
    };

    return {
        get: get,
        put: put
    }
};

module.exports = companyController;