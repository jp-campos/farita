import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import letrero from "./assets/letrero.png";
import "./styleInicio.css";
import CreateDialog from "../Home/createDialog";
import JoinDialog from "../Home/joinDialog";
import {useParams} from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Create = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openJoin, setOpenJoin] = useState(false);
  const {username} = useParams();
  
  return (
    <Grid container={true} justify="center" className="main">
      <Grid item xs={12} className="image">
        <img
        className="image"
          src={letrero}
          style={{ marginBottom: 100, marginTop: 40, width:"40%" }}
          alt="img"
        />
      </Grid>
      <Container className="container">
        <Grid container={true} className="create">
          <Typography
            className="create-farita"
            component="h1"
            variant="h2"
            onClick={() => setOpenCreate(true)}
          >
            {" "}
            <FormattedMessage id="Home.Create.create" />{" "}
          </Typography>
        </Grid>
      </Container>
      <Container className="container">
        <Grid container={true} className="create">
          <Typography
            className="join-farita"
            component="h1"
            variant="h2"
            onClick={() => setOpenJoin(true)}
          >
            {" "}
            <FormattedMessage id="Home.Create.join" />{" "}
          </Typography>
        </Grid>
      </Container>
      <CreateDialog className="createDialog" openDialog={openCreate} setOpenDialog={setOpenCreate} />
      <JoinDialog className="joinDialog" openDialog={openJoin} setOpenDialog={setOpenJoin} />
    </Grid>
  );
};
export default Create;
