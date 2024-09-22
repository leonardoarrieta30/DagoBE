const { Model, DataTypes } = require("sequelize");

const sequelize = require("../db");

class Documento extends Model {}
Documento.init(
  {
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo titulo no puede ser nulo",
        },
        len: {
          args: [3, 255],
          msg: "El campo titulo debe tener entre 3 y 255 caracteres",
        },
      },
    },
    // observaciones: {
    //   type: DataTypes.TEXT("long"),
    //   // allowNull: false,
    //   validate: {
    //     // notNull: {
    //     //   msg: "El campo observaciones no puede ser nulo",
    //     // },
    //     // len: {
    //     //   args: [3, 255],
    //     //   msg: "El campo observaciones debe tener entre 3 y 255 caracteres",
    //     // },
    //   },
    // },

    documento_base64: {
      type: DataTypes.TEXT("long"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo documento_base64 no puede ser nulo",
        },
      },
    },

    fecha_subida: {
      type: DataTypes.STRING,
    },

    fecha_hasta:{
      type: DataTypes.STRING,
    },


    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo usuarioId no puede ser nulo",
        },
        isInt: {
          msg: "El campo usuarioId debe ser un numero entero",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "documentos",
    timestamps: false,
  }
);

module.exports = Documento;
