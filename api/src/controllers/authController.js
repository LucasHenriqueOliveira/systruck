var jwt = require('jwt-simple');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var authController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    var login = function(req, res) {

        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {

            return res.json({
                "error": true,
                "message": "Favor informar email e senha."
            });
        }

        connection.query("SELECT * FROM vw_usuario WHERE usuario_email = ?",[username], function(err, user) {
            if (err || !user.length){
                return res.json({
                    "error": true,
                    "message": "Email ou senha incorretos."
                });
            }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, user[0].usuario_password)) {
                return res.json({
                    "error": true,
                    "message": "Email ou senha incorretos."
                });
            }

            var company = '';
            var role = '';
            if(user.length == 1){
                company = user[0].empresa_id;
                role = user[0].tipo_perfil_id;
            }

            var userObj = {
                id: user[0].usuario_id,
                nome: user[0].usuario_nome,
                email: user[0].usuario_email,
                qtd: user.length,
                empresa: company,
                perfil: role,
                primeiro_acesso: user[0].usuario_primeiro_acesso
            };

            var getToken = genToken(userObj);

            var updateQuery = "UPDATE usuario SET usuario_token = ? WHERE usuario_email = ?";

            connection.query(updateQuery,[getToken.token, user[0].usuario_email],function(err, rows) {
                if (err) {
                    res.json({
                        "error": true,
                        "message": "Error ao logar."
                    });
                    return;
                }

                res.json(getToken);
                return;
            });

        });
    };

    return {
        login: login
    }
};

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = authController;