var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var userController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // create the user
    var post = function(req, res){

        var nome = req.body.nome;
        var tipo_perfil = req.body.tipo_perfil;
        var email = req.body.email;
        var cnh = req.body.cnh;
        var data_exame = req.body.data_exame;
        var telefone1 = req.body.telefone1;
        var telefone2 = req.body.telefone2;
        var usuario_ativacao = req.body.usuario_ativacao;
        var empresa = req.body.empresa;
        var password = '';

        if(tipo_perfil == 3) {
            data_exame = convertDate(data_exame);
        }

        if(tipo_perfil != 3) {
            password = bcrypt.hashSync(email, bcrypt.genSaltSync(10));
        }

        connection.beginTransaction(function(err) {
            if (err) {
                return res.json({
                    error: true,
                    message: 'Erro ao iniciar a transação do cadastro de usuário'
                });
            }

            connection.query("INSERT INTO usuario(`usuario_nome`, `usuario_email`, `usuario_cnh`, `usuario_data_exame`," +
                "`usuario_telefone1`, `usuario_telefone2`, `usuario_password`) VALUES (?,?,?,?,?,?,?)",
                [nome, email, cnh, data_exame, telefone1, telefone2, password], function(err, row) {
                if (err) {
                    connection.rollback(function() {
                        return res.json({
                            error: true,
                            message: 'Erro ao inserir o usuário'
                        });
                    });
                }

                var user_id = row.insertId;

                connection.query("INSERT INTO perfil (`perfil_usuario_id`, `perfil_empresa_id`, " +
                    "`perfil_tipo_perfil_id`, `perfil_data_ativacao`, `perfil_usuario_id_ativacao`) " +
                    "VALUES(?,?,?,NOW(),?)",[user_id, empresa, tipo_perfil, usuario_ativacao], function(err, row) {
                    if (err) {
                        connection.rollback(function() {
                            return res.json({
                                error: true,
                                message: 'Erro ao criar o perfil do usuário'
                            });
                        });
                    }
                });

                connection.commit(function(err) {
                    if (err) {
                        connection.rollback(function() {
                            return res.json({
                                error: true,
                                message: 'Erro ao realizar a transação do cadastro de usuário'
                            });
                        });
                    }

                    res.json({
                        error: false,
                        message: 'Usuário adicionado com sucesso'
                    });
                });
            });
        });
    };

    // get the user
    var get = function(req, res){

        var id = req.params.id;

        connection.query("CALL getUser(?)",[id], function(err, rows) {
            if (err)
                return res.send(err);

            res.json({
                getUser: rows[0][0]
            });
        });
    };

    // get the users
    var getAll = function(req, res){

        var id = req.params.id;

        connection.query("CALL getUsers(?)",[id], function(err, rows) {
            if (err)
                return res.send(err);

            var getUsersAvailable = {};
            var getUsersUnavailable = {};

            if(rows[0].length) {
                getUsersAvailable = rows[0];
            }

            if(rows[1].length) {
                getUsersUnavailable = rows[1];
            }

            res.json({
                getUsersAvailable: getUsersAvailable,
                getUsersUnavailable: getUsersUnavailable
            });

        });
    };

    // edit the user
    var put = function(req, res){

        var id = req.params.id;
        var nome = req.body.nome;
        var id_perfil = req.body.id_perfil;
        var tipo_perfil = req.body.tipo_perfil;
        var email = req.body.email;
        var cnh = req.body.cnh;
        var data_exame = req.body.data_exame;
        var telefone1 = req.body.telefone1;
        var telefone2 = req.body.telefone2;

        if(tipo_perfil == 3) {
            email = '';
            data_exame = convertDate(data_exame);
        } else {
            cnh = '';
            data_exame = '';
        }

        connection.query("CALL editUser(?,?,?,?,?,?,?,?,?)",[id, nome, id_perfil, tipo_perfil, email, cnh, data_exame, telefone1, telefone2], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao alterar dados do usuário."});

            res.json({"error": false, "message": "Dados do usuário alterado com sucesso."});
        });
    };

    // remove the user
    var putRemove = function(req, res){

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE perfil SET perfil_sin_ativo = 0, perfil_usuario_id_desativacao = ?, " +
            "perfil_data_desativacao = NOW() WHERE perfil_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar o usuário."});

            res.json({"error": false, "message": "Usuário desativado com sucesso."});
        });
    };

    // active the user
    var putActive = function(req, res){

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE perfil SET perfil_sin_ativo = 1, perfil_usuario_id_desativacao = NULL, " +
            "perfil_data_desativacao = null, perfil_usuario_id_ativacao = ?, perfil_data_ativacao = NOW() " +
            "   WHERE perfil_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao ativar o usuário."});

            res.json({"error": false, "message": "Usuário ativado com sucesso."});
        });
    };

    // change the password
    var putChange = function(req, res){

        var id = req.body.id;
        var password = req.body.password;
        var new_password = req.body.new_password;
        var confirm_password = req.body.confirm_password;

        if(new_password !== confirm_password){
            return res.json({"error": true, "message": "Nova senha não corresponde a senha confirmada."});
        }

        connection.query("SELECT usuario_password FROM usuario WHERE usuario_id = ?",[id], function(err, user) {
            if (err || !user.length)
                return res.send({"error": true, "message": "Erro ao pesquisar o usuário."});

            if (!bcrypt.compareSync(password, user[0].usuario_password)) {
                return res.json({
                    "error": true,
                    "message": "Senha atual está incorreta."
                });
            }

            password = bcrypt.hashSync(new_password, bcrypt.genSaltSync(10));

            connection.query("UPDATE usuario SET usuario_password = ?, usuario_primeiro_acesso = 0 " +
                "   WHERE usuario_id = ?",[password, id], function(err, rows) {
                if (err)
                    return res.send({"error": true, "message": "Erro ao alterar a senha."});

                res.json({"error": false, "message": "Senha alterada com sucesso."});
            });
        });
    };


    return {
        post: post,
        get: get,
        put: put,
        getAll: getAll,
        putRemove: putRemove,
        putActive: putActive,
        putChange: putChange
    }
};

module.exports = userController;

function convertDate(date) {
    var datePart = date.split('/');
    return datePart[2] + "-" + datePart[1] + "-" + datePart[0];
}