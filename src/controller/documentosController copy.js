const express = require("express");
const Documento = require("../database/models/Documento");
const Persona = require("../database/models/Persona");
const Usuario = require("../database/models/User");
const { Op } = require('sequelize');
const router = express.Router();

router.get("/", async (_req, res) => {
  Documento.findAll({
    attributes: { exclude: ["usuarioId"] },
    include: "usuario",
  })
    .then((documentos) => {
      res.json({ documentos, status: 1, message: "Documentos encontrados" });
    })
    .catch((error) => {
      if (error) {
        res
          .status(404)
          .json({ message: "Documentos no encontrados", status: 0 });
      }

      // res.status(500).json({ message: "Error me cai", status: -1 });
    });
});

router.get("/byUsuarioId/:userId", async (req, res) => {
  const userId = req.params.userId;
  Documento.findAll({
    where: { usuarioId: userId },
    attributes: { exclude: ["usuarioId", "documento_base64"] },
  })
    .then((documentos) => {
      res
        .status(200)
        .json({ documento: documentos, status: 1, message: "Documentos encontrados" });
    })
    .catch((error) => {
      console.error(error);
      res.status(404).json({ message: "Documentos no encontrados", status: 0 });
      res
        .status(500)
        .json({ message: "Error al obtener los documentos", status: -1 });
    });
});



router.post("/", async (req, res) => {
  Documento.create({
    titulo: req.body.titulo,
    // observaciones: req.body.observaciones,
    documento_base64: req.body.documento_base64,
    fecha_subida: req.body.fecha_subida,
    // estado_documento: req.body.estado_documento,
    usuarioId: req.body.usuarioId,
  })
    .then((documento) => {
      res
        .status(201)
        .json({ documento, status: 1, message: "Documento creado" });
    })
    .catch((error) => {
      console.error(error);
      if (error) {
        return res.status(401).json({ message: error.message, status: 0 });
      }
      res
        .status(500)
        .json({ message: "Error al crear el documento", status: -1 });
    });
});

router.put("/:id", async (req, res) => {
  Documento.findByPk(req.params.id)
    .then((documento) => {
      if (documento) {
        documento
          .update({
            titulo: req.body.titulo,
            // observaciones: req.body.observaciones,
            documento_base64: req.body.documento_base64,
            fecha_subida: req.body.fecha_subida,
            // estado_documento: req.body.estado_documento,
            usuarioId: req.body.usuarioId,
          })
          .then((documento) => {
            res.json({
              documento,
              status: 1,
              message: "Documento actualizado",
            });
          });
      } else {
        res.status(404).json({ message: "Documento no encontrado", status: 0 });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error al actualizar el documento", status: -1 });
    });
});

router.delete("/:id", async (req, res) => {
  Documento.findByPk(req.params.id)
    .then((documento) => {
      if (documento) {
        documento.destroy().then(() => {
          res.json({ status: 1, message: "Documento eliminado" });
        });
      } else {
        res.status(404).json({ message: "Documento no encontrado", status: 0 });
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ message: "Error al eliminar el documento", status: -1 });
    });
});


// Endpoint para obtener el base64 del documento por ID
router.get("/pdf/:id", async (req, res) => {
  try {
    const documentoId = req.params.id;

    // Buscar el documento por ID
    const documento = await Documento.findOne({
      where: { id: documentoId },
      attributes: ['documento_base64'], // Solo queremos el campo base64
    });

    if (!documento) {
      return res.status(404).json({ status: 0, mensaje: 'Documento no encontrado' });
    }

    // Retornar el base64 del documento
    res.status(200).json({
      documento_base64: documento.documento_base64, // Asegúrate de que este campo exista
      status: 1,
      mensaje: 'Documento encontrado',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});






router.get('/pdfs-by-area', async (req, res) => {
  try {
    const { area, desde, hasta } = req.query;

    let whereClause = {};

    // Solo aplicar el filtro de fechas si se proporcionan 'desde' y 'hasta'
    if (desde && hasta) {
      // Asumimos que desde y hasta están en formato 'YYYY-MM-DD'
      whereClause.fecha_subida = {
        [Op.between]: [desde, hasta]
      };
    }

    // Crear una cláusula de búsqueda condicional para el área
    const includeClause = [{
      model: Usuario,
      required: true,
      include: [{
        model: Persona,
        where: {}
      }]
    }];

    // Solo agregar el filtro del área si se proporciona
    if (area) {
      includeClause[0].include[0].where.area = {
        [Op.like]: `%${area}%`
      };
    }

    // Buscar todos los documentos o filtrar según los parámetros
    const pdfs = await Documento.findAll({
      include: includeClause,
      where: whereClause
    });

    if (pdfs.length === 0) {
      return res.status(404).json({ status: 0, mensaje: 'No hay documentos para los criterios dados' });
    }

    res.status(200).json({ documentos: pdfs, status: 1, mensaje: 'Documentos encontrados' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});








module.exports = router;
