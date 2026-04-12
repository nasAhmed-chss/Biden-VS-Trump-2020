import { useState, useEffect } from 'react';
import axios from 'axios';
import * as d3 from 'd3';
import { create, all } from 'mathjs';


const math = create(all);

const GinglesGraph = ({ populationType, locationType, currentState, setPrecinct }) => {
    const [selectedPrecinct, setSelectedPrecinct] = useState(null); // State to track selected precinct
    const [selectedVoteType, setSelectedVoteType] = useState(null);  // Track which vote type (Dem/Rep)



    const popType = populationType === 'Income'
        ? 'MEDN_INC22'
        : populationType === 'White'
            ? 'WHT_NHSP22'
            : populationType === 'African American'
                ? 'BLK_NHSP22'
                : populationType === 'Hispanic/Latino'
                    ? 'HSP_POP22'
                    : populationType === 'Asian'
                        ? 'ASN_NHSP22'
                        : 'OTH_NHSP22';


    const [districtType, setDistrictType] = useState('precinct');

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                // Fetch master GeoJSON directly from the Next.js API route
                const fileResponse = await axios.get(`/api/data/${currentState}/Master_Data`);
                console.log("File Response: ", fileResponse.data);

                let responseData;

                if (districtType === 'precinct') {
                    responseData = fileResponse.data.features.precincts;
                } else if (districtType === 'cd') {
                    responseData = fileResponse.data.features.districts;
                }

                const maxPopTypeValue = d3.max(responseData, d => +d.properties[popType]);
                const maxVotes = d3.max(responseData, d => Math.max(+d.properties.G20PREDBID, +d.properties.G20PRERTRU));
                const maxIncomeValue = d3.max(responseData, d => Math.max(+d.properties.MEDN_INC22));
                const data = responseData.map(feature => {
                    const demVotes = +feature.properties.G20PREDBID;
                    const repVotes = +feature.properties.G20PRERTRU;

                    const income = +feature.properties.MEDN_INC22;
                    const normalizedIncome = (income / maxIncomeValue) * 100
                    const popValue = populationType === 'Income'
                        ? +feature.properties[popType]
                        : (+feature.properties[popType] / maxPopTypeValue) * 100;

                    const category = feature.properties.category;



                    //Normalize percentage with income
                    const combinedValue =
                        locationType === 'Income/'
                            ? (normalizedIncome + popValue) / 2
                            : popValue;

                    return {
                        NAME: feature.properties.NAME20,
                        [popType]: combinedValue,
                        'Democratic Votes': (demVotes / maxVotes) * 100,
                        'Republican Votes': (repVotes / maxVotes) * 100,
                        Category: category,
                        xCoord: +feature.properties[popType],
                        yCoordDem: (demVotes / maxVotes) * 100,
                        yCoordRep: (repVotes / maxVotes) * 100,
                    };
                });

                const margin = { top: 20, right: 30, bottom: 60, left: 50 };
                const width = 750 - margin.left - margin.right;
                const height = 350 - margin.top - margin.bottom;

                d3.select("#scatterplot").selectAll("*").remove();

                const svg = d3.select("#scatterplot")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);


                const xScale = d3.scaleLinear()
                    .domain(
                        populationType === 'Income'
                            ? [0, maxPopTypeValue]
                            : [0, 100]
                    )
                    .range([0, width]);

                const validData =
                    locationType === 'All' || locationType === 'Income/'
                        ? data.filter(d => d['Democratic Votes'] > 0 || d['Republican Votes'] > 0)
                        : data.filter(
                            d =>
                                (d['Democratic Votes'] > 0 || d['Republican Votes'] > 0) &&
                                d.Category === locationType
                        );

                console.log("Location", locationType)

                const yScale = d3.scaleLinear()
                    .domain([0, 100])
                    .range([height, 0]);

                svg.selectAll(".dotDem")
                    .data(validData.filter(d => d['Democratic Votes'] > 0))
                    .enter()
                    .append("circle")
                    .attr("class", "dot dotDem")
                    .attr("cx", d => xScale(d[popType]))
                    .attr("cy", d => yScale(d['Democratic Votes']))
                    .attr("r", 2)
                    .attr("fill", "#4A90E2")
                    .on("click", (event, d) => {
                        setSelectedPrecinct(d); // Set the clicked precinct
                        setSelectedVoteType('Democratic'); // Set vote type to Democratic
                        setPrecinct(d.NAME); // Pass the precinct name back to PrecinctAnalysis
                    })
                    .on("mouseover", function (event, d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", 8); // Increase radius on hover
                    })
                    .on("mouseout", function (event, d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", 4); // Reset radius to default
                    });

                svg.selectAll(".dotRep")
                    .data(validData.filter(d => d['Republican Votes'] > 0))
                    .enter()
                    .append("circle")
                    .attr("class", "dot dotRep")
                    .attr("cx", d => xScale(d[popType]))
                    .attr("cy", d => yScale(d['Republican Votes']))
                    .attr("r", 2)
                    .attr("fill", "#E57373")
                    .on("click", (event, d) => {
                        setSelectedPrecinct(d); // Set the clicked precinct
                        setSelectedVoteType('Republican'); // Set vote type to Republican
                        setPrecinct(d.NAME); // Pass the precinct name back to PrecinctAnalysis
                    })
                    .on("mouseover", function (event, d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", 8); // Increase radius on hover
                    })
                    .on("mouseout", function (event, d) {
                        d3.select(this)
                            .transition()
                            .duration(200)
                            .attr("r", 4); // Reset radius to default
                    });

                // Update the text position based on which vote type was clicked
                if (selectedPrecinct) {
                    svg
                        .append("text")
                        .attr("x", xScale(selectedPrecinct[popType]) + 10)
                        .attr("y", selectedVoteType === 'Democratic'
                            ? yScale(selectedPrecinct['Democratic Votes']) - 10
                            : yScale(selectedPrecinct['Republican Votes']) - 10)
                        .attr("fill", "rgba(255,255,255,0.9)")
                        .attr("font-size", "12px")
                        .style("font-family", "Inter, Arial, sans-serif")
                        .text(selectedPrecinct.NAME);
                }


                const fitPolynomial = (x, y, degree) => {
                    const n = x.length;
                    const X = [];
                    for (let i = 0; i < n; i++) {
                        X.push([1]);
                        for (let j = 1; j <= degree; j++) {
                            X[i].push(Math.pow(x[i], j));
                        }
                    }
                    const Xt = math.transpose(X);
                    const XtX = math.multiply(Xt, X);
                    const XtY = math.multiply(Xt, y);
                    const coeffs = math.multiply(math.inv(XtX), XtY);
                    return coeffs;
                };


                const demData = validData.filter(d => d['Democratic Votes'] > 0);

                const filteredDemData = demData.filter(d => d['Democratic Votes'] >= 0);
                const xDataDem = filteredDemData.map(d => d[popType]);
                const yDataDem = filteredDemData.map(d => d['Democratic Votes']);

                const repData = validData.filter(d => d['Republican Votes'] > 0);
                const filteredRepData = repData.filter(d => d['Republican Votes'] >= 0);

                const xDataRep = filteredRepData.map(d => d[popType]);
                const yDataRep = filteredRepData.map(d => d['Republican Votes']);

                const coeffsDem = fitPolynomial(xDataDem, yDataDem, 2);
                const coeffsRep = fitPolynomial(xDataRep, yDataRep, 2);

                const xFit = populationType === 'Income'
                    ? d3.range(0, maxPopTypeValue, maxPopTypeValue / 100)
                    : d3.range(0, 100, 1);

                const yFitDem = xFit.map(x => coeffsDem[0] + coeffsDem[1] * x + coeffsDem[2] * Math.pow(x, 2));
                const yFitRep = xFit.map(x => coeffsRep[0] + coeffsRep[1] * x + coeffsRep[2] * Math.pow(x, 2));

                const lineDem = d3.line()
                    .x((d, i) => xScale(xFit[i]))
                    .y((d, i) => yScale(yFitDem[i]));

                const lineRep = d3.line()
                    .x((d, i) => xScale(xFit[i]))
                    .y((d, i) => yScale(yFitRep[i]));



                svg.append("path")
                    .datum(xFit)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", "#004080")
                    .attr("stroke-width", 3)
                    .attr("stroke-dasharray", "5,5")
                    .attr("clip-path", "url(#clip)")
                    .attr("d", lineDem);

                svg.append("path")
                    .datum(xFit)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", "#800000")
                    .attr("stroke-width", 3)
                    .attr("stroke-dasharray", "5,5")
                    .attr("clip-path", "url(#clip)")
                    .attr("d", lineRep);

                const axisColor = 'rgba(255,255,255,0.6)';
                const gridColor = 'rgba(255,255,255,0.08)';
                const labelColor = 'rgba(255,255,255,0.75)';

                const xAxis = svg.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .call(
                        d3.axisBottom(xScale)
                            .ticks(10)
                            .tickFormat(d => {
                                if (populationType === 'Income') {
                                    return `$${d}`;
                                }
                                return `${d}%`;
                            })
                    );
                xAxis.selectAll("text").style("fill", axisColor).style("font-size", "11px");
                xAxis.selectAll("line").style("stroke", axisColor);
                xAxis.select(".domain").style("stroke", axisColor);

                const yAxis = svg.append("g")
                    .call(d3.axisLeft(yScale).ticks(10).tickFormat(d => `${d}%`));
                yAxis.selectAll("text").style("fill", axisColor).style("font-size", "11px");
                yAxis.selectAll("line").style("stroke", axisColor);
                yAxis.select(".domain").style("stroke", axisColor);

                svg.append("text")
                    .attr("class", "x label")
                    .attr("text-anchor", "middle")
                    .attr("x", width / 2)
                    .attr("y", height + margin.bottom - 10)
                    .style("font-family", "Inter, Arial, sans-serif")
                    .style("fill", labelColor)
                    .style("font-size", "12px")
                    .text(() => {
                        if (populationType === 'White') {
                            return "Total White Population %";
                        } else if (populationType === 'African American') {
                            return "Total African American Population %";
                        } else if (populationType === 'Hispanic/Latino') {
                            return "Total Hispanic/Latino Population %";
                        } else if (populationType === 'Asian') {
                            return "Total Asian Population %";
                        } else if (populationType === 'Other Races') {
                            return "Total Other Races %";
                        } else if (populationType === 'Income') {
                            return "Average Household Income";
                        }
                        return "";
                    });

                svg.append("text")
                    .attr("class", "y label")
                    .attr("text-anchor", "middle")
                    .attr("y", -margin.left + 15)
                    .attr("x", -height / 2)
                    .attr("transform", "rotate(-90)")
                    .style("font-family", "Inter, Arial, sans-serif")
                    .style("fill", labelColor)
                    .style("font-size", "12px")
                    .text("Vote Share (%)");

                svg.append("g")
                    .attr("class", "grid")
                    .attr("stroke", gridColor)
                    .attr("stroke-width", 1)
                    .selectAll("line")
                    .data(yScale.ticks(10))
                    .enter().append("line")
                    .attr("x1", 0)
                    .attr("x2", width)
                    .attr("y1", d => yScale(d))
                    .attr("y2", d => yScale(d));

                svg.append("g")
                    .attr("class", "grid")
                    .attr("stroke", gridColor)
                    .attr("stroke-width", 1)
                    .selectAll("line")
                    .data(xScale.ticks(10))
                    .enter().append("line")
                    .attr("y1", 0)
                    .attr("y2", height)
                    .attr("x1", d => xScale(d))
                    .attr("x2", d => xScale(d));

                svg.append("defs")
                    .append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", width)
                    .attr("height", height);
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
    }, [popType, currentState, locationType, districtType, selectedPrecinct, setPrecinct]);

    return (
        <svg
            id="scatterplot"
            style={{ display: 'block', margin: '0 auto', overflow: 'visible' }}
        ></svg>
    );
};

export default GinglesGraph;
