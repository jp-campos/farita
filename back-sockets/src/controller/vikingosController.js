import vikingosModel from "../models/vikingosModel";

const vikingosController = {
  getAll: async () => {
    return await vikingosModel.find({});
  },
};

export default vikingosController;
