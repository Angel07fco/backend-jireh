const express = require("express");
const router = express.Router();
const {
  createdUser,
  authenticateUser,
  logoutUserSession,
  getUserById,
  updateUser,
  getUsers,
  deshabilitarUsuario,
  habilitarUsuario,
  authenticateUserMovil,
  getUserByIdByEmail,
} = require("./controller");
const auth = require("./../../middleware/auth");
const {
  sendVerificationOTPEmail,
} = require("./../email_verification/controller");
const axios = require("axios");

// protected route
router.get("/private_data", auth, (req, res) => {
  res
    .status(200)
    .send(`You're in the private territory of ${req.currentUser.email}`);
});

// Obtener un usuario
router.get("/obtenerusuario/:token", async (req, res) => {
  const { token } = req.params;
  try {
    const userById = await getUserById(token);
    res.status(200).json(userById);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Signin
router.post("/", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      throw Error("Credenciales ingresadas vacías!");
    }

    const ipResponse = await axios.get("https://api.ipify.org/");
    const ip = ipResponse.data.trim();

    const navegador = req.headers["user-agent"];

    const authenticatedUser = await authenticateUser({
      email,
      password,
      ip,
      navegador,
    });

    res.status(200).json({
      id: authenticatedUser._id,
      rol: authenticatedUser.rol,
      email: authenticatedUser.email,
      token: authenticatedUser.token,
      msj: "Has iniciado sesión correctamente.",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Signin wear os y alexa
router.post("/dispositivos", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      throw Error("Credenciales ingresadas vacías!");
    }

    const ipResponse = await axios.get("https://api.ipify.org/");
    const ip = ipResponse.data.trim();

    const navegador = req.headers["user-agent"];

    const authenticatedUser = await authenticateUser({
      email,
      password,
      ip,
      navegador,
    });

    res.status(200).json({
      id: authenticatedUser._id,
      rol: authenticatedUser.rol,
      email: authenticatedUser.email,
      token: authenticatedUser.token,
      msj: "Has iniciado sesión correctamente.",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Crear una cuenta
router.post("/crearcuenta", async (req, res) => {
  let { user, email, phone, password } = req.body;

  try {
    user = user.trim();
    email = email.trim();
    phone = phone.trim();
    password = password.trim();

    if (!(user && email && phone && password)) {
      throw new Error("Campos de entrada vacíos!");
    } else {
      const createNewUser = await createdUser({
        user,
        email,
        phone,
        password,
      });
      await sendVerificationOTPEmail(email);
      res.status(200).json({
        id: createNewUser._id,
        email: createNewUser.email,
        msj: "Se ha creado su cuenta correctamente",
        createdAt: createNewUser.createdAt,
        updatedAt: createNewUser.updatedAt,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Cerrar una sesion
router.post("/logout", auth, async (req, res) => {
  const { token } = req.body;
  try {
    await logoutUserSession(token);
    res.status(200).json({ msj: "Sesión cerrada correctamente." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar un usuario
router.put("/updateuser/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  try {
    // Obtener la dirección IP pública
    const ip = "192.168.0.110";

    const navegador = req.headers["user-agent"];

    const updatedUser = await updateUser(userId, updateData, ip, navegador);
    res.status(200).json({
      id: updatedUser._id,
      msj: "Su perfil se acutalizo correctamente",
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Rutas para admins

// Obtener usuarios
router.get("/admingetusers/:rol", async (req, res) => {
  const { rol } = req.params;
  try {
    const users = await getUsers(rol);
    res.status(200).json(users);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Crear un nuevo usuario
router.post("/adminnewuser", auth, async (req, res) => {
  let { user, email, phone, password } = req.body;

  try {
    user = user.trim();
    email = email.trim();
    phone = phone.trim();
    password = password.trim();

    if (!(user && email && phone && password)) {
      throw new Error("Campos de entrada vacíos!");
    } else {
      const createNewUser = await createdUser({
        user,
        email,
        phone,
        password,
      });

      await sendVerificationOTPEmail(email);
      res.status(200).json({
        id: createNewUser._id,
        email: createNewUser.email,
        msj: "Se ha creado su cuenta correctamente",
        createdAt: createNewUser.createdAt,
        updatedAt: createNewUser.updatedAt,
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Actualizar un usuario
router.put("/adminupdateuser/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  const ip = req.ip;
  const navegador = req.headers["user-agent"];

  try {
    const updatedUser = await updateUser(userId, updateData, ip, navegador);
    res.status(200).json({
      id: updatedUser._id,
      msj: "Se ha actualizado el campo correctamente",
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/deshabilitar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioDes = await deshabilitarUsuario({ id });
    console.log(usuarioDes);
    res.status(200).json({
      id: usuarioDes._id,
      msj: `Se ha bloqueado la cuenta de ${usuarioDes.user} correctamente.`,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.put("/habilitar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const usuarioHabilitado = await habilitarUsuario({ id });
    res.status(200).json({
      id: usuarioHabilitado._id,
      msj: `Se ha activado la cuenta de ${usuarioHabilitado.user} correctamente.`,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Movil
// Signin
router.post("/movil/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!(email && password)) {
      throw Error("Credenciales ingresadas vacías!");
    }

    const ipResponse = await axios.get("https://api.ipify.org/");
    const ip = ipResponse.data.trim();

    const navegador = req.headers["user-agent"];

    const authenticatedUser = await authenticateUserMovil({
      email,
      password,
      ip,
      navegador,
    });

    res.status(200).json({
      id: authenticatedUser._id,
      rol: authenticatedUser.rol,
      email: authenticatedUser.email,
      msj: "Has iniciado sesión correctamente.",
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Obtener un usuario
router.get("/movil/obtenerusuario/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const userById = await getUserByIdByEmail(email);
    res.status(200).json(userById);
  } catch (error) {
    res.status(404).send(error.message);
  }
});

module.exports = router;
