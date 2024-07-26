const User = require("./models/User");
const Persona = require("./models/Persona");
const Documento = require("./models/Documento");
const Social = require("./models/Social");

//uno a uno
//Persona tiene o es un usuario
//añade una clave userId a la tabla persona
User.hasOne(Persona);

//Añade una clave personaId a la tabla user
Persona.belongsTo(User);

//Usuario va a tener muchos documentos
//añade una clave userId a la tabla documento
User.hasMany(Documento);

Documento.belongsTo(User);

Persona.hasMany(Social);
Social.belongsTo(Persona);
