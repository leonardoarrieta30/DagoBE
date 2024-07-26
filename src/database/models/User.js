const { Model, DataTypes } = require("sequelize");
const sequelize = require("../db");

class Usuario extends Model {}
Usuario.init(
  {
    //email
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo user no puede ser nulo",
        },
        // len: {
        //   args: [3, 255],
        //   msg: "El campo user debe tener entre 3 y 255 caracteres",
        // },
        isEmail: {
          msg: "El campo user debe ser un email",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo password no puede ser nulo",
        },
        len: {
          args: [8, 20],
          msg: "El campo password debe tener como minimo 8 caracteres",
        },
      },
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo nombre no puede ser nulo",
        },
        is: {
          args: /^[A-Za-z\sáéíóúÁÉÍÓÚñÑ]+$/,
          msg: "El campo nombre solo puede contener letras y espacios",
        },
      },
    },
    apellido: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "El campo apellido no puede ser nulo",
        },
        is: {
          args: /^[A-Za-z\sáéíóúÁÉÍÓÚñÑ]+$/,
          msg: "El campo nombre solo puede contener letras y espacios",
        },
      },
    },
    fecha_nacimiento: {
      type: DataTypes.STRING,
      // validate: {
      //   isDate: {
      //     msg: "El campo fecha de nacimiento debe ser una fecha",
      //   },
      // },
    },
    dni: {
      type: DataTypes.STRING,
      validate: {
        isEightCharacters(value) {
          if (value.length !== 8) {
            throw new Error("El campo dni debe tener 8 caracteres");
          }
        },
      },
    },
  },

  {
    sequelize,
    modelName: "usuarios",
    timestamps: false,
  }
);

module.exports = Usuario;
