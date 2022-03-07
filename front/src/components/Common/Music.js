import { makeStyles, Grid, Button, Slider, Input, List, ListItem, ListItemText, createMuiTheme, ThemeProvider, setRef } from "@material-ui/core";
import AudioPlayer from 'material-ui-audio-player';
import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";


import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';

import BackIcon from '@material-ui/icons/SkipPreviousRounded';
import PlayIcon from '@material-ui/icons/PlayArrowRounded';
import PauseIcon from '@material-ui/icons/PauseRounded';
import NextIcon from '@material-ui/icons/SkipNextRounded';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import AddIcon from '@material-ui/icons/Add';
import SendIcon from '@material-ui/icons/Send';
import { FormattedMessage } from "react-intl";

import './musicStyles.css'

const biblioteca = [
    {
        nombre:"Bohemian Rhapsody",
        autor: "Queen",
        tiempo: "5:59",
        sec: 359
    },
    {
        nombre:"Liar",
        autor: "Camila Cabello",
        tiempo: "3:27",
        sec: 208
    },
    {
        nombre:"Persiana Americana",
        autor: "Soda Stereo",
        tiempo: "4:52",
        sec: 359
    },
    {
        nombre:"Causa Perdida",
        autor: "Morat",
        tiempo: "3:40",
        sec: 359
    },
    {
        nombre:"Amor Prohibido",
        autor: "Selena",
        tiempo: "2:44",
        sec: 359
    },
    {
        nombre:"Carita Bonita",
        autor: "Lil Silvio & El Vega",
        tiempo: "2:54",
        sec: 359
    },
    {
        nombre:"La hormiguita",
        autor: "Juan L.Guerra",
        tiempo: "3:04",
        sec: 359
    },
    {
        nombre:"Las Cosas de la Vida",
        autor: "Carlos Vives",
        tiempo: "3:27",
        sec: 359
    },
    {
        nombre:"Hymn for the Weekend",
        autor: "Coldplay, Seeb",
        tiempo: "3:32",
        sec: 359
    },
    {
        nombre:"Todo Cambió",
        autor: "Camila",
        tiempo: "3:13",
        sec: 359
    },
    {
        nombre:"Dejaría Todo",
        autor: "chayanne",
        tiempo: "4:43",
        sec: 359
    }
    
]

var blankSong = {
    nombre:"----",
    autor: "--",
    tiempo: "00:00",
    sec: 0
}

var can_busqueda = [
]

var index_act = 0;

var canciones_espera = [
    {
        id:0,
        nombre:"Bohemian Rhapsody",
        autor: "Queen",
        tiempo: "5:59",
        sec: 359
    },
    {
        id:1,
        nombre:"Liar",
        autor: "Camila Cabello",
        tiempo: "3:28",
        sec: 208
    },
    {
        id:2,
        nombre:"Persiana Americana",
        autor: "Soda Stereo",
        tiempo: "4:52",
        sec: 359
    },
    {
        id:3,
        nombre:"Causa Perdida",
        autor: "Morat",
        tiempo: "3:40",
        sec: 359
    },
    {
        id:4,
        nombre:"Causa Perdida",
        autor: "Morat",
        tiempo: "3:40",
        sec: 359
    },
    {
        id:5,
        nombre:"Causa Perdida",
        autor: "Morat",
        tiempo: "3:40",
        sec: 359
    },
    {
        id:6,
        nombre:"Causa Perdida",
        autor: "Morat",
        tiempo: "3:40",
        sec: 359
    },
    {
        id:7,
        nombre:"Causa Perdida",
        autor: "Morat",
        tiempo: "3:40",
        sec: 359
    },
    {
        id:8,
        nombre:"Causa Perdida",
        autor: "Morat",
        tiempo: "3:40",
        sec: 359
    }

]

var canciones_pasadas =[];

const useStyles = makeStyles( (theme) => ({
    root: {
        backgroundColor: "#363940",
        width: '100%',
    },
    list: {
        backgroundColor: "#363940",
        height:"100%",
    },
    textoBlanco: {
        color: "white",
    },
    slider: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    },
    musicList: {
        height: 500,
        marginLeft: theme.spacing(2),
    },
    closeButton:{
        position: "fixed",
        top: theme.spacing(1),
        left: 430,
        color: "white",
    }
  }));

export default function Music(props) {
    const [listaCanciones, setCanciones] = useState(canciones_espera);
    const [index, setIndex] = useState(index_act);
    const [actu, refresh] = useState(false);
    const [listaPasadas, setAnteriores] = useState(canciones_pasadas);
    const [listaBusqueda, setBusqueda] = useState(can_busqueda);
    const [paused, setPaused] = useState(true);
    const [editing, setEdit] = useState(false);
    const [buscanding, setBuscando] = useState(false);
    const classes = useStyles();
    const [value, setValue] = useState("00:00");
    const [visible, setVisible] = useState(true);



    const muiTheme = createMuiTheme({});

    useEffect(() => {
        setCanciones(listaCanciones);
        setAnteriores(listaPasadas);
    }, [canciones_espera, canciones_pasadas])

    function closeMusic() {
        console.log("cerrar")
    }

    function editPlayList() {
        setEdit(!editing);
    }

    function siguienteCancion() {
        if(index_act < canciones_espera.length - 1){
            index_act += 1;
            setIndex(index_act);
        }
    }

    function anteriorCancion() {
        if(index_act >0 ){
            index_act -= 1;
            setIndex(index_act);
        }
    }

    function pausarCancion() {
        setPaused(!paused);
        console.log(paused)
    }

    function moverArriba(pos){
        if(pos > index + 1){
            var temp = canciones_espera[pos - 1];
            temp.id = pos;
            canciones_espera[pos -1] = canciones_espera[pos];
            canciones_espera[pos - 1].id = pos -1;
            canciones_espera[pos] = temp
        }
        setCanciones(canciones_espera);
        refresh(!actu);
    }

    function moverAbajo(pos){
        if(pos < canciones_espera.length - 1){
            var temp = canciones_espera[pos + 1]
            temp.id = pos;
            canciones_espera[pos + 1] = canciones_espera[pos];
            canciones_espera[pos + 1].id = pos + 1;
            canciones_espera[pos] = temp;
        }
        setCanciones(canciones_espera);
        refresh(!actu);
    }

    function eliminar(index) {
        canciones_espera.splice(index,1)
        for(var i = index; i < canciones_espera.length; i++){
                canciones_espera[i].id = i;
        }        
        setCanciones(canciones_espera);
        refresh(!actu);
        
    }

    function agregarCancion(){

    }

    const cred = "AIzaSyDpfXopNsWrgWsRKWNF8c-MxKQZ2itj7Cg"

    function buscar() {

        var input = document.getElementById("inputSearch");

        const https = require('https');

        can_busqueda = [];
        
        let req = `https://www.googleapis.com/youtube/v3/search?part=id&part=snippet&type=video&q=${input.value}&key=${cred}&maxResults=5`;

        https.get(req, (resp) => {
            let data = "";
            resp.on("data", (chunk) => {
                data += chunk;
            });
            resp.on("end", () => {

                let dData = JSON.parse(data);
                let songs = dData.items;
                for(let i = 0; i < songs.length; i++){
                    var temp = {
                        autor : songs[i].snippet.channelTitle,
                        nombre: songs[i].snippet.title,
                    }
                    can_busqueda.push(temp)
                }
                console.log(songs)
                console.log(can_busqueda);
                let title = dData.items[0].snippet.title;
                let vId = dData.items[0].id.videoId;
                setBusqueda(can_busqueda);
                setBuscando(true);
                refresh(!actu)
                
            })

        }).on("error", (err)=> {
            console.log(err.message);
        })

    }

    function noBuscando () {
        
        can_busqueda = [];
        var input = document.getElementById("inputSearch");
        input.setValue = "";
        setBuscando(false);
    }

    const handleSliderChange = (event, newValue) => {
        setValue(newValue);
      };

    const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    return(
        <div className="body-music d-flex flex-column">

            <div className="player-music">
                <div className="d-flex justify-content-center"  >
                    <h1 className="texto-blanco titulo-musica">Far-ita Music</h1>
                </div>
                <div>
                    <h2 className="texto-blanco">{canciones_espera[index].nombre}</h2>
                    <h3 className="texto-blanco">{canciones_espera[index].autor}</h3>
                    <div className="d-flex justify-content-center">
                        <button
                            type="button"
                            class="btn"
                            aria-label="Anterior"
                            onClick={()=> anteriorCancion()}> <BackIcon/> 
                        </button>
                        <button 
                            type="button"
                            class="btn"
                            aria-label={(paused)? "Reproducir": "Pausar"}
                            onClick={()=> pausarCancion()}> {(paused)? <PlayIcon/>:<PauseIcon/>} 
                        </button>
                        <button
                            type="button"
                            class="btn"
                            aria-label="Siguiente"
                            onClick={()=> siguienteCancion()}> <NextIcon/> 
                        </button>
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <p className="texto-blanco">00:00</p>
                    <p className="texto-blanco">{canciones_espera[index].tiempo }</p>
                </div>
                <div className="d-flex justify-content-between">
                    <input aria-label="scroll musica" type="range" min="1" max={canciones_espera[index].sec}  class="slider" id="myRange"/>
                </div>
            </div>
            <div className="d-flex justify-content-between music-content">
                    <h3 className="texto-blanco">Lista de reproducción</h3>
                    <button
                        type="button"
                        class="btn"
                        aria-label={(editing)? "Editar lista": "Terminar editar"}
                        onClick={()=> editPlayList()}> {(editing)? <CloseIcon fontSize="small"/> : <EditIcon fontSize="small"/>}  </button>
                </div>
            <div tabindex="0" className="list-music music-content">
                <List cointainer  >
                        {
                            listaCanciones.map( function(x) {
                                if(x.id > index && x.id != listaCanciones.length -1){
                                    return(
                                            <ListItem alignItems="center" className={classes.textoBlanco}>
                                                <ListItemText
                                                    primary={<span className="cancion-title">{x.nombre}</span>}
                                                    secondary={<span className="span">{x.autor}</span>}
                                                >
                                                    
                                                </ListItemText>
                                                <p className={classes.textoBlanco}></p>
                                                {(editing)? 
                                                    <React.Fragment>
                                                            <button 
                                                                type="button"
                                                                class="btn"
                                                                aria-label={"eliminar " + x.nombre}
                                                                onClick={()=> eliminar(x.id)}> <DeleteOutlineIcon fontSize="small"/> 
                                                            </button>
                                                            <div className="d-flex flex-column">
                                                                <button
                                                                    type="button"
                                                                    class="btn" 
                                                                    aria-label={"subir " + x.nombre}
                                                                    onClick={()=> moverArriba(x.id)}> <ArrowDropUpIcon fontSize="small"/> 
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    class="btn"
                                                                    aria-label={"bajar " + x.nombre}
                                                                    onClick={()=> moverAbajo(x.id)}> <ArrowDropDownIcon fontSize="small"/> 
                                                                </button>
                                                                
                                                            </div>
                                                                                                                    
                                                    </React.Fragment>: ""}
                                            </ListItem>
                        
                                    );
                                }
                        })}
                        
                    </List>
            </div>
            <div className="d-flex justify-content-center music-content">
                <InputBase
                    id="inputSearch"
                    autoComplete="off"
                    className="input-chat"
                    placeholder="Buscar canción"
                    inputProps={{ 'aria-label': 'search google maps' }}
                />

                <button type="button" class="btn"  type="submit" className={classes.iconButton} aria-label="buscar" onClick={()=> buscar()}>
                <SearchIcon />
                </button>
                {(buscanding)? 
                    <React.Fragment>
                        <Divider className={classes.divider} orientation="vertical" />
                        <button type="button" class="btn" className={classes.iconButton} aria-label="cerrar busqueda" onClick={()=> noBuscando()}> <CloseIcon fontSize="small"/></button>
                    </React.Fragment>:"" }

                
                </div>
                <div className="list-music">
                    {(buscanding)? <React.Fragment>
                        <List>
                        {
                            listaBusqueda.map( function(x) {
                                console.log(x)
                                    return(
                                            <ListItem alignItems="center" className={classes.textoBlanco}>
                                                <ListItemText
                                                    primary={x.nombre}
                                                    secondary={<span className="span">{x.autor}</span>}
                                                >
                                                    
                                                </ListItemText>
                                                <p className={classes.textoBlanco}></p>
                                                    <button 
                                                        aria-label={"agregar cancion " + x.nombre} 
                                                        type="button"
                                                        class="btn"
                                                        onClick={()=> eliminar(x.id)}> <AddIcon fontSize="small"/> 
                                                    </button>
                                            </ListItem>
                        
                                    );
                                
                        })}
                        
                    </List>
                    </React.Fragment>: ""}
            </div>
            
        </div>
    )
}
