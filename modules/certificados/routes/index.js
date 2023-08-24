const { execSQLQuery } = require("../../../database");


exports.certificadosRoutes = (app) => {
    app.post('/getCertificados', (req, res) => {
        var sqlQry = ["SELECT t2.titulo AS nm_certificado, t1.datagerado AS dt_emissao FROM certificado_usuario t1 INNER JOIN certificado t2 ON t1.id_certificado = t2.id WHERE t1.id_usuario = ?", [req.body.idUser]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb);
    });

}
