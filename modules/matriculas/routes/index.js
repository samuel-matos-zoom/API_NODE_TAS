const { execSQLQuery } = require("../../../database");


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
        var sqlQry = ["UPDATE curso_matricula SET progresso = ? WHERE id_usuario = ? AND id_curso = ?", [req.body.porcentagem, req.body.idUser, req.body.idCurso]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

}
