const express = require('express');
const { termsRoutes } = require('../terms/routes');
const { userRoutes } = require('../user/routes');
const { paisesRoutes } = require('../paises/routes');
const { idiomasRoutes } = require('../idiomas/routes');
const { generosRoutes } = require('../generos/routes');
const { matriculasRoutes } = require('../matriculas/routes');
const { trilhasRoutes } = require('../trilhas/routes');
const { cursosRoutes } = require('../cursos/routes');
const { etapasRoutes } = require('../etapas/routes');
const { recursosRoutes } = require('../recursos/routes');
const { presenciaisRoutes } = require('../presenciais/routes');
const { certificadosRoutes } = require('../certificados/routes');
const { conquistasRoutes } = require('../conquistas/routes');
const { bibliotecaRoutes } = require('../biblioteca/routes');
const { niveisRoutes } = require('../niveis/routes');
const { bannerRoutes } = require('../banner/routes');
const { tagsRoutes } = require('../tags/routes');
const { avisosRoutes } = require('../avisos/routes');
const { rankingRoutes } = require('../ranking/routes');
const { npsRoutes } = require('../nps/routes');

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
};
