import dotenv from "dotenv";
dotenv.config();

export const { DB_NAME, MONGO_PASSWORD } = process.env;

//export const DB_URL = `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@cluster0.e6bpn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
export const DB_URL = `mongodb://admin:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00.e6bpn.mongodb.net:27017,cluster0-shard-00-01.e6bpn.mongodb.net:27017,cluster0-shard-00-02.e6bpn.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-g26j4d-shard-0&authSource=admin&retryWrites=true&w=majority`;
//export const URI =
// "mongodb+srv://mongoUser:contrasenia@mongodb.wp5bu.mongodb.net/test";
export const MAX_TIMER_DEFAULT = 120 * 1000;
export const MAX_PLAYERS_DEFAULT = 8;

export let hosts = [];
if (process.env.NODE_ENV === "production") {
  hosts = [];
} else {
  hosts = ["http://localhost:3001"];
}

export const ROOM_ID_RX = /^([A-Z0-9]){6}$/;
