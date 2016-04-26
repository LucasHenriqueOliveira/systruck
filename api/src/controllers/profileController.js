var mysql = require('mysql');

var userController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the user
    var get = function(req, res){

        var id = req.params.id;

        connection.query("SELECT usuario_id, usuario_nome, usuario_email, " +
            " empresa_id, empresa_nome, tipo_perfil_id, tipo_perfil_nome" +
            " FROM vw_usuario WHERE usuario_id = ?",[id], function(err, user) {
            if (err)
                return res.send(err);

            if (!user.length) {
                return res.json({error: true, message: 'Usuário não existe.'});
            } else {
                res.json(user);
            }
        });
    };

    return {
        get: get
    }
};

module.exports = userController;

