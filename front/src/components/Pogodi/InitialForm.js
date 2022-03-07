import React, { useState, useEffect } from "react";
import {
  Grid,
  makeStyles,
  TextField,
  Typography,
  ThemeProvider,
  createMuiTheme,
  Button,
} from "@material-ui/core";
import Buttons from "../Common/Buttons";
import Fallback from "../Common/Fallback";
import { FormattedMessage, useIntl  } from "react-intl";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#2f3137",
    height: "100%",
  },
  white: {
    color: "white",
    fontSize: "20px",
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
    color: "s",
  },
  width: {
    width: "30%",
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FFF",
    },
  },
});



const InitialForm = (props) => {
  const classes = useStyles();
  const [url, setUrl] = useState("");
  const [rounds, setRounds] = useState(0);
  const [isHost, setIsHost] = useState(false);
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  useEffect(() => {
    setIsHost(props.host);
  }, [props.host]);
  if (props.loading) {
    return <Fallback></Fallback>;
  } else if (isHost) {
    return (
      <Grid
        container
        justify="center"
        className={classes.root}
        alignItems="center"
      >
        <Buttons></Buttons>
        <Grid item container justify="center" alignItems="center">
          <img
            className="mb-5 img-fluid"
            src={require("./assets/logo-pogodi-grande.png")}
            alt="Banner pogodi"
          ></img>
        </Grid>
        <Typography className={classes.white} variant="h1">
          <FormattedMessage id="Pogodi.InitialForm.Guess" />
        </Typography>
        <Grid item container justify="center" xs={12}>
          <ThemeProvider theme={theme}>
            <TextField
              value={url}
              color="primary"
              onChange={(event) => {
                setUrl(event.target.value);
              }}
              FormHelperTextProps={{
                className: classes.formHelperText,
              }}
              InputProps={{
                className: classes.InputForm,
              }}
              InputLabelProps={{
                className: classes.formHelperText,
              }}
              inputProps={{
                "aria-label": intl.formatMessage({ id: 'Pogodi.InitialForm.url' }),
              }}
              className={classes.width}
              label= { intl.formatMessage({ id: 'Pogodi.InitialForm.url' })}
              helperText={ intl.formatMessage({ id: 'Pogodi.InitialForm.urlExplain' })}
            />
          </ThemeProvider>
        </Grid>

        <Grid item container justify="center" className={classes.mt} xs={12}>
          <ThemeProvider theme={theme}>
            <TextField
              value={rounds}
              color="primary"
              onChange={(event) => {
                setRounds(event.target.value);
              }}
              InputProps={{
                className: classes.InputForm,
              }}
              FormHelperTextProps={{
                className: classes.formHelperText,
              }}
              InputLabelProps={{
                className: classes.formHelperText,
              }}
              inputProps={{
                "aria-label":  intl.formatMessage({ id: 'Pogodi.InitialForm.rounds' }),
              }}
              error={rounds < 0}
              className={classes.width}
              type="number"
              label={ intl.formatMessage({ id: 'Pogodi.InitialForm.rounds' })}
              helperText={
                rounds >= 0
                  ? intl.formatMessage({ id: 'Pogodi.InitialForm.roundExplain' })
                  : intl.formatMessage({ id: 'Pogodi.InitialForm.roundError' })
              }
            />
          </ThemeProvider>
        </Grid>
        <Grid item xs={12} container justify="center" className={classes.mt}>
          <Button
            variant="contained"
            className={classes.spotify}
            onClick={() => {
              if(rounds>0){

                props.comenzarJuego(url, rounds);
              }
              else{
                setOpen(true)
              }
            }}
          >
            <FormattedMessage id="Pogodi.InitialForm.play" />
          </Button>
        </Grid>
        
      </Grid>
    );
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
          <img
            className="mb-5 img-fluid"
            src={require("./assets/logo-pogodi-grande.png")}
            alt="Banner pogodi"
          ></img>
        </Grid>
        <Grid item xs={12} container justify="center" className={classes.mt}>
          <ThemeProvider theme={theme}>
            <Typography className={classes.white} variant="h1">
              <FormattedMessage id="Pogodi.InitialForm.wait" />
            </Typography>
          </ThemeProvider>
        </Grid>
      </Grid>
    );
  }
};

export default InitialForm;
