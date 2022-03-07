import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Buttons from "../Common/Buttons";
import { Grid, Typography, ButtonBase } from "@material-ui/core";
import { FormattedMessage } from "react-intl";


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "#2f3137",
    minHeight: "100%",
  },
  imageSize: {
    width: "100%",
    position: "relative",
  },
  margin: {
    marginTop: "10px",
  },
  invisibleTex: {
    visibility: "hidden",
    opacity: 0,
  },
  white: {
    color: "white",
    fontSize: "60px",
  },
  overlayText:{
    position: "absolute",
    top: "80%",
    left: "50%",
    display: "inline-block",
    transform: "translate(-50%, -50%)" ,
    color: "white",
  },
}));

const Lobby = () => {
  const classes = useStyles();
  const { farita, username } = useParams();
  const [redirect, setRedirect] = useState(undefined);
  const images = [
    {
      url: "./assets/logopogodi.png",
      title: "pogodi",
      ref: `/${farita}/pogodi/${username}`,
    },
    {
      url: "./assets/logocategorias.jpg",
      title: "categories",
      ref: `/${farita}/categorias-explosivas/${username}`,
    },
    {
      url: "./assets/logovikingos.png",
      title: "vikings",
      ref: `/${farita}/Vikingos/${username}`,
    },
  ];
  return redirect ? (
    <Redirect to={redirect} />
  ) : (
    <>
      <Buttons />
      <Grid
        container
        justify="center"
        className={classes.root}
        alignItems="center"
      >
        <Grid item container justify="center" alignItems="center" xs={12}>
          <Typography variant={"h1"} className={classes.white}>
            <FormattedMessage id="Home.Looby.games" />
          </Typography>
        </Grid>
        {images.map((image) => (
          <Grid
            item
            container
            justify="center"
            className={classes.margin}
            xs={12}
            md={4}
          >
            <ButtonBase
              onClick={() => {
                setRedirect(image.ref);
              }}
              focusRipple
              key={"Home.Looby."+image.title} 
            >
              <img
                src={require(`${image.url}`)}
                className={classes.imageSize}
                alt={"Home.Looby."+image.title} 
              />
              <h1 className={classes.overlayText}><FormattedMessage id={"Home.Looby."+image.title}  /></h1>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Lobby;
