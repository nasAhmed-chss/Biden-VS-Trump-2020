import * as d3 from 'd3';
import { useEffect } from 'react';

const RegionEcoBar = ({ state }) => {
    useEffect(() => {
        // Updated data for Region Types
        const datasets = {
            Connecticut: [
                { region: 'Rural', Biden: 0.2, Trump: 0.8, errorBiden: 0.02, errorTrump: 0.02 },
                { region: 'Urban', Biden: 0.5, Trump: 0.45, errorBiden: 0.03, errorTrump: 0.03 },
                { region: 'Suburban', Biden: 0.4, Trump: 0.6, errorBiden: 0.02, errorTrump: 0.03 },
            ],
            Mississippi: [
                { region: 'Rural', Biden: 0.1, Trump: 0.9, errorBiden: 0.01, errorTrump: 0.03 },
                { region: 'Urban', Biden: 0.4, Trump: 0.5, errorBiden: 0.02, errorTrump: 0.02 },
                { region: 'Suburban', Biden: 0.3, Trump: 0.6, errorBiden: 0.03, errorTrump: 0.03 },
            ],
        };

        const data = datasets[state] || [];

        // Chart dimensions
        const margin = { top: 40, right: 30, bottom: 70, left: 70 };
        const width = window.innerWidth * 0.4 - margin.left - margin.right;
        const height = window.innerHeight * 0.6 - margin.top - margin.bottom;

        // Clear existing SVG
        d3.select(`#${state.toLowerCase()}-chart`).selectAll('*').remove();

        // Create SVG
        const svg = d3
            .select(`#${state.toLowerCase()}-chart`)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // X and Y scales
        const x = d3.scaleBand()
            .domain(data.map((d) => d.region))
            .range([0, width])
            .padding(0.4);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);

        // Add X-axis
        const xAxisGroup = svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        xAxisGroup.selectAll('text')
            .style('fill', 'rgba(255,255,255,0.7)')
            .style('font-size', '14px')
            .style('text-anchor', 'middle');
        xAxisGroup.selectAll('line')
            .style('stroke', 'rgba(255,255,255,0.7)');
        xAxisGroup.select('.domain')
            .style('stroke', 'rgba(255,255,255,0.7)');

        // Add Y-axis
        const yAxisGroup = svg.append('g')
            .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0%')));
        yAxisGroup.selectAll('text')
            .style('fill', 'rgba(255,255,255,0.7)');
        yAxisGroup.selectAll('line')
            .style('stroke', 'rgba(255,255,255,0.7)');
        yAxisGroup.select('.domain')
            .style('stroke', 'rgba(255,255,255,0.7)');

        // Add X-axis label
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + 50)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('fill', 'rgba(255,255,255,0.85)')
            .style('font-family', 'Inter, Arial, sans-serif')
            .text('Region Type');

        // Add Y-axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -50)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('fill', 'rgba(255,255,255,0.85)')
            .style('font-family', 'Inter, Arial, sans-serif')
            .text('Support Percentage');
        const yGridGroup = svg.append('g')
            .attr('class', 'grid')
            .call(
                d3.axisLeft(y)
                    .tickSize(-width) // Extend the grid lines across the chart
                    .tickFormat('') // Remove tick labels
            )
            .attr('stroke-opacity', 0.28); // Adjust grid line opacity
        yGridGroup.selectAll('line')
            .style('stroke', 'rgba(255,255,255,0.28)');

        // Add grid lines for the X-axis
        const xGridGroup = svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${height})`)
            .call(
                d3.axisBottom(x)
                    .tickSize(-height)
                    .tickFormat('')
            )
            .attr('stroke-opacity', 0.28);
        xGridGroup.selectAll('line')
            .style('stroke', 'rgba(255,255,255,0.28)');

        // Add Biden bars (blue)
        svg.selectAll('.bar-biden')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.region))
            .attr('y', (d) => y(d.Biden))
            .attr('width', x.bandwidth() / 2)
            .attr('height', (d) => height - y(d.Biden))
            .attr('fill', 'blue');

        // Add Trump bars (red)
        svg.selectAll('.bar-trump')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.region) + x.bandwidth() / 2)
            .attr('y', (d) => y(d.Trump))
            .attr('width', x.bandwidth() / 2)
            .attr('height', (d) => height - y(d.Trump))
            .attr('fill', 'red');

        // Add error bars and T-caps
        const addErrorBars = (key, errorKey, color, offsetFactor) => {
            svg.selectAll(`.error-line-${key}`)
                .data(data)
                .enter()
                .append('line')
                .attr('x1', (d) => x(d.region) + offsetFactor * x.bandwidth())
                .attr('x2', (d) => x(d.region) + offsetFactor * x.bandwidth())
                .attr('y1', (d) => y(d[key] - d[errorKey]))
                .attr('y2', (d) => y(d[key] + d[errorKey]))
                .attr('stroke', 'rgba(255,255,255,0.7)')
                .attr('stroke-width', 2);

            svg.selectAll(`.error-cap-${key}-top`)
                .data(data)
                .enter()
                .append('line')
                .attr('x1', (d) => x(d.region) + offsetFactor * x.bandwidth() - 5)
                .attr('x2', (d) => x(d.region) + offsetFactor * x.bandwidth() + 5)
                .attr('y1', (d) => y(d[key] + d[errorKey]))
                .attr('y2', (d) => y(d[key] + d[errorKey]))
                .attr('stroke', 'rgba(255,255,255,0.7)')
                .attr('stroke-width', 2);
        };

        addErrorBars('Biden', 'errorBiden', 'black', 0.25);
        addErrorBars('Trump', 'errorTrump', 'black', 0.75);

        // Chart Title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style('fill', 'rgba(255,255,255,0.85)')
            .style('font-family', 'Inter, Arial, sans-serif')
            .text(`Support for Candidates by Region Type`);
        const legend = svg.append('g').attr('transform', `translate(${width - 35}, ${0})`);

        legend
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', 'red');

        legend
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '16px')
            .style('fill', 'rgba(255,255,255,0.8)')
            .text('Trump');

        legend
            .append('rect')
            .attr('x', 0)
            .attr('y', 20)
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', 'blue');

        legend
            .append('text')
            .attr('x', 20)
            .attr('y', 32)
            .style('font-size', '16px')
            .style('fill', 'rgba(255,255,255,0.8)')
            .text('Biden');


    }, [state]);

    return <div id={`${state.toLowerCase()}-chart`}></div>;
};

export default RegionEcoBar;
