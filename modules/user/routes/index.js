const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { execSQLQuery } = require("../../../database");

exports.userRoutes = (app) => {
    app.post('/addAccess', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var user = jsonwebtoken.verify(token, 'ZECTAS');
        console.log(user['id']);
        console.log(req.body.idPais);
        var query = ["INSERT INTO log_acesso (aparelho, bateria, data_hora, id_empresa, id_pais, id_perfil, id_usuario, ip, latitude, longitude, navegador, sistema,versao) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", [
            req.body.aparelho,
            req.body.bateria,
            moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z',
            req.body.idEmpresa,
            req.body.idPais,
            req.body.idPerfil,
            user['id'],
            req.body.ip,
            req.body.latitude,
            req.body.longitude,
            req.body.navegador,
            req.body.sistema,
            req.body.versao,
        ]];
        cb = (val) => {
            res.json(val[0])
        };
        execSQLQuery(query, cb);
    });
    app.get('/getAccesses', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var user = jsonwebtoken.verify(token, 'ZECTAS');
        var query = ["SELECT * FROM log_acesso WHERE id_usuario = ?", [user['id']]];
        var acessosMes = [];
        cb = (val) => {
            val.forEach((acesso) => {
                var newDate = moment(acesso['data_hora']);
                if (newDate.month() == moment().month()) {
                    acessosMes.push(acesso);
                }
            });
            res.json({ total: val.length, mes: acessosMes.length })
        };
        execSQLQuery(query, cb);
    });


    app.get('/getUser', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var query = ["SELECT * FROM usuario WHERE token = ?", [token]];
        cb = (val) => {
            res.json(val[0])
        };
        execSQLQuery(query, cb);
    });

    app.post('/updateUser', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var query = ["UPDATE usuario SET sexo = ?, id_idioma = ? WHERE token = ?", [req.body.sexo, req.body.idioma, token]];
        cb = (val) => {
            res.json(val[0])
        };
        execSQLQuery(query, cb);
    });

    app.get('/refreshPoints', (req, res) => {
        const [, token] = req.headers.authorization?.split(' ') || [' ', ' '];
        var user = jsonwebtoken.verify(token, 'ZECTAS');
        var query = ["SELECT SUM(pontos) as pontos FROM curso_usuario_log WHERE id_usuario = ? AND data_end IS NOT NULL", [user['id']]];
        cb = (val) => {
            if (val.length > 0) {
                var pontosRec = val[0]['pontos'] ?? 0;
                var queryConq = ["SELECT SUM(pontos) as pontos FROM gamificacao_log WHERE id_usuario = ? AND ativo = 1", [user['id']]];
                cbConq = (valConq) => {
                    if (valConq.length > 0) {
                        var pontosConq = valConq[0]['pontos'] ?? 0;
                        var pontos = parseInt(pontosRec) + parseInt(pontosConq);
                        var query2 = ["UPDATE usuario SET pontos = ? WHERE token = ?", [pontos, token]];
                        cb2 = (val) => {
                            res.send({ message: 'Pontos atualizados', pontos: pontos })
                        };
                        execSQLQuery(query2, cb2);
                    }
                };
                execSQLQuery(queryConq, cbConq);
            } else {
                res.send({ message: 'Nenhum log para esse usuário' });
            }
        }
        execSQLQuery(query, cb);
    });


    app.post('/newPass', async (req, res) => {
        var query = ["SELECT id, senha FROM usuario WHERE cpf = ?", [req.body.documento]];
        cb = async (txt) => {
            if (txt.length > 0) {
                if (txt[0]['senha'].length == 32) {
                    var newPass = await bcrypt.hash(req.body.newPass, 10);
                    const hashOldPass = crypto.createHash('md5').update(req.body.oldPass).digest('hex');
                    if (hashOldPass == txt[0]['senha']) {
                        var id = txt[0]['id'];
                        var agora = moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
                        var token = jsonwebtoken.sign({ ultimo_acesso: agora, id: id }, 'ZECTAS');
                        var query2 = ["UPDATE usuario SET token = ?, ultimo_acesso = ?, senha = ? WHERE id = ?", [token, agora, newPass, id]];
                        execSQLQuery(query2, () => { });
                        res.json({ token });
                    } else {
                        res.send({ message: "Senha incoreta." })
                    }
                } else {
                    res.send({ message: "Senha já está no padrão novo." })
                }
            } else {
                res.send({ message: "Usuário não encontrado." })
            }
        }
        execSQLQuery(query, cb);
    });


    app.post('/login', async (req, res) => {
        var query = [];
        if (req.body.email != null) {
            query = ["SELECT id, senha, ativo, ultimo_acesso FROM usuario WHERE email = ?", [req.body.email]];
        } else {
            query = ["SELECT id, senha, ativo, ultimo_acesso FROM usuario WHERE cpf = ?", [req.body.documento]];
        }
        cb = async (txt) => {
            console.log(req.body.documento);
            console.log(req.body.senha);
            if (txt.length > 0) {
                if (txt[0]['ativo'] != '1') {
                    res.send({
                        status: 'error',
                        error_code: 2,
                        error_message: "Usuário inátivo",
                        ative: txt[0]['ativo'],
                    });
                } else {
                    if (txt[0]['senha'].length == 32) {
                        res.send({
                            status: 'error',
                            error_code: 1,
                            error_message: "Senha no padrão antigo (MD5)",
                        });
                    } else {

                        //
                        console.log(txt[0]['senha']);
                        console.log(req.body.senha);
                        bcrypt.genSalt(10);
                        bcrypt.compare(req.body.senha, txt[0]['senha'], function (err, result) {
                            if (result) {
                                var id = txt[0]['id'];
                                var agora = moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
                                var token = jsonwebtoken.sign({ ultimo_acesso: agora, id }, 'ZECTAS');

                                var query2 = ["UPDATE usuario SET token = ?, ultimo_acesso = ? WHERE id = ?", [token, agora, id]];

                                execSQLQuery(query2, () => {
                                    res.json({ token, ultimo_acesso: txt[0]['ultimo_acesso'] });
                                });
                            } else {
                                res.send({ message: "Senha incorreta" });
                            }
                        });
                        //


                    }
                }
            } else {
                res.send({ message: "Usuário não encontrado" })
            }
        }
        execSQLQuery(query, cb);
    });

    app.post('/changePass', async (req, res) => {
        var query = [];
        if (req.body.email != null) {
            query = ["SELECT id, senha, ativo FROM usuario WHERE email = ?", [req.body.email]];
        } else {
            query = ["SELECT id, senha, ativo FROM usuario WHERE cpf = ?", [req.body.documento]];
        }
        cb = async (txt) => {
            console.log(req.body.documento);
            console.log(req.body.oldPass);
            if (txt.length > 0) {
                if (txt[0]['ativo'] != '1') {
                    res.send({
                        status: 'error',
                        error_code: 2,
                        error_message: "Usuário inátivo",
                        ative: txt[0]['ativo'],
                    });
                } else {
                    if (txt[0]['senha'].length == 32) {
                        res.send({
                            status: 'error',
                            error_code: 1,
                            error_message: "Senha no padrão antigo (MD5)",
                        });
                    } else {
                        var verify = await bcrypt.compare(req.body.oldPass, txt[0]['senha']);
                        if (verify) {
                            var id = txt[0]['id'];
                            var newPass = await bcrypt.hash(req.body.newPass, 10);
                            var agora = moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
                            var token = jsonwebtoken.sign({ ultimo_acesso: agora, id }, 'ZECTAS');
                            var query2 = ["UPDATE usuario SET token = ?, ultimo_acesso = ?, senha = ? WHERE id = ?", [token, agora, newPass, id]];
                            execSQLQuery(query2, () => { });
                            res.json({ token });
                        } else {
                            res.send({ message: "Senha incorreta" });
                        }
                    }
                }
            } else {
                res.send({ message: "Usuário não encontrado" })
            }
        }
        execSQLQuery(query, cb);
    });


    app.post('/refreshToken', (req, res) => {

        //Pega usuário pelo token
        var query = ["SELECT ultimo_acesso, id FROM usuario WHERE token = ?", [req.body.token]];
        //decodifica o token
        var user = jsonwebtoken.verify(req.body.token, 'ZECTAS');
        var agora = moment().format('YYYY-MM-DDTHH:mm:ss') + '.000Z';
        var newDate = moment(user['ultimo_acesso']);
        //verifica a diferença entre as datas
        var diff = newDate.diff(agora, 'days');
        if (diff > 30) {
            res.send({ message: "Token expirado!" })
        } else {
            //caso a diferença for menor de 30 dias 
            cb = (txt) => {
                if (txt.length > 0) {
                    var id = txt[0]['id'];
                    var last_access = txt[0]['ultimo_acesso'];
                    var lst = moment(last_access);
                    //verifica se o ultimo_acesso do token é igual ao ultimo_acesso do banco
                    if (lst.isSame(newDate)) {
                        //cria um novo token e atualiza no banco
                        var token = jsonwebtoken.sign({ ultimo_acesso: agora, id }, 'ZECTAS');
                        var query2 = ["UPDATE usuario SET token = ?, ultimo_acesso = ? WHERE token = ?", [token, agora, req.body.token]];
                        execSQLQuery(query2, () => { });
                        res.json({ token });
                    } else {
                        //caso a data seja diferente retorna token inválido
                        res.send({ message: "Token inválido" });
                    }
                } else {
                    res.send({ message: 'Usuário não encontrado ou token inválido' })
                }

            };
            execSQLQuery(query, cb);
        }
    });


}
