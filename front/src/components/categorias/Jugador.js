import React, { useEffect, useState } from "react";
import bomba from "./assets/bomba.png";
import "./style.css";

export default function Jugador(props) {
  const [visibleVoto, setVisibleVoto] = useState({ visibility: "hidden" });

  useEffect(() => {
    console.log("voto en jugador", props.voto);
    if (props.voto) {
      let colorVoto = props.voto === "NO" ? "#ff0000" : "#238c06";
      setVisibleVoto({ visibility: "visible", color: colorVoto });
      setTimeout(() => setVisibleVoto({ visibility: "hidden" }), 2000);
    }
  }, [props.voto]);

  return (
    <div className="placeholder-jugador">
      <div className="bomba">
        <img
          alt="Bomba otro jugador"
          style={props.timer ? { display: "block" } : { display: "none" }}
          className="img-fluid"
          src={bomba}
        ></img>
        <div style={{backgroundColor:"black"}}>
          <p className="bomba-text">{props.timer}</p>
        </div>
      </div>

      <div style={visibleVoto} className="tool-tip">
        {props.voto}
      </div>

      <div className="icono-jugador">
        <svg
          width="80%"
          height="80%"
          viewBox="0 0 16 16"
          className="bi bi-person-fill"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
          />
        </svg>
      </div>
      <h2 className="text-center mx-auto nombre-jugador" style={props.color}>
        {props.obj.username}
      </h2>
    </div>
  );
}
