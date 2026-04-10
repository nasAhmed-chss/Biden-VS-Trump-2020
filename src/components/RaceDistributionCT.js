import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import * as d3 from 'd3';

const RaceDistributionCT = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/data/connecticut_race_data')
      .then((response) => {
        const dataRetrieved = response.data;
        setData(dataRetrieved);
        console.log("CT race data: ", dataRetrieved);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    if (!data) return;

    const margin = { top: 25, right: 10, bottom: 20, left: 50 };
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
      .domain(data.map(d => d.race))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.percentage) * 1.1]) // Multiply by 1.1 to add some padding
      .range([height, 0])
      .nice();

    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.race))
      .attr('y', d => y(d.percentage))
      .attr('width', x.bandwidth() * 0.8)
      .attr('height', d => height - y(d.percentage))
      .attr('fill', 'purple');

    svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .attr('dy', '.35em')
      .attr('transform', 'rotate(0)')
      .style('text-anchor', 'center');

    svg
      .append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d => `${d}%`))
      .selectAll('text')
      .style('font-size', '12px');

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style("fill", "black")
      .style("font-family", "Arial, sans-serif")
      .text('Race Distribution in Connecticut (%)');

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
      d3.select(chartRef.current).selectAll('*').remove();
    };
  }, [data]);

  return <svg ref={chartRef} style={{ width: '100%', height: '100%' }}></svg>;
};

export default RaceDistributionCT;
