import { useEffect, useRef, useState } from "react";
import axios from "axios";
import * as d3 from "d3";

// Color palette for race categories
const RACE_COLORS = [
  "#7C83FD", "#56CFB2", "#F4845F", "#F7C59F",
  "#A8DADC", "#E9C46A", "#E76F51", "#8ECAE6",
];

const RaceDistributionCT = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get("/api/data/connecticut_race_data")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Connecticut race data:", error);
      });
  }, []);

  useEffect(() => {
    const el = chartRef.current;
    if (!el || !data) return;
    d3.select(el).selectAll("*").remove();

    const margin = { top: 36, right: 20, bottom: 56, left: 50 };
    const parentWidth = el.parentElement.offsetWidth || 400;
    const parentHeight = el.parentElement.offsetHeight || 240;
    const width = parentWidth - margin.left - margin.right;
    const height = parentHeight - margin.top - margin.bottom;

    const svg = d3
      .select(el)
      .attr("width", parentWidth)
      .attr("height", parentHeight);

    // ── Gradients (one per bar) ───────────────────────────────────
    const defs = svg.append("defs");
    data.forEach((d, i) => {
      const color = RACE_COLORS[i % RACE_COLORS.length];
      const grad = defs
        .append("linearGradient")
        .attr("id", `raceGradCT_${i}`)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 1);
      grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.4);
    });

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // ── Scales ───────────────────────────────────────────────────
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.race))
      .range([0, width])
      .padding(0.35);

    const maxVal = d3.max(data, (d) => d.percentage);
    const y = d3
      .scaleLinear()
      .domain([0, maxVal * 1.25])
      .nice()
      .range([height, 0]);

    // ── Grid lines ───────────────────────────────────────────────
    g.append("g")
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""))
      .call((grp) => grp.select(".domain").remove())
      .selectAll("line")
      .style("stroke", "rgba(255,255,255,0.18)")
      .style("stroke-dasharray", "3,3");

    // ── Bars ─────────────────────────────────────────────────────
    const barW = x.bandwidth();
    const radius = 4;

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("d", (d) => {
        const bx = x(d.race);
        return `M${bx},${height} L${bx + barW},${height} L${bx + barW},${height} L${bx},${height} Z`;
      })
      .attr("fill", (_, i) => `url(#raceGradCT_${i})`)
      .transition()
      .duration(600)
      .ease(d3.easeCubicOut)
      .delay((_, i) => i * 60)
      .attr("d", (d) => {
        const bx = x(d.race);
        const by = y(d.percentage);
        const bh = height - by;
        if (bh <= radius) {
          return `M${bx},${by} L${bx + barW},${by} L${bx + barW},${height} L${bx},${height} Z`;
        }
        return (
          `M${bx},${by + radius} Q${bx},${by} ${bx + radius},${by}` +
          ` L${bx + barW - radius},${by} Q${bx + barW},${by} ${bx + barW},${by + radius}` +
          ` L${bx + barW},${height} L${bx},${height} Z`
        );
      });

    // ── Value labels ─────────────────────────────────────────────
    g.selectAll(".val-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "val-label")
      .attr("x", (d) => x(d.race) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.percentage) - 6)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .style("font-weight", "700")
      .style("font-family", "Inter, Arial, sans-serif")
      .style("fill", "rgba(255,255,255,0.85)")
      .style("opacity", 0)
      .text((d) => `${d.percentage}%`)
      .transition()
      .delay((_, i) => 500 + i * 60)
      .duration(250)
      .style("opacity", 1);

    // ── X-axis ───────────────────────────────────────────────────
    const xG = g
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0));
    xG.select(".domain").remove();
    xG.selectAll("text")
      .style("fill", "rgba(255,255,255,0.7)")
      .style("font-size", "9px")
      .style("font-weight", "600")
      .style("font-family", "Inter, Arial, sans-serif")
      .attr("dy", "1em")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    // ── Y-axis ───────────────────────────────────────────────────
    const yG = g
      .append("g")
      .call(d3.axisLeft(y).ticks(4).tickFormat((d) => `${d}%`));
    yG.select(".domain").remove();
    yG.selectAll("text")
      .style("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "10px")
      .style("font-family", "Inter, Arial, sans-serif");
    yG.selectAll("line").remove();

    // ── Title ────────────────────────────────────────────────────
    svg
      .append("text")
      .attr("x", margin.left + width / 2)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "700")
      .style("fill", "rgba(255,255,255,0.85)")
      .style("font-family", "Inter, Arial, sans-serif")
      .style("letter-spacing", "0.04em")
      .text("RACE DISTRIBUTION (%)");

    return () => d3.select(el).selectAll("*").remove();
  }, [data]);

  return (
    <svg
      ref={chartRef}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
};

export default RaceDistributionCT;
