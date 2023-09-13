const { execSQLQuery } = require("../../../database");


exports.avisosRoutes = (app) => {
    app.post('/getAvisos', (req, res) => {
        var sqlQry = ["SELECT * FROM mural_avisos WHERE ativo = 1 AND id_receptor = ? ", [req.body.idUser]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });


    app.post('/lerAviso', (req, res) => {
        var sqlQry = ["UPDATE mural_avisos SET lido = 1 WHERE id = ? AND id_receptor = ?", [req.body.idAviso, req.body.idUser]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

}
