import { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import axios from 'axios';

const IncomeDataCT = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState(null);
  const [title, setTitle] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8080/api/data/connecticut_income_data')
      .then((response) => {
        const dataRetrieved = response.data;
        setData(dataRetrieved.data);
        setTitle(dataRetrieved.title);
        setColor(dataRetrieved.color);
        console.log("CT income data: ", dataRetrieved);
      })
      .catch((error) => {
        console.error('Error fetching Connecticut income data:', error);
      });
  }, []);

  useEffect(() => {
    if (!data) return;
    if (!title) return;
    if (!color) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 60 };
    const parentWidth = chartRef.current.parentElement.offsetWidth;
    const parentHeight = chartRef.current.parentElement.offsetHeight;
    const width = parentWidth - margin.left - margin.right;
    const height = parentHeight - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', parentWidth)
      .attr('height', parentHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleBand()
      .domain(data.map(d => d.incomeGroup))
      .range([0, width])
      .padding(0.2);

    const maxPercentage = d3.max(data, d => d.percentage);
    const adjustedMax = Math.min(100, Math.ceil((maxPercentage + 5) * 10) / 10);

    const y = d3
      .scaleLinear()
      .domain([0, adjustedMax])
      .range([height, 0])
      .nice();

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.incomeGroup))
      .attr('y', d => y(d.percentage))
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.percentage))
      .attr('fill', color);

    svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-weight', 'bold')
      .style('font-size', '12px');

    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .selectAll('text')
      .style('font-size', '10px');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style("fill", "black")
      .style("font-family", "Arial, sans-serif")
      .text(title);

    const gridLines = d3.axisLeft(y)
      .tickSize(-width)
      .tickFormat("");

    svg.append("g")
      .attr("class", "grid")
      .call(gridLines);

    svg.selectAll(".grid line")
      .style("stroke", "grey")
      .style("stroke-width", 0.2);

    return () => {
      d3.select(chartRef.current).selectAll("*").remove();
    };
  }, [data, title, color]);

  return <svg ref={chartRef} style={{ width: '100%', height: '100%' }}></svg>;
};

export default IncomeDataCT;
