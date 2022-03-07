import logger from "../middlewares/logger";
const got = require("got");

export default class RoomCanciones {
  constructor(options) {
    this.io = options.io; // Shortname for -> io.of('/your_namespace_here')
    this.socket = options.socket;
    this.username = options.username;
    this.roomId = options.roomId;
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
    // Stores an array containing socket ids in 'roomId's
    let clients;
    await this.io.in(this.roomId).clients((e, _clients) => {
      clients =
        _clients || logger.error("[INTERNAL ERROR] Room creation failed!");
    });

    if (clients.length >= 1) {
      this.store = this.store.rooms[this.roomId];
      await this.socket.join(this.roomId);

      this.store.clients.push({
        id: this.socket.id,
        name: username,
        host: false,
      });

      if (!(username in this.store.clientsMap)) {
        this.store.clientsMap[username] = 0;
        this.store.clientsNum += 1;
        logger.info(`[CREATE] new client room ${this.roomId}`);
      }

      this.socket.username = username;
      this.socket.emit("[SUCCESS] Successfully initialised");
      logger.info(`[JOIN] Client joined room ${this.roomId}`);

      //El juego ya empezó
      if (this.store.gameBegan) {
        logger.info("Llego alguien a la ronda");
        this.io.to(this.socket.id).emit("tu-turno", {
          cancionesRonda: this.store.cancionesRonda,
          correcta: this.store.correcta,
          rondas: this.store.rounds,
          cancion: this.store.cancion,
        });
      }
      return true;
    }

    if (clients.length < 1) {
      //HOST
      await this.socket.join(this.roomId);

      this.store = this.store["rooms"][this.roomId];
      this.store.clients = [
        { id: this.socket.id, username, isReady: false, host: true },
      ];

      this.store.clientsMap = {};
      this.store.clientsMap[username] = 0;
      this.store.clientsNum = 1;
      this.socket.emit("host");
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

      this.io.to(this.roomId).emit("canciones", this.store.canciones);
    }
  }

  /**
   * Mark player as ready  ---> to start the draft in the given room. If all players ready then initiate the draft
   *
   * @access public
   */
  initJuego() {
    this.socket.on("start-game", (inicio) => {
      this.store.gameBegan = true;
      logger.info(
        `[BEGIN] Inicio  URL ${inicio.url}, numero de rondas ${inicio.rounds}`,
      );

      this.store.rounds = parseInt(inicio.rounds);
      this.store.url = inicio.url;
      this.store.clients.porAhora = [];
      this._comenzarJuego();
    });
  }
  recibirCancion() {
    this.socket.on("cancion", (cancion) => {
      if (cancion === 1) {
        //correcto
        logger.info(
          `El usuario ${this.socket.username} eligio correctamente ${cancion}`,
        );
        this.store.clientsMap[this.socket.username] += 1;
      } else {
        //incorrecto
        logger.info(
          `El usuario ${this.socket.username} eligio incorrectamente ${cancion}`,
        );
        for (let j = 0; j < this.store.clients.length; j++) {
          let cli = this.store.clients[j];
          if (cli.id === this.socket.id) {
            if (cli.respondio === -1)
            {
              this.store.respuestas += 1;
              cli.respondio =1;
            }
          }
        }
        
      }
      logger.info(
        `El numero de respuestas en esta ronda es ${this.store.respuestas} y el numero de clientes es ${this.store.clientsNum}`,
      );
      if (cancion === 1 || this.store.clientsNum === this.store.respuestas) {
        if (this.store.idTurno !== this.store.rounds) {
          //No han acabado todas las rondas
          for (let j = 0; j < this.store.clients.length; j++) {
            let cli = this.store.clients[j];
            cli.respondio = -1;
            if (cancion === 1 && cli.id === this.socket.id) {
              cli.rondas[this.store.idTurno-1].played = true;
              cli.rondas[this.store.idTurno-1].correct = true;
              this.io.to(cli.id).emit("siguiente-turno", {
                correcto: 1,
                ronda: this.store.idTurno,
              });
            } else {
              cli.rondas[this.store.idTurno-1].played = true;
              cli.rondas[this.store.idTurno-1].correct = false;
              this.io.to(cli.id).emit("siguiente-turno", {
                correcto: 0,
                ronda: this.store.idTurno,
              });
            }
          }
          let milliseconds= 3000;
          setTimeout(()=>{
            this._comenzarTurno();
          },milliseconds);
          
        } else {
          //Ya hicieron todas las rondas, saca los puestos
          let a = [];
          for (let per in this.store.clientsMap) {
            a.push([this.store.clientsMap[per] , per]);
          }
          a.sort((b,c)=>( c[0]-b[0]));
          let puesto = 0;
          let ant = -1;
          let res = [];
          for (let i = 0; i < a.length; i++) {
            let per = a[i];
            if (ant !== per[0]) {
              puesto += 1;
            }
            ant = per[0];
            res.push({ puesto: puesto, nombre: per[1], puntaje: ant  });
            logger.info(`[END] La ronda acabo y los resultados son puesto: ${puesto}, nombre: ${per[1]} puntaje: ${ant } `);
          }
          this.io.emit(this.roomId).emit("termino", res);
          logger.info(`[END] La ronda acabo y los resultados son ${res}`);
          this.store.clientsMap = {};
          this.store.clientsNum = 0;
          this.socket.username = "";
          this.store.gameBegan = false;
        }
      }
    });
  }

  async _cargarCanciones() {
    //Se lee la pagina de spotify y se saca la informacion
    let html = await got(this.store.url);
    this.store.canciones = [];

    let res = html.body.split("\"track\":{");
    for (let i = 1; i < res.length; i++) {
      try {
        let cor = res[i].split(",\"video_thumbnail\":");
        let obj = JSON.parse("{" + cor[0]);
        let art = obj.album.artists[0];

        this.store.canciones.push({
          nombre: obj.name,
          artista: art.name,
          img: obj.album.images[0].url,
          url: obj.preview_url,
        });
      } catch (err) {
        logger.warn("[CREATE FAILED] Cargar una canción tuvo un error");
      }
    }

    logger.info(
      `[END] Termine de cargar las ${this.store.canciones.length} canciones `,
    );
  }

  async _comenzarJuego() {
    await this._cargarCanciones();

    this.store.idTurno = 0;
    this.store.llevo = [];
    this.io.emit(this.roomId).emit("game-started");
    this._comenzarTurno();
  }

  async _comenzarTurno() {
    if (this.store.idTurno == 0) {
      for (let j = 0; j < this.store.clients.length; j++) {
        let cli = this.store.clients[j];
        cli.rondas = [];
        cli.respondio = -1;
        for (let i = 0; i < this.store.rounds; i++) {
          cli.rondas.push({ played: false, correct: false  });
        }
      }
    }
    this.store.idTurno += 1;
    this.store.respuestas = 0;
    let i = Math.floor(Math.random() * 3) + 1;
    let cancion = Math.floor(Math.random() * this.store.canciones.length);
    let a = (element) => element === cancion;
    while (this.store.llevo.find(a) !== undefined) {
      cancion = Math.floor(Math.random() * this.store.canciones.length);
    }

    this.store.llevo.push(cancion);
    console.log("LLEVO");
    console.log( this.store.llevo);
    let porAhora = [];
    let cancionesRonda = [];
    porAhora.push(cancion);

    for (let j = 1; j <= 4; j++) {
      let esta = cancion;

      if (i !== j) {
        esta = Math.floor(Math.random() * this.store.canciones.length);
        let b = (element) => element === esta;
        while (porAhora.find(b) !== undefined) {
          esta = Math.floor(Math.random() * this.store.canciones.length);
        }
      }
      porAhora.push(esta);
      cancionesRonda.push(this.store.canciones[esta]);
    }
    for (let j = 0; j < this.store.clients.length; j++) {
      let cli = this.store.clients[j];
      this.io.to(cli.id).emit("tu-turno", {
        cancionesRonda: cancionesRonda,
        correcta: i-1,
        rondas: this.store.rounds,
        cancion: cancionesRonda[i-1].url,
        results: cli.rondas,
      });

    }

    this.store.cancionesRonda = cancionesRonda;
    this.store.correcta = i;
    this.store.cancion = cancionesRonda[i].url;
  }

  _siguienteTurno() {
    this.io.to(this.roomId).emit("siguiente-turno");

    this._comenzarTurno();
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
        if (this.store.clients.length === 0) {
          this.store.clientsMap = {};
          this.store.clientsNum = 0;
          this.socket.username = "";
          this.store.gameBegan = false;
        } else {
          let cliente = this.store.clients[0];
          cliente.host = true;
          this.io.to(cliente.id).emit("host");
        }
        this.showPlayers();
      } catch (_) {
        logger.info("[FORCE DISCONNECT] Server closed forcefully");
      }

      logger.info("Client Disconnected!");
    });
  }
}