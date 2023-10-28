const { execSQLQuery } = require("../../../database");


exports.bibliotecaRoutes = (app) => {
    app.post('/getBiblioteca', (req, res) => {
        var sqlQry = ["SELECT t1.id, t1.id_curso, t1.id_categoria, t1.titulo, t1.tipo, t1.capa AS img_biblioteca, t1.arquivo, t1.link AS link_arquivo, t1.descricao, t1.data_gerado, t1.data_alterado, t1.curtidas, t1.id_perfil, t2.nome AS nm_categoria, t3.id_usuario AS minha_biblioteca, t4.id_biblioteca AS curtiu_publicacao FROM biblioteca t1 INNER JOIN biblioteca_categoria t2 ON t2.id = t1.id_categoria LEFT JOIN biblioteca_minha t3 ON t3.id_biblioteca = t1.id AND t3.id_usuario = ? LEFT JOIN biblioteca_curtidas t4 ON t4.id_biblioteca = t1.id AND t4.id_usuario = ? WHERE t1.ativo = 1 AND t1.tipo != 'podcast' AND t1.id_curso = 0 AND t1.id_trilha = 0 AND(t1.id_perfil IS NULL OR FIND_IN_SET(?, t1.id_perfil)) AND t1.id_categoria", [req.body.idUser, req.body.idUser, req.body.idPerfil]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/getBibliotecaByCurso', (req, res) => {
        var sqlQry = ["SELECT t1.id, t1.id_curso, t1.id_categoria, t1.titulo, t1.tipo, t1.capa AS img_biblioteca, t1.arquivo, t1.link AS link_arquivo, t1.descricao, t1.data_gerado, t1.data_alterado, t1.curtidas, t1.id_perfil, t2.nome AS nm_categoria, t3.id_usuario AS minha_biblioteca, t4.id_biblioteca AS curtiu_publicacao FROM biblioteca t1 INNER JOIN biblioteca_categoria t2 ON t2.id = t1.id_categoria LEFT JOIN biblioteca_minha t3 ON t3.id_biblioteca = t1.id AND t3.id_usuario = ? LEFT JOIN biblioteca_curtidas t4 ON t4.id_biblioteca = t1.id AND t4.id_usuario = ? WHERE t1.ativo = 1 AND t1.tipo != 'podcast' AND t1.id_curso = ? AND t1.id_categoria", [req.body.idUser, req.body.idUser, req.body.idCurso]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

    app.post('/addBibliotecaLog', (req, res) => {
        var sqlQry = ["INSERT INTO biblioteca_log (id_biblioteca, id_usuario,datagerado,app) VALUES (?,?,?,?)", [req.body.idBiblioteca, req.body.idUser, req.body.hora, 1]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

}
