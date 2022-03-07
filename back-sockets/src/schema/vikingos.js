import mongoose from "mongoose";

const vikingosSchema = new mongoose.Schema(
  {
    nombre: {
      type: Integer,
    },
    shots: {
      type: Integer,
    },
  },
  { collection: "vikingos" },
);

export default vikingosSchema;
