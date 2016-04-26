var mysql = require('mysql');

var lastTripController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the last Trip
    var get = function(req, res) {

        var id = req.params.id;

        connection.query("CALL getLastTrip(?)",[id], function(err, rows) {
            if (err) {
                return res.json({
                    error: true,
                    message: err
                });
            }

            res.json({
                getLastTrip: rows[0]
            });

        });
    };

    return {
        get: get
    }
};

module.exports = lastTripController;