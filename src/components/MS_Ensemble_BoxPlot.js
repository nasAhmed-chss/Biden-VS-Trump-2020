import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import axios from "axios";
function GetMSEnsembleData({ race, showRegionType }) {
  const [data, setData] = useState([]);
  const width = 700;
  const height = 400;
  const margin = { top: 80, right: 20, bottom: 50, left: 70 };

  const data1 = {
    "1": {
      WHT_NHSP22: 35.74721133219429,
      BLK_NHSP22: 21.591121994652067,
      HSP_POP22: 3.373085021797518,
      ASN_NHSP22: 0.748226669143104,
      OTH_NHSP22: 0.24586118455788292,
    },
    "2": {
      WHT_NHSP22: 35.74721133219429,
      BLK_NHSP22: 25.715332138243635,
      HSP_POP22: 2.222960086068622,
      ASN_NHSP22: 0.4433109228977308,
      OTH_NHSP22: 0.12593941469676628,
    },
    "3": {
      WHT_NHSP22: 67.37462514321251,
      BLK_NHSP22: 35.69972016060348,
      HSP_POP22: 2.2666991118140896,
      ASN_NHSP22: 0.9812629273634262,
      OTH_NHSP22: 0.2801314028470617,
    },
    "4": {
      WHT_NHSP22: 69.8056604216812,
      BLK_NHSP22: 59.74527138937293,
      HSP_POP22: 4.156193582135816,
      ASN_NHSP22: 1.1711138243569903,
      OTH_NHSP22: 0.30953730117850486,
    },
  };
  // Map dropdown values to JSON field names
  const fieldMapping = {
    white: "WHT_NHSP22",
    black: "BLK_NHSP22",
    asian: "ASN_NHSP22",
    hispanic: "HSP_POP22",
    other: "OTH_NHSP22",
  };

  const selectedKey = fieldMapping[race]; // Get the corresponding key for the race
  const fData = Object.entries(data1).map(([district, values]) => ({
    district: `District ${district}`,   // Label for the district
    value: values[selectedKey],   // Divide value by 100 for percentages
  }));



  useEffect(() => {
    axios
      .get("/api/data/MS_Ensemble_Data")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  useEffect(() => {
    if (data.length) {
      const filteredData = data.map((district) => {
        const raceData = district.racialData[race];
        return {
          district: district.district,
          areaType: district.areaType,
          q1: raceData.q1,
          median: raceData.median,
          q3: raceData.q3,
          min: raceData.min,
          max: raceData.max,
        };
      });


      // Sort data if region type is enabled
      const sortedData = showRegionType
        ? [...filteredData].sort((a, b) => d3.ascending(a.areaType, b.areaType))
        : filteredData;
      // Remove any existing chart
      d3.select("#boxplot svg").remove();
      const svg = d3
        .select("#boxplot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      // Title
      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("font-family", "Arial, sans-serif")
        .text(" Box and Whisker Analysis");


      // Define scales
      const x = d3
        .scaleBand()
        .domain(sortedData.map((d) => d.district))
        .range([margin.left, width - margin.right])
        .padding(0.3);
      const y = d3
        .scaleLinear()
        .domain([0.0, 0.8])
        .range([height - margin.bottom, margin.top]);
      const topX = d3
        .scaleBand()
        .domain(showRegionType ? ["Urban", "Suburban", "Rural"] : []) // Show categories only if enabled
        .range([margin.left, width - margin.right]);
      // Axes
      const xAxis = d3.axisBottom(x)
        .tickSizeOuter(0)
        .tickFormat((d, i) => `District Plan ${i + 1}`);
      const yAxis = d3
        .axisLeft(y)
        .ticks(6)
        .tickFormat(d3.format(".0%"));
      const topXAxis = d3.axisTop(topX).tickSize(0);
      // Render axes
      // X-axis title
      svg.append("text")
        .attr("class", "x-axis-title")
        .attr("x", width / 2)
        .attr("y", height - margin.bottom / 3)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("font-family", "Arial, sans-serif")
        .text("Indexed Districts");

      // Y-axis title
      svg.append("text")
        .attr("class", "y-axis-title")
        .attr("x", -(height / 2))
        .attr("y", margin.left / 3)
        .attr("transform", "rotate(-90)") // Rotate text for Y-axis
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("font-weight", "bold")
        .style("font-family", "Arial, sans-serif")
        .text("Percentage of Group");

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .style("font-size", "8px");

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis);
      if (showRegionType) {
        svg
          .append("g")
          .attr("transform", `translate(0,${margin.top})`)
          .call(topXAxis);
      }

      // Render box plots
      const g = svg.append("g");
      g.selectAll(".box")
        .data(sortedData)
        .enter()
        .append("rect")
        .attr("x", (d) => x(d.district))
        .attr("y", (d) => y(d.q3))
        .attr("height", (d) => y(d.q1) - y(d.q3))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue");
      g.selectAll(".median-line")
        .data(sortedData)
        .enter()
        .append("line")
        .attr("x1", (d) => x(d.district))
        .attr("x2", (d) => x(d.district) + x.bandwidth())
        .attr("y1", (d) => y(d.median))
        .attr("y2", (d) => y(d.median))
        .attr("stroke", "red")
        .attr("stroke-width", 2);
      // Render dots within respective districts


      console.log(fData)
      g.selectAll(".dot")
        .data(fData)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => x(d.district) + x.bandwidth() / 2) // Center the dot within the bar
        .attr("cy", (d) => y((d.value) / 100)) // Scale median percentage to fit Y-axis
        .attr("r", 4) // Radius of the dot
        .attr("fill", "red") // Color of the dot
        .attr("stroke", "black")
        .attr("stroke-width", 1);


      g.selectAll(".whisker-line")
        .data(sortedData)
        .enter()
        .append("line")
        .attr("x1", (d) => x(d.district) + x.bandwidth() / 2)
        .attr("x2", (d) => x(d.district) + x.bandwidth() / 2)
        .attr("y1", (d) => y(d.min))
        .attr("y2", (d) => y(d.max))
        .attr("stroke", "black");
      g.selectAll(".whisker-cap-min")
        .data(sortedData)
        .enter()
        .append("line")
        .attr("x1", (d) => x(d.district) + x.bandwidth() / 4)
        .attr("x2", (d) => x(d.district) + (3 * x.bandwidth()) / 4)
        .attr("y1", (d) => y(d.min))
        .attr("y2", (d) => y(d.min))
        .attr("stroke", "black");
      g.selectAll(".whisker-cap-max")
        .data(sortedData)
        .enter()
        .append("line")
        .attr("x1", (d) => x(d.district) + x.bandwidth() / 4)
        .attr("x2", (d) => x(d.district) + (3 * x.bandwidth()) / 4)
        .attr("y1", (d) => y(d.max))
        .attr("y2", (d) => y(d.max))
        .attr("stroke", "black");

      // Horizontal grid lines (Y-axis)
      // Horizontal grid lines (Y-axis)
      svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(${margin.left},0)`)
        .lower() // Move grid lines behind other elements
        .call(
          d3.axisLeft(y)
            .ticks(6) // Same number of ticks as Y-axis
            .tickSize(-width + margin.left + margin.right) // Extend line across width
            .tickFormat("") // Remove tick labels
        )
        .selectAll("line")
        .attr("stroke", "#e0e0e0") // Light gray solid grid lines
        .attr("stroke-width", 1); // Solid line width

      // Vertical grid lines (X-axis)
      svg.append("g")
        .attr("class", "grid")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .lower() // Move grid lines behind other elements
        .call(
          d3.axisBottom(x)
            .tickSize(-height + margin.top + margin.bottom) // Extend line across height
            .tickFormat("") // Remove tick labels
        )
        .selectAll("line")
        .attr("stroke", "#e0e0e0") // Light gray solid grid lines
        .attr("stroke-width", 1); // Solid line width



    }
  }, [data, race, showRegionType]);
  return <div id="boxplot" />;
}
export default GetMSEnsembleData;