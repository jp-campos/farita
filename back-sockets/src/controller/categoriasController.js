import categoriasModel from "../models/categoriasModel";

const categoriasController = {
  getAll: async () => {
    return await categoriasModel.find({});
  },
};

export default categoriasController;
