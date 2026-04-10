import * as d3 from 'd3';
import { useEffect } from 'react';

const RaceEcoBar = ({ state }) => {
    useEffect(() => {
        // Data for the chart
        const datasets = {
            Connecticut: [
                { race: 'White', Trump: 40, Biden: 50, error: 3 },
                { race: 'Black', Trump: 5, Biden: 95, error: 2 },
                { race: 'Native', Trump: 10, Biden: 90, error: 5 },
                { race: 'Asian', Trump: 3, Biden: 97, error: 1 },
                { race: 'Other', Trump: 5, Biden: 95, error: 2 },
            ],
            Mississippi: [
                { race: 'White', Trump: 70, Biden: 28, error: 4 },
                { race: 'Black', Trump: 5, Biden: 92, error: 3 },
                { race: 'Native', Trump: 12, Biden: 85, error: 5 },
                { race: 'Asian', Trump: 8, Biden: 88, error: 3 },
                { race: 'Other', Trump: 10, Biden: 87, error: 4 },
            ],
        };

        const data = datasets[state] || [];

        // Chart dimensions
        const margin = { top: 40, right: 30, bottom: 70, left: 70 };
        const width = window.innerWidth * 0.4 - margin.left - margin.right;
        const height = window.innerHeight * 0.6 - margin.top - margin.bottom;

        // Clear existing SVG
        d3.select('#chart-container').selectAll('*').remove();

        // Create SVG
        const svg = d3
            .select('#chart-container')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scaleBand()
            .domain(data.map((d) => d.race))
            .range([0, width])
            .padding(0.4);

        const y = d3.scaleLinear()
            .domain([0, 100])
            .range([height, 0]);
        // Add horizontal gridlines
        svg.append('g')
            .attr('class', 'grid')
            .call(
                d3.axisLeft(y)
                    .tickSize(-width) // Extend the grid lines across the chart
                    .tickFormat('') // Remove tick labels
            )
            .attr('stroke-opacity', 0.1); // Adjust grid line opacity

        // Add grid lines for the X-axis
        svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${height})`)
            .call(
                d3.axisBottom(x)
                    .tickSize(-height)
                    .tickFormat('')
            )
            .attr('stroke-opacity', 0.1);

        // Add X-axis
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .attr('transform', 'rotate(-20)')
            .style('font-size', '16px')
            .style('text-anchor', 'end');

        // Add X-axis label
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + 50)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .text('Race');

        // Add Y-axis
        svg.append('g').call(d3.axisLeft(y));

        // Add Y-axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -50)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .text('Support Percentage');
        // Add bars for Trump
        svg.selectAll('.bar-trump')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.race))
            .attr('y', (d) => y(d.Trump))
            .attr('width', x.bandwidth() / 2)
            .attr('height', (d) => height - y(d.Trump))
            .attr('fill', 'red');

        // Add bars for Biden
        svg.selectAll('.bar-biden')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.race) + x.bandwidth() / 2)
            .attr('y', (d) => y(d.Biden))
            .attr('width', x.bandwidth() / 2)
            .attr('height', (d) => height - y(d.Biden))
            .attr('fill', 'blue');

        // Add error bars (Trump)
        svg.selectAll('.error-line-trump')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => x(d.race) + x.bandwidth() / 4)
            .attr('x2', (d) => x(d.race) + x.bandwidth() / 4)
            .attr('y1', (d) => y(d.Trump - d.error))
            .attr('y2', (d) => y(d.Trump + d.error))
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        // Add T-caps (Trump)
        svg.selectAll('.error-cap-trump')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => x(d.race) + x.bandwidth() / 4 - 5)
            .attr('x2', (d) => x(d.race) + x.bandwidth() / 4 + 5)
            .attr('y1', (d) => y(d.Trump - d.error))
            .attr('y2', (d) => y(d.Trump - d.error))
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        svg.selectAll('.error-cap-trump-top')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => x(d.race) + x.bandwidth() / 4 - 5)
            .attr('x2', (d) => x(d.race) + x.bandwidth() / 4 + 5)
            .attr('y1', (d) => y(d.Trump + d.error))
            .attr('y2', (d) => y(d.Trump + d.error))
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        // Add error bars (Biden)
        svg.selectAll('.error-line-biden')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => x(d.race) + (3 * x.bandwidth()) / 4)
            .attr('x2', (d) => x(d.race) + (3 * x.bandwidth()) / 4)
            .attr('y1', (d) => y(d.Biden - d.error))
            .attr('y2', (d) => y(d.Biden + d.error))
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        // Add T-caps (Biden)
        svg.selectAll('.error-cap-biden')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => x(d.race) + (3 * x.bandwidth()) / 4 - 5)
            .attr('x2', (d) => x(d.race) + (3 * x.bandwidth()) / 4 + 5)
            .attr('y1', (d) => y(d.Biden - d.error))
            .attr('y2', (d) => y(d.Biden - d.error))
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        svg.selectAll('.error-cap-biden-top')
            .data(data)
            .enter()
            .append('line')
            .attr('x1', (d) => x(d.race) + (3 * x.bandwidth()) / 4 - 5)
            .attr('x2', (d) => x(d.race) + (3 * x.bandwidth()) / 4 + 5)
            .attr('y1', (d) => y(d.Biden + d.error))
            .attr('y2', (d) => y(d.Biden + d.error))
            .attr('stroke', 'black')
            .attr('stroke-width', 2);

        // Add chart title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .text('Support for Candidates by Race');

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
            .text('Biden');



    }, [state]);

    return <div id="chart-container"></div>;
};

export default RaceEcoBar;