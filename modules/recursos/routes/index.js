
const { execSQLQuery } = require("../../../database");
const moment = require('moment');


exports.recursosRoutes = (app) => {
    app.post('/getRecursos', (req, res) => {
        var sqlQry = ["SELECT t1.id AS id_recurso, t1.titulo AS nm_recurso, t1.link AS arquivo_youtube, t1.id_scorm, t1.id_etapa, t1.id_curso, t1.tipo, t1.pontos, t1.ordem, t1.cargahoraria, t1.pesquisa AS id_pesquisa, t2.titulo AS nm_videoaula, t2.capa AS img_capa_video, t3.mp4 AS arquivo_video, t4.data_start, t4.data_end, t5.url AS arquivo_podcast, t5.arquivo AS arquivo_pdf, t7.titulo AS nm_certificado, t8.id_certificado AS ganhou_certificado, t8.datagerado FROM curso_recurso t1  LEFT JOIN curso_videoaula t2 ON t2.id = t1.id_videoaula  LEFT JOIN curso_videoaula_capitulo t3 ON t3.id_videoaula = t2.id  LEFT JOIN curso_usuario_log t4 ON t4.id_curso_recurso = t1.id AND t4.id_usuario = ? LEFT JOIN biblioteca t5 ON t5.id = t1.id_webcast  INNER JOIN curso_matricula t6 ON t6.id_curso = t1.id_curso AND t6.id_usuario = ? LEFT JOIN certificado t7 ON t7.id_curso = t1.id LEFT JOIN certificado_usuario t8 ON t8.id_certificado = t7.id AND t8.id_usuario = ? WHERE t1.ativo = 1",
            [req.body.idUser, req.body.idUser, req.body.idUser]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });


    app.post('/getLogUsuarioRecursos', (req, res) => {
        var sqlQry = ["SELECT * FROM curso_usuario_log WHERE id_usuario = ? AND id_perfil = ? AND data_end IS NULL", [req.body.idUser, req.body.idPerfil]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/startLogUsuarioRecursos', (req, res) => {
        var selectQry = ["SELECT * FROM curso_usuario_log WHERE id_curso_recurso = ? AND id_usuario= ?", [
            req.body.idCursoRecurso,
            req.body.idUsuario
        ]];
        var cb1 = (val) => {
            if (val.length == 0) {
                var sqlQry = ["INSERT INTO curso_usuario_log (id_curso_recurso, id_usuario, id_empresa, id_loja, id_perfil, data_start, data_end, observacao, temporeal, tempomed, nota_user, arquivo, justificativa, id_gestor, data_correcao, pontos) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [
                    req.body.idCursoRecurso,
                    req.body.idUsuario,
                    req.body.idEmpresa,
                    req.body.idLoja,
                    req.body.idPerfil,
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                    req.body.dataEnd,
                    req.body.observacao,
                    req.body.temporeal,
                    req.body.tempomed,
                    req.body.notaUser,
                    req.body.arquivo,
                    req.body.justificativa,
                    req.body.idGestor,
                    req.body.dataCorrecao,
                    req.body.pontos
                ]];
                var cb = (val) => {
                    res.json(val);
                };
                execSQLQuery(sqlQry, cb, req.body.cliente);
            } else {
                res.send({ "message": "já existe um log para esse recurso deste usuário" })
            }
        };
        execSQLQuery(selectQry, cb1, req.body.cliente);
    });

    app.post('/endLogUsuarioRecursos', (req, res) => {
        var selectQry = ["SELECT * FROM curso_usuario_log WHERE id_curso_recurso = ? AND id_usuario= ? AND data_end IS NULL", [
            req.body.idCursoRecurso,
            req.body.idUsuario
        ]];
        var cb1 = (val) => {
            if (val.length == 1) {
                var now = moment(new Date());
                var start = moment(val[0]["data_start"]);
                var duration = moment.duration(now.diff(start));
                var minutes = duration.asMinutes().toFixed(0);


                var sqlQry = ["UPDATE curso_usuario_log SET data_end= ?, temporeal= ?, pontos= ? WHERE id_curso_recurso = ? AND id_usuario= ?", [
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                    minutes,
                    req.body.pontos,
                    req.body.idCursoRecurso,
                    req.body.idUsuario,
                ]];
                var cb = (val) => {
                    res.send({
                        message: 'Recurso encerrado com sucesso',
                        pontos: req.body.pontos,
                        status: true,
                    });
                };
                execSQLQuery(sqlQry, cb, req.body.cliente);
            } else {
                res.send({ "message": "não existe um log para esse recurso deste usuário ou o recurso já foi concluido", status: false })
            }
        };
        execSQLQuery(selectQry, cb1, req.body.cliente);
    });

    app.post('/getLogRecursos', (req, res) => {
        var sqlQry = ["SELECT * FROM curso_recurso_log WHERE id_usuario = ?", [req.body.idUser]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/updateLogRecursos', (req, res) => {
        //update or insert
        var sqlQry = ["UPDATE curso_recurso_log SET tempo = ?, data_gerado = ? WHERE id_curso_recurso = ? AND id_usuario = ?", [req.body.tempo, moment().format('YYYY-MM-DD HH:mm:ss'), req.body.idRecurso, req.body.idUser]];
        var cb = (val) => {
            if (val['affectedRows'] == 0) {
                var sqlQry2 = ["INSERT INTO curso_recurso_log (tempo, data_gerado, id_curso_recurso, id_usuario) VALUES (?,?,?,?)", [req.body.tempo, moment().format('YYYY-MM-DD HH:mm:ss'), req.body.idRecurso, req.body.idUser]];
                var cb2 = (val2) => {
                    if (val2['affectedRows'] == 1) {
                        res.send({
                            "message": "log inserido com sucesso"
                        });
                    } else {
                        res.send({
                            "message": "erro ao inserir log"
                        });
                    }
                };
                execSQLQuery(sqlQry2, cb2, req.body.cliente);
            } else {
                res.send({
                    "message": "log atualizado com sucesso"
                });
            }
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

}
