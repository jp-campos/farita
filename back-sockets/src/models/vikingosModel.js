import mongoose from "mongoose";
import vikingosSchema from "../schema/vikingos";

const vikingosModel = mongoose.model("Vikingo",vikingosSchema, "vikingos");




export default vikingosModel;

