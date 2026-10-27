const jwt = require('jsonwebtoken');

// Protege rutas: exige "Authorization: Bearer <token>" y cuelga el payload en req.usuario.
// El resto de servicios (MySQL/PostgreSQL/MongoDB) confían en req.usuario.sub, nunca en el body.
function verificarToken(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'JWT inválido' });
  }

  const token = header.split(' ')[1];
  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'JWT inválido' });
  }
}

module.exports = { verificarToken };
