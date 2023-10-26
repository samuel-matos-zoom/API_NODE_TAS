const express = require('express');
const { termsRoutes } = require('../modules/terms/routes');
const { userRoutes } = require('../modules/user/routes');
const { paisesRoutes } = require('../modules/paises/routes');
const { idiomasRoutes } = require('../modules/idiomas/routes');
const { generosRoutes } = require('../modules/generos/routes');
const { matriculasRoutes } = require('../modules/matriculas/routes');
const { trilhasRoutes } = require('../modules/trilhas/routes');
const { cursosRoutes } = require('../modules/cursos/routes');
const { etapasRoutes } = require('../modules/etapas/routes');
const { recursosRoutes } = require('../modules/recursos/routes');
const { presenciaisRoutes } = require('../modules/presenciais/routes');
const { certificadosRoutes } = require('../modules/certificados/routes');
const { conquistasRoutes } = require('../modules/conquistas/routes');
const { bibliotecaRoutes } = require('../modules/biblioteca/routes');
const { niveisRoutes } = require('../modules/niveis/routes');
const { bannerRoutes } = require('../modules/banner/routes');
const { tagsRoutes } = require('../modules/tags/routes');
const { avisosRoutes } = require('../modules/avisos/routes');
const { rankingRoutes } = require('../modules/ranking/routes');
const { npsRoutes } = require('../modules/nps/routes');
const { avaliacaoRoutes } = require('../modules/avaliacao/routes');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

exports.start = () => {
    app.listen(3000, () => {
        console.log('Server running at https://localhost/');
    });
    app.use(express.json());
    userRoutes(app);
    termsRoutes(app);
    paisesRoutes(app);
    idiomasRoutes(app);
    generosRoutes(app);
    matriculasRoutes(app);
    trilhasRoutes(app);
    cursosRoutes(app);
    etapasRoutes(app);
    recursosRoutes(app);
    presenciaisRoutes(app);
    certificadosRoutes(app);
    conquistasRoutes(app);
    bibliotecaRoutes(app);
    niveisRoutes(app);
    bannerRoutes(app);
    tagsRoutes(app);
    avisosRoutes(app);
    rankingRoutes(app);
    npsRoutes(app);
    avaliacaoRoutes(app);
};
