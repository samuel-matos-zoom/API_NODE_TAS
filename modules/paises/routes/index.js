const { execSQLQuery } = require("../../../database");


exports.paisesRoutes = (app) => {
    //deve pegar o termo ativo
    app.post('/getPais', (req, res) => {
        var sqlQry = ["SELECT * FROM pais WHERE id = ?", [req.body.pais]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });


}
