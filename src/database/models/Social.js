const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Social extends Model {}
Social.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo nombre no puede ser nulo",
        },
        len: {
          args: [3, 255],
          msg: "El campo nombre debe tener entre 3 y 255 caracteres",
        },
      },
    },
    url: {
      type: DataTypes.STRING,
      // allowNull: false,
      validate: {
        // notNull: {
        //   msg: "El campo url no puede ser nulo",
        // },
        // len: {
        //   args: [3, 255],
        //   msg: "El campo url debe tener entre 3 y 255 caracteres",
        // },
      },
    },
    icono: {
      type: DataTypes.STRING,
      // allowNull: false,
      validate: {
        // notNull: {
        //   msg: "El campo icono no puede ser nulo",
        // },
        // len: {
        //   args: [3, 255],
        //   msg: "El campo icono debe tener entre 3 y 255 caracteres",
        // },
      },
    },
    personaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo personaId no puede ser nulo",
        },
        isInt: {
          msg: "El campo personaId debe ser un numero entero",
        },
      },
    },
  },
  {
    sequelize,
    modelName: "socials",
    timestamps: false,
  }
);

module.exports = Social;
