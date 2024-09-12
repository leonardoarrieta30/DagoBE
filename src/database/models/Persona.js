const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Persona extends Model { }
Persona.init(
  {
    locacion: {
      type: DataTypes.STRING,
      // allowNull: false,
      validate: {
        // notNull: {
        //   msg: "El campo locacion no puede ser nulo",
        // },
        // is: {
        //   args: /^[A-Za-z\s,áéíóúÁÉÍÓÚñÑ]+$/,
        //   msg: "El campo nombre solo puede contener letras y espacios",
        // },
      },
    },

    puesto_trabajo: {
      type: DataTypes.STRING,
      // allowNull: false,
      validate: {
        // notNull: {
        //   msg: "El campo puesto_trabajo no puede ser nulo",
        // },
        // is: {
        //   args: /^[A-Za-z\s,áéíóúÁÉÍÓÚñÑ]+$/,
        //   msg: "El campo nombre solo puede contener letras y espacios",
        // },
      },
    },

    /* descripcion_personal: {
      type: DataTypes.STRING,
      // allowNull: false,
      validate: {
        // notNull: {
        //   msg: "El campo descripcion_personal no puede ser nulo",
        // },
        // is: {
        //   args: /^[A-Za-z\s,áéíóúÁÉÍÓÚñÑ]+$/,
        //   msg: "El campo nombre solo puede contener letras y espacios",
        // },
      },
    }, */
    area: {
      type: DataTypes.STRING,

    },

    foto_perfil: {
      type: DataTypes.TEXT("long"),
      // validate: {
      //   isAlpha: {
      //     msg: "El campo foto de perfil solo puede contener letras",
      //   },
      // },
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      references: {
        model: "usuarios",
        key: "id",
      },
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
    modelName: "personas",
    timestamps: false,
  }
);

module.exports = Persona;
