import React, {useState, useEffect} from "react";
import InitialForm from "../components/Pogodi/InitialForm";
import {useParams} from "react-router-dom";
import Game from "../components/Pogodi/Game"
import socketIOClient from "socket.io-client";
import Positions from "../components/Pogodi/Positions";

const ENDPOINT = "https://farita-back.herokuapp.com/";
// const ENDPOINT = "127.0.0.1:8000/";
let socket = undefined;

const InitialPage = () =>{
    const {farita, username} = useParams();
    const [gameStart, setGameStart] = useState(false);
    const [gameFinished, setGameFinished] = useState(false);
    const [host, setHost] = useState(false);
    const[cancionesRonda, setCancionesRonda] = useState([]);
    const[cancionCor, setCancionCor] = useState(0);
    const[rondas, setRondas] = useState(-1);
    const [resultadosRondas, setResultadosRondas] = useState([]);
    const[cancion, setCancion] = useState("");
    const [posiciones, setPosiciones] = useState([]);
    useEffect(() => {
  
      let path = ENDPOINT +farita;
      if (process.env.NODE_ENV === "production") {
        path = ENDPOINT + farita;
      }
      
      socket = socketIOClient(path, {
        path: "/" + farita,
        query: { username: username, roomId: "canciones", options: "{}" },
      });
  
      //-----------------Los que reciben-----------------
      
      socket.on("game-started", () => {
        setGameStart(true);
        
      });
      socket.on("tu-turno", (canciones) => {
        
        setCancionesRonda (canciones.cancionesRonda);
        setCancionCor (canciones.correcta);
        setRondas(canciones.rondas);
        setCancion(canciones.cancion);
        setResultadosRondas(canciones.results);
      });
      socket.on("termino", (res)=>{
        setGameFinished(true);
        setPosiciones(res);
      });
      socket.on("siguiente-turno", (objeto) => {
        setCancion(undefined);
        
      });
  
      socket.on("host", () => {
        setHost(true);
      });
      
      return () => {
        socket.disconnect();
      };
    }, []);
    //-------------Los que envían------------
    const comenzarJuego = (url, rounds) => {
      if (socket) socket.emit("start-game", {"url": url, "rounds": rounds });
    }
    const enviarResultadoCancion = (correcta) =>{
      
      if  (socket){ 
        
        socket.emit("cancion", correcta)
        
      }
    }

    if(!gameStart && !gameFinished ){
      return <InitialForm comenzarJuego={comenzarJuego} host={host} /> ;
    }
    else if(gameStart && !gameFinished){
      return  <Game cancionesRonda={cancionesRonda} cancionCor={cancionCor} enviarResultadoCancion={enviarResultadoCancion}  rondas={rondas} resultadosRondas={resultadosRondas} cancion={cancion}/>
    }
    else if(gameFinished){
    return <Positions posiciones={posiciones}/>
    }
        
    
}
export default InitialPage