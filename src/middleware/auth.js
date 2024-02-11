const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) {
        return res.status(403).send("Se requiere un token de autenticación");
    }

    try {
        const decodedToken = await jwt.verify(token, TOKEN_KEY);
        req.currentUser = decodedToken;
    } catch (error) {
        return res.status(401).send("Token no válido");
    }

    return next();
};

module.exports = verifyToken;