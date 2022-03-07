import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import "./style.css";
import explosion from "./assets/explosion.svg";
import { FormattedMessage } from "react-intl";

export default function AvisoPerder(props) {

  function handleReiniciar() {
    props.socket.emit("start-game");
  }

  return (
    <section style={props.visible} className="aviso-perder d-flex flex-column">
      <h2 id="mensaje_perder">{props.mensaje}</h2>

      <img alt="Explosión" className="mx-auto" src={explosion} width="40" height="40"></img>
      <button
        type="button"
        className="m-auto btn btn-outline-dark"
        onClick={() => handleReiniciar()}
      >
        <span>
          <FormattedMessage id="Categorias.AvisoPerder.Restart"/>
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            className="bi bi-arrow-counterclockwise"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
          </svg>
        </span>
      </button>
    </section>
  );
}
