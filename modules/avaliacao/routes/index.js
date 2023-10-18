const { execSQLQuery } = require("../../../database");
const moment = require('moment');
const jsonwebtoken = require('jsonwebtoken');

exports.avaliacaoRoutes = (app) => {
    app.post('/getAvaliacao', (req, res) => {
        var sqlQry = ["SELECT t1.id, t1.id_curso, t1.id_etapa, t1.titulo AS nm_avaliacao, t1.descricao, t1.tempo, t1.refazer, t1.obrigatorio, t1.notacorte, t1.embaralhar, t1.refazer_limit, t1.nummaxquestion, t2.notafinal, (SELECT COUNT(id_usuario) FROM avaliacao_resposta WHERE id_avaliacao = t1.id AND id_usuario = ?) as tentativas FROM avaliacao t1 LEFT JOIN avaliacao_resposta t2 ON t2.id_avaliacao = t1.id AND t2.id_usuario = ? WHERE t1.id_curso = ? AND t1.id_etapa = ?  ORDER BY t2.notafinal DESC LIMIT 1", [req.body.idUser, req.body.idUser, req.body.idCurso, req.body.idEtapa,]];
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
        var agora = moment().format('YYYY-MM-DDTHH:mm:ss');
        if (req.body.resultado != null) {
            let jsonValidStr = String(req.body.resultado).replace(/(\w+):/g, '"$1":');
            let obj = JSON.parse(jsonValidStr);
            let perguntas = Object.keys(obj);
            let respostas = Object.values(obj);
            var corretas =
                respostas.filter((r) => r.selected == r.correta).length;
            const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
            if (token != null) {
                var user = jsonwebtoken.verify(token, 'ZECTAS');
                if (user['id'] != null) {
                    var sqlQry = ["INSERT INTO avaliacao_resposta (id_avaliacao,id_usuario,data_gerado,data_fim,respostas,status,acertos,erros,local,notafinal,notacorte,overduehandling,id_perfiluser,id_curso,id_trilha) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        [req.body.idAvaliacao, user['id'], req.body.inicio, agora, respostas.length, ((corretas / respostas.length) * 100) >= req.body.notacorte ? 1 : 0, corretas, (respostas.length - corretas), 'app', (corretas / respostas.length) * 100, req.body.notacorte, req.body.submitType, req.body.idPerfil, req.body.idCurso, req.body.idTrilha]];
                    var cb = (val) => {
                        var idAvalResposta = val['insertId'];
                        for (let i = 0; i < perguntas.length; i++) {
                            var sqlQry2 = ["INSERT INTO avaliacao_resposta_itens (id_avaliacao_resposta,id_questao, id_questao_opcao, correto) VALUES (?,?,?,?)",
                                [idAvalResposta, perguntas[i], respostas[i].selected, respostas[i].selected == respostas[i].correta ? 1 : 0]];
                            cb2 = (val2) => {
                                console.log(val2['insertId']);
                            }
                            execSQLQuery(sqlQry2, cb2, req.body.cliente);
                        }
                        res.json({ "idAvalResposta": idAvalResposta });
                    };
                    execSQLQuery(sqlQry, cb, req.body.cliente);
                } else {
                    res.json({ "message": "Token inválido!" })
                }
            } else {
                res.json({ "message": "Token invalido" })
            }

        } else {
            const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
            if (token != null) {
                var user = jsonwebtoken.verify(token, 'ZECTAS');
                if (user['id'] != null) {
                    var sqlQry = ["INSERT INTO avaliacao_resposta (id_avaliacao,id_usuario,data_gerado,data_fim,respostas,status,acertos,erros,local,notafinal,notacorte,overduehandling,id_perfiluser,id_curso,id_trilha) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                        [req.body.idAvaliacao, user['id'], req.body.inicio, agora, 0, 0, 0, 0, 'app', 0, req.body.notacorte, req.body.submitType, req.body.idPerfil, req.body.idCurso, req.body.idTrilha]];
                    var cb = (val) => {
                        var idAvalResposta = val['insertId'];
                        res.json({ "idAvalResposta": idAvalResposta });
                    };
                    execSQLQuery(sqlQry, cb, req.body.cliente);
                } else {
                    res.json({ "message": "Token inválido!" })
                }
            } else {
                res.json({ "message": "Token invalido" })
            }
        }




    });

}
