const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const verifyToken = async (req, res, next) => {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

    if (token) {
        await jwt.verify(token, TOKEN_KEY, (error, data) => {
            if (error) return res.status(401).send("Token no válido");
            else {
                req.user = data;
                next();
            }
        });
    } else {
        res.status(403).send("Se requiere un token de autenticación");
    }
};

module.exports = verifyToken;