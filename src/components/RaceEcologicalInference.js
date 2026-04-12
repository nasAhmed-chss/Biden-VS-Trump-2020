import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const RaceEcologicalInference = ({ state, party, populationType, region }) => {
    const chartRef = useRef();

    useEffect(() => {
        // Fetch the JSON data
        axios
            .get('/api/data/RaceEcoInferenceData')
            .then((response) => {
                const data = response.data[state];
                if (party == "Democrat") {

                    renderChart(data.Biden); // Pass only Biden's data

                } else {
                    renderChart(data.Trump); // Pass only Biden's data

                }
            })
            .catch((error) => {
                console.error('Error fetching the data:', error);
            });
    }, [state, party, populationType, region]);

    const renderChart = (data) => {
        const margin = { top: 40, right: 30, bottom: 40, left: 50 };
        const width = window.innerWidth * 0.4 - margin.left - margin.right; // 80% of the window width
        const height = window.innerHeight * 0.4 - margin.top - margin.bottom;;

        // Clear any existing chart
        d3.select(chartRef.current).select('svg').remove();

        // Append the SVG element
        const svg = d3
            .select(chartRef.current)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Define scales
        const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);


        // Define colors for racial groups
        const raceColors = {
            "White": '#FF5733', // Red
            "Black": '#C70039', // Dark Red
            "Hispanic": '#FFC300', // Yellow
            "Asian": '#1E90FF', // Blue
            "Other": '#28A745', // Green
        };

        const populationGroups = populationType === 'All'
            ? Object.keys(data)
            : [populationType];
        const maxDensity = d3.max(
            populationGroups.flatMap((group) => {
                const groupData = data[group];
                return groupData ? groupData.map((d) => d.density) : [];
            })
        );

        const yScale = d3.scaleLinear()
            .domain([0, maxDensity + 3])
            .range([height, 0]);

        // Draw filled density curves for selected population groups
        populationGroups.forEach((populationGroup) => {
            const groupData = data[populationGroup];
            if (!groupData) return; // Skip if data for the group is missing

            // Area generator
            const area = d3
                .area()
                .x((d) => xScale(d.x))
                .y0(yScale(0)) // Start the fill from the bottom (density = 0)
                .y1((d) => yScale(d.density)) // Fill up to the density curve
                .curve(d3.curveBasis); // Smooth curve

            // Append area path
            svg.append('path')
                .datum(groupData)
                .attr('fill', raceColors[populationGroup]) // Fill color based on the population group
                .attr('opacity', 0.3) // Adjust transparency
                .attr('d', area);

            // Line generator for the curve outline
            const line = d3
                .line()
                .x((d) => xScale(d.x))
                .y((d) => yScale(d.density))
                .curve(d3.curveBasis);

            // Append curve outline
            svg.append('path')
                .datum(groupData)
                .attr('fill', 'none')
                .attr('stroke', raceColors[populationGroup]) // Stroke color matches the fill color
                .attr('stroke-width', 2)
                .attr('d', line);
        });

        // Add axes
        const xAxisGroup = svg
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(10));
        xAxisGroup.selectAll('text').style('fill', 'rgba(255,255,255,0.7)');
        xAxisGroup.selectAll('line').style('stroke', 'rgba(255,255,255,0.7)');
        xAxisGroup.select('.domain').style('stroke', 'rgba(255,255,255,0.7)');

        const yAxisGroup = svg.append('g').call(d3.axisLeft(yScale).ticks(10));
        yAxisGroup.selectAll('text').style('fill', 'rgba(255,255,255,0.7)');
        yAxisGroup.selectAll('line').style('stroke', 'rgba(255,255,255,0.7)');
        yAxisGroup.select('.domain').style('stroke', 'rgba(255,255,255,0.7)');

        // Add title
        svg
            .append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .style("font-family", "Inter, Arial, sans-serif")
            .style('fill', 'rgba(255,255,255,0.85)')
            .text(party === 'Democrat' ? 'Support for Biden by Income Group' : 'Support for Trump by Income Group');

        // Add grid lines for the Y-axis
        const yGridGroup = svg.append('g')
            .attr('class', 'grid')
            .call(
                d3.axisLeft(yScale)
                    .tickSize(-width) // Extend the grid lines across the chart
                    .tickFormat('') // Remove tick labels
            )
            .attr('stroke-opacity', 0.28); // Adjust grid line opacity
        yGridGroup.selectAll('line').style('stroke', 'rgba(255,255,255,0.28)');

        // Add grid lines for the X-axis
        const xGridGroup = svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${height})`)
            .call(
                d3.axisBottom(xScale)
                    .tickSize(-height)
                    .tickFormat('')
            )
            .attr('stroke-opacity', 0.28);
        xGridGroup.selectAll('line').style('stroke', 'rgba(255,255,255,0.28)');

        // Add X-axis title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .style("font-family", "Inter, Arial, sans-serif")
            .style('fill', 'rgba(255,255,255,0.85)')
            .text('Support Fraction');

        // Add Y-axis title
        svg.append('text')
            .attr('x', -height / 2)
            .attr('y', -margin.left + 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('transform', 'rotate(-90)')
            .style("font-family", "Inter, Arial, sans-serif")
            .style('fill', 'rgba(255,255,255,0.85)')
            .text('Density');

        // Add legend
        const legend = svg
            .selectAll('.legend')
            .data(Object.keys(raceColors))
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`);

        legend
            .append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', (d) => raceColors[d]);

        legend
            .append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .style("font-family", "Inter, Arial, sans-serif")
            .style('fill', 'rgba(255,255,255,0.85)')
            .text((d) => (d === "Hispanic" ? "Hisp." : d)); // Conditional check

    };

    return <div ref={chartRef}></div>;
};

export default RaceEcologicalInference;
