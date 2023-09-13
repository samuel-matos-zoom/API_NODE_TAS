const { execSQLQuery } = require("../../../database");
const moment = require('moment');
const jsonwebtoken = require('jsonwebtoken');

exports.conquistasRoutes = (app) => {
    app.post('/getConquistas', (req, res) => {
        var sqlQry = ["SELECT t2.titulo AS nm_gamificacao, t2.pontos, t1.data_gerado AS dt_ganhou_badge, t2.descricao AS desc_badge, t2.imagem_cor AS img_badge FROM gamificacao_log t1 INNER JOIN gamificacao t2 ON t2.id = t1.id_gamificacao WHERE t1.id_usuario = ?", [req.body.idUser]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/emitirConquista', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var user = jsonwebtoken.verify(token, 'ZECTAS');
        var sqlQry = ["SELECT * FROM gamificacao WHERE id = ? LIMIT 1", [req.body.idGamificacao]];
        var cbFirst = (value) => {
            if (value.length > 0) {
                var query = ["SELECT * FROM gamificacao_log WHERE id_usuario = ? AND id_gamificacao = ?", [user['id'], req.body.idGamificacao]];
                var agora = moment().format('YYYY-MM-DD HH:mm:ss');
                var cb = (val) => {
                    if (val.length == 0) {
                        var query2 = ["INSERT INTO gamificacao_log (id_usuario,id_gamificacao, pontos, data_gerado, ativo) VALUES (?,?,?,?,?)", [user['id'], req.body.idGamificacao, value[0]['pontos'], agora, 1]];
                        cb2 = (val) => {
                            res.send({ message: 'Conquista recebida com sucesso', pontos: value[0]['pontos'] });
                        };
                        execSQLQuery(query2, cb2, req.body.cliente)
                    } else {
                        res.send({ message: 'Conquista já recebida.' })
                    }
                };
                execSQLQuery(query, cb, req.body.cliente);
            } else {
                res.send({ message: "Conquista não encontrada" });
            }
        };
        execSQLQuery(sqlQry, cbFirst, req.body.cliente);


    });

}
