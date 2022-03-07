import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./style.css";
import Jugador from "./Jugador";
import Buttons from "../Common/Buttons";
import { FormattedMessage, useIntl } from "react-intl";
import { makeStyles } from "@material-ui/core/styles";

let socket = undefined;
//const ENDPOINT = "127.0.0.1:8000/";
const ENDPOINT = "https://farita-back.herokuapp.com/";
const useStyles = makeStyles((theme) => ({
  
  overlayText:{
    position: "absolute",
    top: "40%",
    left: "50%",
    display: "inline-block",
    transform: "translate(-50%, -50%)" ,
    color: "white",
  },
  container: {
    position: "relative",
    textAlign: "center",
  }
  
}));
export default function Vikingos(props) {
  const [jugadores, setJugadores] = useState([]);
  const [error, setError] = useState("");
  const [errorLider, setErrorLider] = useState("");
  const [comienzoJuego, setComienzo] = useState(false);
  const [miTurno, setMiTurno] = useState(false);
  const [idSocketConTurno, setIdSocketConturno] = useState("");
  const [inforValor, setInfoJugador] = useState("Información del juego");
  const [inforJuego, setInfoJuego] = useState("...");
  const [colorJugador, setColor] = useState("rgb(255, 255, 255)");
  const classes = useStyles();
  const intl = useIntl();
  let colores = [
    "rgb(255, 255, 255)",
    "rgb(255, 0, 0)",
    "rgb(255, 255, 0)",
    "rgb(249, 107, 227)",
    "rgb(188, 99, 85)",
    "rgb(255, 165, 0)",
    "rgb(173, 255, 47)",
    "rgb(0, 0, 255)",
  ].map(function (c) {
    return { color: c };
  });

  useEffect(() => {
    let path = ENDPOINT + props.faritaId;
    if (process.env.NODE_ENV === "production") {
      path = ENDPOINT + props.faritaId;
    }

    socket = socketIOClient(path, {
      path: "/" + props.faritaId,
      query: { username: props.username, roomId: "vikingos", options: "{}" },
    });

    //-----------------Los que reciben-----------------
    socket.on("show-players-joined-v", (data) => {
      setJugadores(data.playersJoined);
      let nombre = data.playersJoined[0].username;
      setInfoJugador(intl.formatMessage({id:"Vikingo.Vikingo.VikingPlay"},  {nombre}));
    });
    socket.on("error", (data) => setError(data));
    socket.on("errorLider", (data) => setErrorLider(data));
    socket.on("game-v-started", () => {
      setComienzo(true);
    });
    socket.on("tu-v-turno", () => {
      setMiTurno(true);
    });

    socket.on("siguiente-v-turno", () => {
      setMiTurno(false);
    });

    //El voyo que yo envio
    socket.on("turno-otros", (idTurnActual) => {
      setIdSocketConturno(idTurnActual);
    });

    socket.on("escribirMensaje", (color, nombre) => {
      renderizarMensajeJugador(color, nombre);
    });
    socket.on("jugar-v", (idJugador) => {
      jugar(idJugador);
    });

    socket.on("ckB-v", (i, d, nombre) => {
      remar(i, d, nombre);
    });

    socket.on("tu-color", (color) => {
      setColor(color.color);
    });

    return () => {
      socket.disconnect();
    };
  }, [props.username]);

  //-------------Los que envían------------
  function comenzarJuego() {
    if (socket) socket.emit("start-v-game", jugadores[0].id, colores);
  }

  if (errorLider) {
    return (
      <>
        <h1><FormattedMessage id="Vikingos.Vikingos.NotLeader"/></h1>
        <h2><FormattedMessage id="Vikingos.Vikingos.Wait"/></h2>
      </>
    );
  }
  if (error) {
    return (
      <>
        <h1><FormattedMessage id="Vikingos.Vikingos.FullRoom"/></h1>
        <h2><FormattedMessage id="Vikingos.Vikingos.TryAnotherRoom"/></h2>
      </>
    );
  }

  function mensajeError() {
    if (props?.username === jugadores[0]?.username) {
      return (
        <button
          className="btn btn-light my-4 "
          onClick={() => {
            comenzarJuego();
          }}
        >
          <FormattedMessage id="Vikingos.Vikingos.BeginGame"/>
        </button>
      );
    } else {
      return (
        <>
          <h1><FormattedMessage id="Vikingos.Vikingos.NotLeader"/></h1>
          <h2><FormattedMessage id="Vikingos.Vikingos.Wait"/></h2>
        </>
      );
    }
  }
  let ids = ["j0", "j1", "j2", "j3", "j4", "j5", "j6", "j7"].map(function (id) {
    return { id: id };
  });

  function renderizacionJugadores(numeroJugadores) {
    let html = "";
    switch (numeroJugadores) {
      case 2:
        html = (
          <div id="jugadores" className="circle-container ocultarcircl">
            <Jugador
              id={ids[0].id}
              idRD={ids[0].id + 1}
              idRI={ids[0].id + 2}
              color={colores[0].color}
              idj={jugadores[0].id}
              desabilitar={
                jugadores[0].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[4].id}
              idRD={ids[4].id + 1}
              idRI={ids[4].id + 2}
              color={colores[1].color}
              idj={jugadores[1].id}
              desabilitar={
                jugadores[1].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
          </div>
        );
        break;
      case 3:
        html = (
          <div id="jugadores" className="circle-container ocultarcircl">
            <Jugador
              id={ids[0].id}
              idRD={ids[0].id + 1}
              idRI={ids[0].id + 2}
              color={colores[0].color}
              idj={jugadores[0].id}
              desabilitar={
                jugadores[0].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[3].id}
              idRD={ids[3].id + 1}
              idRI={ids[3].id + 2}
              color={colores[1].color}
              idj={jugadores[1].id}
              desabilitar={
                jugadores[1].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[5].id}
              idRD={ids[5].id + 1}
              idRI={ids[5].id + 2}
              color={colores[2].color}
              idj={jugadores[2].id}
              desabilitar={
                jugadores[2].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
          </div>
        );
        break;
      case 4:
        html = (
          <div id="jugadores" className="circle-container ocultarcircl">
            <Jugador
              id={ids[0].id}
              idRD={ids[0].id + 1}
              idRI={ids[0].id + 2}
              color={colores[0].color}
              idj={jugadores[0].id}
              desabilitar={
                jugadores[0].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[2].id}
              idRD={ids[2].id + 1}
              idRI={ids[2].id + 2}
              color={colores[1].color}
              idj={jugadores[1].id}
              desabilitar={
                jugadores[1].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[4].id}
              idRD={ids[4].id + 1}
              idRI={ids[4].id + 2}
              color={colores[2].color}
              idj={jugadores[2].id}
              desabilitar={
                jugadores[2].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[6].id}
              idRD={ids[6].id + 1}
              idRI={ids[6].id + 2}
              color={colores[3].color}
              idj={jugadores[3].id}
              desabilitar={
                jugadores[3].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
          </div>
        );
        break;
      case 5:
        html = (
          <div id="jugadores" className="circle-container ocultarcircl">
            <Jugador
              id={ids[0].id}
              idRD={ids[0].id + 1}
              idRI={ids[0].id + 2}
              color={colores[0].color}
              idj={jugadores[0].id}
              desabilitar={
                jugadores[0].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[1].id}
              idRD={ids[1].id + 1}
              idRI={ids[1].id + 2}
              color={colores[1].color}
              idj={jugadores[1].id}
              desabilitar={
                jugadores[1].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[2].id}
              idRD={ids[2].id + 1}
              idRI={ids[2].id + 2}
              color={colores[2].color}
              idj={jugadores[2].id}
              desabilitar={
                jugadores[2].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[4].id}
              idRD={ids[4].id + 1}
              idRI={ids[4].id + 2}
              color={colores[3].color}
              idj={jugadores[3].id}
              desabilitar={
                jugadores[3].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[6].id}
              idRD={ids[6].id + 1}
              idRI={ids[6].id + 2}
              color={colores[4].color}
              idj={jugadores[4].id}
              desabilitar={
                jugadores[4].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
          </div>
        );
        break;
      case 6:
        html = (
          <div id="jugadores" className="circle-container ocultarcircl">
            <Jugador
              id={ids[0].id}
              idRD={ids[0].id + 1}
              idRI={ids[0].id + 2}
              color={colores[0].color}
              idj={jugadores[0].id}
              desabilitar={
                jugadores[0].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[1].id}
              idRD={ids[1].id + 1}
              idRI={ids[1].id + 2}
              color={colores[1].color}
              idj={jugadores[1].id}
              desabilitar={
                jugadores[1].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[3].id}
              idRD={ids[3].id + 1}
              idRI={ids[3].id + 2}
              color={colores[2].color}
              idj={jugadores[2].id}
              desabilitar={
                jugadores[2].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[4].id}
              idRD={ids[4].id + 1}
              idRI={ids[4].id + 2}
              color={colores[3].color}
              idj={jugadores[3].id}
              desabilitar={
                jugadores[3].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[5].id}
              idRD={ids[5].id + 1}
              idRI={ids[5].id + 2}
              color={colores[4].color}
              idj={jugadores[4].id}
              desabilitar={
                jugadores[4].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[7].id}
              idRD={ids[7].id + 1}
              idRI={ids[7].id + 2}
              color={colores[5].color}
              idj={jugadores[5].id}
              desabilitar={
                jugadores[5].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
          </div>
        );
        break;
      case 7:
        html = (
          <div id="jugadores" className="circle-container ocultarcircl">
            <Jugador
              id={ids[0].id}
              idRD={ids[0].id + 1}
              idRI={ids[0].id + 2}
              color={colores[0].color}
              idj={jugadores[0].id}
              desabilitar={
                jugadores[0].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[1].id}
              idRD={ids[1].id + 1}
              idRI={ids[1].id + 2}
              color={colores[1].color}
              idj={jugadores[1].id}
              desabilitar={
                jugadores[1].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[3].id}
              idRD={ids[3].id + 1}
              idRI={ids[3].id + 2}
              color={colores[2].color}
              idj={jugadores[2].id}
              desabilitar={
                jugadores[2].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[4].id}
              idRD={ids[4].id + 1}
              idRI={ids[4].id + 2}
              color={colores[3].color}
              idj={jugadores[3].id}
              desabilitar={
                jugadores[3].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[5].id}
              idRD={ids[5].id + 1}
              idRI={ids[5].id + 2}
              color={colores[4].color}
              idj={jugadores[4].id}
              desabilitar={
                jugadores[4].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[6].id}
              idRD={ids[6].id + 1}
              idRI={ids[6].id + 2}
              color={colores[5].color}
              idj={jugadores[5].id}
              desabilitar={
                jugadores[5].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[7].id}
              idRD={ids[7].id + 1}
              idRI={ids[7].id + 2}
              color={colores[6].color}
              idj={jugadores[6].id}
              desabilitar={
                jugadores[6].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
          </div>
        );
        break;
      case 8:
        html = (
          <div id="jugadores" className="circle-container ocultarcircl">
            <Jugador
              id={ids[0].id}
              idRD={ids[0].id + 1}
              idRI={ids[0].id + 2}
              color={colores[0].color}
              idj={jugadores[0].id}
              desabilitar={
                jugadores[0].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[1].id}
              idRD={ids[1].id + 1}
              idRI={ids[1].id + 2}
              color={colores[1].color}
              idj={jugadores[1].id}
              desabilitar={
                jugadores[1].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[2].id}
              idRD={ids[2].id + 1}
              idRI={ids[2].id + 2}
              color={colores[2].color}
              idj={jugadores[2].id}
              desabilitar={
                jugadores[2].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[3].id}
              idRD={ids[3].id + 1}
              idRI={ids[3].id + 2}
              color={colores[3].color}
              idj={jugadores[3].id}
              desabilitar={
                jugadores[3].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[4].id}
              idRD={ids[4].id + 1}
              idRI={ids[4].id + 2}
              color={colores[4].color}
              idj={jugadores[4].id}
              desabilitar={
                jugadores[4].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[5].id}
              idRD={ids[5].id + 1}
              idRI={ids[5].id + 2}
              color={colores[5].color}
              idj={jugadores[5].id}
              desabilitar={
                jugadores[5].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[6].id}
              idRD={ids[6].id + 1}
              idRI={ids[6].id + 2}
              color={colores[6].color}
              idj={jugadores[6].id}
              desabilitar={
                jugadores[6].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
            <Jugador
              id={ids[7].id}
              idRD={ids[7].id + 1}
              idRI={ids[7].id + 2}
              color={colores[7].color}
              idj={jugadores[7].id}
              desabilitar={
                jugadores[7].id === idSocketConTurno && miTurno ? true : false
              }
              miTurno={miTurno}
            />
          </div>
        );
        break;
      default:
        html = (
          <>
            <h1>La sala ya esta llena :(</h1>
          </>
        );
        break;
    }
    return html;
  }

  function renderizarMensajeJugador(color, nomb) {
    setInfoJugador(
      intl.formatMessage({id:"Vikingos.Vikingos.InfoPlayer"}, {nomb, color: nombreColor(
        color)})
    );
  }

  function jugar(idJugador) {
    var regex = /(\d+)/g;
    var numero = idJugador.match(regex);
    socket.emit("reglas", idJugador, numero, ids);
  }

  function remar(i, d, nombre) {
    let isMi = false;
    let isMd = false;
    if (document.getElementById(i) != null) {
      isMi = document.getElementById(i).checked;
    }
    if (document.getElementById(d) != null) {
      isMd = document.getElementById(d).checked;
    }
    if (isMi || isMd) {
      setInfoJuego(
        intl.formatMessage({id:"Vikingos.Vikingos.InfoGameCorrect"},{nombre})
      );
    } else {
      socket.emit("sumarShots", nombre);
      setInfoJuego(intl.formatMessage({id:"Vikingos.Vikingos.InfoGameLoose"}, {nombre}));
    }
  }

  function nombreColor(elementIColor) {
    let result_name_jI = "";
    if (elementIColor === "rgb(188, 99, 85)") {
      result_name_jI = "Rosado Oscuro";
    } else if (elementIColor === "rgb(255, 0, 0)") {
      result_name_jI = "Rojo";
    } else if (elementIColor === "rgb(255, 255, 0)") {
      result_name_jI = "Amarillo";
    } else if (elementIColor === "rgb(255, 255, 255)") {
      result_name_jI = "Blanco";
    } else if (elementIColor === "rgb(249, 107, 227)") {
      result_name_jI = "Rosado Claro";
    } else if (elementIColor === "rgb(255, 165, 0)") {
      result_name_jI = "Naranja";
    } else if (elementIColor === "rgb(173, 255, 47)") {
      result_name_jI = "Verde Lima";
    } else if (elementIColor === "rgb(0, 0, 255)") {
      result_name_jI = "Azul";
    }
    return result_name_jI;
  }

  let lider = "";
  let inline = "";
  if (comienzoJuego) {
    return (
      <>
        <Buttons />
        <div className="container-fluid sala-espera">
          <div className="row row-sm-2">
            <div className="col-md-12 arg2">
              <h1>Tu color es:</h1>
              <div
                className="forma"
                style={{ backgroundColor: colorJugador }}
              ></div>
            </div>
            <div className="col-md-12">
              {renderizacionJugadores(jugadores.length)}
            </div>
            <div className="col-md-12 contener">
              <h1>{inforValor}</h1>
              <h1>{inforJuego}</h1>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Buttons />
        <div className="container-fluid sala-espera">
        <div className={classes.container}>
          <img
            className="mb-5 img-fluid"
            src={require("./assets/logo-vikingos-grande.png")}
            alt="logo"
          ></img>
          <h1 className={classes.overlayText}><FormattedMessage id={"Home.Looby.vikings"}  /></h1>
          </div>
          <h1 className="texto-como-jugar"><FormattedMessage id={"Vikingos.Vikingos.HowToPlay"}/> </h1>
          <p className="texto-descripcion">
          <FormattedMessage id={"Vikingos.Vikingos.Rules"}/>
          </p>

          <p className="text-esperando saving">
          <FormattedMessage id={"Vikingos.Vikingos.WaitingPlayers"}/> <span>. </span>
            <span>. </span>
            <span>. </span>
          </p>
          {jugadores.map(function (j, i) {
            lider = j.leader ? intl.formatMessage({id:"Vikingos.Vikingos.Leader"}) : "";
            inline = j.leader ? "d-inline" : "";
            if (lider !== "") {
              return (
                <span key={i}>
                  <h2 className="d-inline text-lider ">{lider} </h2>
                  <h3 className={inline} style={colores[i]}>
                    {j.username}
                  </h3>
                </span>
              );
            } else {
              return (
                <span key={i}>
                  <h3 className={inline} style={colores[i]}>
                    {j.username}
                  </h3>
                </span>
              );
            }
          })}

          {mensajeError()}
        </div>
      </>
    );
  }
}
export function turno(color, id, sockID) {
  socket.emit("mensaje", sockID, color);
  socket.emit("turno-de", sockID);
  socket.emit("jugar", id);
}
