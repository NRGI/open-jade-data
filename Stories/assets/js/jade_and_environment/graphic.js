/* 
	I've created a function here that is a simple d3 chart.
	This could be anthing that has discrete steps, as simple as changing
	the background color, or playing/pausing a video.
	The important part is that it exposes and update function that
	calls a new thing on a scroll trigger.
*/
window.createGraphic = function(graphicSelector) {
	var graphicEl = d3.select('.graphic')
	var graphicVisEl = graphicEl.select('.graphic__vis')
	var graphicProseEl = graphicEl.select('.graphic__prose')

	var margin = 0
	var sizeX = 1920*.3
	var sizeY = 1080*.3
	var chartSize = sizeX - margin * 2
	var scaleX = null
	var scaleR = null
	var data = [8, 6, 7, 5, 3, 0, 9]
	var extent = d3.extent(data)
	var minR = 10
	var maxR = 24
	
	// actions to take on each step of our scroll-driven story
	var steps = [
		function step0() {
			// circles are centered and small
//			var t = d3.transition()
//				.duration(800)
//				.ease(d3.easeQuadInOut)
			    

			var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_1984.jpg");
		},

		function step1() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_1990.jpg");
    },
		function step2() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_1996.jpg");
    },
		function step3() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2000.jpg");
    },
		function step4() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2006.jpg");
    },
		function step5() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2010.jpg");
    },
		function step6() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2014.jpg");
    },
		function step7() {
      
      var item = graphicVisEl.selectAll('.item')
      
      item.attr("xlink:href", "assets/img/environment/Hpakant_2018.jpg");
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
		var svg = graphicVisEl.append('svg')
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

		item.append('text')
			.text(function(d) { return d })
			.attr('y', 1)
			.style('opacity', 0)
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