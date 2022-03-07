import mongoose from "mongoose";

const categoriasSchema = new mongoose.Schema(
  {
    categoria: {
      type: String,
    },
    img: {
      type: String,
    },
  },
  { collection: "categorias" },
);

export default categoriasSchema;
