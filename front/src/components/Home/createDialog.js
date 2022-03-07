import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import {Typography} from "@material-ui/core";
import {Redirect, useParams} from "react-router-dom";
import { FormattedMessage } from "react-intl";

const CreateDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [redirect, setRedirect] = useState(false);
  const {username} = useParams();

  useEffect(()=>{
    let result = "";
    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setId(result);
    setOpen(props.openDialog)
  },[props.openDialog])

  const handleClose = () => {
    props.setOpenDialog(false);
    setRedirect(true);
  };

  return redirect? <Redirect to={`/lobby/${id}/${username}`}/> : (
        <Dialog role = "dialog"
        open={open}
        onClose={handleClose}>
        <DialogTitle>
          <Typography className="codigo" component={'span'} variant="h6"> <FormattedMessage id="Home.joinDialog.title" /> </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="id" justify="center">
          <FormattedMessage id="Home.createDialog.title" /> {id} 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="button" onClick={handleClose} color="primary" autoFocus>
          <FormattedMessage id="Home.joinDialog.enter" />
          </Button>
        </DialogActions>
        </Dialog>
  );
};
export default CreateDialog;