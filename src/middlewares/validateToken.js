const validateToken = (req, res, next) => {
    const { authorization } = req.headers;
    console.log('linha 3', req.headers);
    if (!authorization) {
        return res.status(402).json({message: 'Token não encontrado'})
    };

    if (authorization.length !== 16 || typeof authorization !== 'string') {
        console.log('estou aqui', authorization);
        return res.status(403).json({message: 'Token inválido'})
    }

    next();
}

module.exports = validateToken;