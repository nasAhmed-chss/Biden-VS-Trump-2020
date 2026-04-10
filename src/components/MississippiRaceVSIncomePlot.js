import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import axios from "axios";

const MississippiRaceVSIncomePlot = ({ size }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/data/MS_RaceVSIncome");
        const data = response.data;

        if (!data || data.length === 0) {
          console.warn("No data available to display.");
          return;
        }

        const margin = { top: size * 0.1, right: size * 0.075, bottom: size * 0.15, left: size * 0.15 };
        const width = size - margin.left - margin.right;
        const height = size * 0.75 - margin.top - margin.bottom;

        d3.select(chartRef.current).selectAll("*").remove();

        const svg = d3
          .select(chartRef.current)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3
          .scaleBand()
          .range([0, width])
          .domain(data.map((d) => d.race))
          .paddingInner(1)
          .paddingOuter(0.5);

        const xAxis = d3.axisBottom(x).ticks(5);
        svg
          .append("g")
          .attr("transform", `translate(0, ${height})`)
          .call(xAxis)
          .selectAll("text")
          .style("font-weight", "bold");

        const y = d3
          .scaleLinear()
          .domain([0, 100000])
          .range([height, 0]);

        const yAxis = d3.axisLeft(y).ticks(5);
        svg
          .append("g")
          .call(yAxis)
          .selectAll("text")
          .style("font-weight", "bold");

        svg
          .append("g")
          .attr("class", "grid")
          .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""))
          .style("stroke-dasharray", "3,3")
          .style("color", "lightgray");




        svg
          .selectAll("vertLines")
          .data(data)
          .enter()
          .append("line")
          .attr("x1", (d) => x(d.race))
          .attr("x2", (d) => x(d.race))
          .attr("y1", (d) => y(d.min))
          .attr("y2", (d) => y(d.max))
          .attr("stroke", "grey");

        const boxWidth = (width / data.length) * 0.5;

        svg
          .selectAll("boxes")
          .data(data)
          .enter()
          .append("rect")
          .attr("x", (d) => x(d.race) - boxWidth / 2)
          .attr("y", (d) => y(d.q3))
          .attr("height", (d) => y(d.q1) - y(d.q3))
          .attr("width", boxWidth)
          .attr("stroke", "grey")
          .style("fill", "#3CB371");

        svg
          .selectAll("medianLines")
          .data(data)
          .enter()
          .append("line")
          .attr("x1", (d) => x(d.race) - boxWidth / 2)
          .attr("x2", (d) => x(d.race) + boxWidth / 2)
          .attr("y1", (d) => y(d.median))
          .attr("y2", (d) => y(d.median))
          .attr("stroke", "grey");

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", -margin.top / 2)
          .attr("text-anchor", "middle")
          .style("font-size", `${size * 0.05}px`)
          .style("font-weight", "bold")
          .style("fill", "black")
          .style("font-family", "Arial, sans-serif")
          .text("Household Income by Race");

        svg
          .append("text")
          .attr("x", width / 2)
          .attr("y", height + margin.bottom * 0.5)
          .attr("text-anchor", "middle")
          .style("font-size", `${size * 0.04}px`)
          .style("font-weight", "bold")
          .style("fill", "black")
          .text("Race");

        svg
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", -margin.left * 0.7)
          .attr("x", -height / 2)
          .attr("text-anchor", "middle")
          .style("font-size", `${size * 0.04}px`)
          .style("font-weight", "bold")
          .style("fill", "black")
          .text("Income ($)");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, [size]);

  return (
    <div style={{ overflowX: "hidden" }}>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default MississippiRaceVSIncomePlot;
