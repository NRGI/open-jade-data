//var width = 600,
var height = 500,
    padding = 1.5, // separation between same-color circles
    clusterPadding = 6, // separation between different-color circles
    maxRadius = 12;

var chartBox = d3.select("#pricing_viz").node().getBoundingClientRect();
//var chartBox = d3.select("#pricing_viz").getBoundingClientRect();

console.log(chartBox);

var margin = {top: 10, right: 30, bottom: 10, left: 20};
var width = (chartBox.width - margin.left - margin.right);


var n = 100, // total number of nodes
    m = 3; // number of distinct clusters

var split = {i: .1, c: 0.1, u:0.8};

var color = d3.scale.linear().domain(d3.range(m))
//      .interpolate(d3.interpolateHcl)
      .range(["#83CCB0","#00A86B","#006743"]);

// The largest node for each cluster.
var clusters = new Array(m);

var nodes = d3.range(n).map(function() {
  var i = Math.random() <= split.u ? 0 : (Math.random() <= split.i ? 2 : 1),
      r = Math.pow((i+1)*2,2),
//      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
      d = {
        cluster: i,
        radius: r,
//        x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
//        y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
        x: width / 4 + Math.random(),
        y: i/m * height + Math.random()
      };
  if (!clusters[i] || (r > clusters[i].radius)) {
    clusters[i] = {
        cluster: i,
        radius: r,  
        x: 3 * width / 4,
        y: height/2
      };
  }
  return d;
});

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(.01)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("#pricing_viz").append("svg")
    .attr("width", width)
    .attr("height", height);

var node = svg.selectAll("circle")
    .data(nodes)
  .enter().append("circle")
    .style("fill", function(d) { return color(d.cluster); })
    .call(force.drag);

node.transition()
    .duration(1750)
    .delay(function(d, i) { return i * 50; })
    .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });

function tick(e) {
  node
      .each(cluster(10 * e.alpha * e.alpha))
      .each(collide(.5))
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function(d) {
    var cluster = clusters[d.cluster];
    console.log(cluster.x,cluster.y);
    if (cluster === d) return;
    var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
    if (l != r) {
      l = (l - r) / l * alpha;
      d.x -= x *= l;
      d.y -= y *= l;
//      cluster.x += x;
//      cluster.y += y;
    }
  };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}