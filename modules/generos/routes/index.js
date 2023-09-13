const { execSQLQuery } = require("../../../database");


exports.generosRoutes = (app) => {

    app.post('/setGenero', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var sqlQry = ["UPDATE usuario SET sexo = ? WHERE token = ? ", [req.body.genero, token]];
        var cb = (val) => {
            console.log(val);
            res.json(val);

        };

        execSQLQuery(sqlQry, cb, req.body.cliente);
    });


}
