const { execSQLQuery } = require("../../../database");


exports.idiomasRoutes = (app) => {
    //deve pegar o termo ativo
    app.post('/getIdioma', (req, res) => {
        var sqlQry = ["SELECT * FROM idioma WHERE id = ?", [req.body.idioma]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/getIdiomas', (req, res) => {
        var sqlQry = ["SELECT * FROM idioma"];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });
    app.post('/setIdioma', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var sqlQry = ["UPDATE usuario SET id_idioma = ? WHERE token = ? ", [req.body.id, token]];
        var cb = (val) => {
            console.log(val);
            res.json(val);

        };

        execSQLQuery(sqlQry, cb, req.body.cliente);
    });


}
