var jwt = require('jwt-simple');
var mysql = require('mysql');
var dbconfig = require('../config/database');

module.exports = function(req, res, next) {

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.

    // We skip the token outh for [OPTIONS] requests.
    //if(req.method == 'OPTIONS') next();

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];

    if (token || key) {
        try {
            var decoded = jwt.decode(token, require('../config/secret')());

            if (decoded.exp <= Date.now()) {
                res.json({
                    "error": true,
                    "message": "Token Expirado."
                });
                return;
            }

            // Authorize the user to see if s/he can access our resources

            connection.query("SELECT * FROM usuario WHERE usuario_token = ? AND usuario_email = ?",[token, key], function(err, user) {
                if (err) {
                    res.json({
                        "error": true,
                        "message": "Ocorreu algum erro no acesso ao sistema."
                    });
                    return;
                }

                if (!user.length) {

                    res.json({
                        "error": true,
                        "message": "Usuário inválido."
                    });
                    return;

                } else {

                    if (req.url.indexOf('/api/v1/') >= 0) {
                        next(); // To move to next middleware
                    } else {
                        res.json({
                            "error": true,
                            "message": "Not Authorized"
                        });
                        return;
                    }
                }
            });

        } catch (err) {
            res.json({
                "message": "Ocorreu algum erro no acesso ao sistema.",
                "error": true
            });
        }
    } else {
        res.json({
            "error": true,
            "message": "Token ou Key inválida."
        });
        return;
    }
};