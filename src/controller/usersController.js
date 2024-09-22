const express = require("express");
const Usuario = require("../database/models/User");
const jwt = require("jsonwebtoken");
const Persona = require("../database/models/Persona");
const router = express.Router();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, user: user.user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token inválido" });
    req.user = user;
    next();
  });
};

router.get("/", async (_req, res) => {

  Usuario.findAll()
    .then((users) => {
      res.json({ users, status: 1, message: "Usuarios encontrados" });
    })
    .catch((error) => {
      res.json(error.message);
    });
});

router.get("/:id", async (req, res) => {
  Usuario.findByPk(req.params.id)
    .then((user) => {
      if (user) {
        res.json({ user, status: 1, message: "Usuario encontrado" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado", status: 0 });
      }
    })
    .catch((error) => {
      res.json(error.message);
    });
});

router.post("/", async (req, res) => {
  const existingUser = await Usuario.findOne({
    where: { user: req.body.user },
  });
  const existingDni = await Usuario.findOne({
    where: { dni: req.body.dni },
  });
  if (existingUser) {
    res.status(409).json({ message: "Usuario ya existe", status: 2 });
  } else if (existingDni) {
    res.status(409).json({ message: "DNI ya existe", status: 3 });
  } else {
    await Usuario.create({
      user: req.body.user,
      password: req.body.password,
      state: req.body.state || false,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      fecha_nacimiento: req.body.fecha_nacimiento,
      dni: req.body.dni,
    })
      .then((user) => {
        //const token = generateToken(user);
        res.status(201).json({
          user,
          //token,
          status: 1,
          message: "Usuario creado exitosamente",
        });
      })
      .catch((error) => {
        console.error(error.message);
        res.status(401).json({ message: error.message, status: 0 });
      });
  }
});

router.post("/verificarUsuarioExiste", async (req, res) => {
  const existingUser = await Usuario.findOne({
    where: { user: req.body.user, password: req.body.password },
  });

  if (existingUser) {
    //const token = generateToken(existingUser);
    res.status(200).json({
      user: existingUser,
      //token,
      status: 1,
      message: "Usuario encontrado",
    });
  } else {
    res.status(404).json({ message: "Credenciales incorrectas", status: 0 });
  }
});

router.get("/findByUser/:user", async (req, res) => {
  Usuario.findOne({
    where: { user: req.params.user },
  })
    .then((user) => {
      if (user) {
        res.status(200).json({ status: 1, message: "Usuario encontrado" });
      } else {
        res.status(404).json({ message: "Usuario no encontrado", status: 0 });
      }
    })
    .catch((error) => {
      res.json(error.message);
    });
});

router.put("/:id", async (req, res) => {
  Usuario.findByPk(req.params.id)
    .then((user) => {
      if (user) {
        user
          .update(
            {
              user: req.body.user,
              password: req.body.password,
              state: req.body.state || false,
              nombre: req.body.nombre,
              apellido: req.body.apellido,
              fecha_nacimiento: req.body.fecha_nacimiento,
              dni: req.body.dni,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          )
          .then((user) => {
            res.json({ user, status: 1, message: "Usuario actualizado" });
          })
          .catch((error) => {
            console.error(error);
            res.status(401).json({ message: error.message, status: 0 });
          });
      } else {
        res.status(404).json({ message: "Usuario no encontrado", status: 2 });
      }
    })
    .catch((error) => {
      res.json(error.message);
    });
});

router.delete("/:id", async (req, res) => {
  Usuario.findByPk(req.params.id)
    .then((user) => {
      if (user) {
        user
          .destroy()
          .then(() => {
            res.json({ status: 1, message: "Usuario eliminado" });
          })
          .catch((error) => {
            console.error(error);
            res
              .status(500)
              .json({ message: "Error al eliminar el usuario", status: -1 });
          });
      } else {
        res.status(404).json({ message: "Usuario no encontrado", status: 0 });
      }
    })
    .catch((error) => {
      console.error(error);
    });
});



module.exports = router;
