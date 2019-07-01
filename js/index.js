const width = 1000, height = 700;
const map = d3.select('#map');

const colors = [
    [3, "#cae1f7"], [12, "#add8ff"],
    [21, "#80b9ee"], [30, "#559ce4"], [39, "#0078d4"],
    [48, "#235a9f"], [57, "#174276"], [66, '#092642']
  ];

const fillColor = (d) => {
  let reArr = [...colors].sort((a, b) => b[0] - a[0]);
  for ( let i = 0; i < reArr.length; i++ ) {
    if (d >= reArr[i][0]) return reArr[i][1];
  }
  return '#FFF';
}

const svg = map.append('svg')
  .attr('width', width)
  .attr('height', height);

const tooltip = map.append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

const Mapping = (education, us) => {
  console.log(us);

  const legend = svg.append('g') 
    .attr('id', 'legend')
    .attr('transform',`translate(${width - 420}, 40)`);
  
  legend.selectAll('rect')
    .data(colors)
    .enter()
    .append('rect')
    .attr('fill', d => fillColor(d[0]))
    .attr('width', 36)
    .attr('height', 9)
    .attr('x', (d, i) => (36 * i) + i);
 
  legend.selectAll('g')
    .data(colors)
    .enter()
    .append('g')
    .attr('transform', (d, i) => `translate(${(36 * i) + i-.5 })`)
    .append('line')
    .attr('stroke', '#000')
    .attr('y1', 15);
  
  legend.selectAll('g')
    .append('text')
    .attr('x', -10)
    .attr('y', 25)
    .text(d => `${d[0]}%`)
    .style('font-size', 12)
  
  svg.selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('fill', d => {
      let result = education.find(obj => obj.fips == d.id);
      return fillColor(result.bachelorsOrHigher);
    })
    .attr('d', d3.geoPath())
    .classed('county', true)
    .attr("data-fips", d => d.id)
    .attr("data-education", function(d) {
      let result = education.find(obj => obj.fips == d.id);
      if(result) return result.bachelorsOrHigher;
       return 0
    })
    .on("mouseover", function(d) {  
        tooltip.style("opacity", .9); 
        tooltip.html(function() {
          let result = education.find(obj => obj.fips == d.id);
          if(result){
            return result['area_name'] + ', ' + result['state'] + ': ' + result.bachelorsOrHigher + '%';
          }
          return 0
       })
        .attr("data-education", function() {
          let result = education.find(obj => obj.fips == d.id);
          if(result) return result.bachelorsOrHigher;
          return 0
        })
        .style("left", (d3.event.pageX + 10) + "px") 
        .style("top", (d3.event.pageY - 28) + "px"); 
    }) 
    .on("mouseout", d => tooltip.style("opacity", 0));
    
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b ))
      .attr("class", "states")
      .attr("d", d3.geoPath())
}

const Education = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
const County = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';


fetch(Education).then(a => a.json())
  .then(a => {
    fetch(County).then(b => b.json())
      .then(b => Mapping(a, b))
  })

