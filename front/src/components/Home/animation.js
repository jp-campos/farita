import React, {Component} from "react";
import getSocket from '../Socket/Socket'
import * as d3 from "d3";

class Animation extends Component{

    componentDidMount(){

        const data = [
            {name: "Pipe", shots: 15},
            {name: "Nicolas", shots: 18},
            {name: "Sebastían", shots: 10},
            {name: "Lily", shots: 13},
            {name: "Sofia", shots: 9},
            {name: "Juan", shots: 7}
        ];
        this.drawChart(data);

    }

    drawChart(data){
        const colors = ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#af7aa1","#ff9da7","#9c755f","#bab0ab"]

        console.log("La resolución de tu pantalla es: " + window.innerWidth + " x " + window.innerHeight);
        const width = window.innerWidth*0.85;
        const height = window.innerHeight*0.70;
        const margin = {top:50, left: 10, bottom: 40, right:10};
        const iwidth = width - margin.left - margin.right;
        const iheight = height - margin.top - margin.bottom;

        const canvas = d3.select("#canvas");

        const svg = canvas.append("svg");
            svg.attr("width", width);
            svg.attr("height", height);

        let g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

        const x = d3.scaleLinear()
            .domain([0, 20])
            .range([0, iwidth]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, iheight])
            .padding(0.1);

        const bars = g.selectAll("rect").data(data);

        bars.enter()
            .append("rect")
            .attr("id", d => d.name)
            .attr("class", "bar")
            .style("fill", (d,i) =>colors[i])
            .attr("x", d => 0)
            .attr("y", d => y(d.name))
            .attr("height", y.bandwidth())
            .attr("width", d => 0 )

        bars.enter()
            .append("text")
            .attr("id", d => `shots-${d.name}`)
            .attr("fill", "white")
            .attr("font-family", "sans-serif")
            .attr("font-size", 25)
            .text(d => d.shots)
            .attr("x", d => 0)
            .attr("y", d => y(d.name))
            .attr("dy", y.bandwidth()/2)
            .attr("dx", -50)

        bars.enter()
            .append("text")
            .attr("fill", "white")
            .attr("font-family", "sans-serif")
            .attr("font-size", 25)
            .text(d => d.name)
            .attr("x", d => 10)
            .attr("y", d => y(d.name))
            .attr("dy", y.bandwidth()/2)
        
        data.forEach(function(d) {

            d3.select(`#shots-${d.name}`).transition()
            .attr("x", x(d.shots))
            .delay(1000)
            .duration(1000)
            

            d3.select(`#${d.name}`).transition()
            .attr("width", x(d.shots))
            .delay(1000)
            .duration(1000)
            

            
        })
        
    }

    render(){
        return (
            <>
                <div id="canvas"></div>
            </>
        )
    }
}

export default Animation;