import React from "react";
import {Grid, Typography, makeStyles} from "@material-ui/core"
import FoodCard from "./FoodCard";
import { FormattedMessage, useIntl } from "react-intl";
const useStyles = makeStyles({
    texto:{
        fontSize: "40px",
        color: "black"
    },
    list: {
      width: 350,
    },
    fullList: {
      width: 'auto',
    },
    marginTop:{
        marginTop:"10px"
    }
  });
  
const Food = () =>{
    const intl = useIntl();
    const restaurantes = [
        {
           img: "https://cleverlynk-imgs.s3.amazonaws.com/bannersModal/9dc56261-31e6-490d-96ef-f684a1a33c2e",
           des: intl.formatMessage({id:"Common.Food.Pacific"}),
           src: "https://clynk.me/pacific-/6nEzDiEKlI/redirect",
           color: "white",
       },
        {
           img: "https://cleverlynk-imgs.s3.amazonaws.com/resized-logos/resized-150-remo-01.png",
           des: intl.formatMessage({id:"Common.Food.Remo"}),
           src: "https://clynk.me/remo/6I8V4BD14W",
           color: "#000000",
       },
        {
           img: "https://cleverlynk-imgs.s3.amazonaws.com/logos/2506201506226wr7TT",
           des: intl.formatMessage({id:"Common.Food.Shoyu"}),
           src: "https://clynk.me/shoyu/HddQHUSgTL",
           color: "#293541",
       },
   
        {
           img: "https://cleverlynk-imgs.s3.amazonaws.com/logos/110820170814nrKuVR",
           des: intl.formatMessage({id:"Common.Food.Parrilla"}),
           src: "https://clynk.me/laparrilla/GRcVlkMqXl",
           color: "#170F11",
       },
        {
           img: "https://cleverlynk-imgs.s3.amazonaws.com/resized-logos/resized-150-270520150543K2MUUR.png",
           des: intl.formatMessage({id:"Common.Food.Hakims"}),
           src: "https://clynk.me/hakims-pastry/oVmwtv9lY7",
           color: "white",
       },
        {
           img: "https://cleverlynk-imgs.s3.amazonaws.com/logos/1205202305989ktfce.png",
           des: intl.formatMessage({id:"Common.Food.Crepes"}),
           src: "https://clynk.me/Crepes-Waffles/ErQEy1jPfV",
           color: "#53352A",
       },
     ];
   

    const classes = useStyles();
    return(
        <Grid container justify="center" className={classes.list}>
        <Grid item xs={12} container justify="center" className={classes.marginTop}>
            <Typography variant={"h1"} className={classes.texto}><FormattedMessage id="Common.Food.Restaurants"/></Typography>
        </Grid>    
        {restaurantes.map((r,i)=> (
            <Grid item xs ={12} key={i} container justify="center" className={classes.marginTop}>
            <FoodCard {...r}/>
            </Grid>
        )
        )}
        </Grid>
    )
}
export default Food