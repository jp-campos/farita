import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import MediaControlCard from "./MusicCard";
import Fallback from "../Common/Fallback";
import MusicNoteSharpIcon from "@material-ui/icons/MusicNoteSharp";
import Buttons from "../Common/Buttons";
import "./style.css";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#2f3137",
    minHeight: "100%",
  },
  white: {
    color: "white",
    fontSize: "60px",
  },
  subtitle: {
    color: "white",
    fontSize: "40px",
  },
  mt: {
    marginTop: "10px",
  },
  formHelperText: {
    color: "white",
  },
  InputHelperText: {
    color: "white",
  },
  InputForm: {
    color: "white",
    borderBottom: "2px solid white",
  },
  spotify: {
    backgroundColor: "#1bd75f",
    color: "white",
  },
  width: {
    width: "30%",
  },
});

const Game = (props) => {
  const classes = useStyles();
  const [cancionesRonda, setCancionesRonda] = useState([]);
  const [rondas, setRondas] = useState(-1);
  const [cancion, setCancion] = useState(undefined);
  const [correcta, setCorrecta] = useState(-1);
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    setCancionesRonda(props.cancionesRonda);
    setRondas(props.rondas);
    setCancion(props.cancion);
    setCorrecta(props.cancionCor);
    setResultados(props.resultadosRondas);
  }, [
    props.cancionesRonda,
    props.rondas,
    props.cancion,
    props.resultadosRondas,
    props.cancionCor
  ]);

  if (cancionesRonda === [] || rondas === -1) {
    return <Fallback />;
  } else {
    return (
      <Grid
        container
        justify="center"
        className={classes.root}
        alignItems="center"
      >
        <Buttons></Buttons>
        <Grid item container justify="center" alignItems="center">
          
          <MusicNoteSharpIcon className={classes.white} />
          <Typography className={classes.white} variant={"h1"}>
            Pogodi
          </Typography>
        </Grid>
        <Grid item xs={12} container justify="center" alignItems="center">
          <Typography className={classes.subtitle} variant={"h2"}>
            <FormattedMessage id="Pogodi.Game.rounds" /> {rondas}
          </Typography>
        </Grid>
        <Grid item container justify="space-evenly" alignItems="center" xs={12}>
          {resultados.map((resultado) => (
            <Grid item>
              <span
                className={
                  !resultado.played
                    ? "notPlayedYet"
                    : resultado.correct
                    ? "success"
                    : "error"
                }
              />
            </Grid>
          ))}
        </Grid>
        <Grid
          item
          container
          justify="center"
          className={classes.mt}
          xs={12}
          spacing={4}
        >
          {cancionesRonda.map((r, i) => (
            <Grid item container justify="center" xs={12} sm={6} key={i}>
              <MediaControlCard
                {...r}
                correcta={correcta}
                index={i}
                enviarResultadoCancion={props.enviarResultadoCancion}
              />
            </Grid>
          ))}
        </Grid>
        {cancion && (
          <audio autoPlay>
            <source src={cancion} type="audio/mpeg" />
          </audio>
        )}
      </Grid>
    );
  }
};
export default Game;
