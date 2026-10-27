const sql = require('mssql');

const config = {
  server: process.env.SQLSERVER_HOST,
  database: process.env.SQLSERVER_DB,
  user: process.env.SQLSERVER_USER,
  password: process.env.SQLSERVER_PASSWORD,
  options: {
    trustServerCertificate: true, // uso académico / local
    encrypt: false,
  },
};

let poolPromise;

// Un solo pool reutilizado en toda la app: no abrir conexión por cada query.
function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config).catch((err) => {
      poolPromise = null; // permite reintentar en la próxima llamada
      throw err;
    });
  }
  return poolPromise;
}

module.exports = { sql, getPool };
