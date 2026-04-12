import { useEffect, useRef } from "react";
import * as d3 from "d3";

const ConnecticutVotesChart = () => {
  const chartRef = useRef(null);

  const data = [
    { party: "Democratic", votes: 1813000, color: "#4A90D9", gradientId: "demGradCT" },
    { party: "Republican", votes: 1160320, color: "#E85C50", gradientId: "repGradCT" },
  ];

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    d3.select(el).selectAll("*").remove();

    const margin = { top: 36, right: 24, bottom: 44, left: 52 };
    const parentWidth  = el.parentElement.offsetWidth  || 400;
    const parentHeight = el.parentElement.offsetHeight || 240;
    const width  = parentWidth  - margin.left - margin.right;
    const height = parentHeight - margin.top  - margin.bottom;

    const svg = d3.select(el)
      .attr("width",  parentWidth)
      .attr("height", parentHeight);

    // ── Defs: gradients ──────────────────────────────────────────
    const defs = svg.append("defs");
    data.forEach(({ gradientId, color }) => {
      const grad = defs.append("linearGradient")
        .attr("id", gradientId)
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 1);
      grad.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0.5);
    });

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    // ── Scales ───────────────────────────────────────────────────
    const x = d3.scaleBand()
      .domain(data.map(d => d.party))
      .range([0, width])
      .padding(0.45);

    const maxVal = d3.max(data, d => d.votes);
    const y = d3.scaleLinear()
      .domain([0, maxVal * 1.2])
      .nice()
      .range([height, 0]);

    // ── Grid lines ───────────────────────────────────────────────
    g.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y).ticks(5).tickSize(-width).tickFormat(""))
      .call(grp => grp.select(".domain").remove())
      .selectAll("line")
      .style("stroke", "rgba(255,255,255,0.18)")
      .style("stroke-dasharray", "3,3");

    // ── Bars ─────────────────────────────────────────────────────
    const barW = x.bandwidth();
    const radius = 5;

    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "bar")
      .attr("d", d => {
        const bx = x(d.party);
        const by = height; // start at baseline for animation
        return `M${bx},${by + radius} Q${bx},${by} ${bx + radius},${by}
                L${bx + barW - radius},${by} Q${bx + barW},${by} ${bx + barW},${by + radius}
                L${bx + barW},${by} L${bx},${by} Z`;
      })
      .attr("fill", d => `url(#${d.gradientId})`)
      .transition().duration(700).ease(d3.easeCubicOut)
      .attr("d", d => {
        const bx = x(d.party);
        const by = y(d.votes);
        const bh = height - by;
        if (bh <= radius) {
          return `M${bx},${by} L${bx+barW},${by} L${bx+barW},${height} L${bx},${height} Z`;
        }
        return `M${bx},${by + radius} Q${bx},${by} ${bx + radius},${by}
                L${bx + barW - radius},${by} Q${bx + barW},${by} ${bx + barW},${by + radius}
                L${bx + barW},${height} L${bx},${height} Z`;
      });

    // ── Value labels ─────────────────────────────────────────────
    g.selectAll(".val-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "val-label")
      .attr("x", d => x(d.party) + x.bandwidth() / 2)
      .attr("y", d => y(d.votes) - 8)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .style("font-family", "Inter, Arial, sans-serif")
      .style("fill", "rgba(255,255,255,0.9)")
      .style("opacity", 0)
      .text(d => `${(d.votes / 1e6).toFixed(2)}M`)
      .transition().delay(600).duration(300)
      .style("opacity", 1);

    // ── X-axis ───────────────────────────────────────────────────
    const xG = g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickSize(0));
    xG.select(".domain").remove();
    xG.selectAll("text")
      .style("fill", "rgba(255,255,255,0.75)")
      .style("font-size", "12px")
      .style("font-weight", "600")
      .style("font-family", "Inter, Arial, sans-serif")
      .attr("dy", "1.2em");

    // ── Y-axis ───────────────────────────────────────────────────
    const yG = g.append("g")
      .call(d3.axisLeft(y).ticks(4).tickFormat(d => `${(d / 1e6).toFixed(1)}M`));
    yG.select(".domain").remove();
    yG.selectAll("text")
      .style("fill", "rgba(255,255,255,0.5)")
      .style("font-size", "10px")
      .style("font-family", "Inter, Arial, sans-serif");
    yG.selectAll("line").remove();

    // ── Title ────────────────────────────────────────────────────
    svg.append("text")
      .attr("x", margin.left + width / 2)
      .attr("y", 18)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-weight", "700")
      .style("fill", "rgba(255,255,255,0.85)")
      .style("font-family", "Inter, Arial, sans-serif")
      .style("letter-spacing", "0.04em")
      .text("VOTES — DEM VS REP");

    // ── Party color legend dots ───────────────────────────────────
    const legendX = margin.left + width - 10;
    data.forEach((d, i) => {
      svg.append("circle")
        .attr("cx", legendX - (i === 0 ? 65 : 0))
        .attr("cy", 18)
        .attr("r", 5)
        .attr("fill", d.color);
      svg.append("text")
        .attr("x", legendX - (i === 0 ? 57 : -8))
        .attr("y", 22)
        .style("font-size", "10px")
        .style("fill", "rgba(255,255,255,0.65)")
        .style("font-family", "Inter, Arial, sans-serif")
        .text(d.party === "Democratic" ? "Dem" : "Rep");
    });

    return () => d3.select(el).selectAll("*").remove();
  }, []);

  return <svg ref={chartRef} style={{ width: "100%", height: "100%", display: "block" }} />;
};

export default ConnecticutVotesChart;
