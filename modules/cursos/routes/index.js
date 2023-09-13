const { execSQLQuery } = require("../../../database");


exports.cursosRoutes = (app) => {

    app.post('/getCursos', (req, res) => {
        var sqlQry = ["SELECT * FROM curso WHERE ativo = 1 AND id IN (?) ORDER BY ordem ASC", [req.body.cursos]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/getCursosByTrilha', (req, res) => {
        var sqlQry = ["SELECT * FROM curso WHERE ativo = 1 AND id_trilha = ? ORDER BY ordem ASC", [req.body.idTrilha]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });
}
