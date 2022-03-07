import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
const useStyles = makeStyles((theme) => ({
  root: {
    width:"80%"
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function FoodCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.root} onClick={()=>window.open(props.src)} tabindex="0">
      <CardMedia
        className={classes.media}
        image={props.img}
        style={{ backgroundColor: props.color }}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {props.des}
        </Typography>
      </CardContent>
    </Card>
  );
}
