const app = require("./src/app");
const { PORT } = process.env;

const starApp = () => {
  app.listen(PORT, () => {
    console.log(`Backend ejecutándose en el puerto ${PORT}`);
  });
};

starApp();
