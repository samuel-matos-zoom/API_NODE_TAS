const { execSQLQuery } = require("../../../database");


exports.etapasRoutes = (app) => {
    app.post('/getEtapas', (req, res) => {
        var sqlQry = ["SELECT * FROM etapa WHERE ativo = 1 AND id_curso IN (?)", [req.body.cursos]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb);
    });

}
