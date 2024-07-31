const mongoose = require("mongoose");

const mongoDBURI = "mongodb://127.0.0.1:27017";

module.exports = async () => {
  try {
    await mongoose.connect(mongoDBURI);
    console.log("Mongo db is conected");
  } catch (error) {
    console.error(
      "Ocurrio un error al tratar de conectar con la base de datos"
    );
  }
};
