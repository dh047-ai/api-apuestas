require('dotenv').config();

const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth.routes');
const deportesRoutes = require('./routes/deportes.routes');
const apuestasRoutes = require('./routes/apuestas.routes');
const mercadosRoutes = require('./routes/mercados.routes');
const { verificarToken } = require('./middleware/auth.middleware');

// 1. PRIMERO inicializamos app
const app = express();
app.use(express.json());
app.use(cors());

// 2. LUEGO configuramos Swagger (ya que utiliza app.use)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Apuestas',
            version: '1.0.0',
            description: 'Documentación oficial de la API de Apuestas'
        },
        servers: [{ url: 'http://localhost:3000' }]
    },
    apis: ['./src/routes/*.js'] 
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 3. FINALMENTE conectamos todas las rutas
app.use('/api/pagos', require('./routes/pagos.routes'));
app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/deportes', deportesRoutes);
app.use('/api/apuestas', apuestasRoutes);
app.use('/api/mercados', mercadosRoutes);

const verificacionRoutes = require('./routes/verificacion.routes');
app.use('/api/verificacion', verificacionRoutes);
// Ruta de prueba para confirmar que el JWT viaja y se valida correctamente.
app.get('/api/auth/whoami', verificarToken, (req, res) => {
  res.json({ usuario: req.usuario });
});

// Manejo de rutas no encontradas
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API corriendo en http://localhost:${PORT}`));