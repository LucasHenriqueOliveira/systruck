var mysql = require('mysql');

var TrucksDriversCitiesController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the cities
    var get = function(req, res) {

        var id = req.params.id;

        connection.query("CALL getDataAddTrip(?)",[id], function(err, rows) {
            if (err) {
                return res.json({
                    error: true,
                    message: err
                });
            }

            var getTrucks = {};
            var getDrivers = {};
            var getCities = {};

            if(rows[0].length) {
                getTrucks = rows[0];
            }

            if(rows[1].length) {
                getDrivers = rows[1];
            }

            if(rows[2].length) {
                getCities = rows[2];
            }

            res.json({
                getTrucks: getTrucks,
                getDrivers: getDrivers,
                getCities: getCities
            });

        });
    };

    return {
        get: get
    }
};

module.exports = TrucksDriversCitiesController;