const { execSQLQuery } = require("../../../database");
const moment = require('moment');

exports.matriculasRoutes = (app) => {
    app.post('/getMatriculas', (req, res) => {
        var sqlQry = ["SELECT * FROM curso_matricula WHERE id_usuario = ? AND ativo_matricula = 1 AND (dt_vencimento_matricula IS NULL OR dt_vencimento_matricula > CURRENT_DATE OR status_curso = ?) ", [req.body.idUser, 1]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });


    //status e data end
    app.post('/setProgressoMatricula', (req, res) => {
        var sqlQry = [];
        var agora = moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
        switch (req.body.porcentagem) {
            case "0":
                sqlQry = ["UPDATE curso_matricula SET progresso = ?, data_start = ? WHERE id_usuario = ? AND id_curso = ?", [req.body.porcentagem, agora, req.body.idUser, req.body.idCurso]];
                break;
            case "100":
                sqlQry = ["UPDATE curso_matricula SET progresso = ?, data_end = ? WHERE id_usuario = ? AND id_curso = ? AND progresso < ?", [req.body.porcentagem, agora, req.body.idUser, req.body.idCurso, 100]];
                break;
            default:
                sqlQry = ["UPDATE curso_matricula SET progresso = ? WHERE id_usuario = ? AND id_curso = ?", [req.body.porcentagem, req.body.idUser, req.body.idCurso]];
                break;
        }
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

}
