const { execSQLQuery } = require("../../../database");


exports.niveisRoutes = (app) => {
    app.get('/getNiveis', (req, res) => {
        var sqlQry = ["SELECT * FROM gamificacao_nivel", []];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb);
    });

}
