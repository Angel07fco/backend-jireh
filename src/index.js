const app = require("./app");
const { PORT } = process.env;

const starApp = () => {
    app.listen(PORT, () => {
        console.log(`Auth Backend running on port ${PORT}`);
    });
};

starApp();