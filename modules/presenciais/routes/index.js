const { execSQLQuery } = require("../../../database");


exports.presenciaisRoutes = (app) => {
    app.post('/getPresenciais', (req, res) => {
        var sqlQry = ["SELECT t1.id_pi_curso_turma_agenda, t1.agendamento, t1.dt_agendamento, DAY(t1.dt_agendamento) AS day, MONTH(t1.dt_agendamento) AS month, YEAR(t1.dt_agendamento) AS year, t1.hr_inicio, t1.hr_fim, t1.link_sala_virtual, t1.id_formato, t2.nm_turma, t3.codigo AS cod_inscricao, t4.nome_fantasia AS nm_loja, t4.rua AS endereco, t4.numero, t4.cidade, t4.estado, t4.bairro, t4.latitude, t4.longitude, t5.presenca, t6.nome AS nm_tema, t7.nome AS nm_instrutor FROM pi_curso_turma_agenda t1 INNER JOIN pi_curso_turma t2 ON t2.id_pi_curso_turma = t1.id_pi_curso_turma INNER JOIN pi_curso_turma_inscricao t3 ON t3.id_pi_curso_turma = t2.id_pi_curso_turma INNER JOIN lojas t4 ON t4.id = t1.id_loja LEFT JOIN pi_curso_turma_presenca t5 ON t5.id_pi_curso_turma_inscricao = t3.id_pi_curso_turma_inscricao INNER JOIN pi_temastreinamento t6 ON t6.id = t1.id_pi_tema INNER JOIN usuario t7 ON t7.id = t1.id_instrutor WHERE t3.id_usuario = ? AND t1.agendamento != 4 ORDER BY t1.dt_agendamento ASC", [req.body.idUser]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

}
