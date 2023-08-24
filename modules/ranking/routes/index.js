const { execSQLQuery } = require("../../../database");


exports.rankingRoutes = (app) => {
    app.post('/getRankingByPerfil', (req, res) => {
        var sqlQry = ["SELECT id, nome,imagem, pontos FROM usuario WHERE id_perfil = ? AND ativo = ? ORDER BY pontos DESC LIMIT 10", [req.body.idPerfil, 1]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb);
    });

}
