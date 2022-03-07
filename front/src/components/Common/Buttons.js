import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import HomeIcon from "@material-ui/icons/Home";
import MusicIcon from "@material-ui/icons/MusicNote";
import FoodIcon from "@material-ui/icons/LocalPizza";
import ChatIcon from '@material-ui/icons/Chat';
import BarChartIcon from '@material-ui/icons/BarChart';
import Drawer from "@material-ui/core/Drawer";
import { useParams } from "react-router-dom";
import Music from "./Music";
import Food from "./Food";
import Chat from "./Chat";
//import Graph from "./Graph";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      position: "fixed",
      margin: theme.spacing(2),
      zIndex: 2,
    },
  },
  button2: {
    marginTop: theme.spacing(12),
  },
  button3: {
    marginTop: theme.spacing(22),
  },
  button4: {
    marginTop: theme.spacing(32),
  },
  button5: {
    marginTop: theme.spacing(42),
  }
  
}));

export default function Buttons() {
  const [state, setState] = React.useState({
    music: false, 
    food: false,
  });
  let { farita, username } = useParams();
  

const list = (anchor) =>{ 
  if(anchor === "music") {
    return <Music/>
  }else if(anchor === "food"){
    return <Food />
  }else if(anchor === "chat"){
    return <Chat/>
   }

  // else if(anchor === "graph"){
    //return <Graph/>
   //}

  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const classes = useStyles();

  return (
    <section className={classes.root}>
      <Fab
        color="secondary"
        aria-label="home"
        href={`/lobby/${farita}/${username}`}
      >
        <HomeIcon />
      </Fab>

      <Fab
        color="secondary"
        aria-label="home"
        className={classes.button2}
        href={`/score-board/${farita}/${username}`}
      >
        <BarChartIcon />
      </Fab>

      <Fab
        onClick={toggleDrawer("music", true)}
        className={classes.button3}
        color="secondary"
        aria-label="edit"
      >
        <MusicIcon />
      </Fab>
      <Drawer
        anchor={"left"}
        open={state["music"]}
        onClose={toggleDrawer("music", false)}
      >
        {list("music")}
      </Drawer>
      <Fab
        onClick={toggleDrawer("food", true)}
        className={classes.button4}
        color="secondary"
        aria-label="edit"
      >
        <FoodIcon />
      </Fab>
      <Drawer
        anchor={"left"}
        open={state["food"]}
        onClose={toggleDrawer("food", false)}
      >
        <section> 
        {list("food")}
        </section>
      </Drawer>
      <Fab
        onClick={toggleDrawer("chat", true)}
        className={classes.button5}
        color="secondary"
        aria-label="edit"
      >
        <ChatIcon />
      </Fab>
      <Drawer
        anchor={"left"}
        open={state["chat"]}
        onClose={toggleDrawer("chat", false)}
      >
        {list("chat")}
      </Drawer>

    </section>
  );
}