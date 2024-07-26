const express = require("express");
const Social = require("../database/models/Social");
const router = express.Router();

router.get("/", async (_req, res) => {
  Social.findAll({
    attributes: { exclude: ["personaId"] },
    include: "persona",
  })
    .then((socials) => {
      res.json({ socials, status: 1, message: "Redes sociales encontradas" });
    })
    .catch((error) => {
      if (error) {
        res
          .status(404)
          .json({ message: "Redes sociales no encontradas", status: 0 });
      }

      // res.status(500).json({ message: "Error me cai", status: -1 });
    });
});

// router.post("/", async (req, res) => {
//   await Social.create({
//     nombre: req.body.nombre,
//     url: req.body.url,
//     icono: req.body.icono,
//     personaId: req.body.personaId,
//   })
//     .then((social) => {
//       res
//         .status(201)
//         .json({ social, status: 1, message: "Red social creada exitosamente" });
//     })
//     .catch((error) => {
//       if (error) {
//         res.status(401).json({ message: error.message, status: 0 });
//       }

//     });
// });

router.post("/", async (req, res) => {
  try {
    const { personaId, socialNetworks } = req.body;

    console.log("Received request:", { personaId, socialNetworks });

    if (!personaId || !socialNetworks || !Array.isArray(socialNetworks)) {
      return res.status(400).json({
        status: 0,
        message: "Datos inválidos",
      });
    }

    // Eliminar las redes sociales existentes para esta persona
    await Social.destroy({ where: { personaId } });

    // Crear las nuevas redes sociales
    const createdNetworks = await Social.bulkCreate(
      socialNetworks.map((network) => ({
        nombre: network.nombre,
        url: network.url || "www.url.com",
        icono: network.icono || "icono.png",
        personaId: personaId,
      }))
    );

    console.log("Created networks:", createdNetworks);

    res.status(201).json({
      socialNetworks: createdNetworks,
      status: 1,
      message: "Redes sociales actualizadas exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar redes sociales:", error);
    res.status(500).json({
      status: 0,
      message: "Error al actualizar redes sociales",
      error: error.message,
    });
  }
});

router.get("/:personaId", async (req, res) => {
  const { personaId } = req.params;
  try {
    const socials = await Social.findAll({
      where: {
        personaId,
      },

      // include: "persona",
    });

    if (socials.length > 0) {
      res
        .status(200)
        .json({ socials, status: 1, message: "Redes sociales encontradas" });
    } else {
      res
        .status(404)
        .json({ message: "Redes sociales no encontradas", status: 0 });
    }
  } catch (error) {
    res
      .status(401)
      .json({ message: "Error al obtener las redes sociales", status: -1 });
  }
});

router.delete("/:socialId", async (req, res) => {
  const { socialId } = req.params;
  try {
    await Social.destroy({ where: { id: socialId } });
    res
      .status(200)
      .json({ status: 1, message: "Red social eliminada exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar la red social", status: -1 });
  }
});

// router.get("/:nombre/:personaId", async (req, res) => {
//   const { nombre, personaId } = req.params;
//   Social.findOne({
//     where: {
//       nombre,
//       personaId,
//     },
//     attributes: { exclude: ["personaId"] },
//     include: "persona",
//   })
//     .then((social) => {
//       if (social) {
//         res.json({ social, status: 1, message: "Red social encontrada" });
//       } else {
//         res.status(404).json({ message: "Red social no encontrada", status: 0 });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ message: "Error al obtener la red social", status: -1 });
//     });
// });

// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   Social.findByPk(id, {
//     attributes: { exclude: ["personaId"] },
//     include: "persona",
//   })
//     .then((social) => {
//       if (social) {
//         res.json({ social, status: 1, message: "Red social encontrada" });
//       } else {
//         res.status(404).json({ message: "Red social no encontrada", status: 0 });
//       }
//     })
//     .catch((error) => {
//       res.status(500).json({ message: "Error al obtener la red social", status: -1 });
//     });
// });

router.get("/:nombre/:personaId", async (req, res) => {
  const { nombre, personaId } = req.params;
  Social.findOne({
    where: {
      nombre,
      personaId,
    },
    attributes: { exclude: ["personaId"] },
    include: "persona",
  })
    .then((social) => {
      if (social) {
        res.json({ social, status: 1, message: "Red social encontrada" });
      } else {
        res
          .status(404)
          .json({ message: "Red social no encontrada", status: 0 });
      }
    })
    .catch((error) => {
      res
        .status(401)
        .json({ message: "Error al obtener la red social", status: -1 });
    });
});

router.patch("/:id", async (req, res) => {
  await Social.findByPk(req.params.id)
    .then((social) => {
      if (social) {
        social
          .update(
            {
              nombre: req.body.nombre,
              url: "www.url.com",
              icono: "icono.png",
              personaId: req.body.personaId,
            },
            {
              where: {
                id: req.params.id,
              },
            }
          )
          .then((social) => {
            res.status(200).json({
              social,
              status: 1,
              message: "Red social actualizada exitosamente",
            });
          })
          .catch((error) => {
            if (error) {
              res.status(401).json({ message: error.message, status: 0 });
            }
          });
      } else {
        res.status(404).json({ message: "Social no encontrado", status: 2 });
      }
    })
    .catch((error) => {
      if (error) {
        res.status(401).json({ message: error.message, status: 0 });
      }
    });
});

module.exports = router;
