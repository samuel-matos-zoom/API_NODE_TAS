const { execSQLQuery } = require("../../../database");


exports.avaliacaoRoutes = (app) => {
    app.post('/getAvaliacao', (req, res) => {
        var sqlQry = ["SELECT t1.id, t1.id_curso, t1.id_etapa, t1.titulo AS nm_avaliacao, t1.descricao, t1.tempo, t1.refazer, t1.obrigatorio, t1.notacorte, t1.embaralhar, t1.refazer_limit, t1.nummaxquestion, t2.notafinal, COUNT(t2.id_usuario) as tentativas FROM avaliacao t1 LEFT JOIN avaliacao_resposta t2 ON(t2.id_avaliacao = t1.id AND t2.id_usuario = ?) WHERE t1.id_curso = ? AND t1.id_etapa = ?", [req.body.idUser, req.body.idCurso, req.body.idEtapa,]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });




}
