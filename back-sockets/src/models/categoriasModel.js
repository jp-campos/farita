import mongoose from "mongoose";
import categoriasSchema from "../schema/categorias";

const categoriasModel = mongoose.model(
  "Categoria",
  categoriasSchema,
  "categorias",
);

export default categoriasModel;
