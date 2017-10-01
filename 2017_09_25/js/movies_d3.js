//Author: Erick Kelvin
//Based on template by: Emanuele Santos

//renders a chart
function render(data, chartID, title, params, color) {
    let param = params[0];
    let label = "Film";

    //checks if there's more than 1 parameter and do what's necessary
    if (params.length>1) {
        param = params[2];
        if (params[3]=="minus") {
            data.forEach(function(d) {
                d[param] = d[params[0]] - d[params[1]];
            });
        } 
        else if (params[3]=="group-by") {
            data = d3.nest()
                        .key(function(d) { return d[params[1]]; })
                        .rollup(function(v) { return d3.sum(v, function(d) { return d[params[0]]; })
                        })
                        .entries(data);
            param = "value";
            label = "key";
        }

    }

    //defining sorting function
    let compare = function (a, b) { 
        return a[param] > b[param]?-1:1;
    };

    //getting and setting sizes and scales
    max = d3.max(data, function(d) { return +d[param];} );
    let chartWidth = d3.select(chartID).node().getBoundingClientRect().width - 30;
    let chartHeight = d3.select(chartID).node().getBoundingClientRect().height;
    widthScale = d3.scaleLinear()
                    .range([0, chartWidth])
                    .domain([0, max]);

    //showing chart title
    d3.select(chartID)
        .append("h3")
            .text(title);
        

    //initializing chart
    d3.select(chartID).selectAll("div.h-bar")
            .data(data)
        .enter().append("div")
        .attr("class", "h-bar")
        .append("span");

    //filling chart
    d3.select(chartID).selectAll("div.h-bar")
            .data(data)
        .attr("class", "h-bar")
        .style("background-color", color)
        .style("width", function (d) {
            return widthScale(d[param]) + "px";
        })
        .select("span")
            .text(function (d) {
                return d[label];
            });

    //sorting chart
    d3.select(chartID)
        .selectAll("div.h-bar") 
        .sort(compare);

    //drawing x axis
    d3.select(chartID)
        .append("svg")
            .attr("width", chartWidth)
            .attr("height", "10px")
            .style("padding", "20px")
            .append("g")
                .attr("class", "axis")
                .call(d3.axisBottom()
                        .scale(widthScale)
                        .ticks(5)
                        .tickFormat(function(d) { 
                            if (max>1000) {
                                return d / 1000 + " B";
                            }
                            else {
                                return d + " M";
                            }}));            
}

//renders all the charts
function renderAll(error, json) {
    render(json,
           "#chart",
           "Filmes com maior bilheteria",
           ["Worldwide_Gross_M"],
           "#0059b3"
    );
    render(json,
           "#chart2",
           "Filmes com maior orçamento",
           ["Budget_M"],
           "#862d2d"
    );
    render(json,
           "#chart3",
           "Filmes com maior lucro",
           ["Worldwide_Gross_M","Budget_M","Profit", "minus"],
           "#008080"
    );
    render(json,
           "#chart4",
           "Gêneros com maior bilheteria",
           ["Worldwide_Gross_M","Genre","GrossByGenre", "group-by"],
    );
}

//gets and pass the data
d3.json("movies.json", renderAll);

//responsiveness
window.addEventListener("resize", function() {
    let elements = document.getElementsByClassName("chart");
    for (let i=0; i<elements.length; i++) {
        elements[i].innerHTML = "";
    }
    d3.json("movies.json", renderAll);
});