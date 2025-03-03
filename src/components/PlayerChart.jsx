import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const PlayerChart = ({ players, totalMatches }) => {
  const chartRefs = useRef([]);

  useEffect(() => {
    if (!players || players.length === 0 || totalMatches === 0) {
      return;
    }

    const chunks = [];
    for (let i = 0; i < players.length; i += 10) {
      chunks.push(players.slice(i, i + 10));
    }

    const fixedXDomain = Array.from({ length: 10 }, (_, i) => `Player ${i + 1}`);

    chunks.forEach((chunk, index) => {
      const svg = d3.select(chartRefs.current[index]);
      svg.selectAll("*").remove();

      const width = window.innerWidth / 2;
      const height = 300;
      const margin = { top: 60, right: 20, bottom: 50, left: 50 };

      const keys = ["wins", "losses", "draws", "participation"];
      const color = d3.scaleOrdinal().domain(keys).range(["steelblue", "tomato", "gray", "green"]);

      const x = d3
        .scaleBand()
        .domain(fixedXDomain)
        .range([margin.left, width - margin.right])
        .padding(0.2);

      const step = totalMatches > 30 ? 5 : totalMatches > 20 ? 2 : 1;
      const y = d3.scaleLinear().domain([0, totalMatches]).range([height - margin.bottom, margin.top]);

      const svgContainer = svg.attr("viewBox", [0, 0, width, height]).classed("chart", true);

      if (index === 0) {
        const legend = svgContainer.append("g").attr("transform", `translate(${margin.left},${margin.top - 40})`);
        keys.forEach((key, i) => {
          const group = legend.append("g").attr("transform", `translate(${i * 120},0)`);
          group.append("rect").attr("width", 10).attr("height", 10).attr("fill", color(key));
          group.append("text").attr("x", 15).attr("y", 10).text(key).style("font-size", "12px").attr("fill", "black");
        });
      }

      svgContainer
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3.axisBottom(x).tickSizeOuter(0).tickFormat((_, i) => (chunk[i] ? chunk[i].name : ""))
        )
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svgContainer
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3.axisLeft(y).tickValues(
            [...Array(totalMatches + 1).keys()].filter((n) => n % step === 0 || n === totalMatches)
          )
        );

      // Bars
      svgContainer
        .append("g")
        .selectAll("g")
        .data(chunk)
        .join("g")
        .attr("transform", (d, i) => `translate(${x(fixedXDomain[i])},0)`)
        .selectAll("rect")
        .data((d) =>
          keys.map((key) => ({
            key,
            value: d[key],
          }))
        )
        .join("rect")
        .attr("x", (d, i) => i * (x.bandwidth() / keys.length))
        .attr("y", (d) => y(d.value))
        .attr("height", (d) => y(0) - y(d.value))
        .attr("width", x.bandwidth() / keys.length)
        .attr("fill", (d) => color(d.key));

      svgContainer
        .append("g")
        .selectAll("g")
        .data(chunk)
        .join("g")
        .attr("transform", (d, i) => `translate(${x(fixedXDomain[i])},0)`)
        .selectAll("text")
        .data((d) =>
          keys.map((key) => ({
            key,
            value: d[key],
          }))
        )
        .join("text")
        .attr("x", (d, i) => i * (x.bandwidth() / keys.length) + x.bandwidth() / (2 * keys.length))
        .attr("y", (d) => y(d.value) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text((d) => d.value);
    });
  }, [players, totalMatches]);

  return (
    <div>
      {Array.from({ length: Math.ceil(players.length / 10) }, (_, index) => (
        <svg key={index} ref={(el) => (chartRefs.current[index] = el)} style={{ marginBottom: "20px" }} />
      ))}
    </div>
  );
};

export default PlayerChart;
