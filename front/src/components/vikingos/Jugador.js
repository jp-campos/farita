import React, { useEffect, useState } from "react";
import "./style.css";
import {turno} from "./Vikingos"


export default function Jugador(props) {
  const[botonDeshabilidado,setDeshabilitar]=useState(false)
  //console.log(botonDeshabilidado)
  let color = props.color
  useEffect(() => {
    if(!props.miTurno){
      setDeshabilitar(true)
    }else{
      setDeshabilitar(props.desabilitar)
    }
  },[props.miTurno,props.desabilitar])

  return (
    <div>
      <div className="botonesRemar">
        <input className="remar-derecha" id={props.idRD} type="checkbox" />
        <label className="remar-derecha" htmlFor={props.idRD} title = "Derecha"></label>
        <input className="remar-izquierda" id={props.idRI} type="checkbox" />
        <label className="remar-izquierda" htmlFor={props.idRI} title = "Izquierda"></label>
      </div>

      <button
        className="boton-jugador"
        id={props.id}
        onClick={()=>turno(props.color, props.id,props.idj)}
        disabled = {botonDeshabilidado}
        style={{backgroundColor:color}}
        title={props.id}
      ></button>
    </div>
  );
}
