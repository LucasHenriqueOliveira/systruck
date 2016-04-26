var mysql = require('mysql');

var partController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get the part
    var get = function(req, res){

        connection.query("SELECT item_id as id, item_nome as name FROM item WHERE item_ativo = 1", function(err, rows) {
            if (err)
                return res.send(err);

            var getParts = {};

            if(rows.length) {
                getParts = rows;
            }

            res.json({
                getParts: getParts
            });

        });

    };

    // get the all part company
    var getParts = function(req, res){

        var id = req.params.id;

        connection.query("CALL getParts(?)",[id], function(err, rows) {
            if (err)
                return res.send(err);

            var getPartsAvailable = {};
            var getPartsUnavailable = {};

            if(rows[0].length) {
                getPartsAvailable = rows[0];
            }

            if(rows[1].length) {
                getPartsUnavailable = rows[1];
            }

            res.json({
                getPartsAvailable: getPartsAvailable,
                getPartsUnavailable: getPartsUnavailable
            });

        });

    };

    // get the part
    var getAllParts = function(req, res){

        var id = req.params.id;

        connection.query("CALL getAllParts(?)",[id], function(err, rows) {
            if (err)
                return res.send(err);

            var getParts = rows[0];
            var getStock = rows[1];

            for(var i = 0; i < getParts.length; i++) {
                getParts[i].parts = [];

                for(var j = 0; j < getStock.length; j++) {
                    if(getParts[i].id === getStock[j].estoque_item_id) {
                        getParts[i].parts.push(getStock[j]);
                    }
                }
            }

            res.json({
                getParts: getParts
            });

        });

    };

    // post new part
    var post = function(req, res){

        var id = req.body.id;
        var desc = req.body.desc;
        var price = req.body.preco;
        var qtd = req.body.qtd;
        var id_user = req.body.usuario_ativacao;
        var company = req.body.empresa;

        connection.query("INSERT INTO estoque (estoque_empresa_id, estoque_item_id, estoque_qtd, estoque_preco_unitario, " +
            "estoque_descricao, estoque_usuario_id_ativacao, estoque_data_ativacao) VALUES(?,?,?,?,?,?,NOW())",
            [company, id, qtd, price, desc, id_user], function(err, row) {
                if (err) {
                    return res.json({
                        error: true,
                        message: 'Erro ao inserir a peça/item'
                    });
                }

                res.json({
                    error: false,
                    message: 'Peça/Item adicionado com sucesso'
                });
        });

    };

    // edit the truck
    var put = function(req, res) {

        var id = req.params.id;
        var item_id = req.body.item_id;
        var desc = req.body.desc;
        var price = req.body.price;
        var qtd = req.body.qtd;
        var company = req.body.company;

        connection.query("UPDATE estoque SET estoque_item_id = ?, estoque_descricao = ?, estoque_preco_unitario = ?, estoque_qtd = ?," +
            "estoque_empresa_id = ? WHERE estoque_id = ?", [item_id, desc, price, qtd, company, id], function (err, row) {
            if (err) {
                return res.json({
                    error: true,
                    message: 'Erro ao editar a peça/item'
                });
            }

            res.json({
                error: false,
                message: 'Peça/Item alterado com sucesso'
            });
        });

    };

    // remove the part
    var putRemove = function(req, res){

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE estoque SET estoque_ativo = 0, estoque_usuario_id_desativacao = ?, " +
            "estoque_data_desativacao = NOW() WHERE estoque_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao desativar a peça/item."});

            res.json({"error": false, "message": "Peça/Item desativado com sucesso."});
        });

    };

    // active the truck
    var putActive = function(req, res){

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE estoque SET estoque_ativo = 1, estoque_usuario_id_desativacao = NULL, " +
            "estoque_data_desativacao = NULL, estoque_usuario_id_ativacao = ?, estoque_data_ativacao = NOW() " +
            "   WHERE estoque_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao ativar a peça/item."});

            res.json({"error": false, "message": "Peça/Item ativado com sucesso."});
        });
    };

    return {
        get: get,
        getParts: getParts,
        getAllParts: getAllParts,
        post: post,
        put: put,
        putRemove: putRemove,
        putActive: putActive
    }
};

module.exports = partController;