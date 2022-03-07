import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogTitle, DialogContent, TextField, Grid, Typography, Button } from "@material-ui/core";
import {Redirect} from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
const Login = (props) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [username, setUsername] = useState("");
  const intl = useIntl();

  useEffect(() => {
    setUsername("");
    setOpenDialog(props.openLogin);
  }, [props.openLogin]);
  const handleLogin = () =>{
      
    props.setLoggedIn(true);
      
  }
  return props.loggedIn? <Redirect to={`/create/${username}`}/> : (
    <Dialog
      open={openDialog}
      onClose={() => {
        props.setOpenLogin(false);
      }}
    >
      <DialogTitle>
        <Typography variant="h6">  <FormattedMessage id="Home.Login.logIn" />  </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid container justify="center">
          <Grid item container justify="center" xs={12}>
            <TextField aria-label="nombre de usuario" label= { intl.formatMessage({ id: 'Home.Login.user' })} variant="outlined" style={{ width: "80%" }} onChange={(event) => setUsername(event.target.value)} value={username} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
          <Button onClick={handleLogin}> <FormattedMessage id="Home.Login.start" />  </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Login;
