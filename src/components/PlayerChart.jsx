import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import playerChartStyles from "../styles/playerChartStyles";

const PlayerChart = ({ players, totalMatches }) => {
  const chartRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const playersPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(players.length / playersPerPage));

  useEffect(() => {
    if (!players || totalMatches === 0) {
      return;
    }

    const startIdx = currentPage * playersPerPage;
    let chunk = players.slice(startIdx, startIdx + playersPerPage);

    while (chunk.length < playersPerPage) {
      chunk.push({ name: "", wins: 0, losses: 0, draws: 0, participation: 0 });
    }

    const fixedXDomain = Array.from({ length: playersPerPage }, (_, i) => i);

    const svg = d3.select(chartRef.current);
    svg.selectAll("*").remove();

    const width = window.innerWidth / 2;
    const height = 300;
    const margin = { top: 60, right: 20, bottom: 50, left: 50 };

    const keys = ["wins", "losses", "draws", "participation"];
    const color = d3
      .scaleOrdinal()
      .domain(keys)
      .range(["steelblue", "tomato", "gray", "green"]);

    const x = d3
      .scaleBand()
      .domain(fixedXDomain)
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const step = totalMatches > 30 ? 5 : totalMatches > 20 ? 2 : 1;
    const y = d3
      .scaleLinear()
      .domain([0, totalMatches])
      .range([height - margin.bottom, margin.top]);

    const svgContainer = svg
      .attr("viewBox", [0, 0, width, height])
      .classed("chart", true);

    if (currentPage === 0) {
      const legend = svgContainer
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top - 40})`);
      keys.forEach((key, i) => {
        const group = legend
          .append("g")
          .attr("transform", `translate(${i * 120},0)`);
        group
          .append("rect")
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", color(key));
        group
          .append("text")
          .attr("x", 15)
          .attr("y", 10)
          .text(key)
          .style("font-size", "12px")
          .attr("fill", "black");
      });
    }

    svgContainer
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .tickSizeOuter(0)
          .tickFormat((i) => (chunk[i] && chunk[i].name ? chunk[i].name : ""))
      )
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svgContainer
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickValues(
            [...Array(totalMatches + 1).keys()].filter(
              (n) => n % step === 0 || n === totalMatches
            )
          )
      );

    svgContainer
      .append("g")
      .selectAll("g")
      .data(chunk)
      .join("g")
      .attr("transform", (d, i) => `translate(${x(i)},0)`)
      .selectAll("rect")
      .data((d) => keys.map((key) => ({ key, value: d[key] || 0 })))
      .join("rect")
      .attr("x", (d, i) => i * (x.bandwidth() / keys.length))
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => y(0) - y(d.value))
      .attr("width", x.bandwidth() / keys.length)
      .attr("fill", (d) => color(d.key))
      .attr("opacity", (d, _, arr) => (arr[0].value === 0 ? 0.2 : 1));

    svgContainer
      .append("g")
      .selectAll("g")
      .data(chunk)
      .join("g")
      .attr("transform", (d, i) => `translate(${x(i)},0)`)
      .selectAll("text")
      .data((d) => keys.map((key) => ({ key, value: d[key] || 0 })))
      .join("text")
      .attr(
        "x",
        (d, i) =>
          i * (x.bandwidth() / keys.length) + x.bandwidth() / (2 * keys.length)
      )
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .style("font-size", "10px")
      .text((d) => (d.value > 0 ? d.value : ""));
  }, [players, totalMatches, currentPage]);

  return (
    <div style={playerChartStyles.container}>
      {players.length === 0 || totalMatches === 0 ? (
        <p style={playerChartStyles.emptyState}>
          No players available to display on chart.
        </p>
      ) : (
        <>
          <svg ref={chartRef} style={playerChartStyles.chart} />
          {totalPages > 1 && (
            <div style={playerChartStyles.paginationContainer}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                style={playerChartStyles.paginationButton}
              >
                {"<"} Prev
              </button>
              <span style={playerChartStyles.paginationText}>
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                style={playerChartStyles.paginationButton}
              >
                Next {">"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PlayerChart;
