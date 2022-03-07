import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Buttons from "../Common/Buttons";
import Animation from "./animation";

import {Grid, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#2f3137",
        minHeight: "100%",
      },
    white: {
        color: "white",
        fontSize: "60px",
    },
    
  }));

export default function ScoreBoard() {

    const classes = useStyles();

    return(
        <>
            <Buttons />
            <Grid container justify="center" alignItems="center" className={classes.root}>
                <Typography variant={"h1"} className={classes.white}>
                    Número de shots
                </Typography>
                <Animation />
            </Grid>
        </>
    )
}