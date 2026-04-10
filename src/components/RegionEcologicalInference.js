import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const RegionEcologicalInference = ({ state, party, region }) => {
    const chartRef = useRef();

    useEffect(() => {
        // Fetch the JSON file directly
        fetch('/data/RegionEI.json') // File path in public/data
            .then((response) => response.json())
            .then((data) => {
                const stateData = data[state];
                if (party === 'Democrat') {
                    renderChart(stateData.Biden); // Render Biden's data
                } else {
                    renderChart(stateData.Trump); // Render Trump's data
                }
            })
            .catch((error) => {
                console.error('Error fetching the data:', error);
            });
    }, [state, party, region]);

    const renderChart = (data) => {
        const margin = { top: 40, right: 30, bottom: 40, left: 50 };
        const width = window.innerWidth * 0.4 - margin.left - margin.right;
        const height = window.innerHeight * 0.4 - margin.top - margin.bottom;

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
        const populationGroups =
            region === 'All' ? Object.keys(data) : [region];

        // Find the maximum density value dynamically across all groups
        const maxDensity = d3.max(
            populationGroups.flatMap((group) =>
                data[group] ? data[group].map((d) => d.density) : []
            )
        );

        // Set the Y-axis scale dynamically to the max density value
        const yScale = d3.scaleLinear()
            .domain([0, maxDensity + 3]) // Dynamically set domain to 0 -> maxDensity
            .range([height, 0]);



        // Define colors for regions
        const regionColors = {
            Urban: '#1E90FF', // Blue
            Suburban: '#FFC300', // Yellow
            Rural: '#FF5733', // Red
        };

        // Draw curves for each region
        populationGroups.forEach((populationGroup) => {
            const groupData = data[populationGroup];
            if (!groupData) return;

            const area = d3
                .area()
                .x((d) => xScale(d.x))
                .y0(yScale(0))
                .y1((d) => yScale(d.density))
                .curve(d3.curveBasis);

            svg.append('path')
                .datum(groupData)
                .attr('fill', regionColors[populationGroup])
                .attr('opacity', 0.3)
                .attr('d', area);

            const line = d3
                .line()
                .x((d) => xScale(d.x))
                .y((d) => yScale(d.density))
                .curve(d3.curveBasis);

            svg.append('path')
                .datum(groupData)
                .attr('fill', 'none')
                .attr('stroke', regionColors[populationGroup])
                .attr('stroke-width', 2)
                .attr('d', line);
        });

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).ticks(10));

        svg.append('g').call(d3.axisLeft(yScale).ticks(10));

        // Add chart title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .style("font-family", "Arial, sans-serif")
            .text(
                party === 'Democrat'
                    ? 'Support for Biden by Region Type'
                    : 'Support for Trump by Region Type'
            );
        svg.append('g')
            .attr('class', 'grid')
            .call(
                d3.axisLeft(yScale)
                    .tickSize(-width) // Extend the grid lines across the chart
                    .tickFormat('') // Remove tick labels
            )
            .attr('stroke-opacity', 0.1); // Adjust grid line opacity

        // Add grid lines for the X-axis
        svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${height})`)
            .call(
                d3.axisBottom(xScale)
                    .tickSize(-height)
                    .tickFormat('')
            )
            .attr('stroke-opacity', 0.1);

        // Add X-axis label
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom - 10)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .style("font-family", "Arial, sans-serif")
            .text('Support Fraction');

        // Add Y-axis label
        svg.append('text')
            .attr('x', -height / 2)
            .attr('y', -margin.left + 15)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('transform', 'rotate(-90)')
            .style("font-family", "Arial, sans-serif")
            .text('Density');

        // Add legend
        const legend = svg
            .selectAll('.legend')
            .data(Object.keys(regionColors))
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(0, ${i * 20})`);

        legend
            .append('rect')
            .attr('x', width - 18)
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', (d) => regionColors[d]);

        legend
            .append('text')
            .attr('x', width - 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'end')
            .style("font-family", "Arial, sans-serif")
            .text((d) => d);
    };

    return <div ref={chartRef}></div>;
};

export default RegionEcologicalInference;
