var mysql = require('mysql');

var maintenanceController = function(dbconfig){

    var connection = mysql.createConnection(dbconfig.connection);
    connection.query('USE ' + dbconfig.database);

    // get maintenance
    var get = function(req, res){

        var id = req.params.id;

        connection.query("CALL getMaintenanceById(?)", [id], function(err, rows) {
            if (err)
                return res.json({
                    error: true,
                    message: 'Erro ao consultar a manutenção'
                });

            var getMaintenance = rows[0];

            if(getMaintenance.length){
                var resultRevisao = '';

                connection.query("SELECT ri.revisao_item_revisao_id, ri.revisao_item_id, ri.revisao_item_qtd, ri.revisao_item_valor, i.item_nome, i.item_id, e.estoque_descricao, e.estoque_id " +
                    "FROM revisao_item ri INNER JOIN item i ON ri.revisao_item_item_id = i.item_id " +
                    "LEFT JOIN estoque e ON e.estoque_id = ri.revisao_item_estoque_id " +
                    "WHERE ri.revisao_item_revisao_id = ?",[id], function(err, rows, fields) {
                    if (err) {
                        return res.json({
                            error: true,
                            message: 'Erro ao consultar os itens da manutenção'
                        });
                    } else {
                        resultRevisao = rows;
                    }

                    for(var i = 0; i < getMaintenance.length; i++) {
                        getMaintenance[i].parts = [];
                        var total = 0;

                        for(var j = 0; j < resultRevisao.length; j++) {

                            if(getMaintenance[i].revisao_id === resultRevisao[j].revisao_item_revisao_id) {
                                total = total + resultRevisao[j].revisao_item_valor;
                                getMaintenance[i].parts.push(resultRevisao[j]);
                            }
                        }
                        getMaintenance[i].total_parts = total;
                    }

                    res.json({
                        getMaintenance: getMaintenance[0]
                    });
                });

            } else{
                res.json({
                    getMaintenance: getMaintenance[0]
                });
            }
        });

    };

    // get the last maintenance
    var getLastMaintenance = function(req, res){

        var id = req.params.id;

        connection.query("CALL getMaintenance(?, 1)", [id], function(err, rows) {
            if (err)
                return res.json({
                    error: true,
                    message: 'Erro ao consultar as últimas manutenções'
                });

            var getLastMaintenance = rows[0];

            if(getLastMaintenance.length){
                var strRevisaoId = '';
                var resultRevisao = '';

                for(var i = 0; i < getLastMaintenance.length; i++) {
                    strRevisaoId = strRevisaoId + getLastMaintenance[i].revisao_id + ',';
                }
                strRevisaoId = strRevisaoId.slice(0, -1);

                connection.query("SELECT ri.revisao_item_revisao_id, ri.revisao_item_id, ri.revisao_item_qtd, ri.revisao_item_valor, i.item_nome, i.item_id, e.estoque_descricao, e.estoque_id " +
                    "FROM revisao_item ri INNER JOIN item i ON ri.revisao_item_item_id = i.item_id " +
                    "LEFT JOIN estoque e ON e.estoque_id = ri.revisao_item_estoque_id " +
                    "WHERE ri.revisao_item_revisao_id IN(" + strRevisaoId + ") AND revisao_item_ativo = 1", function(err, rows, fields) {
                    if (err) {
                        return res.json({
                            error: true,
                            message: 'Erro ao consultar os itens das manutenções'
                        });
                    } else {
                        resultRevisao = rows;
                    }

                    for(var i = 0; i < getLastMaintenance.length; i++) {
                        getLastMaintenance[i].parts = [];
                        var total = 0;

                        for(var j = 0; j < resultRevisao.length; j++) {

                            if(getLastMaintenance[i].revisao_id === resultRevisao[j].revisao_item_revisao_id) {
                                total = total + resultRevisao[j].revisao_item_valor;
                                getLastMaintenance[i].parts.push(resultRevisao[j]);
                            }
                        }
                        getLastMaintenance[i].total_parts = total;
                    }

                    res.json({
                        getLastMaintenance: getLastMaintenance
                    });
                });

            } else{
                res.json({
                    getLastMaintenance: getLastMaintenance
                });
            }
        });

    };

    // get the realized maintenance
    var getRealizedMaintenance = function(req, res){

        var id = req.params.id;

        connection.query("CALL getMaintenance(?, 2)", [id], function(err, rows) {
            if (err)
                return res.json({
                    error: true,
                    message: 'Erro ao consultar as últimas manutenções'
                });

            var getRealizedMaintenance = rows[0];

            if(getRealizedMaintenance.length){
                var strRevisaoId = '';
                var resultRevisao = '';

                for(var i = 0; i < getRealizedMaintenance.length; i++) {
                    strRevisaoId = strRevisaoId + getRealizedMaintenance[i].revisao_id + ',';
                }
                strRevisaoId = strRevisaoId.slice(0, -1);

                connection.query("SELECT ri.revisao_item_revisao_id, ri.revisao_item_id, ri.revisao_item_qtd, ri.revisao_item_valor, i.item_nome, i.item_id, e.estoque_descricao, e.estoque_id " +
                    "FROM revisao_item ri INNER JOIN item i ON ri.revisao_item_item_id = i.item_id " +
                    "LEFT JOIN estoque e ON e.estoque_id = ri.revisao_item_estoque_id " +
                    "WHERE ri.revisao_item_revisao_id IN(" + strRevisaoId + ") AND revisao_item_ativo = 1", function(err, rows, fields) {
                    if (err) {
                        return res.json({
                            error: true,
                            message: 'Erro ao consultar os itens das manutenções'
                        });
                    } else {
                        resultRevisao = rows;
                    }

                    for(var i = 0; i < getRealizedMaintenance.length; i++) {
                        getRealizedMaintenance[i].parts = [];
                        var total = 0;

                        for(var j = 0; j < resultRevisao.length; j++) {

                            if(getRealizedMaintenance[i].revisao_id === resultRevisao[j].revisao_item_revisao_id) {
                                total = total + resultRevisao[j].revisao_item_valor;
                                getRealizedMaintenance[i].parts.push(resultRevisao[j]);
                            }
                        }
                        getRealizedMaintenance[i].total_parts = total;
                    }

                    res.json({
                        getRealizedMaintenance: getRealizedMaintenance
                    });
                });

            } else{
                res.json({
                    getRealizedMaintenance: getRealizedMaintenance
                });
            }
        });

    };

    // post new maintenance
    var post = function(req, res){

        var carro_id = req.body.carro_id;
        var revisao_km = req.body.revisao_km;
        var revisao_status = req.body.revisao_status;
        var revisao_data = req.body.revisao_data;
        var revisao_preco = req.body.revisao_preco;
        var revisao_observacao = req.body.revisao_observacao;
        var id_usuario = req.body.id_usuario;
        var empresa = req.body.empresa;
        var qtd_parts = req.body.qtd_parts;

        if(revisao_data) {
            revisao_data = convertDate(revisao_data);
        }

        connection.beginTransaction(function(err) {
            if (err) {
                connection.rollback(function() {
                    return res.json({
                        error: true,
                        message: 'Erro ao iniciar a transação do cadastro da manutenção'
                    });
                });
            }

            connection.query("INSERT INTO revisao (revisao_carro_id, revisao_km, revisao_empresa_id, revisao_status," +
                "revisao_manual, revisao_valor, revisao_data, revisao_observacao, revisao_usuario_id_ativacao, revisao_data_ativacao) " +
                "VALUES(?,?,?,?,1,?,?,?,?,NOW())",[carro_id, revisao_km, empresa, revisao_status, revisao_preco,
                revisao_data, revisao_observacao, id_usuario], function(err, row) {
                if (err) {
                    return res.json({
                        error: true,
                        message: 'Erro ao criar a manutenção'
                    });
                }

                var revisao_id = row.insertId;

                for(var i = 0; i < qtd_parts; i++) {
                    var id_part = req.body['id_part_' + i];
                    var id_stock = req.body['id_stock_' + i];
                    var qtd = req.body['qtd_' + i];
                    var price = req.body['price_' + i];

                    connection.query("INSERT INTO revisao_item (revisao_item_revisao_id, revisao_item_item_id, revisao_item_qtd, " +
                        "revisao_item_valor, revisao_item_estoque_id, revisao_item_usuario_id_ativacao, revisao_item_data_ativacao)" +
                        "VALUES(?,?,?,?,?,?,NOW())",[revisao_id, id_part, qtd, price, id_stock, id_usuario], function(err, row) {
                        if (err) {
                            connection.rollback(function() {
                                return res.json({
                                    error: true,
                                    message: 'Erro ao criar o item da manutenção do caminhão'
                                });
                            });
                        }
                    });
                }
            });

            connection.commit(function(err) {
                if (err) {
                    connection.rollback(function() {
                        return res.json({
                            error: true,
                            message: 'Erro ao realizar a transação do cadastro da manutenção'
                        });
                    });
                }

                res.json({
                    error: false,
                    message: 'Manutenção adicionada com sucesso'
                });
            });
        });
    };

    var postSearch = function(req, res) {

        var dateInitial = req.body.dateInitial;
        var dateFinal = req.body.dateFinal;
        var truck = req.body.truck;
        var part = req.body.part;
        var option = req.body.option;
        var status = req.body.status;
        var company = req.body.company;

        var strDateInitial = '';
        var strDateFinal = '';
        var strTruck = '';
        var strPart = '';
        var strOption = '';
        var strStatus = '';

        if(typeof truck !== "undefined") {
            strTruck = " AND r.revisao_carro_id = " + truck;
        }

        if(typeof part !== "undefined") {
            strPart = " AND ri.revisao_item_item_id = " + part;
        }

        if(typeof option !== "undefined") {
            strOption = " AND ri.revisao_item_estoque_id = " + option;
        }

        if(typeof status !== "undefined") {
            strStatus = " AND r.revisao_status = " + status;
        }

        if(dateInitial) {
            strDateInitial = " AND r.revisao_data >= '" + convertDate(dateInitial) + "'";
        }

        if(dateFinal) {
            strDateFinal = " AND r.revisao_data <= '" + convertDate(dateFinal) + "'";
        }

        if(typeof part !== "undefined") {
            connection.query("SELECT r.revisao_id " +
                "FROM revisao r INNER JOIN revisao_item ri ON r.revisao_id = ri.revisao_item_revisao_id " +
                "LEFT JOIN estoque e ON e.estoque_id = ri.revisao_item_estoque_id " +
                "WHERE r.revisao_ativo = 1 AND r.revisao_empresa_id = ? AND ri.revisao_item_ativo = 1 " +
                strTruck + strPart + strOption + strStatus + strDateInitial + strDateFinal +
                " ORDER BY r.revisao_status ASC, r.revisao_data DESC", company, function(err, rows) {

                if (err) {
                    return res.json({
                        error: true,
                        message: 'Erro ao realizar a pesquisa!'
                    });
                }

                var strRevisaoId = '';

                for(var i = 0; i < rows.length; i++) {
                    strRevisaoId = strRevisaoId + rows[i].revisao_id + ',';
                }
                strRevisaoId = strRevisaoId.slice(0, -1);

                connection.query("SELECT r.revisao_id, r.revisao_km, r.revisao_valor, r.revisao_observacao, r.revisao_status," +
                    "DATE_FORMAT(r.revisao_data, '%d/%m/%Y') as revisao_data," +
                    "DATE_FORMAT(r.revisao_data_ativacao, '%d/%m/%Y') as revisao_data_ativacao," +
                    "c.carro_id, c.carro_nome, c.carro_placa, c.carro_placa_semi_reboque, c.carro_frota, c.carro_km," +
                    "ri.revisao_item_revisao_id, ri.revisao_item_id, ri.revisao_item_qtd, ri.revisao_item_valor, i.item_nome, i.item_id, e.estoque_descricao, e.estoque_id " +
                    "FROM revisao r INNER JOIN carro c ON r.revisao_carro_id = c.carro_id " +
                    "INNER JOIN revisao_item ri ON r.revisao_id = ri.revisao_item_revisao_id " +
                    "INNER JOIN item i ON ri.revisao_item_item_id = i.item_id " +
                    "LEFT JOIN estoque e ON e.estoque_id = ri.revisao_item_estoque_id " +
                    "WHERE ri.revisao_item_revisao_id IN(" + strRevisaoId + ") AND revisao_item_ativo = 1 ORDER BY r.revisao_status ASC, r.revisao_data DESC", function(err, rows, fields) {
                    if (err) {
                        return res.json({
                            error: true,
                            message: 'Erro ao consultar os itens das manutenções'
                        });
                    }

                    var maintenance = result(rows);

                    if (!maintenance.length) {
                        return res.json({error: true, message: 'Nenhuma manutenção foi encontrada.'});
                    } else {
                        res.json({error: false, maintenance: maintenance});
                    }
                });
            });
        } else {

            connection.query("SELECT r.revisao_id, r.revisao_km, r.revisao_valor, r.revisao_observacao, r.revisao_status," +
                "DATE_FORMAT(r.revisao_data, '%d/%m/%Y') as revisao_data," +
                "DATE_FORMAT(r.revisao_data_ativacao, '%d/%m/%Y') as revisao_data_ativacao," +
                "c.carro_id, c.carro_nome, c.carro_placa, c.carro_placa_semi_reboque, c.carro_frota, c.carro_km," +
                "ri.revisao_item_revisao_id, ri.revisao_item_id, ri.revisao_item_qtd, ri.revisao_item_valor, i.item_nome, i.item_id, e.estoque_descricao, e.estoque_id " +
                "FROM revisao r INNER JOIN carro c ON r.revisao_carro_id = c.carro_id " +
                "INNER JOIN revisao_item ri ON r.revisao_id = ri.revisao_item_revisao_id " +
                "INNER JOIN item i ON ri.revisao_item_item_id = i.item_id " +
                "LEFT JOIN estoque e ON e.estoque_id = ri.revisao_item_estoque_id " +
                "WHERE r.revisao_ativo = 1 AND r.revisao_empresa_id = ? AND ri.revisao_item_ativo = 1 " +
                strTruck + strPart + strOption + strStatus + strDateInitial + strDateFinal +
                " ORDER BY r.revisao_status ASC, r.revisao_data DESC", company, function(err, row) {

                if (err) {
                    return res.json({
                        error: true,
                        message: 'Erro ao realizar a pesquisa!'
                    });
                }

                var maintenance = result(row);

                if (!maintenance.length) {
                    return res.json({error: true, message: 'Nenhuma manutenção foi encontrada.'});
                } else {
                    res.json({error: false, maintenance: maintenance});
                }
            });
        }
    };

    // remove the part maintenance
    var removeMaintenance = function(req, res){

        var id = req.params.id;
        var id_user = req.body.id;

        connection.query("UPDATE revisao_item SET revisao_item_ativo = 0, revisao_item_usuario_id_desativacao = ?, " +
            "revisao_item_data_desativacao = NOW() WHERE revisao_item_id = ?",[id_user, id], function(err, rows) {
            if (err)
                return res.send({"error": true, "message": "Erro ao remover peça/item da manutenção."});

            res.json({"error": false, "message": "Peça/item removido com sucesso."});
        });
    };

    // edit the maintenance
    var put = function(req, res){

        var revisao_id = req.params.id;
        var revisao_manual = req.body.revisao_manual;
        var revisao_comments = req.body.revisao_comments;
        var revisao_date = req.body.revisao_date;
        var revisao_km = req.body.revisao_km;
        var revisao_price = req.body.revisao_price;
        var revisao_status = req.body.revisao_status;
        var carro_id = req.body.carro_id;
        var empresa = req.body.empresa;
        var qtd_parts = req.body.qtd_parts;
        var id_usuario = req.body.id_usuario;

        if(revisao_date) {
            revisao_date = convertDate(revisao_date);
        }

        connection.beginTransaction(function(err) {
            if (err) {
                connection.rollback(function() {
                    return res.json({
                        error: true,
                        message: 'Erro ao iniciar a transação do cadastro da manutenção'
                    });
                });
            }

            connection.query("SELECT revisao_id, revisao_km, revisao_status, revisao_manual, revisao_valor, revisao_data " +
                "FROM revisao WHERE revisao_id = ? AND revisao_carro_id = ? AND revisao_empresa_id = ?",[revisao_id, carro_id, empresa], function(err, row) {
                if (err)
                    return res.send({"error": true, "message": "Erro ao pesquisar a manutenção."});

                if(revisao_status == row[0].revisao_status) {
                    // NAO HOUVE ALTERACAO DE STATUS NA REVISAO

                    connection.query("UPDATE revisao SET revisao_km = ?, revisao_valor = ?, revisao_data = ?, " +
                        "revisao_observacao = ? WHERE revisao_id = ?",[revisao_km, revisao_price, revisao_date, revisao_comments, revisao_id], function(err, rows) {
                        if (err)
                            return res.send({"error": true, "message": "Erro ao remover peça/item da manutenção."});
                    });

                    for(var i = 0; i < qtd_parts; i++) {
                        var estoque_id = req.body['estoque_id_' + i];
                        var item_id = req.body['item_id_' + i];
                        var revisao_item_id = req.body['revisao_item_id_' + i];
                        var revisao_item_qtd = req.body['revisao_item_qtd_' + i];
                        var revisao_item_valor = req.body['revisao_item_valor_' + i];

                        if(revisao_item_id) {
                            // REVISAO ITEM JA EXISTENTE

                            connection.query("UPDATE revisao_item SET revisao_item_item_id = ?, revisao_item_qtd = ?, revisao_item_valor = ?, " +
                                "revisao_item_estoque_id = ? WHERE revisao_item_id = ?",[item_id, revisao_item_qtd, revisao_item_valor, estoque_id, revisao_item_id], function(err, row) {
                                if (err) {
                                    connection.rollback(function() {
                                        return res.json({
                                            error: true,
                                            message: 'Erro ao criar o item da manutenção do caminhão'
                                        });
                                    });
                                }
                            });
                        } else {
                            // REVISAO ITEM NOVO
                            connection.query("INSERT INTO revisao_item (revisao_item_revisao_id, revisao_item_item_id, revisao_item_qtd, " +
                                "revisao_item_valor, revisao_item_estoque_id, revisao_item_usuario_id_ativacao, revisao_item_data_ativacao)" +
                                "VALUES(?,?,?,?,?,?,NOW())",[revisao_id, item_id, revisao_item_qtd, revisao_item_valor, estoque_id, id_usuario], function(err, row) {
                                if (err) {
                                    connection.rollback(function() {
                                        return res.json({
                                            error: true,
                                            message: 'Erro ao criar o item da manutenção do caminhão'
                                        });
                                    });
                                }
                            });
                        }
                    }

                } else {
                    // HOUVE ALTERACAO DE STATUS NA REVISAO

                    if(revisao_manual == 1) {
                        // REVISAO MANUAL, NAO CADASTRA NOVAS REVISOES
                        connection.query("UPDATE revisao SET revisao_km = ?, revisao_valor = ?, revisao_data = ?, revisao_status = ?," +
                            "revisao_observacao = ? WHERE revisao_id = ?",[revisao_km, revisao_price, revisao_date, revisao_status, revisao_comments, revisao_id], function(err, rows) {
                            if (err)
                                return res.send({"error": true, "message": "Erro ao remover peça/item da manutenção."});
                        });

                        for(var i = 0; i < qtd_parts; i++) {
                            var estoque_id = req.body['estoque_id_' + i];
                            var item_id = req.body['item_id_' + i];
                            var revisao_item_id = req.body['revisao_item_id_' + i];
                            var revisao_item_qtd = req.body['revisao_item_qtd_' + i];
                            var revisao_item_valor = req.body['revisao_item_valor_' + i];

                            if(revisao_item_id) {
                                // REVISAO ITEM JA EXISTENTE

                                connection.query("UPDATE revisao_item SET revisao_item_item_id = ?, revisao_item_qtd = ?, revisao_item_valor = ?, " +
                                    "revisao_item_estoque_id = ? WHERE revisao_item_id = ?",[item_id, revisao_item_qtd, revisao_item_valor, estoque_id, revisao_item_id], function(err, row) {
                                    if (err) {
                                        connection.rollback(function() {
                                            return res.json({
                                                error: true,
                                                message: 'Erro ao criar o item da manutenção do caminhão'
                                            });
                                        });
                                    }
                                });
                            } else {
                                // REVISAO ITEM NOVO
                                connection.query("INSERT INTO revisao_item (revisao_item_revisao_id, revisao_item_item_id, revisao_item_qtd, " +
                                    "revisao_item_valor, revisao_item_estoque_id, revisao_item_usuario_id_ativacao, revisao_item_data_ativacao)" +
                                    "VALUES(?,?,?,?,?,?,NOW())",[revisao_id, item_id, revisao_item_qtd, revisao_item_valor, estoque_id, id_usuario], function(err, row) {
                                    if (err) {
                                        connection.rollback(function() {
                                            return res.json({
                                                error: true,
                                                message: 'Erro ao criar o item da manutenção do caminhão'
                                            });
                                        });
                                    }
                                });
                            }
                        }
                    } else {
                        // REVISAO AUTOMATICA - CADASTRAR PROXIMAS REVISOES

                        connection.query("UPDATE revisao SET revisao_km = ?, revisao_valor = ?, revisao_data = ?, revisao_status = ?," +
                            "revisao_observacao = ? WHERE revisao_id = ?",[revisao_km, revisao_price, revisao_date, revisao_status, revisao_comments, revisao_id], function(err, rows) {
                            if (err)
                                return res.send({"error": true, "message": "Erro ao remover peça/item da manutenção."});
                        });

                        for(var i = 0; i < qtd_parts; i++) {
                            var estoque_id = req.body['estoque_id_' + i];
                            var item_id = req.body['item_id_' + i];
                            var revisao_item_id = req.body['revisao_item_id_' + i];
                            var revisao_item_qtd = req.body['revisao_item_qtd_' + i];
                            var revisao_item_valor = req.body['revisao_item_valor_' + i];

                            if(revisao_item_id) {
                                // REVISAO ITEM JA EXISTENTE

                                connection.query("UPDATE revisao_item SET revisao_item_item_id = ?, revisao_item_qtd = ?, revisao_item_valor = ?, " +
                                    "revisao_item_estoque_id = ? WHERE revisao_item_id = ?",[item_id, revisao_item_qtd, revisao_item_valor, estoque_id, revisao_item_id], function(err, row) {
                                    if (err) {
                                        connection.rollback(function() {
                                            return res.json({
                                                error: true,
                                                message: 'Erro ao criar o item da manutenção do caminhão'
                                            });
                                        });
                                    }
                                });
                            } else {
                                // REVISAO ITEM NOVO
                                connection.query("INSERT INTO revisao_item (revisao_item_revisao_id, revisao_item_item_id, revisao_item_qtd, " +
                                    "revisao_item_valor, revisao_item_estoque_id, revisao_item_usuario_id_ativacao, revisao_item_data_ativacao)" +
                                    "VALUES(?,?,?,?,?,?,NOW())",[revisao_id, item_id, revisao_item_qtd, revisao_item_valor, estoque_id, id_usuario], function(err, row) {
                                    if (err) {
                                        connection.rollback(function() {
                                            return res.json({
                                                error: true,
                                                message: 'Erro ao criar o item da manutenção do caminhão'
                                            });
                                        });
                                    }
                                });
                            }
                        }

                        if(revisao_status == 2) {
                            // CRIA A NOVA MANUTENCAO PROGRAMADA

                            connection.query("SELECT carro_item_id, carro_item_item_id, carro_item_vida_util, carro_item_ultima_km " +
                                "FROM carro_item WHERE carro_item_revisao_id = ? AND carro_item_carro_id = ? AND carro_item_ativo = 1",
                                [revisao_id, carro_id], function(err, row) {
                                if (err){
                                    connection.rollback(function() {
                                        return res.json({
                                            error: true,
                                            message: 'Erro ao pesquisar a manutenção.'
                                        });
                                    });
                                }
                                console.log(row, revisao_id, carro_id);


                                if(row.length) {
                                    var km = row[0].carro_item_vida_util + revisao_km;
                                    var carro_item_item_id = row[0].carro_item_item_id;
                                    var carro_item_id = row[0].carro_item_id;

                                    connection.query("INSERT INTO revisao (revisao_carro_id, revisao_km, revisao_empresa_id, revisao_status," +
                                        "revisao_manual, revisao_usuario_id_ativacao, revisao_data_ativacao) " +
                                        "VALUES(?,?,?,1,0,?,NOW())",[carro_id, km, empresa, id_usuario], function(err, row) {
                                        if (err) {
                                            connection.rollback(function() {
                                                return res.json({
                                                    error: true,
                                                    message: 'Erro ao criar a manutenção'
                                                });
                                            });
                                        }

                                        var id_revisao = row.insertId;

                                        for(var i = 0; i < qtd_parts; i++) {
                                            var estoque_id = req.body['estoque_id_' + i];
                                            var item_id = req.body['item_id_' + i];

                                            if(item_id == carro_item_item_id) {
                                                // SE A PECA/ITEM FOR A PECA PROGRAMADA

                                                connection.query("INSERT INTO revisao_item (revisao_item_revisao_id, revisao_item_item_id, " +
                                                    "revisao_item_estoque_id, revisao_item_usuario_id_ativacao, revisao_item_data_ativacao)" +
                                                    "VALUES(?,?,?,?,NOW())",[id_revisao, item_id, estoque_id, id_usuario], function(err, row) {
                                                    if (err) {
                                                        connection.rollback(function() {
                                                            return res.json({
                                                                error: true,
                                                                message: 'Erro ao criar o item da manutenção do caminhão'
                                                            });
                                                        });
                                                    }
                                                });
                                            }
                                        }

                                        connection.query("UPDATE carro_item SET carro_item_revisao_id = ?, carro_item_ultima_km = ? " +
                                            "WHERE carro_item_id = ?",[id_revisao, revisao_km, carro_item_id], function(err, row) {
                                            if (err) {
                                                connection.rollback(function() {
                                                    return res.json({
                                                        error: true,
                                                        message: 'Erro ao criar o item da manutenção do caminhão'
                                                    });
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        }
                    }
                }
            });

            connection.commit(function(err) {
                if (err) {
                    connection.rollback(function() {
                        return res.json({
                            error: true,
                            message: 'Erro ao realizar a transação na edição da manutenção'
                        });
                    });
                }

                res.json({
                    error: false,
                    message: 'Manutenção alterada com sucesso'
                });
            });
        });
    };

    return {
        get: get,
        getLastMaintenance: getLastMaintenance,
        getRealizedMaintenance: getRealizedMaintenance,
        post: post,
        postSearch: postSearch,
        removeMaintenance: removeMaintenance,
        put: put
    }
};

module.exports = maintenanceController;

function convertDate(date) {
    var datePart = date.split('/');
    return datePart[2] + "-" + datePart[1] + "-" + datePart[0];
}

function result(getMaintenance) {

    var maintenance = [];
    var obj = {};
    obj.parts = [];

    for(var i = 0; i < getMaintenance.length; i++) {

        if(maintenance.length) {

            var exists = false;
            for(var j = 0; j < maintenance.length; j++) {
                if(getMaintenance[i].revisao_id === maintenance[j].revisao_id){

                    maintenance[j].parts.push({
                        estoque_id: getMaintenance[i].estoque_id,
                        estoque_descricao: getMaintenance[i].estoque_descricao,
                        item_id: getMaintenance[i].item_id,
                        item_nome: getMaintenance[i].item_nome,
                        revisao_item_id: getMaintenance[i].revisao_item_id,
                        revisao_item_qtd: getMaintenance[i].revisao_item_qtd,
                        revisao_item_revisao_id: getMaintenance[i].revisao_item_revisao_id,
                        revisao_item_valor: getMaintenance[i].revisao_item_valor
                    });
                    exists = true;
                    maintenance[j].total_parts = maintenance[j].total_parts + getMaintenance[i].revisao_item_valor;
                }
            }

            if(!exists) {
                obj = {
                    carro_id: getMaintenance[i].carro_id,
                    carro_frota: getMaintenance[i].carro_frota,
                    carro_km: getMaintenance[i].carro_km,
                    carro_nome: getMaintenance[i].carro_nome,
                    carro_placa: getMaintenance[i].carro_placa,
                    carro_placa_semi_reboque: getMaintenance[i].carro_placa_semi_reboque,
                    revisao_data: getMaintenance[i].revisao_data,
                    revisao_data_ativacao: getMaintenance[i].revisao_data_ativacao,
                    revisao_id: getMaintenance[i].revisao_id,
                    revisao_km: getMaintenance[i].revisao_km,
                    revisao_observacao: getMaintenance[i].revisao_observacao,
                    revisao_status: getMaintenance[i].revisao_status,
                    revisao_valor: getMaintenance[i].revisao_valor
                };

                obj.parts = [];
                obj.parts.push({
                    estoque_id: getMaintenance[i].estoque_id,
                    estoque_descricao: getMaintenance[i].estoque_descricao,
                    item_id: getMaintenance[i].item_id,
                    item_nome: getMaintenance[i].item_nome,
                    revisao_item_id: getMaintenance[i].revisao_item_id,
                    revisao_item_qtd: getMaintenance[i].revisao_item_qtd,
                    revisao_item_revisao_id: getMaintenance[i].revisao_item_revisao_id,
                    revisao_item_valor: getMaintenance[i].revisao_item_valor
                });

                obj.total_parts = getMaintenance[i].revisao_item_valor;

                maintenance.push(obj);
            }
        } else {
            obj = {
                carro_id: getMaintenance[i].carro_id,
                carro_frota: getMaintenance[i].carro_frota,
                carro_km: getMaintenance[i].carro_km,
                carro_nome: getMaintenance[i].carro_nome,
                carro_placa: getMaintenance[i].carro_placa,
                carro_placa_semi_reboque: getMaintenance[i].carro_placa_semi_reboque,
                revisao_data: getMaintenance[i].revisao_data,
                revisao_data_ativacao: getMaintenance[i].revisao_data_ativacao,
                revisao_id: getMaintenance[i].revisao_id,
                revisao_km: getMaintenance[i].revisao_km,
                revisao_observacao: getMaintenance[i].revisao_observacao,
                revisao_status: getMaintenance[i].revisao_status,
                revisao_valor: getMaintenance[i].revisao_valor
            };

            obj.parts = [];
            obj.parts.push({
                estoque_id: getMaintenance[i].estoque_id,
                estoque_descricao: getMaintenance[i].estoque_descricao,
                item_id: getMaintenance[i].item_id,
                item_nome: getMaintenance[i].item_nome,
                revisao_item_id: getMaintenance[i].revisao_item_id,
                revisao_item_qtd: getMaintenance[i].revisao_item_qtd,
                revisao_item_revisao_id: getMaintenance[i].revisao_item_revisao_id,
                revisao_item_valor: getMaintenance[i].revisao_item_valor
            });

            obj.total_parts = getMaintenance[i].revisao_item_valor;

            maintenance.push(obj);
        }
    }

    return maintenance;
}