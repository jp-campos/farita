import logger from "../middlewares/logger";

//import { SALT_ROUNDS, MAX_PLAYERS_DEFAULT, MAX_TIMER_DEFAULT } from '../env';

const MAX_JUGADORES = 8;

export default class RoomVikingos {
  constructor(options) {
    this.io = options.io; // Shortname for -> io.of('/your_namespace_here')
    this.socket = options.socket;
    this.username = options.username;
    this.roomId = options.roomId;
    this.password = options.password; // Optional
    this.options = JSON.parse(options.options); // {maxTimerLimit, maxPlayerLimit}
    this.store = options.io.adapter; // Later expanded to io.adapter.rooms[roomId]
  }

  /**
   * Initialises steps on first connection.
   *
   * Checks if room available:
   *   If yes, then joins the room
   *   If no, then creates new room.
   *
   * @access    public
   * @return   {bool}    Returns true if initialization is successfull, false otherwise
   */
  async init(username) {
    // Stores an array containing socket ids in 'roomId'
    let clients;
    await this.io.in(this.roomId).clients((e, _clients) => {
      clients =
        _clients || logger.error("[INTERNAL ERROR] Room creation failed!");
      logger.debug(`Connected Clients are: ${clients}`);
    });

    if (clients.length >= 1) {
      if (clients.length + 1 > MAX_JUGADORES) {
        this.io.to(this.socket.id).emit("error", "La sala está llena :(");
        return false;
      }
      this.store = this.store.rooms[this.roomId];
      await this.socket.join(this.roomId);

      this.store.clients.push({
        id: this.socket.id,
        username,
        leader: false,
        shots: 0,
      });
      this.socket.username = username;
      this.socket.emit("[SUCCESS] Successfully initialised");
      logger.info(`[JOIN] Client joined room ${this.roomId}`);

      return true;
    }

    if (clients.length < 1) {
      await this.socket.join(this.roomId);

      this.store = this.store["rooms"][this.roomId];
      this.store.clients = [
        { id: this.socket.id, username, leader: true, shots: 0 },
      ];

      this.socket.username = username;
      logger.info(`[CREATE] Client created and joined room ${this.roomId}`);
      this.socket.emit("[SUCCESS] Successfully initialised");
      return true;
    }

    logger.warn(
      `[CREATE FAILED] Client denied create, as roomId ${this.roomId} already present`,
    );
    this.socket.emit("Error: Room already created. Join the room!");
    return false;
  }

  /**
   * Broadcast info about all players and their ready status joined to given room. Deafult status as 'Not ready'.
   *
   * @access    public
   */
  showPlayers() {
    const { clients } = this.store;
    this.io
      .to(this.roomId)
      .emit("show-players-joined-v", { playersJoined: clients });
    if (this.store.gameBegan) {
      this.io.to(this.roomId).emit("game-v-started");
      this.io.to(this.roomId).emit("vikingo", this.store.vikingo);
    }
  }

  /**
   * Mark player as ready  ---> to start the draft in the given room. If all players ready then initiate the draft
   *
   * @access public
   */
  initJuego() {
    const { clients } = this.store;

    this.socket.on("start-v-game", (idSock, colores) => {
      this.store.gameBegan = true;
      for (let i = 0; i < clients.length; i++) {
        const jugador = clients[i];
        this.io.to(jugador.id).emit("tu-color", colores[i]);
      }
      this._comenzarJuego(idSock);
    });
  }

  /**
   * Mark player as ready  ---> to start the draft in the given room. If all players ready then initiate the draft
   *
   * @access public
   */
  noJuego() {
    this.socket.on("no-", (id) => {
      this.io.to(id).emit("error", true);
    });
  }
  /**
   * Crear logica del juego
   */
  async _comenzarJuego(idSock) {
    this.store.turno = true;
    this.io.to(this.roomId).emit("game-v-started");
    this._comenzarTurno(idSock);
  }

  _comenzarTurno(idSock) {
    let socketId = idSock;
    this.io.to(socketId).emit("tu-v-turno");
    this.io.to(this.roomId).emit("turno-otros", idSock);
  }

  /**
   * Indicacion inicial para el juego
   */
  sumarShot() {
    this.socket.on("sumarShots", (nombre) => {
      let cliente = this.store.clients.find(
        (elemento) => elemento.username == nombre,
      );
      cliente.shots = cliente.shots + 1;
      let json = JSON.stringify(this.store.clients);
      console.log(json);
      this.socket.to(this.roomId).emit("Json", json);
    });
  }

  /**
   * Mensaje una vez realiza alguna movida
   */
  escribirMensaje() {
    this.socket.on("mensaje", (idSock, color) => {
      this.io
        .to(this.roomId)
        .emit(
          "escribirMensaje",
          color,
          this.store.clients.find((elemento) => elemento.id == idSock).username,
        );
    });
  }

  _getJugadorId() {
    return this.store.idTurno % this.store.clients.length;
  }

  siguienteTurno() {
    this.socket.on("turno-de", (idSock) => {
      this.io.to(this.roomId).emit("siguiente-v-turno");
      this._comenzarTurno(idSock);
    });
    this.socket.on("jugar", (id) => {
      this.io.to(this.roomId).emit("jugar-v", id);
    });
  }

  juego() {
    const { clients } = this.store;
    let i;
    let d;
    let id;
    let nombre;
    let id1;
    let id2;
    let nombre1;
    let nombre2;
    this.socket.on("reglas", (idJugando, numero) => {
      if (clients.length > 2) {
        switch (clients.length) {
          case 3:
            if (numero == 0) {
              id1 = clients[2].id;
              id2 = clients[1].id;
              nombre1 = clients[2].username;
              nombre2 = clients[1].username;
              i = "j32";
              d = "j51";
            } else if (numero == 3) {
              id1 = clients[0].id;
              id2 = clients[2].id;
              nombre1 = clients[0].username;
              nombre2 = clients[2].username;
              i = "j52";
              d = "j01";
            } else {
              id1 = clients[1].id;
              id2 = clients[0].id;
              nombre1 = clients[1].username;
              nombre2 = clients[0].username;
              i = "j02";
              d = "j31";
            }
            break;
          case 4:
            if (numero == 0) {
              id1 = clients[3].id;
              id2 = clients[1].id;
              nombre1 = clients[3].username;
              nombre2 = clients[1].username;
              i = "j22";
              d = "j61";
            } else if (numero == 2) {
              id1 = clients[0].id;
              id2 = clients[2].id;
              nombre1 = clients[0].username;
              nombre2 = clients[2].username;
              i = "j42";
              d = "j01";
            } else if (numero == 4) {
              id1 = clients[1].id;
              id2 = clients[3].id;
              nombre1 = clients[1].username;
              nombre2 = clients[3].username;
              i = "j62";
              d = "j21";
            } else {
              id1 = clients[2].id;
              id2 = clients[0].id;
              nombre1 = clients[2].username;
              nombre2 = clients[0].username;
              i = "j02";
              d = "j41";
            }
            break;
          case 5:
            if (numero == 0) {
              id1 = clients[4].id;
              id2 = clients[1].id;
              nombre1 = clients[4].username;
              nombre2 = clients[1].username;
              i = "j12";
              d = "j61";
            } else if (numero == 1) {
              id1 = clients[0].id;
              id2 = clients[2].id;
              nombre1 = clients[0].username;
              nombre2 = clients[2].username;
              i = "j22";
              d = "j01";
            } else if (numero == 2) {
              id1 = clients[1].id;
              id2 = clients[3].id;
              nombre1 = clients[1].username;
              nombre2 = clients[3].username;
              i = "j42";
              d = "j11";
            } else if (numero == 4) {
              id1 = clients[2].id;
              id2 = clients[4].id;
              nombre1 = clients[2].username;
              nombre2 = clients[4].username;
              i = "j62";
              d = "j21";
            } else {
              id1 = clients[3].id;
              id2 = clients[0].id;
              nombre1 = clients[3].username;
              nombre2 = clients[0].username;
              i = "j02";
              d = "j41";
            }
            break;
          case 6:
            if (numero == 0) {
              id1 = clients[5].id;
              id2 = clients[1].id;
              nombre1 = clients[5].username;
              nombre2 = clients[1].username;
              i = "j12";
              d = "j71";
            } else if (numero == 1) {
              id1 = clients[0].id;
              id2 = clients[2].id;
              nombre1 = clients[0].username;
              nombre2 = clients[2].username;
              i = "j32";
              d = "j01";
            } else if (numero == 3) {
              id1 = clients[1].id;
              id2 = clients[3].id;
              nombre1 = clients[1].username;
              nombre2 = clients[3].username;
              i = "j42";
              d = "j11";
            } else if (numero == 4) {
              id1 = clients[2].id;
              id2 = clients[4].id;
              nombre1 = clients[2].username;
              nombre2 = clients[4].username;
              i = "j52";
              d = "j31";
            } else if (numero == 5) {
              id1 = clients[3].id;
              id2 = clients[5].id;
              nombre1 = clients[3].username;
              nombre2 = clients[5].username;
              i = "j72";
              d = "j41";
            } else {
              id1 = clients[4].id;
              id2 = clients[0].id;
              nombre1 = clients[4].username;
              nombre2 = clients[0].username;
              i = "j02";
              d = "j51";
            }
            break;
          case 7:
            if (numero == 0) {
              id1 = clients[6].id;
              id2 = clients[1].id;
              nombre1 = clients[6].username;
              nombre2 = clients[1].username;
              i = "j12";
              d = "j71";
            } else if (numero == 1) {
              id1 = clients[2].id;
              id2 = clients[0].id;
              nombre1 = clients[2].username;
              nombre2 = clients[0].username;
              i = "j32";
              d = "j01";
            } else if (numero == 3) {
              id1 = clients[1].id;
              id2 = clients[3].id;
              nombre1 = clients[1].username;
              nombre2 = clients[3].username;
              i = "j42";
              d = "j11";
            } else if (numero == 4) {
              id1 = clients[2].id;
              id2 = clients[4].id;
              nombre1 = clients[2].username;
              nombre2 = clients[4].username;
              i = "j52";
              d = "j31";
            } else if (numero == 5) {
              id1 = clients[3].id;
              id2 = clients[5].id;
              nombre1 = clients[3].username;
              nombre2 = clients[5].username;
              i = "j62";
              d = "j41";
            } else if (numero == 6) {
              id1 = clients[4].id;
              id2 = clients[6].id;
              nombre1 = clients[6].username;
              nombre2 = clients[6].username;
              i = "j72";
              d = "j51";
            } else {
              id1 = clients[5].id;
              id2 = clients[0].id;
              nombre1 = clients[5].username;
              nombre2 = clients[0].username;
              i = "j02";
              d = "j61";
            }
            break;
          case 8:
            if (numero == 0) {
              id1 = clients[7].id;
              id2 = clients[1].id;
              nombre1 = clients[7].username;
              nombre2 = clients[1].username;
              i = "j12";
              d = "j71";
            } else if (numero == 1) {
              id1 = clients[0].id;
              id2 = clients[2].id;
              nombre1 = clients[0].username;
              nombre2 = clients[2].username;
              i = "j22";
              d = "j01";
            } else if (numero == 2) {
              id1 = clients[1].id;
              id2 = clients[3].id;
              nombre1 = clients[1].username;
              nombre2 = clients[3].username;
              i = "j32";
              d = "j11";
            } else if (numero == 3) {
              id1 = clients[2].id;
              id2 = clients[4].id;
              nombre1 = clients[2].username;
              nombre2 = clients[4].username;
              i = "j42";
              d = "j21";
            } else if (numero == 4) {
              id1 = clients[3].id;
              id2 = clients[5].id;
              nombre1 = clients[3].username;
              nombre2 = clients[5].username;
              i = "j52";
              d = "j31";
            } else if (numero == 5) {
              id1 = clients[4].id;
              id2 = clients[6].id;
              nombre1 = clients[4].username;
              nombre2 = clients[6].username;
              i = "j62";
              d = "j41";
            } else if (numero == 6) {
              id1 = clients[5].id;
              id2 = clients[7].id;
              nombre1 = clients[5].username;
              nombre2 = clients[7].username;
              i = "j72";
              d = "j51";
            } else {
              id1 = clients[6].id;
              id2 = clients[0].id;
              nombre1 = clients[6].username;
              nombre2 = clients[0].username;
              i = "j02";
              d = "j61";
            }
            break;
        }
        this.io.to(id1).emit("ckB-v", i, d, nombre1);
        this.io.to(id2).emit("ckB-v", i, d, nombre2);
      } else {
        if (numero == 0) {
          id = clients[1].id;
          i = "j41";
          d = "j42";
          nombre = clients[1].username;
        } else {
          id = clients[0].id;
          i = "j01";
          d = "j02";
          nombre = clients[0].username;
        }
        this.io.to(id).emit("ckB-v", i, d, nombre);
      }
    });
  }

  /**
   * Gracefully disconnect the user from the game and end the draft
   * Preserving the gameState
   *
   * @access    public
   */
  onDisconnect() {
    this.socket.on("disconnect-v", () => {
      try {
        this.store.clients = this.store.clients.filter(
          (player) => player.id !== this.socket.id,
        );

        if (this.store.clients.length == 0) {
          clearInterval(this.store.interval);
        } else {
          clearInterval(this.store.interval);
          let cliente = this.store.clients[0];
          cliente.leader = true;
        }
        this.showPlayers();
      } catch (_) {
        logger.info("[FORCE DISCONNECT] Server closed forcefully");
      }

      logger.info("Client Disconnected!");
    });
  }
}
