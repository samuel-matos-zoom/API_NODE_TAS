const { execSQLQuery } = require("../../../database");
const moment = require('moment');
const jsonwebtoken = require('jsonwebtoken');

exports.termsRoutes = (app) => {

    //deve pegar o termo ativo
    app.get('/getTerm', (req, res) => {
        console.log(req.query.cliente);
        var sqlQry = ["SELECT * FROM termos_uso WHERE ativo = ?", [1]];
        var cb = (val) => {
            res.json(val);
        };
        execSQLQuery(sqlQry, cb, req.query.cliente);
    });

    //deve atualizar o usuario com aceite e registrar o log
    app.post('/acceptTerm', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var sqlQry = ["UPDATE usuario SET ultimo_termo = ? WHERE token = ?", [req.body.id_termo, token]];
        execSQLQuery(sqlQry, () => { }, req.body.cliente);
        var user = jsonwebtoken.verify(token, 'ZECTAS');
        var agora = moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
        var sqlQry2 = ["INSERT INTO termos_uso_log (id_usuario, id_termo_uso, aceitou, data_gerado,dispositivo) VALUES (?,?,1,?,?)", [user['id'], req.body.id_termo, agora, req.body.dispositivo]];
        execSQLQuery(sqlQry2, (val) => { res.json(val) }, req.body.cliente);

    });
}
