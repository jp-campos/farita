import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    maxWidth: "365px",
    maxHeight: "100px",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: 151,
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function MediaControlCard(props) {
  const classes = useStyles();
  const handleCorrect = () => {
    if (props.index === props.correcta) props.enviarResultadoCancion(1);
    else props.enviarResultadoCancion(0);
  };
  return (
    <Card className={classes.root} onClick={handleCorrect}>
      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography>{props.nombre}</Typography>
          <Typography color="textSecondary">{props.artista}</Typography>
        </CardContent>
      </div>
      <CardMedia
        className={classes.cover}
        image={props.img}
        title="Live from space album cover"
      />
    </Card>
  );
}
