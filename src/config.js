const dotenv= require("dotenv");
dotenv.config();

module.exports = {
  database: {
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.USER,
    password: process.env.PASSWORD,
    dialect: process.env.DIALECT,
  },
};