import React from "react";
import Animation from "./animation";
import {
  Grid,
  Card,
  CardContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import MusicNoteSharpIcon from "@material-ui/icons/MusicNoteSharp";
import Buttons from "../Common/Buttons";
import { FormattedMessage } from "react-intl";
const useStyles = makeStyles({
  root: {
    backgroundColor: "#2f3137",
    height: "100%",
  },
  white: {
    color: "white",
    fontSize: "60px",
  },
});

const Positions = (props) => {
  const classes = useStyles();
  return (
    <>
      <Grid
        container
        justify="center"
        alignItems="center"
        item
        xs={12}
        className={classes.root}
      >
        <Buttons></Buttons>
        <Grid item container justify="center" alignItems="center" xs={12}>
          <MusicNoteSharpIcon className={classes.white} />
          <Typography className={classes.white} variant={"h1"}>
            Pogodi
          </Typography>
        </Grid>
        <Grid item container justify="center" alignItems="center" xs={12}>
          <Animation posiciones={props.posiciones} />
        </Grid>
      </Grid>
    </>
  );
};
export default Positions;
