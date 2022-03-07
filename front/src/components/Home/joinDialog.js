import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import "./styleInicio.css";
import { useParams, Redirect } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const JoinDialog = (props) => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { username } = useParams();
  useEffect(() => {
    setOpen(props.openDialog);
  }, [props.openDialog]);

  const handleClose = () => {
    setRedirect(true);
    props.setOpenDialog(false);
  };

  return redirect ? (
    <Redirect to={`/lobby/${id}/${username}`} />
  ) : (
    <Dialog role="dialog" open={open} onClose={handleClose}>
      <DialogTitle>
        <FormattedMessage id="Home.joinDialog.title" />
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormattedMessage id="Home.joinDialog.code" />
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="roomId"
          label="Room Id"
          fullWidth
          value={id}
          onChange={(event) => setId(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button
          className="button"
          onClick={handleClose}
          color="primary"
          autoFocus
        >
          <FormattedMessage id="Home.joinDialog.enter" />
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default JoinDialog;
