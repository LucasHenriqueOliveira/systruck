var mysql = require('mysql');

var driverToTruckController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the header
    var get = function(req, res){

        var id = req.params.id;

        connection.query("CALL getDriverToTruck(?)",[id], function(err, rows) {
            if (err)
                return res.send(err);

            res.json({
                getDriverToTruck: rows[0][0]
            });

        });
    };

    return {
        get: get
    }
};

module.exports = driverToTruckController;