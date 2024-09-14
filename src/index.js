const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const sequelize = require("./database/db");
const userController = require("./controller/usersController");
const personaController = require("./controller/personasController");
require("./database/associations");

//confifguracion inicial
const app = express();
// app.set("port", process.env.PORT || 8080);

//middlewares
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 8080;
//arrancamos el servidor, es tipo useEffect
app.listen(PORT, function () {
  console.log(`Server running on port ${PORT}`);
  sequelize
    //sync crea la tabla si no existe
    //foce true: drop table
    .sync({ force: false })
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
});

app.use("/api/v1/users", require("./controller/usersController"));
app.use("/api/v1/personas", require("./controller/personasController"));
app.use("/api/v1/documentos", require("./controller/documentosController"));
app.use("/api/v1/socials", require("./controller/socialsControllers"));
app.use("/api/v1/datosCalidad", require("./controller/datosCalidadController"));

//rutas
// app.get("/", async (req, res) => {
//   const connection = await database.getConnection();
//   const result = await connection.query("SELECT * FROM dago.usuario");
//   res.json(result);
// });

// app.post("/crearUsuario", async (req, res) => {
//   try {
//     const connection = await database.getConnection();
//     const { user, password, state, persona_id } = req.body;

//     // Check if all required fields are present
//     if (!user || !password || !state || !persona_id) {
//       res.status(401).json({ message: "Faltan campos requeridos", status: 0 });
//       return;
//     }

//     // Check if user already exists
//     const existingUser = await connection.query(
//       `SELECT * FROM dago.usuario WHERE user = '${user}'`
//     );
//     if (existingUser.length > 0) {
//       res.status(409).json({ message: "El usuario ya existe", status: 2 });
//       return;
//     }

//     // Check if persona exists
//     const existingPersona = await connection.query(
//       `SELECT * FROM dago.persona WHERE id = '${persona_id}'`
//     );
//     if (existingPersona.length === 0) {
//       res.status(404).json({ message: "La persona no existe", status: 3 });
//       return;
//     }

//     const result = await connection.query(
//       `INSERT INTO dago.usuario (user, password, state, persona_id) VALUES ('${user}', '${password}', '${state}', '${persona_id}')`
//     );

//     res.status(201).json({ message: "Usuario creado exitosamente", status: 1 });
//   } catch (error) {
//     res.status(500).json({ message: "Error al crear el usuario", status: -1 });
//   }
// });

// app.post("/crearPersona", async (req, res) => {
//   try {
//     const connection = await database.getConnection();
//     const { nombre, apellido, fecha_nacimiento, dni } = req.body;

//     // Check if all required fields are present
//     if (!nombre || !apellido || !fecha_nacimiento || !dni) {
//       res.status(401).json({ message: "Faltan campos requeridos", status: 0 });
//       return;
//     }

//     // // Check if user exists
//     // const existingUser = await connection.query(
//     //     `SELECT * FROM dago.usuario WHERE id = '${usuario_id}'`
//     // );
//     // if (existingUser.length === 0) {
//     //     res.status(404).json({ message: "El usuario no existe", status: 2 });
//     //     return;
//     // }

//     // // Check if persona already exists for the user
//     // const existingPersona = await connection.query(
//     //     `SELECT * FROM dago.persona WHERE usuario_id = '${usuario_id}'`
//     // );
//     // if (existingPersona.length > 0) {
//     //     res.status(409).json({ message: "La persona ya existe para este usuario", status: 3 });
//     //     return;
//     // }

//     const result = await connection.query(
//       `INSERT INTO dago.persona (nombre, apellido, fecha_nacimiento, dni) VALUES ('${nombre}', '${apellido}', '${fecha_nacimiento}', '${dni}')`
//     );

//     res.status(201).json({ message: "Persona creada exitosamente", status: 1 });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al crear la persona", status: -1 });
//   }
// });

// app.post("/getPersonIdByDNI", async (req, res) => {
//   try {
//     const connection = await database.getConnection();
//     console.log(req.body);
//     const dni = req.body.dni;
//     console.log(dni);
//     // const dni = 74625984;
//     // Check if all required fields are present
//     if (!dni) {
//       res.status(401).json({ message: "Faltan campos requeridos", status: 0 });
//       return;
//     }

//     const result = await connection.query(
//       `SELECT * FROM dago.persona WHERE dni = '${dni}'`
//     );

//     if (result.length === 0) {
//       res.status(404).json({ message: "Persona no encontrada", status: 2 });
//       return;
//     }

//     res.status(201).json({
//       message: "Persona encontrada",
//       status: 1,
//       persona_id: result[0].id,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al buscar la persona", status: -1 });
//   }
// });
