import "./database/db";
import express from "express";
import http from "http";
import bodyParser from "body-parser";
import routes from "./routes";
import cors from "cors";

import { socket } from "./sockets";
import { handleError, logger } from "./middlewares";

const port = process.env.PORT || 8000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors);
app.use("/static", express.static(__dirname + "/public"));

routes(app);
app.use((err, _req, res, ) => {
  handleError(err, res);
});

const server = http.createServer(app);
socket(server);

server.listen(port, () => {
  logger.info(`Api listening on port ${Number(port)}!`);
});