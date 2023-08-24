const { execSQLQuery } = require("../../../database");
const moment = require('moment');
const jsonwebtoken = require('jsonwebtoken');

exports.npsRoutes = (app) => {
    app.post('/getNps', (req, res) => {
        var sqlQry = ["SELECT * FROM nps_pesquisa WHERE id = ?", req.body.npsId];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb);
    });

    app.post('/addNps', (req, res) => {
        var sqlQry = ["INSERT INTO nps_resposta (id_nps, id_usuario, id_recurso,score,resposta,ativo,datagerado, respondeupor) VALUES (?,?,?,?,?,?,?,?)", [
            req.body.idNps,
            req.body.idUsuario,
            req.body.idRecurso,
            req.body.score,
            req.body.resposta,
            1,
            moment().format('YYYY-MM-DD HH:mm:ss'),
            1,
        ]];
        var cb = (val) => {
            if (val['affectedRows'] == 1) {
                res.json({
                    message: 'resposta adicionada com sucesso'
                });

            } else {
                res.json({
                    message: 'resposta adicionada com sucesso'
                });
            }
        };
        execSQLQuery(sqlQry, cb);
    });


}
