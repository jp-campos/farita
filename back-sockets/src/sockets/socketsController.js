import socketio from "socket.io";

import { logger } from "../middlewares";
import RoomCategorias from "./roomCategorias";
import RoomVikingos from "./roomVikingos";
import RoomCanciones from "./roomCanciones";

export default (app) => {
  //Cambiar el mode al código de la farrita?
  const io = socketio.listen(app, {
    path: "/",
  });

  logger.info("Started listening!");

  const general = io.of(/^\/\w{4}$/);
  
  general.on("connection", async (socket) => {
    const { username, roomId, options } = socket.handshake.query;

    logger.info("Client Connected " + username + " " + roomId + " " + options);
    if (roomId === "home") {
      let store = socket.nsp.adapter;

      logger.info("Entra a home");
      if (Object.prototype.hasOwnProperty.call(store, "mensajes")) {
        socket.emit("mensajes", store.mensajes);
      }

      socket.on("mensaje", (mensaje) => {
        if (!Object.prototype.hasOwnProperty.call(store, "mensajes")) {
          store.mensajes = [];
        }
        let today = new Date();
        mensaje.mio = false;
        mensaje.hora = today.getHours() + ":" + today.getMinutes();
        store.mensajes.push(mensaje);
        socket.broadcast.emit("mensaje", mensaje);
      });

      socket.on("mensajes", (mensajes) => {
        
        if (! Object.prototype.hasOwnProperty.call(store,"mensajes")) {
          store.mensajes = [];
        }
        mensajes.map(e=>e.mio = false)
        store.mensajes = store.mensajes.concat(mensajes)
        socket.broadcast.emit("mensajes", mensajes)
      })

      socket.on("disconnect", () => {
        logger.info("Client Disconnected!");
      });
    } else if (roomId === "categorias") {
      const room = new RoomCategorias({
        io: socket.nsp,
        socket,
        username,
        roomId,
        options,
      });
      const joinedRoom = await room.init(username);
      logger.info("Client Connected");

      if (joinedRoom) {
        room.showPlayers();
        room.initJuego();
        room.recibirPalabra();
        room.recibirVotos();
      }
      room.onDisconnect();
    } else if (roomId === "vikingos") {
      const room = new RoomVikingos({
        io: socket.nsp,
        socket,
        username,
        roomId,
        options,
      });
      const joinedRoom = await room.init(username);
      logger.info("Client Connected");

      if (joinedRoom) {
        room.showPlayers();
        room.initJuego();
        room.escribirMensaje();
        room.sumarShot();
        room.siguienteTurno();
        room.juego();
      }
      room.onDisconnect();
      //TODO: lo de vikingos
    } else if (roomId == "canciones") {
      //TODO: lo de canciones
      logger.info("Client Connected -Canciones");

      const room = new RoomCanciones({
        io: socket.nsp,
        socket,
        username,
        roomId,
        options,
      });
      const joinedRoom = await room.init(username);

      if (joinedRoom) {
        room.showPlayers();
        room.initJuego();
        room.recibirCancion();
      }
      room.onDisconnect();
    }
  });

  return io;
};
