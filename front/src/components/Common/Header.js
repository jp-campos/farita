import React, { useEffect, useState } from "react";
import {
  AppBar,
  Hidden,
  Grid,
  Button,
  MenuItem,
  Menu,
  Typography,
} from "@material-ui/core";
import Logo from "../../assets/Logo.png";
import MenuIcon from "@material-ui/icons/Menu";
import Login from "../Home/Login";
import { useParams } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Header = (props) => {
  const [openLogin, setOpenLogin] = useState(false);
  const [landingMenu, setLandingMenu] = useState(null);
  const { username } = useParams();
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    setUser(username);
  }, [username]);
  useEffect(() => {
    if (user) {
      props.setLoggedIn(true);
    } else {
      props.setLoggedIn(false);
    }
  }, [user]);
  return (
    <>
      <AppBar position="sticky" style={{ backgroundColor: "#000" }}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <img
              src={Logo}
              style={{ marginBottom: 10, marginTop: 10, marginLeft: 10 }}
              height={35}
              alt="logo"
            />
          </Grid>
          <Hidden xsDown>
            {!props.loggedIn && (
              <Grid item>
                <Grid container justify="flex-end">
                  <Grid item style={{ backgroundColor: "#E1F2D2", height: 55 }}>
                    <Button
                      style={{ height: 55, width: 190, borderRadius: 0 }}
                      onClick={() => setOpenLogin(true)}
                    >
                      <FormattedMessage id="Common.Header.start" />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Hidden>
          <Hidden smUp>
            <Grid item>
              <Button onClick={(ev) => setLandingMenu(ev.currentTarget)}>
                <MenuIcon fontSize="large" style={{ color: "#E1F2D2" }} />
              </Button>
            </Grid>
          </Hidden>
        </Grid>
        <Menu
          anchorEl={landingMenu}
          keepMounted
          open={Boolean(landingMenu)}
          onClose={() => setLandingMenu(null)}
        >
          <MenuItem
            onClick={() => {
              setLandingMenu(null);
              setOpenLogin(true);
            }}
          >
            <Typography component={"h1"}>
              {" "}
              <FormattedMessage id="Common.Header.start" />{" "}
            </Typography>
          </MenuItem>
        </Menu>
      </AppBar>
      <Login
        openLogin={openLogin}
        setLoggedIn={props.setLoggedIn}
        loggedIn={props.loggedIn}
        setOpenLogin={setOpenLogin}
      />
    </>
  );
};

export default Header;
