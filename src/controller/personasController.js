const express = require("express");
const Persona = require("../database/models/Persona");
const router = express.Router();

router.get("/", async (_req, res) => {
  Persona.findAll({
    include: "usuario",
    attributes: { exclude: ["usuarioId"] },
  })
    .then((personas) => {
      res.json({ personas, status: 1, message: "Personas encontradas" });
    })
    .catch((error) => {
      if (error) {
        res.status(404).json({ message: "Personas no encontradas", status: 0 });
      }

      // res.status(500).json({ message: "Error me cai", status: -1 });
    });
});

router.get("/usuario/:id", async (req, res) => {
  Persona.findByPk(req.params.id)
    .then((persona) => {
      res.json({
        persona,
        status: 1,
        message: "Persona encontrada",
      });
    })
    .catch((error) => {
      if (error) {
        res.status(404).json({ message: "Personas no encontradas", status: 0 });
      }

      // res.status(500).json({ message: "Error me cai", status: -1 });
    });
});

router.get("/:id", async (req, res) => {
  await Persona.findByPk(req.params.id)
    .then((persona) => {
      if (persona) {
        res
          .status(200)
          .json({ persona, status: 1, message: "Persona encontrada" });
      } else {
        res.status(404).json({ message: "Persona no encontrada", status: 2 });
      }
    })
    .catch((error) => {
      //en un get creo que casi nunca hay un 401
      // if (error) {
      //   res.status(401).json({ message: error.message, status: 0 });
      // }
      // res.status(500).json({ message: "Error me cai", status: -1 });
    });
});

// router.post("/", async (req, res) => {
//   await Persona.create({
//     locacion: req.body.locacion,
//     puesto_trabajo: req.body.puesto_trabajo,
//     descripcion_personal: req.body.descripcion_personal,
//     foto_perfil: req.body.foto_perfil,
//     usuarioId: req.body.usuarioId,
//   })
//     .then((persona) => {
//       res
//         .status(201)
//         .json({ persona, status: 1, message: "Persona creada exitosamente" });
//     })
//     .catch((error) => {
//       console.error(error.message);
//       if (error) {
//         res.status(401).json({ message: error.message, status: 0 });
//       }
//     });
// });

router.post("/", async (req, res) => {
  try {
    const {
      locacion,
      puesto_trabajo,
      area,
      foto_perfil,
      usuarioId,
    } = req.body;

    // Primero, buscar si ya existe una Persona para este Usuario
    let persona = await Persona.findOne({ where: { usuarioId } });

    if (persona) {
      // Si existe, actualizar la Persona existente
      persona = await persona.update({
        locacion,
        puesto_trabajo,
        area,
        foto_perfil,
      });
      res.status(200).json({
        persona,
        status: 1,
        message: "Información de Persona actualizada exitosamente",
      });
    } else {
      // Si no existe, crear una nueva Persona
      persona = await Persona.create({
        locacion,
        puesto_trabajo,
        area,
        foto_perfil,
        usuarioId,
      });
      res.status(201).json({
        persona,
        status: 1,
        message: "Persona creada exitosamente",
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      message: error.message,
      status: 0,
    });
  }
});

router.put("/:id", async (req, res) => {
  await Persona.findByPk(req.params.id)
    .then((persona) => {
      if (persona) {
        persona
          .update(
            {
              locacion: req.body.locacion,
              puesto_trabajo: req.body.puesto_trabajo,
              area: req.body.area,
              foto_perfil: req.body.foto_perfil,
              usuarioId: req.body.usuarioId,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          )
          .then((persona) => {
            res.json({ persona, status: 1, message: "Persona actualizada" });
          })
          .catch((error) => {
            console.error(error.message);
            res.status(401).json({ message: error.message, status: 0 });
          });
      } else {
        res.status(404).json({ message: "Persona no encontrada", status: 2 });
      }
    })
    .catch((error) => {
      if (error) {
        res.status(401).json({ message: error.message, status: 0 });
      }
      // res.status(500).json({ message: "error me cai", status: -1 });
    });
});

router.patch("/:id", async (req, res) => {
  await Persona.findByPk(req.params.id)
    .then((persona) => {
      if (persona) {
        persona
          .update(
            {
              locacion: req.body.locacion,
              puesto_trabajo: req.body.puesto_trabajo,
              area: req.body.area,
              foto_perfil: req.body.foto_perfil,
              usuarioId: req.body.usuarioId,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          )
          .then((persona) => {
            res
              .status(200)
              .json({ persona, status: 1, message: "Persona actualizada" });
          })
          .catch((error) => {
            console.error(error.message);
            res.status(401).json({ message: error.message, status: 0 });
          });
      } else {
        res.status(404).json({ message: "Persona no encontrada", status: 2 });
      }
    })
    .catch((error) => {
      if (error) {
        res.status(401).json({ message: error.message, status: 0 });
      }
    });
});


router.get('/areaByUsuarioId/:id', async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const persona = await Persona.findOne({
      where: { usuarioId },
      //attributes: ['area']
    });

    if (persona) {
      if (persona.area) {
        res.status(200).json({ isExists: true, status: 1, message: "Área encontrada" });
      } else {
        res.status(404).json({ isExists: false, message: "Área no encontrada", status: 2 });
      }
    } else {
      res.status(404).json({ message: "Persona no encontrada", status: 2 });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error al buscar el área", status: 0 });
  }
});

router.get('/hasArea/:id', async (req, res) => {
  try {
    const usuarioId = req.params.id;
    const persona = await Persona.findOne({ where: { usuarioId } });

    if (persona) {
      const hasArea = !!persona.area;
      res.status(200).json({ hasArea, status: 1, message: "Verificación de área completada" });
    } else {
      res.status(404).json({ message: "Persona no encontrada", status: 2 });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error al verificar el área", status: 0 });
  }
});


module.exports = router;
