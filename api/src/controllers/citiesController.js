var mysql = require('mysql');

var citiesController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the user
    var get = function(req, res){

        var id = req.params.id;

        connection.query("SELECT cidade_id as id, cidade_nome as name FROM cidade", function(err, city) {
            if (err)
                return res.send(err);

            res.json(city);
        });
    };

    return {
        get: get
    }
};

module.exports = citiesController;

