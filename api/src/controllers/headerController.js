var mysql = require('mysql');

var headerController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the header
    var get = function(req, res){

        var id = req.params.id;

        connection.query("CALL statistics_header(?)",[id], function(err, rows) {
            if (err)
                return res.send(err);

            var getLastTrip = {};
            var getNextPeriodic = {};
            var getNextMaintenance = {};
            var parts = '';

            if(rows[0].length) {
                getLastTrip = rows[0];
            }

            if(rows[1].length) {
                getNextPeriodic = rows[1];
            }

            if(rows[2].length) {
                getNextMaintenance = rows[2];

                for(var i = 0; i < getNextMaintenance.length; i++) {
                    parts = parts + getNextMaintenance[i].revisao_id + ',';
                }
                parts = parts.slice(0, -1);

                connection.query("SELECT i.item_nome, ri.revisao_item_revisao_id as revisao_id " +
                    "FROM revisao_item ri INNER JOIN item i ON ri.revisao_item_item_id = i.item_id " +
                    "WHERE ri.revisao_item_revisao_id IN (" + parts + ") " +
                    "AND ri.revisao_item_ativo = 1;", function(err, items) {

                    if (err)
                        return res.send(err);

                    var items = items;

                    for(var i = 0; i < getNextMaintenance.length; i++) {
                        getNextMaintenance[i].parts = [];
                        for (var a = 0; a < items.length; a++) {
                            if(getNextMaintenance[i].revisao_id == items[a].revisao_id) {
                                getNextMaintenance[i].parts.push(items[a].item_nome);
                            }
                        }
                    }

                    res.json({
                        getLastTrip: getLastTrip,
                        getNextPeriodic: getNextPeriodic,
                        getNextMaintenance: getNextMaintenance
                    });
                });
            } else{
                res.json({
                    getLastTrip: getLastTrip,
                    getNextPeriodic: getNextPeriodic,
                    getNextMaintenance: getNextMaintenance
                });
            }

        });
    };

    return {
        get: get
    }
};

module.exports = headerController;

