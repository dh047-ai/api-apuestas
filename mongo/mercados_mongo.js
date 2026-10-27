// ============================================================
// Servicio de Reglas/Mercados + Auditoría (MongoDB)
// Dueño exclusivo de: mercados (reglas de apuesta) y auditoria (log)
// Sin referencias a otros motores (SQLServer/MySQL/PostgreSQL)
//
// Cómo ejecutarlo:
//   mongosh "mongodb://localhost:27017" mercados_mongo.js
// o pega el contenido dentro de mongosh / la pestaña "mongosh" de Compass
// ============================================================

use("apuestas_reglas");

db.mercados.deleteMany({});
db.auditoria.deleteMany({});

db.mercados.insertMany([
  {
    nombre_mercado: "Ganador",
    tipo_apuesta: "Ganador",
    selecciones: ["Local", "Empate", "Visitante"],
    requiere_resultado_final: true,
    activo: true,
    reglas: "Se paga la cuota completa si el equipo seleccionado gana en tiempo reglamentario"
  },
  {
    nombre_mercado: "Marcador exacto",
    tipo_apuesta: "Marcador exacto",
    selecciones: [],
    requiere_resultado_final: true,
    activo: true,
    reglas: "Se paga solo si el marcador final coincide exactamente con la selección"
  },
  {
    nombre_mercado: "Total goles",
    tipo_apuesta: "Total goles",
    selecciones: ["Más de 2.5", "Menos de 2.5"],
    requiere_resultado_final: true,
    activo: true,
    reglas: "Apuesta a más/menos de N goles en el partido"
  },
  {
    nombre_mercado: "Ambos anotan",
    tipo_apuesta: "Ambos anotan",
    selecciones: ["Sí", "No"],
    requiere_resultado_final: true,
    activo: true,
    reglas: "Apuesta a si ambos equipos anotan al menos un gol"
  }
]);

// Índices para que /auditoria (ordenado por fecha, filtrado por usuario) sea rápido.
db.auditoria.createIndex({ fecha: -1 });
db.auditoria.createIndex({ correo_usuario: 1 });

print("Base apuestas_reglas lista con " + db.mercados.countDocuments() + " mercados.");
