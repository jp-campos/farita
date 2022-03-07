import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const Animation = (props) => {
  //
  const divRef = useRef(null);
  useEffect(() => {
    if (props.posiciones.length !== 0) {
      const data = props.posiciones;

      const maxValue = Math.max.apply(
        Math,
        props.posiciones.map((o) => o.puntaje),
      );

      const colors = [
        "#4e79a7",
        "#f28e2c",
        "#e15759",
        "#76b7b2",
        "#59a14f",
        "#af7aa1",
        "#ff9da7",
        "#9c755f",
        "#bab0ab",
      ];

      console.log(
        "La resolución de tu pantalla es: " +
          window.innerWidth +
          " x " +
          window.innerHeight,
      );
      const width = window.innerWidth * 0.85;
      const height = window.innerHeight * 0.7;
      const margin = { top: 10, left: 10, bottom: 10, right: 10 };
      const iwidth = width - margin.left - margin.right;
      const iheight = height - margin.top - margin.bottom;

      const canvas = d3.select(divRef.current);

      const svg = canvas.append("svg");
      svg.attr("width", width);
      svg.attr("height", height);

      let g = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      const x = d3.scaleLinear().domain([0, maxValue]).range([0, iwidth]);

      const y = d3
        .scaleBand()
        .domain(data.map((d) => d.nombre))
        .range([0, iheight])
        .padding(0.1);

      const bars = g.selectAll("rect").data(data);

      bars
        .enter()
        .append("rect")
        .attr("id", (d) => d.nombre)
        .attr("class", "bar")
        .style("fill", (d, i) => colors[i])
        .attr("x", (d) => d.puntaje)
        .attr("y", (d) => y(d.nombre))
        .attr("height", y.bandwidth())
        .attr("width", (d) => 0);

      bars
        .enter()
        .append("text")
        .attr("id", (d) => `shots-${d.nombre}`)
        .attr("fill", "white")
        .attr("font-family", "sans-serif")
        .attr("font-size", 25)
        .text((d) => d.puntaje)
        .attr("x", (d) => 0)
        .attr("y", (d) => y(d.nombre))
        .attr("dy", y.bandwidth() / 2)
        .attr("dx", -50);

      bars
        .enter()
        .append("text")
        .attr("fill", "white")
        .attr("font-family", "sans-serif")
        .attr("font-size", 25)
        .text((d) => d.nombre)
        .attr("x", (d) => 10)
        .attr("y", (d) => y(d.nombre))
        .attr("dy", y.bandwidth() / 2);

      data.forEach(function (d) {
        d3.select(`#shots-${d.nombre}`)
          .transition()
          .attr("x", x(d.puntaje))
          .delay(1000)
          .duration(1000);

        d3.select(`#${d.nombre}`)
          .transition()
          .attr("width", x(d.puntaje))
          .delay(1000)
          .duration(1000);
      });
    }
  }, [props.posiciones]);

  return (
    <>
      <div ref={divRef}></div>
    </>
  );
};

export default Animation;
