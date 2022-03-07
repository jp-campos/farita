import reunionModel from "../models/reunionModelo";
//const mdbconn = require("../database/db.js");

const categoriasController = {
  getAll: async () => {
    return await reunionModel.find({});
  },
  /*
  insertRegistroShot(shot) {
    return mdbconn.conn().then((client) => {
      return client.db("isis3710").collection("reuniones").insertOne(shot); // Si no se provee un ID, este será generado automáticamente
    });
  },*/
};

export default categoriasController;
