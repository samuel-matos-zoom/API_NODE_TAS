const { execSQLQuery } = require("../../../database");


exports.bannerRoutes = (app) => {
    app.post('/getBanners', (req, res) => {
        if (req.body.exibeApp != null) {
            var sqlQry = ["SELECT * FROM slide WHERE exibe_app = ? AND ativo = ?", [req.body.exibeApp, 1]];
        } else {
            var sqlQry = ["SELECT * FROM slide WHERE ativo = ?", [1]];
        }
        var cb = (val) => {
            var nArr = [];
            val.forEach(element => {
                var inicio = Date.parse(element['inicio']);
                var fim = Date.parse(element['fim']);
                var agora = Date.now();
                if (inicio < agora && agora < fim) {
                    if (element['id_perfil'] == null) {
                        nArr.push(element);
                    } else {
                        var perfis = element['id_perfil'];
                        var arrPerfis = perfis.split(',');
                        if (arrPerfis.includes((req.body.idPerfil).toString())) {
                            nArr.push(element);
                        }
                    }
                }

            });
            res.json(nArr);

        };
        execSQLQuery(sqlQry, cb, req.body.cliente);
    });

}
