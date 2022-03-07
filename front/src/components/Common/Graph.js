import { makeStyles, createMuiTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { color } from "d3";

const useStyles = makeStyles( (theme) => ({
    root: {
        backgroundColor: "#363940",
        width: '100%',
    },
    
    textoBlanco: {
        color: "white",
    },
    slider: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(2),
    }
  }));

export default function Graph(props)
 {
  const classes = useStyles();

  const data = [
    {game: "Categorias", score: 5},
    {game: "Pogodi", score: 6},
    {game: "Vikingos", score: 2}
];

  const canvas = d3.select("#canvas");

  const width = 500;
  const height = 300;
  const margin = { top: 10, left: 80, bottom: 40, right: 10 };
  const iwidth = width - margin.left - margin.right;
  const iheight = height - margin.top - margin.bottom;


  const svg = canvas.append("svg");
  svg.attr("width", width);
  svg.attr("height", height);

  let g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

   const y = d3.scaleLinear() 
  .domain([0, 20])
  .range([iheight, 0]);

const x = d3.scaleBand()
.domain(data.map(d => d.game) ) 
.range([0, iwidth])
.padding(0.1); 

const bars = g.selectAll("rect").data(data);

bars.enter().append("rect")
.attr("id", d=>d.game)
.attr("class", "bar")
.style("fill", "steelblue")
.attr("x", d => x(d.game))
.attr("y", d => y(d.score))
.attr("height", d => iheight - y(d.height))
.attr("width", x.bandwidth())  

g.append("g")
.classed("x--axis", true)
.call(d3.axisBottom(x))
.attr("transform", `translate(0, ${iheight})`);  

g.append("g")
.classed("y--axis", true)
.call(d3.axisLeft(y));


  return(
      <div className="body-music d-flex flex-column">
              <div className="d-flex justify-content-center"  >
                  <h3 className="texto-blanco ">Estádisticas partidas </h3>
                  <div id="canvas">
              </div>
              </div>            
      </div>
  )

}