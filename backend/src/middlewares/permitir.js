function permitir(...perfisAceitos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Faça login para continuar' });
    }

    if (!perfisAceitos.includes(req.usuario.perfil)) {
      return res.status(403).json({ erro: 'Seu perfil não tem acesso a esta rota' });
    }

    next();
  };
}

module.exports = permitir;
