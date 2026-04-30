const express = require('express');
const swaggerUi = require('swagger-ui-express');
const apiRoutes = require('./routes');
const swaggerSpec = require('./config/swagger');
const { toProblemDetails } = require('./utils/resources');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', apiRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).type('application/problem+json').json(toProblemDetails(req, err));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    console.log(`Documentation Swagger: http://localhost:${PORT}/api-docs`);
  });
}

module.exports = app;
