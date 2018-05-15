//var width = 600,
var height = 500,
    padding = 1.5, // separation between same-color circles
    clusterPadding = 6, // separation between different-color circles
    maxRadius = 12,
    scaleFactor = 0.1;

var sqPadding = 3;
var stdLength = 15;

var formatPercent = d3.format(".3%");
var formatKg = d3.format(",.0f");

var loadingValues = {
  gw2014hp2013 : {
    name: 'gw2014hp2013',
    label: 'Global Witness 2014 emporium auction prices with Harvard/Proximity 2013 percentage split',
    totalWeight: 16684386,
    totalValue: 34200000000,
    prices: {i: 19491.97, c: 2213.89, u: 505.52},
    split: {i: 5, c: 35, u: 60}
  },
  mge2014 : {
    name: 'mge2014',
    label: 'MGE 2014 emporium sales prices and percentage split',
    totalWeight: 16684386,
    totalValue: 6600000000,
    prices: {i: 871809., c: 2675., u: 204.},
    split: {i: 0.0046, c: 6.0548, u: 93.9406}
  },
  gw2014 : {
    name: 'gw2014',
    label: 'Global Witness 2014 emporium auction prices and percentage split',
    totalWeight: 16684386,
    totalValue: 16380000000,
    prices: {i: 19491.97, c: 2213.89, u: 505.52},
    split: {i: 1.49, c: 11.33, u: 87.18}
  },
  mge2014hp2016 : {
    name: 'mge2014hp2016',
    label: 'MGE 2014 emporium sales prices with Harvard/Proximity 2016 percentage split',
    totalWeight: 16684386,
    totalValue: 6300000000,
    prices: {i: 871809., c: 2675., u: 204.},
    split: {i: 0.01, c: 3.5, u: 96.49}
  }
}

console.log(loadingValues);

[loadingValues.gw2014hp2013, loadingValues.mge2014, loadingValues.gw2014, loadingValues.mge2014hp2016]
.map(function(s) {
  d3.select('#select_preset')
    .append("option")
    .text(s.label)
    .attr('value', s.name);
})


var chartBox = d3.select("#pricing_viz").node().getBoundingClientRect();
//var chartBox = d3.select("#pricing_viz").getBoundingClientRect();

console.log(chartBox);

var margin = {top: 10, right: 10, bottom: 10, left: 10};
var width = (chartBox.width - margin.left - margin.right);
var m = 3; // number of distinct clusters

var color = d3.scale.linear().domain(d3.range(m))
  //      .interpolate(d3.interpolateHcl)
        .range(["#006743","#00A86B","#83CCB0"]);

var clusters = new Array(m);

var currentData;
var split, prices, totalWeight, totalValue;
var n, sizes, grades, sqPositions, sqClusterPositions;
var start;
var qtyTitle, qtyLabelPercent , qtyLabelKg, valueTitle, valueLabel;
var nodes;
var node, nodeEnter;
var force;
var svg;


updateData();

function updateData(values) {

  currentData = values ? loadingValues[values] : loadingValues.gw2014hp2013;

  //var split = {i: 0.0046, c: 6.0548, u:93.9406};
  //var split = {i: 5, c: 35, u: 60};
  //var prices = {i: 871809., c: 2675., u:204.};
  //var prices = {i: 19491.97, c: 2213.89, u: 505.52};

  split = currentData.split;
  prices = currentData.prices;
  totalWeight = currentData.totalWeight;
  totalValue = currentData.totalValue;

//  var n, sizes, grades, sqPositions, sqClusterPositions;
  [n,sizes,grades] = setGrades(split);
  [sqPositions, sqClusterPositions] = setSqPos(grades);

  start = false;
  
  // The largest node for each cluster.

//  var qtyTitle, qtyLabelPercent , qtyLabelKg, valueTitle, valueLabel;


  nodes = d3.range(n).map(function(i) {

    [grade, size] = getGrade(i);
  //  console.log(grade,size);

    [xsPos,ysPos] = getSqPos(i);
  //  console.log(xsPos,ysPos);


  //  var grade = Math.random() <= split.u ? 0 : (Math.random() <= split.i ? 2 : 1);
    var r = Math.pow(getPrice(grade) * size * scaleFactor,0.5),
        l = Math.pow(size,0.5) * stdLength,
  //      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
        d = {
          cluster: grade,
          radius: r,
          length: l,
  //        x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
  //        y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
          x: 2 * width / 3 + Math.random(),
          y: grade/m * height + Math.random(),
          xs: xsPos * (stdLength + sqPadding) + sqPadding,
          ys: height / 4 + ysPos * (stdLength + sqPadding)
        };
    if (!clusters[i] || (r > clusters[i].radius)) {
      clusters[i] = {
          cluster: grade,
          length: l,
          radius: r,  
          x: 2 * width / 3,
          y: height/2,
          xs: width / 4,
          ys: height / 4 + getSqClusterY(grade) * (stdLength + sqPadding)
        };
    }
    return d;
  });

  force = d3.layout.force()
      .nodes(nodes)
      .size([width, height])
      .gravity(.01)
      .charge(0)
      .on("tick", tick);//.start();

//  if (svg) svg.removeAll();
//  if (svg) svg.selectAll("*").remove();
  d3.select("#pricing_viz").selectAll("svg").remove();
  svg = d3.select("#pricing_viz").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//  node, nodeEnter;

  resetAll();
}

function setGrades(split) {
  var n = 0;
  var sizes = [];
  var grades = [];
  
  [split.i, split.c, split.u].map(function(d,s) {
    left = d;
    while (left > 0) {
      left -= 1;
      if (left < 0) sizes.push(1 + left);
      else sizes.push(1);
      grades.push(s);
    }
  });
  
  n = sizes.length;
  return [n,sizes,grades];
}

function getGrade(i) {
//  grade = Math.random() <= split.u ? 0 : (Math.random() <= split.i ? 2 : 1);
  return [grades[i],sizes[i]];
}

function getPrice(g) {
  switch (g) {
      case(0): 
        return prices['i'];
      case(1): 
        return prices['c'];
      case(2): 
        return prices['u'];
    }
}


function getJadeValue(g) {
  return getPrice(g) * getJadePercent(g) * totalWeight;
}

function getJadeQty(g) {
  return getJadePercent(g) * totalWeight;
}

function getJadePercent(g) {
  switch (g) {
      case(0): 
        return split['i']/100;
      case(1): 
        return split['c']/100;
      case(2): 
        return split['u']/100;
    }
}

function setSqPos(grades) {
  var positions = [];
  var clusterPositions = [];
  var px, py;
  px = 0;
  py = 1;
  
  positions.push([px,py]);
  clusterPositions.push(py);
  
  for (g = 1; g < grades.length; g++) {
    if (grades[g] != grades[g-1]) {
      px = 0;
      py += 2;
      clusterPositions.push(py);
    } else {
      px += 1;
      if (px > 9) {
        px = 0;
        py += 1;
      } 
    }
    
    positions.push([px,py]);
  }
  
  return [positions, clusterPositions];
}

function getSqPos(i) {
  return sqPositions[i];
}

function getSqClusterY(g) {
  return sqClusterPositions[g];
}

function tick(e) {
  nodeEnter.each(cluster(10 * e.alpha * e.alpha))
      .each(collide(.5))
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function(d) {
    var cluster = clusters[d.cluster];
//    console.log(cluster.x,cluster.y);
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

function startAnimation() {
     
  force.start();
  nodeEnter.transition()
    .duration(1000)
    .delay(function(d, i) { return i * 100; })
    .attrTween("r", function(d) {
      var i = d3.interpolate(0, d.radius);
      return function(t) { return d.radius = i(t); };
    });
  
  squareEnter.transition()
      .duration(1000)
      .delay(function(d, i) { return i * 100; })
      .attrTween("width", function(d) {
        var i = d3.interpolate(0, d.length);
        return function(t) { return d.length = i(t); };
      })
      .attrTween("height", function(d) {
        var i = d3.interpolate(0, d.length);
        return function(t) { return d.length = i(t); };
      });
  
  qtyLabelPercent
    .transition()
    .duration(1000 + 100*n)
    .tween("text", function () {
      console.log(this);
      var i = d3.interpolateNumber(0, 1);
      return function (t) {
        d3.select(this).text(formatPercent(i(t)) + ' by weight');
      };
    });
  
  qtyLabelKg
    .transition()
    .duration(1000 + 100*n)
    .tween("text", function () {
      console.log(this);
      var i = d3.interpolateNumber(0, totalWeight);
      return function (t) {
        d3.select(this).text(formatKg(i(t)) + ' kg');
      };
    });
  
  valueLabel
    .transition()
    .duration(1000 + 100*n)
    .tween("text", function () {
      console.log(this);
      var i = d3.interpolateNumber(0, totalValue);
      return function (t) {
        d3.select(this).text('USD ' + formatKg(i(t)));
      };
    });
  
//  handleMouseOver();
}



function resetAll() {
  
  force.stop();
  
  svg.selectAll("circle").remove();
  svg.selectAll("rect").remove();
  svg.selectAll("text").remove();
  
  node = svg.selectAll("circle")
    .data(nodes);
    
  nodeEnter = node.enter()
    .append("circle")
    .style("fill", function(d) { 
//      console.log(d);
      return color(d.cluster); })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr('stroke','#FF6E48')
    .attr('stroke-width','0px')
    .call(force.drag)
    .on('mouseover', function(d) { handleMouseover(d); })
    .on('mouseout', function(d) { handleMouseout(d); });
  
  
  
  square = svg.selectAll("rect")
    .data(nodes);
    
  squareEnter = square.enter()
    .append("rect")
    .style("fill", function(d) { return color(d.cluster); })
    .attr("x", function(d) { return d.xs; })
    .attr("y", function(d) { return d.ys; })
    .attr('stroke','#FF6E48')
    .attr('stroke-width','0px')
    .call(force.drag)
    .on('mouseover', function(d) { handleMouseover(d); })
    .on('mouseout', function(d) { handleMouseout(d); });
  
  addAllText();
  
}

function handleMouseover(d) {
  var grade = d.cluster;
  var gradeTxt = '';
  d3.selectAll('circle')
    .filter(function(d) {return d.cluster == grade;})
    .attr('stroke-width','3px');
  d3.selectAll('rect')
    .filter(function(d) {return d.cluster == grade;})
    .attr('stroke-width','2px');

  d3.selectAll('.mainLbl')
    .attr('display','none');
  d3.selectAll('.selectLbl')
    .attr('display','block');
  
  d3.selectAll('.selectLbl')
    .attr('fill',color(grade));
  
  switch (grade) {
    case 0:
      gradeText = 'Imperial jade';
      break;
    case 1:
      gradeText = 'Commercial jade';
      break;
    case 2:
      gradeText = 'Utility jade';
      break;
  }
  
  d3.select('#qtyTitleSelect')
    .text('Quantity of ' + gradeText);
  
  d3.select('#valueTitleSelect')
    .text('Value of ' + gradeText);
  
  d3.select('#qtyPercentSelect')
    .text(formatPercent(getJadePercent(grade)) + ' by weight');
  
  d3.select('#qtyKgSelect')
    .text(formatKg(getJadeQty(grade)) + ' kg');
  
  d3.select('#valueSelect')
    .text('USD ' + formatKg(getJadeValue(grade)));
  
}

function handleMouseout(d) {
  d3.selectAll('circle')
    .attr('stroke-width','0px');
  d3.selectAll('rect')
    .attr('stroke-width','0px');

  d3.selectAll('.mainLbl')
    .attr('display','block');
  d3.selectAll('.selectLbl')
    .attr('display','none');
  
}

function addAllText() {
  
  
  // Main labels
  
  qtyTitle = svg.append('text')
    .attr('class','mainLbl')
    .attr('id','qtyTitle')
    .attr('x',  (stdLength + sqPadding) * 5)
    .attr('y', stdLength * 2 + sqPadding)
    .text('Quantity');

  qtyLabelPercent = svg.append('text')
    .attr('class','mainLbl')
    .attr('id','qtyPercent')
    .attr('x',  (stdLength + sqPadding) * 5)
    .attr('y', stdLength * 2 + sqPadding)
    .attr('dy', '1.2em');

  qtyLabelKg = svg.append('text')
    .attr('class','mainLbl')
    .attr('id','qtyKg')
    .attr('x', (stdLength + sqPadding) * 5)
    .attr('y', stdLength * 2 + sqPadding)
    .attr('dy', '2.4em');

  valueTitle = svg.append('text')
    .attr('class','mainLbl')
    .attr('id','valueTitle')
    .attr('x', 2 * width / 3)
    .attr('y', stdLength * 2 + sqPadding)
    .text('Value');

  valueLabel = svg.append('text')
    .attr('class','mainLbl')
    .attr('id','value')
    .attr('x', 2 * width / 3)
    .attr('y', stdLength * 2 + sqPadding)
    .attr('dy', '1.2em');
  
  // Selection labels
  
  qtyTitleSelect = svg.append('text')
    .attr('class','selectLbl')    
    .attr('id','qtyTitleSelect')
    .attr('x',  (stdLength + sqPadding) * 5)
    .attr('y', stdLength * 2 + sqPadding)
    .text('Quantity');

  qtyLabelPercentSelect = svg.append('text')
    .attr('class','selectLbl')
    .attr('id','qtyPercentSelect')
    .attr('x',  (stdLength + sqPadding) * 5)
    .attr('y', stdLength * 2 + sqPadding)
    .attr('dy', '1.2em');

  qtyLabelKgSelect = svg.append('text')
    .attr('class','selectLbl')
    .attr('id','qtyKgSelect')
    .attr('x', (stdLength + sqPadding) * 5)
    .attr('y', stdLength * 2 + sqPadding)
    .attr('dy', '2.4em');

  valueTitleSelect = svg.append('text')
    .attr('class','selectLbl')
    .attr('id','valueTitleSelect')
    .attr('x', 2 * width / 3)
    .attr('y', stdLength * 2 + sqPadding)
    .text('Value');

  valueLabelSelect = svg.append('text')
    .attr('class','selectLbl')
    .attr('id','valueSelect')
    .attr('x', 2 * width / 3)
    .attr('y', stdLength * 2 + sqPadding)
    .attr('dy', '1.2em');
  
  
  
  d3.selectAll('text')
    .attr('text-anchor', 'middle')
    .attr('fill', "#00A86B");
  
  d3.selectAll('.selectLbl')
    .attr('display','none');
    
}


d3.select('#start_button').on('click', function() {
  console.log(start);
  
  if (start) {
    this.innerHTML = "START";
    start = false;
    resetAll();
  } 
  else {
    this.innerHTML = "RESET";
    start = true; 
    startAnimation();
  }

});


d3.select('#select_preset').on('change', function() {
  console.log(this.value);
  updateData(this.value);
  document.getElementById('start_button').innerHTML = "START";
  start = false;
//  resetAll();

});
