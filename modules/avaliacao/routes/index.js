const { execSQLQuery } = require("../../../database");


exports.avaliacaoRoutes = (app) => {
    app.post('/getAvaliacao', (req, res) => {
        var sqlQry = ["SELECT t1.id, t1.id_curso, t1.id_etapa, t1.titulo AS nm_avaliacao, t1.descricao, t1.tempo, t1.refazer, t1.obrigatorio, t1.notacorte, t1.embaralhar, t1.refazer_limit, t1.nummaxquestion, t2.notafinal, COUNT(t2.id_usuario) as tentativas FROM avaliacao t1 LEFT JOIN avaliacao_resposta t2 ON(t2.id_avaliacao = t1.id AND t2.id_usuario = ?) WHERE t1.id_curso = ? AND t1.id_etapa = ?", [req.body.idUser, req.body.idCurso, req.body.idEtapa,]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/getPerguntas', (req, res) => {
        var sqlQry = ["SELECT id AS id_questao, titulo AS nm_questao, tipo, nota, ordem FROM questao WHERE id_avaliacao = ? AND ativo = 1 AND tipo = ?", [req.body.idAvaliacao, 'radio']];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/getRespostas', (req, res) => {
        var sqlQry = ["SELECT id AS id_resposta, texto AS nm_resposta, tipo, correto FROM questao_opcao WHERE id_questao = ?", [req.body.idPergunta]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/sendResultadoAvaliacao', (req, res) => {
        var sqlQry = ["INSERT INTO avaliacao_resposta (id_avaliacao, id_usuario, data_gerado, data_fim, respostas, status,acertos,erros,local, notafinal, notacorte) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            [req.body.idAvaliacao, req.body.idUser, req.body.dataGerado, agora, req.body.respostas, 1, req.body.acertos, req.body.erros, 'app', req.body.notafinal, req.body.notacorte]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

}
