import * as d3 from 'd3';
import { useEffect } from 'react';

const IncomeEcoBar = ({ state }) => {
    useEffect(() => {
        // Define data for both states
        const datasets = {
            Connecticut: [
                { income: 'Low Income', Biden: 0.55, Trump: 0.45, errorBiden: 0.03, errorTrump: 0.02 },
                { income: 'Middle Income', Biden: 0.5, Trump: 0.4, errorBiden: 0.02, errorTrump: 0.03 },
                { income: 'High Income', Biden: 0.6, Trump: 0.4, errorBiden: 0.04, errorTrump: 0.03 },
            ],
            Mississippi: [
                { income: 'Low Income', Biden: 0.35, Trump: 0.6, errorBiden: 0.02, errorTrump: 0.04 },
                { income: 'Middle Income', Biden: 0.3, Trump: 0.5, errorBiden: 0.03, errorTrump: 0.03 },
                { income: 'High Income', Biden: 0.15, Trump: 0.85, errorBiden: 0.02, errorTrump: 0.04 },
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
            .domain(data.map((d) => d.income))
            .range([0, width])
            .padding(0.4);

        const y = d3.scaleLinear()
            .domain([0, 1])
            .range([height, 0]);


        svg.append('g')
            .attr('class', 'grid')
            .call(
                d3.axisLeft(y)
                    .tickSize(-width) // Extend the grid lines across the chart
                    .tickFormat('') // Remove tick labels
            )
            .attr('stroke-opacity', 0.28) // Adjust grid line opacity
            .selectAll('line').style('stroke', 'rgba(255,255,255,0.28)');

        // Add grid lines for the X-axis
        svg.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0, ${height})`)
            .call(
                d3.axisBottom(x)
                    .tickSize(-height)
                    .tickFormat('')
            )
            .attr('stroke-opacity', 0.28)
            .selectAll('line').style('stroke', 'rgba(255,255,255,0.28)');

        const axisColor = 'rgba(255,255,255,0.7)';
        // Add X-axis
        const xAxisG = svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(x));
        xAxisG.selectAll('text').style('font-size', '13px').style('fill', axisColor);
        xAxisG.selectAll('line').style('stroke', axisColor);
        xAxisG.select('.domain').style('stroke', axisColor);

        // Add Y-axis
        const yAxisG = svg.append('g').call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0%')));
        yAxisG.selectAll('text').style('font-size', '12px').style('fill', axisColor);
        yAxisG.selectAll('line').style('stroke', axisColor);
        yAxisG.select('.domain').style('stroke', axisColor);

        // Add X-axis label
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', height + 50)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style("font-family", "Arial, sans-serif")
            .style('fill', 'rgba(255,255,255,0.85)')
            .style('font-family', 'Inter, Arial, sans-serif')
            .text('Income Group');

        // Add Y-axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -50)
            .attr('text-anchor', 'middle')
            .style('font-size', '20px')
            .style('font-weight', 'bold')
            .style("font-family", "Arial, sans-serif")
            .style('fill', 'rgba(255,255,255,0.85)')
            .style('font-family', 'Inter, Arial, sans-serif')
            .text('Support Percentage');

        // Add Biden bars (blue)
        svg.selectAll('.bar-biden')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.income))
            .attr('y', (d) => y(d.Biden))
            .attr('width', x.bandwidth() / 2)
            .attr('height', (d) => height - y(d.Biden))
            .attr('fill', 'blue');

        // Add Trump bars (red)
        svg.selectAll('.bar-trump')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.income) + x.bandwidth() / 2)
            .attr('y', (d) => y(d.Trump))
            .attr('width', x.bandwidth() / 2)
            .attr('height', (d) => height - y(d.Trump))
            .attr('fill', 'red');

        // Add error bars and T-caps
        const addErrorBars = (key, errorKey, color, offsetFactor) => {
            // Vertical lines
            svg.selectAll(`.error-line-${key}`)
                .data(data)
                .enter()
                .append('line')
                .attr('x1', (d) => x(d.income) + offsetFactor * x.bandwidth())
                .attr('x2', (d) => x(d.income) + offsetFactor * x.bandwidth())
                .attr('y1', (d) => y(d[key] - d[errorKey]))
                .attr('y2', (d) => y(d[key] + d[errorKey]))
                .attr('stroke', 'rgba(255,255,255,0.7)')
                .attr('stroke-width', 2);

            // T-caps (bottom)
            svg.selectAll(`.error-cap-${key}-bottom`)
                .data(data)
                .enter()
                .append('line')
                .attr('x1', (d) => x(d.income) + offsetFactor * x.bandwidth() - 5)
                .attr('x2', (d) => x(d.income) + offsetFactor * x.bandwidth() + 5)
                .attr('y1', (d) => y(d[key] - d[errorKey]))
                .attr('y2', (d) => y(d[key] - d[errorKey]))
                .attr('stroke', 'rgba(255,255,255,0.7)')
                .attr('stroke-width', 2);

            // T-caps (top)
            svg.selectAll(`.error-cap-${key}-top`)
                .data(data)
                .enter()
                .append('line')
                .attr('x1', (d) => x(d.income) + offsetFactor * x.bandwidth() - 5)
                .attr('x2', (d) => x(d.income) + offsetFactor * x.bandwidth() + 5)
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
            .style("font-family", "Arial, sans-serif")
            .style('fill', 'rgba(255,255,255,0.9)')
            .style('font-family', 'Inter, Arial, sans-serif')
            .text(`Support for Biden and Trump by Income Group`);

        const legend = svg.append('g').attr('transform', `translate(${width - 50}, ${0})`);

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
            .style("font-family", "Arial, sans-serif")
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
            .style("font-family", "Arial, sans-serif")
            .style('fill', 'rgba(255,255,255,0.8)')
            .text('Biden');
    }, [state]);

    return <div id={`${state.toLowerCase()}-chart`}></div>;
};

export default IncomeEcoBar;



