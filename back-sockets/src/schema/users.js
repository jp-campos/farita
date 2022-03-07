import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

export default usersSchema;
