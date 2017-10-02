//Author: Erick Kelvin
//Based on template by: Emanuele Santos

//renders a chart
function render(data, chartID, title, axisLabel, params, color) {
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
    let max = d3.max(data, function(d) { return +d[param];} );
    let chartWidth = d3.select(chartID).node().getBoundingClientRect().width - 60;
    
    let widthScale = d3.scaleLinear()
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
            .style("padding-left", "10px")
            .text(function (d) {
                return d[label];
            });
    
    d3.select(chartID).selectAll("div.h-bar")
    .append("span")
            .style("float","right")
            .style("margin-right",function(d) { if (max>1000) return "-32px"; else return "-35px"; })
            .style("color","#000")
            .text(function (d) {
                return prettyPrint(max,d[param]);
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
            .style("padding", "1px 20px 20px 20px")
            .append("g")
                .attr("class", "axis")
                .call(d3.axisBottom()
                        .scale(widthScale)
                        .ticks(5)
                        .tickFormat(function (d) { return prettyPrint(max,d); }));
    d3.select(chartID)
        .append("span")
            .append("text")
                .style("font-size","12px")
                .style("font-weight","bold")
                .text(axisLabel + " ($)");
    
    /*let chartHeight = 35*d3.select(chartID).selectAll("div.h-bar").size() + 5;
    let heightScale = d3.scalePoint()
                        .range([0, chartHeight]);
    
    //drawing y axis
    d3.select(chartID)
        .append("svg")
            .attr("width", "10px")
            .attr("height", chartHeight)
            .style("padding", "20px")
            .style("float", "left")
            .style("margin-top", -(chartHeight)-54)
            .append("g")
                .attr("class", "axis")
                .call(d3.axisLeft()
                        .scale(heightScale)
                        .tickFormat(function (d) { return d[label]; }));*/
    
    
}

function prettyPrint(max,param) {
    if (max>1000) {
        return (param/1000).toFixed(1) + " B";
    }
    else {
        return param + " M";
    }
}
//renders all the charts
function renderAll(error, json) {
    render(json,
           "#chart",
           "Filmes com maior bilheteria",
           "Bilheteria",
           ["Worldwide_Gross_M"],
           "#0059b3"
    );
    render(json,
           "#chart2",
           "Filmes com maior orçamento",
           "Orçamento",
           ["Budget_M"],
           "#862d2d"
    );
    render(json,
           "#chart3",
           "Filmes com maior lucro",
           "Lucro",
           ["Worldwide_Gross_M","Budget_M","Profit", "minus"],
           "#008080"
    );
    render(json,
           "#chart4",
           "Gêneros com maior bilheteria",
           "Bilheteria",
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