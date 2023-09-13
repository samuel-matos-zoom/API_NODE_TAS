const { execSQLQuery } = require("../../../database");


exports.tagsRoutes = (app) => {
    app.get('/getTags', (req, res) => {
        var sqlQry = ["SELECT * FROM curso_tags WHERE ativo = 1", []];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.query.cliente);
    });

}
