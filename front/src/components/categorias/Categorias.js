import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import Jugador from "./Jugador";
import AvisoPerder from "./AvisoPerder";
import Buttons from "../Common/Buttons";
import { makeStyles } from "@material-ui/core/styles";
import bomba from "./assets/bomba.png";
import enviar from "./assets/Send-01.svg";
import { FormattedMessage, useIntl } from "react-intl";


import "./style.css";
import { Field, Form, Formik } from "formik";

const ENDPOINT = "https://farita-back.herokuapp.com/";
//const ENDPOINT = "127.0.0.1:8000/";

let socket = undefined;
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
export default function Categorias(props) {
  const [jugadores, setJugadores] = useState([]);
  const [comienzoJuego, setComienzo] = useState(false);
  const [categoria, setCategoria] = useState("");

  const [palabra, setPalabra] = useState("");
  const [colorPalabra, setColorPalabra] = useState({ color: "white" });
  const [miTurno, setMiTurno] = useState(false);
  const [timer, setTimer] = useState({ jugador: 0, timer: "" });
  const [disabled, setDisabled] = useState({ votos: true, palabra: true });
  const [votos, setVotos] = useState([]);
  const [error, setError] = useState("");
  const [modal, setModal] = useState({
    visibility: { visibility: "hidden" },
    mensaje: "",
  });
  const classes = useStyles();

  const intl = useIntl();
  const [lider, setLider] = useState(false);

  let colores = [
    "#e254ff",
    "#04fd9e",
    "#fd6604",
    "#0099ff",
    "#ffcd00",
    "#ff7597",
  ].map(function (c) {
    return { color: c };
  });

  useEffect(() => {
    let miTurnoLocal = false;

    let path = ENDPOINT + props.faritaId;
    if (process.env.NODE_ENV === "production") {
      path = ENDPOINT + props.faritaId;
    }
    console.log("En el usefect de catego farita", props.faritaId);
    socket = socketIOClient(path, {
      path: "/" + props.faritaId,
      query: { username: props.username, roomId: "categorias", options: "{}" },
    });

    //-----------------Los que reciben-----------------
    socket.on("show-players-joined", (data) =>
      setJugadores(data.playersJoined),
    );
    socket.on("lider", () => setLider(true));
    socket.on("error", (data) => setError(data));
    socket.on("game-started", () => {
      setModal({ visibility: { visibility: "hidden" }, mensaje: "" });
      setComienzo(true);
    });
    socket.on("categoria", (data) => setCategoria(data));
    socket.on("tu-turno", () => {
      setMiTurno(true);
      miTurnoLocal = true;
      setDisabled({ votos: true, palabra: false });
    });

    socket.on("tiempo", (timerObj) => setTimer(timerObj));

    socket.on("palabra", (palabra, idJugador) => {
      setPalabra(palabra);
      setColorPalabra(colores[idJugador]);
    });

    //El voto que yo envio
    socket.on("votar", () => {
      if (!miTurnoLocal) {
        setDisabled({ votos: false, palabra: true });
      }
    });
    //El voto que envió alguien más
    socket.on("voto", (v) => {
      const nuevosVotos = votos.concat(v);
      setVotos(nuevosVotos);
    });

    socket.on("siguiente-turno", () => {
      setPalabra("");
      setTimer("");
      setMiTurno(false);
      miTurnoLocal = false;
      setDisabled({ votos: true, palabra: true });
    });

    socket.on("perder", (username) => {
      setPalabra("");
      setTimer("");
      setMiTurno(false);
      miTurnoLocal = false;
      setDisabled({ votos: true, palabra: true });
      setModal({
        visibility: { visibility: "visible" },
        mensaje: intl.formatMessage({id:"Categorias.AvisoPerder.Mensaje"}, {username}),
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [props.username]);

  //-------------Los que envían------------
  function comenzarJuego() {
    if (socket) socket.emit("start-game", intl.locale);
  }

  function handleEnviarPalabra(obj, resetForm) {
    resetForm({});
    socket.emit("palabra", obj.palabra);
    setDisabled({ votos: true, palabra: true });
  }

  function handleVotar(v) {
    setDisabled({ votos: true, palabra: true });
    socket.emit("voto", { voto: v, jugador: socket.id });
  }

  if (error) {
    return (
      <div>
        <h1><FormattedMessage id="Categorias.Categorias.FullRoom"/></h1>
        <h2><FormattedMessage id="Categorias.Categorias.TryAnotherRoom"/></h2>
      </div>
    );
  }
  //
  if (comienzoJuego) {
    return (
      <div className="body-wrap">
        <Buttons />
        <AvisoPerder
          visible={modal.visibility}
          mensaje={modal.mensaje}
          socket={socket}
          lider={lider}
        />

        <div className="frame-juego">
          <div className="h-100 d-flex flex-column">
            <div className="categoria-container">
              <div className="text-center" style={{ fontSize: "24px" }}>
                <span className="texto-categoria">{categoria}</span>
              </div>
            </div>

            <div className="grow d-flex ">
              <p
                style={colorPalabra}
                className="display-3 text-break mx-auto my-auto palabra-principal"
              >
                {palabra}{" "}
              </p>
            </div>

            <div className="d-flex justify-content-around flex-wrap">
              {jugadores.map((j, i) => {
                let timerJ = "";
                let votoJ = "";
                if (timer.jugador === i && !miTurno) {
                  timerJ = timer.timer;
                }
                let votoElJugadorArr = votos.filter(
                  (voto) => voto.jugador === j.id,
                );
                if (votoElJugadorArr.length > 0) {
                  votoJ = votoElJugadorArr.pop().voto;
                }

                return (
                  <Jugador
                    timer={timerJ}
                    obj={j}
                    key={j.id}
                    color={colores[i]}
                    voto={votoJ}
                  />
                );
              })}
            </div>

            <div className="mx-auto timer mt-2">
              <div className="bomba-yo">
                <img
                  aria-label="Bomba"
                  alt="Bomba"
                  style={miTurno ? { display: "block" } : { display: "none" }}
                  src={bomba}
                  className="img-fluid"
                ></img>
                <div style={{ backgroundColor: "black" }}>
                  <h1 aria-hidden="true" className="bomba-text-yo">
                    {miTurno ? timer.timer : ""}
                  </h1>
                </div>
              </div>
            </div>

            <div className="container-lg d-flex justify-content-center">
              <Formik
                initialValues={{ palabra: "" }}
                onSubmit={(values, { resetForm }) => {
                  handleEnviarPalabra(values, resetForm);
                }}
              >
                <Form className="w-75 d-inline">
                  <div className="container-lg d-flex justify-content-center">
                    <Field
                      aria-label="Insertar  "
                      disabled={disabled.palabra}
                      autoComplete="off"
                      name="palabra"
                      className="w-100 text-box"
                      type="text"
                    ></Field>
                    <button disabled={disabled.palabra} type="submit">
                      <img
                        alt="Enviar palabra"
                        height="40"
                        width="40"
                        src={enviar}
                        alt="Enviar"
                      ></img>
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>

            <div className="d-flex justify-content-center">
              <button
                aria-label="Votar que si"
                disabled={disabled.votos}
                className="m-3 boton-si"
                onClick={() => handleVotar("SI")}
              >
                <svg
                  width="48px"
                  height="64px"
                  viewBox="0 0 16 16"
                  className="bi bi-hand-thumbs-up"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a9.84 9.84 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733.058.119.103.242.138.363.077.27.113.567.113.856 0 .289-.036.586-.113.856-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.163 3.163 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16v-1c.563 0 .901-.272 1.066-.56a.865.865 0 0 0 .121-.416c0-.12-.035-.165-.04-.17l-.354-.354.353-.354c.202-.201.407-.511.505-.804.104-.312.043-.441-.005-.488l-.353-.354.353-.354c.043-.042.105-.14.154-.315.048-.167.075-.37.075-.581 0-.211-.027-.414-.075-.581-.05-.174-.111-.273-.154-.315L12.793 9l.353-.354c.353-.352.373-.713.267-1.02-.122-.35-.396-.593-.571-.652-.653-.217-1.447-.224-2.11-.164a8.907 8.907 0 0 0-1.094.171l-.014.003-.003.001a.5.5 0 0 1-.595-.643 8.34 8.34 0 0 0 .145-4.726c-.03-.111-.128-.215-.288-.255l-.262-.065c-.306-.077-.642.156-.667.518-.075 1.082-.239 2.15-.482 2.85-.174.502-.603 1.268-1.238 1.977-.637.712-1.519 1.41-2.614 1.708-.394.108-.62.396-.62.65v4.002c0 .26.22.515.553.55 1.293.137 1.936.53 2.491.868l.04.025c.27.164.495.296.776.393.277.095.63.163 1.14.163h3.5v1H8c-.605 0-1.07-.081-1.466-.218a4.82 4.82 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"
                  />
                </svg>
              </button>

              <button
                aria-label="Votar que no"
                disabled={disabled.votos}
                className="m-3 boton-no"
                onClick={() => handleVotar("NO")}
              >
                <svg
                  width="48px"
                  height="64px"
                  viewBox="0 0 16 16"
                  className="bi bi-hand-thumbs-down"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.956 14.534c.065.936.952 1.659 1.908 1.42l.261-.065a1.378 1.378 0 0 0 1.012-.965c.22-.816.533-2.512.062-4.51.136.02.285.037.443.051.713.065 1.669.071 2.516-.211.518-.173.994-.68 1.2-1.272a1.896 1.896 0 0 0-.234-1.734c.058-.118.103-.242.138-.362.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.094 2.094 0 0 0-.16-.403c.169-.387.107-.82-.003-1.149a3.162 3.162 0 0 0-.488-.9c.054-.153.076-.313.076-.465a1.86 1.86 0 0 0-.253-.912C13.1.757 12.437.28 11.5.28v1c.563 0 .901.272 1.066.56.086.15.121.3.121.416 0 .12-.035.165-.04.17l-.354.353.353.354c.202.202.407.512.505.805.104.312.043.44-.005.488l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.415-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.353.352.373.714.267 1.021-.122.35-.396.593-.571.651-.653.218-1.447.224-2.11.164a8.907 8.907 0 0 1-1.094-.17l-.014-.004H9.62a.5.5 0 0 0-.595.643 8.34 8.34 0 0 1 .145 4.725c-.03.112-.128.215-.288.255l-.262.066c-.306.076-.642-.156-.667-.519-.075-1.081-.239-2.15-.482-2.85-.174-.502-.603-1.267-1.238-1.977C5.597 8.926 4.715 8.23 3.62 7.93 3.226 7.823 3 7.534 3 7.28V3.279c0-.26.22-.515.553-.55 1.293-.138 1.936-.53 2.491-.869l.04-.024c.27-.165.495-.296.776-.393.277-.096.63-.163 1.14-.163h3.5v-1H8c-.605 0-1.07.08-1.466.217a4.823 4.823 0 0 0-.97.485l-.048.029c-.504.308-.999.61-2.068.723C2.682 1.815 2 2.434 2 3.279v4c0 .851.685 1.433 1.357 1.616.849.232 1.574.787 2.132 1.41.56.626.914 1.28 1.039 1.638.199.575.356 1.54.428 2.591z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="frame-espera">
        <Buttons />
        <div
          style={{ paddingLeft: "75px" }}
          className="container-fluid sala-espera"
        >
          <div className={classes.container}>
          <img
            className="mb-5 img-fluid"
            src={require("./assets/logo-explosivas-grande.png")}
            alt="Banner de categorías explosivas"
          ></img>
          <h1 className={classes.overlayText}><FormattedMessage id={"Home.Looby.categories"}  /></h1>
          </div>
          <h1 style={{ fontSize: "30px" }} className="texto-como-jugar">
            <FormattedMessage id="Categorias.Categorias.HowToPlay"/>{" "}
          </h1>
          <p className="texto-descripcion">
          <FormattedMessage id="Categorias.Categorias.Rules"/>
          </p>

          <p className="text-esperando saving">
          <FormattedMessage id="Categorias.Categorias.WaitingPlayers"/> <span>. </span>
            <span>. </span>
            <span>. </span>
          </p>
          {jugadores.map(function (j, i) {
            let lider = j.leader ? intl.formatMessage({id:"Categorias.Categorias.Leader"}) : "";
            let inline = j.leader ? "d-inline text-lider" : "";

            return (
              <span key={i}>
                <h2 className="d-inline text-lider " aria-hidden="true">
                  {lider}{" "}
                </h2>
                <h2 className={inline} style={colores[i]}>
                  {j.username}
                </h2>
              </span>
            );
          })}

          <button
            disabled={!lider}
            className="btn btn-light my-4 "
            onClick={() => comenzarJuego()}
          >
            <FormattedMessage id="Categorias.Categorias.BeginGame"/>
          </button>
        </div>
      </div>
    );
  }
}
