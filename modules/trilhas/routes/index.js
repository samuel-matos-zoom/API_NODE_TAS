const { execSQLQuery } = require("../../../database");


exports.trilhasRoutes = (app) => {
    app.post('/getTrilhas', (req, res) => {
        var sqlQry = ["SELECT * FROM trilha WHERE ativo = 1 AND id IN (?) ORDER BY ordem ASC", [req.body.trilhas]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });
    app.post('/getTrilha', (req, res) => {
        var sqlQry = ["SELECT * FROM trilha WHERE ativo = 1 AND id = ?", [req.body.idTrilha]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });
}
