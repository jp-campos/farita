import logger from "../middlewares/logger";
import { SALT_ROUNDS, MAX_PLAYERS_DEFAULT, MAX_TIMER_DEFAULT } from "../env";

import categoriasController from "../controller/categoriasController";

const MAX_JUGADORES = 6;
let categorias = null;

export default class RoomCategorias {
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
        console.log("la sala esta llena");
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
        {
          id: this.socket.id,
          username,
          isReady: false,
          leader: true,
          shots: 0,
        },
      ];
      this.socket.emit("lider");
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
      .emit("show-players-joined", { playersJoined: clients });
    if (this.store.gameBegan) {
      this.io.to(this.roomId).emit("game-started");
      this.io.to(this.roomId).emit("categoria", this.store.categoria);
    }
  }

  /**
   * Mark player as ready  ---> to start the draft in the given room. If all players ready then initiate the draft
   *
   * @access public
   */
  initJuego() {
    this.socket.on("start-game", (lenguaje) => {
      this.store.gameBegan = true;
      this._comenzarJuego(lenguaje);
    });
  }

  recibirPalabra() {
    this.socket.on("palabra", (palabra) => {
      clearInterval(this.store.interval);
      this.io.emit(this.roomId).emit("palabra", palabra, this._getJugadorId());
      this.io.emit(this.roomId).emit("votar");
      //TODO: Mandarle a la gente que votar
    });
  }

  recibirVotos() {
    this.socket.on("voto", (votoObj) => {
      let voto = votoObj.voto;

      this.io.to(this.roomId).emit("voto", votoObj);
      if (voto == "SI") {
        this.store.votos["SI"] += 1;
      } else {
        this.store.votos["NO"] += 1;
      }
      let totalVotos = this.store.votos["SI"] + this.store.votos["NO"];
      if (totalVotos === this.store.clients.length - 1) {
        //Pasa al siguiente turno
        if (this.store.votos["SI"] / totalVotos > 0.6) {
          this._siguienteTurno();
        } else {
          //El jugador pierde
          this.store.perder = true;
          this.io
            .to(this.roomId)
            .emit("perder", this.store.clients[this._getJugadorId()].username);
        }
      }
    });
  }

  async _comenzarJuego(lenguaje) {
    categorias = [ ["Marcas de carro", "Colores", "Marca de ropa", "Animales","Paises"], ["Car brands", "Colors", "Clothing brand", "Animals", "Countries"], ["Marques de voitures", "Couleurs", "Marque de vêtements", "Animaux", "Pays"]] ;
    if (lenguaje === "es")
    {
      categorias = categorias[0];
    }
    else if (lenguaje === "fr")
    {
      categorias = categorias[2];
    }
    else
    {
      categorias = categorias[1];
    }
    let categoria = categorias[this._getRandomInt(0, categorias.length)];
    this.store.categoria = categoria;
    this.store.votos = { SI: 0, NO: 0 };
    this.io.emit(this.roomId).emit("categoria", categoria);
    this.store.idTurno = 0;
    this.io.emit(this.roomId).emit("game-started");
    this.store.perder = false;
    this._comenzarTurno();
  }

  _getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  _iniciarContador(segundos) {
    let tiempoActual = segundos + 1;
    const interval = setInterval(() => {
      tiempoActual--;
      this.io.to(this.roomId).emit("tiempo", {
        jugador: this.store.idTurno % this.store.clients.length,
        timer: tiempoActual,
      });
      if (tiempoActual == 0) {
        clearInterval(interval);

        let username = this.store.clients[this._getJugadorId()]?.username;
        this.store.perder = true;
        if (username) this.io.to(this.roomId).emit("perder", username);
      }
    }, 1000);

    this.store.interval = interval;
  }

  _comenzarTurno() {
    let socketId = this.store.clients[this._getJugadorId()].id;
    this.io.to(socketId).emit("tu-turno");
    let segundos = this._tiempoContador();
    this._iniciarContador(segundos);
  }

  _siguienteTurno() {
    this.io.to(this.roomId).emit("siguiente-turno");
    this.store.idTurno++;
    this.store.votos = { SI: 0, NO: 0 };
    this._comenzarTurno();
  }

  _getJugadorId() {
    return this.store.idTurno % this.store.clients.length;
  }

  _tiempoContador() {
    let idTurno = this.store.idTurno;
    let numJugadores = this.store.clients.length;
    if (idTurno < numJugadores) {
      return 10;
    } else if (idTurno < numJugadores * 2) {
      return 8;
    } else {
      return 5;
    }
  }
  /**
   * Gracefully disconnect the user from the game and end the draft
   * Preserving the gameState
   *
   * @access    public
   */
  onDisconnect() {
    this.socket.on("disconnect", () => {
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
          this.io.to(cliente.id).emit("lider");
        }
        if (!this.store.perder) {
          this.showPlayers();
        }
      } catch (_) {
        logger.info("[FORCE DISCONNECT] Server closed forcefully");
      }

      logger.info("Client Disconnected!");
    });
  }
}
