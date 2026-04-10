import { useEffect, useRef } from "react";
import * as d3 from "d3";

const ConnecticutVotesChart = () => {
  const chartRef = useRef(null);

  const data = [
    { state: "Connecticut", party: "Democratic", votes: 1813000 },
    { state: "Connecticut", party: "Republican", votes: 1160320 },
  ];

  useEffect(() => {
    const margin = { top: 20, right: 10, bottom: 30, left: 40 };

    const parentWidth = chartRef.current.parentElement.offsetWidth;
    const parentHeight = chartRef.current.parentElement.offsetHeight;

    const width = parentWidth - margin.left - margin.right;
    const height = parentHeight - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr("width", parentWidth)
      .attr("height", parentHeight)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const filteredData = data.filter((d) => d.state === "Connecticut");

    const candidates = d3.rollups(
      filteredData,
      (v) => d3.sum(v, (d) => d.votes),
      (d) => d.party
    );

    const x = d3
      .scaleBand()
      .domain(candidates.map((d) => d[0]))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(candidates, (d) => d[1]) * 1.1]) // Dynamically set max + 10%
      .nice()
      .range([height, 0]);

    svg
      .selectAll(".bar")
      .data(candidates)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d[0]) + (x.bandwidth() * 0.2))
      .attr("y", (d) => y(d[1]))
      .attr("width", x.bandwidth() * 0.6)
      .attr("height", (d) => height - y(d[1]))
      .attr("fill", (d) => (d[0] === "Republican" ? "red" : "#0000FF"));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style('font-size', '12px')
      .style('font-weight', 'bold')

    svg
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).ticks(5).tickFormat((d) => d / 1000000))
      .selectAll("text")
      .style("font-size", "9px");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -10)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-weight", "bold")
      .style("fill", "black")
      .style("font-family", "Arial, sans-serif")
      .text("Votes (millions) - Democratic vs Republican");


    const gridLines = d3
      .axisLeft(y)
      .tickSize(-width)
      .tickFormat("");

    svg
      .append("g")
      .attr("class", "grid")
      .call(gridLines);

    svg
      .selectAll(".grid line")
      .style("stroke", "grey")
      .style("stroke-width", 0.2);

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, [data]);

  return <svg ref={chartRef} style={{ width: "100%", height: "100%" }}></svg>;
};

export default ConnecticutVotesChart;
