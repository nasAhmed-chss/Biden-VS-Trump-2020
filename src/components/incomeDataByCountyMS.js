import { useEffect, useRef } from "react";
import * as d3 from "d3";

const IncomeDataCountyMS = () => {
    const chartRef = useRef(null);

    const data = [
        { county: "Hinds County", bidenVotes: 58800, trumpVotes: 34800, income: 50000 },
        { county: "DeSoto County", bidenVotes: 42000, trumpVotes: 70000, income: 78000 },
        { county: "Lafayette County", bidenVotes: 22000, trumpVotes: 34000, income: 64000 },
        { county: "Rankin County", bidenVotes: 30000, trumpVotes: 61000, income: 75000 },
        { county: "Madison County", bidenVotes: 17000, trumpVotes: 37000, income: 58000 },
        { county: "Jackson County", bidenVotes: 30000, trumpVotes: 50000, income: 67000 },
        { county: "Pearl River County", bidenVotes: 23000, trumpVotes: 22000, income: 61000 },
        { county: "Warren County", bidenVotes: 21000, trumpVotes: 31000, income: 55000 },
        { county: "Loudon County", bidenVotes: 15000, trumpVotes: 22000, income: 59000 },
        { county: "George County", bidenVotes: 18000, trumpVotes: 29000, income: 62000 },
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
            .domain([0, d3.max(data, d => Math.max(d.bidenVotes, d.trumpVotes, d.income)) * 1.1])
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
            .style("font-size", "12px");

        return () => {
            d3.select(chartRef.current).selectAll("*").remove();
        };
    }, [data]);

    return <svg ref={chartRef} style={{ width: "100%", height: "100%" }}></svg>;
};

export default IncomeDataCountyMS;
