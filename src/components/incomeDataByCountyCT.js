import { useEffect, useRef } from "react";
import * as d3 from "d3";

const IncomeDataCountyCT = () => {
    const chartRef = useRef(null);
    const data = [
        { county: "Tolland County", bidenVotes: 44006, trumpVotes: 34819, income: 88230 },
        { county: "New Haven County", bidenVotes: 242629, trumpVotes: 169892, income: 75982 },
        { county: "Windham County", bidenVotes: 26701, trumpVotes: 29141, income: 64147 },
        { county: "Hartford County", bidenVotes: 283368, trumpVotes: 159024, income: 75205 },
        { county: "Litchfield County", bidenVotes: 50164, trumpVotes: 55601, income: 78678 },
        { county: "Fairfield County", bidenVotes: 297505, trumpVotes: 169039, income: 108270 },
        { county: "New London County", bidenVotes: 79459, trumpVotes: 57110, income: 77667 },
        { county: "Middlesex County", bidenVotes: 56848, trumpVotes: 40665, income: 87792 },
    ];




    useEffect(() => {
        const margin = { top: 50, right: 20, bottom: 50, left: 60 };
        const parentWidth = chartRef.current.parentElement.offsetWidth;
        const parentHeight = chartRef.current.parentElement.offsetHeight;

        const width = parentWidth - margin.left - margin.right;
        const height = parentHeight - margin.top - margin.bottom;

        const svg = d3.select(chartRef.current)
            .attr("width", parentWidth)
            .attr("height", parentHeight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const counties = data.map(d => d.county);

        const x0 = d3.scaleBand()
            .domain(counties)
            .range([0, width])
            .padding(0.1);

        const x1 = d3.scaleBand()
            .domain(['Democrat', 'Republican'])
            .range([0, x0.bandwidth()])
            .padding(0.05);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.bidenVotes, d.trumpVotes, d.income))])
            .range([height, 0])
            .nice();

        svg.selectAll(".county")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "county")
            .attr("transform", d => `translate(${x0(d.county)}, 0)`)

            .selectAll("rect")
            .data(d => [
                { party: 'Democrat', votes: d.bidenVotes },
                { party: 'Republican', votes: d.trumpVotes },
            ])
            .enter()
            .append("rect")
            .attr("x", d => x1(d.party))
            .attr("y", d => y(d.votes))
            .attr("width", x1.bandwidth())
            .attr("height", d => height - y(d.votes))
            .attr("fill", d => (d.party === 'Democrat' ? "#0000FF" : "red"));

        svg.append("g")
            .attr("class", "y-axis")
            .call(d3.axisLeft(y).ticks(10));

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x0));

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("font-family", "Open Sans, sans-serif")
            .style("fill", "white")
            .text("Voting Results and Income by County in Connecticut");

        const incomeLine = d3.line()
            .x((d, i) => x0(d.county) + x0.bandwidth() / 2)
            .y(d => y(d.income));

        svg.append("path")
            .datum(data)
            .attr("class", "income-line")
            .attr("d", incomeLine)
            .attr("fill", "none")
            .attr("stroke", "grey")
            .attr("stroke-width", 2);

        const gridLines = d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("");

        svg.append("g")
            .attr("class", "grid")
            .call(gridLines);

        svg.selectAll(".grid line")
            .style("stroke", "grey")
            .style("stroke-width", 0.25);
        const legend = svg.append("g")
            .attr("transform", "translate(0, 10)");

        legend.append("rect")
            .attr("x", width - 120)
            .attr("y", 0)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "#0000FF");

        legend.append("text")
            .attr("x", width - 100)
            .attr("y", 15)
            .text("Democrat")
            .style("font-family", "Open Sans, sans-serif")
            .style("font-size", "12px");

        legend.append("rect")
            .attr("x", width - 120)
            .attr("y", 20)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", "red");

        legend.append("text")
            .attr("x", width - 100)
            .attr("y", 35)
            .text("Republican")
            .style("font-family", "Open Sans, sans-serif")
            .style("font-size", "6px");

        return () => {
            d3.select(chartRef.current).selectAll("*").remove();
        };
    }, [data]);

    return <svg ref={chartRef} style={{ width: "100%", height: "100%" }}></svg>;
};

export default IncomeDataCountyCT;
