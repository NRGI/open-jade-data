/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/
window.createGraphic = function(graphicSelector) {
  
  var chartContainer = d3.select(graphicSelector)._groups[0][0];
  console.log(chartContainer)
	var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
	var graphicProseEl = graphicEl.select('.graphic__prose')

	var margin = 0
  console.log(chartContainer)
//	var sizeX = 1920*.3
//	var sizeY = 1080*.3
	var sizeX = chartContainer.clientWidth
	var sizeY = sizeX*1080/1920
	var chartSize = sizeX - margin * 2
	var scaleX = null
	var scaleR = null
	var data = [8, 6, 7, 5, 3, 0, 9]
	var extent = d3.extent(data)
	var minR = 10
	var maxR = 24
  
  var t = d3.transition()
				.duration(800)
				.ease(d3.easeQuadInOut)
	
	// actions to take on each step of our scroll-driven story
	var steps = [
		function step0() {
			// circles are centered and small
//			var t = d3.transition()
//				.duration(800)
//				.ease(d3.easeQuadInOut)
			 
      console.log(graphicVisEl);

			var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/IndoChina_1984.jpg");
      
      
      graphicVisEl.selectAll('text')
        .text("")
		},
    function step1() {
			// circles are centered and small
//			var t = d3.transition()
//				.duration(800)
//				.ease(d3.easeQuadInOut)
			 
      console.log(graphicVisEl);

			var item = graphicVisEl.selectAll('.item')
        
      item.attr("xlink:href", "assets/img/environment/IndoChina_1984.jpg")
      
      
      graphicVisEl.selectAll('text')
        .text("")
		},

		function step2() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Northern_Myanmar_1984.jpg");
      
      graphicVisEl.selectAll('text').selectAll('tspan').remove();
      
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("Hpakant is located in Kachin State");
      
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("in Northern Myanmar")
        .attr('dy','1.2rem')
        .attr('dx','-20.4rem');
    },
		function step3() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Northern_Myanmar_Zoom_1984.jpg");
      
    },
		function step4() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_1984.jpg");
      
      graphicVisEl.selectAll('text').selectAll('tspan').remove();
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("Hpakant in 1984");
    },
		function step5() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_1992.jpg");
      
      graphicVisEl.selectAll('text').selectAll('tspan').remove();
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("Hpakant in 1992");
    },
		function step6() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2000.jpg");
      
      graphicVisEl.selectAll('text').selectAll('tspan').remove();
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("Hpakant in 2000");
    },
		function step7() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2008.jpg");
      
      graphicVisEl.selectAll('text').selectAll('tspan').remove();
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("Hpakant in 2008");
    },
		function step8() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2016.jpg");
      
      graphicVisEl.selectAll('text').selectAll('tspan').remove();
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("Hpakant in 2016");
    },
		function step9() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2018.jpg");
      
      graphicVisEl.selectAll('text').selectAll('tspan').remove();
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("Hpakant in 2018");
    },
		function step10() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2018.jpg");
      
      graphicVisEl.selectAll('text').selectAll('tspan').remove();
      graphicVisEl.selectAll('text')
        .append('tspan')
        .text("Hpakant in 2018");
    }
    
	]

	// update our chart
	function update(step) {
		steps[step].call()
	}
	
	// little helper for string concat if using es5
	function translate(x, y) {
		return 'translate(' + x + ',' + y + ')'
	}

	function setupCharts() {
		var svg = graphicVisEl
      .append('svg')
			.attr('width', sizeX + 'px')
			.attr('height', sizeY + 'px')
		
		var chart = svg.append('g')
			.classed('chart', true)
			.attr('transform', 'translate(' + margin + ',' + margin + ')')

		scaleR = d3.scaleLinear()
		scaleX = d3.scaleBand()

		var domainX = d3.range(data.length)

		scaleX
			.domain(domainX)
			.range([0, chartSize])
			.padding(1)

		scaleR
			.domain(extent)
			.range([minR, maxR])

//		var item = chart.selectAll('.item')
//			.data(data)
//			.enter().append('g')
//				.classed('item', true)
//				.attr('transform', translate(chartSize / 2, chartSize / 2))
//		
//		item.append('circle')
//			.attr('cx', 0)
//			.attr('cy', 0)
    var item = chart.selectAll("img").data([0])
			.enter()
        .append("image")
        .attr('width', sizeX)
        .attr('height', sizeY)
        .attr("xlink:href", "assets/img/environment/Hpakant_1984.jpg")
				.classed('item', true)
//				.attr('transform', translate(chartSize / 2, chartSize / 2))
		
//		item.append('circle')
//			.attr('cx', 0)
//			.attr('cy', 0)

		chart.append('text')
			.text(function(d) { return d })
      .attr('transform', 'translate(' + sizeX/40 + ',' + sizeY/5 + ')')
      .classed('item-text', true)
    
    
//			.attr('y', 1)
//			.style('opacity', 0)
	}

	function setupProse() {
		var height = window.innerHeight * 0.5
		graphicProseEl.selectAll('.trigger')
			.style('height', height + 'px')
	}

	function init() {
		setupCharts()
		setupProse()
		update(0)
	}
	
	init()
	
	return {
		update: update,
	}
}