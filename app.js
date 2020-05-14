function renderViz() {
  var randomGenerator = d3.randomNormal()
  var data1 = d3.range(100).map(x => randomGenerator())
  var data2 = d3.range(100).map(x => randomGenerator())
  var data3 = d3.range(100).map(x => randomGenerator())

  d3.select("svg").append("g").attr("id", "chart").attr("transform", "translate(15,20)")

  var colorRamp = d3.scaleOrdinal().domain([0, 1, 2]).range(["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"])

  var yRamp = d3.scaleLinear().domain([-3, 3]).range([450, 0])
  var yAxsis = d3.axisRight().scale(yRamp).tickSize(450)
  d3.select("#chart").append("g").attr("id", "yAxisG").attr("class", "axis").call(yAxsis)

  var histoGramGen = d3.histogram().domain([-3, 3])
    .thresholds([-3, -2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5, 3])

  var areaGen = d3.area()
    .y(d => yRamp(d.x0))
    .x0(d => -d.length * 2)
    .x1(d => d.length * 2)
    .curve(d3.curveCatmullRom)


  d3.select("#chart").selectAll(".violinPath")
    .data([data1, data2, data3])
    .enter()
    .append("path").attr("id", (d, i) => "violinPath" + i).attr("class", "violinPath")
    .attr("transform", (d, i) => `translate(${100 + i * 120}, 0)`)
    .attr("d", d => areaGen(histoGramGen(d)))
    .style("fill", (d, i) => colorRamp(i))
    .on("mouseover", (d, i) => highlight("violinPath" + i, true))
    .on("mouseleave", (d, i) => highlight("violinPath" + i))

  function highlight(id, b) {
    d3.select(`#${id}`)
    .classed("hover", b)
  }

  setInterval(refreshViz, 1000)

  function refreshViz() {
    console.log("refreshing...")
    data1 = d3.range(100).map(x => randomGenerator())
    data2 = d3.range(100).map(x => randomGenerator())
    data3 = d3.range(100).map(x => randomGenerator())

    d3.select("#chart").selectAll(".violinPath")
      .data([data1, data2, data3])
      .transition()
      .duration(500)
      .attr("d", d => areaGen(histoGramGen(d)))
  }
}