import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { makeStyles } from "@material-ui/core/styles";
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
export default function SalaDeEspera(props) {
  const intl = useIntl();
  const classes = useStyles();
return (
    <div className="container sala-espera">
      <div className={classes.container}>
        <img className="mb-5 img-fluid" src={require(props.img)}></img>
        <h1 className={classes.overlayText}><FormattedMessage id={"Home.Looby.vikings"}  /></h1>
        </div>
        <h3 className= "texto-como-jugar"><FormattedMessage id="Vikingos.Vikingos.BeginGame"/></h3>
        <p className = "texto-descripcion">{props.mensaje}</p>

        <p className ="text-esperando saving"><FormattedMessage id="Vikingos.Vikingos.WaitingPlayers"/><span>. </span><span>. </span><span>. </span></p>
        {props.jugadores.map(function (j,i) {
          let lider = j.leader? intl.formatMessage({id:"Vikingos.Vikingos.Leader"}) :''
          let inline = j.leader?'d-inline' :''
        
        return <span key={i}><h3 className="d-inline text-lider ">{lider}  </h3><h3 className={inline} style={props.colores[i]}>{j.username}</h3></span>
        })}

        <button className="btn btn-light my-4 " onClick={() => props.callBackComenzar()}> COMENZAR JUEGO</button>
    </div>
    );
}