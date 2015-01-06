(function ($) {
        
	AjaxSolr.BilevelWidget = AjaxSolr.AbstractFacetWidget.extend({
		

				  
		afterRequest: function () 
		{
				//$(this.target).empty();
				//default values
				var width= 960;
				var height= 500;
				var margin= {top: 40,right: 10,bottom: 10,left: 10};
				var env = this;
				
				
		if (Manager.currentTab==undefined || Manager.currentTab!='Bilevel Partition')
				return;
			

			var self = this;
			$(this.target).empty();
			var innerhtml='';
			for (var i in this.field){
				innerhtml+='					<div id="iann_bilevel_'+this.field[i]+'"></div>';
			}	
			$(this.target).html(innerhtml);	
			/*
			var facetDataKeysDisplay = [];
			for (var i = 0, l = this.field.length; i < l; i++) {
				var field= this.field[i],
					//chartTitle=this.chartTitle[i];
	    		//var facetDataValues = [];
	    		var facetDataKeysDisplay = [];
				for (var facet in this.manager.response.facet_counts.facet_fields[field]) {
					var count = parseInt(this.manager.response.facet_counts.facet_fields[field][facet]);
					facetDataKeysDisplay.push(field +":" +facet);
					//facetDataValues.push(count);	
	//				$(this.target).append(AjaxSolr.theme('tag', facet, parseInt(objectedItems[i].count / maxCount * 10), self.clickHandler(facet)));
					
				}
			}

*/

  // Compute the initial layout on the entire tree to sum sizes.
  // Also compute the full name and fill color for each node,
  // and stash the children so they can be restored as we descend.
 			
			/*
			for (var i = 0, l = this.manager.response.response.docs.length; i < l; i++) {
				var doc = this.manager.response.response.docs[i];
				var isAdmin=false;
				if (typeof this.manager.isAdmin  != "undefined") 
					isAdmin=this.manager.isAdmin;
				$(this.target).append(AjaxSolr.theme('result', doc, AjaxSolr.theme('snippet', doc),isAdmin,this.manager.solrEditUrl));

				var items = [];
				items = items.concat(this.facetLinks('field', doc.field));
				items = items.concat(this.facetLinks('keyword', doc.keyword));
				if (doc.country)	items = items.concat(AjaxSolr.theme('facet_link', doc.country, this.facetHandler('country', doc.country)));
				if (doc.city)		items = items.concat(AjaxSolr.theme('facet_link', doc.city, this.facetHandler('city', doc.city)));
				var test = [];
				//test.push(field +":" +facet);
				console.log('result view :' + doc);
				AjaxSolr.theme('list_items', '#links_' + doc.id, items);
			}
			*/
				//objectedItems is my list of facets & counts
				/*
				var maxCount = 0;
				var objectedItems2 = [];
				for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
				  var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
				  if (count > maxCount) {
					maxCount = count;
				  }
				  objectedItems2.push({ name: facet, children : [{name: facet, size: count}] });
				}
				*/
				
				//see print values
					/*for(var i=0; i<objectedItems2.length;i++){
						document.write(objectedItems2[i].name); 
						document.write(",");
						document.write(objectedItems2[i].children[0].size);
						document.write("\n");
					}*/
				
				
				//document.write(json1);
var margin = {top: 350, right: 480, bottom: 350, left: 480},
    radius = Math.min(margin.top, margin.right, margin.bottom, margin.left) - 10;

var hue = d3.scale.category10();

var luminance = d3.scale.sqrt()
    .domain([0, 1e6])
    .clamp(true)
    .range([90, 20]);

var svg = d3.select(this.target).append("svg")
    .attr("width", margin.left + margin.right)
    .attr("height", margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var partition = d3.layout.partition()
    .sort(function(a, b) { return d3.ascending(a.name, b.name); })
    .size([2 * Math.PI, radius]);

var arc = d3.svg.arc()
    .startAngle(function(d) { return d.x; })
    .endAngle(function(d) { return d.x + d.dx - .01 / (d.depth + .5); })
    .innerRadius(function(d) { return radius / 3 * d.depth; })
    .outerRadius(function(d) { return radius / 3 * (d.depth + 1) - 1; });

d3.json("flare.json", function(error, root) {

  // Compute the initial layout on the entire tree to sum sizes.
  // Also compute the full name and fill color for each node,
  // and stash the children so they can be restored as we descend.
  partition
      .value(function(d) { return d.size; })
      .nodes(root)
      .forEach(function(d) {
        d._children = d.children;
        d.sum = d.value;
        d.key = key(d);
        d.fill = fill(d);
      });

  // Now redefine the value function to use the previously-computed sum.
  partition
      .children(function(d, depth) { return depth < 2 ? d._children : null; })
      .value(function(d) { return d.sum; });

  var center = svg.append("circle")
      .attr("r", radius / 3)
      .on("click", zoomOut);

  center.append("title")
      .text("zoom out");

  var path = svg.selectAll("path")
      .data(partition.nodes(root).slice(1))
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) { return d.fill; })
      .each(function(d) { this._current = updateArc(d); })
      .on("click", zoomIn)
	  .on("mouseover", function(d) {
         //  tooltip.html(function() {
         //      var name = format_name(d);
         //      return name;
         // });
	  		tooltip.show([d3.event.clientX,d3.event.clientY],'<div>'+d.name+'</div>');
         
        })
        .on("mousemove", function(d) {
           // return container
           //   .style("top", (d3.event.pageY-10)+"px")
           //   .style("left", (d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){return tooltip.cleanup();}) 
	  ;

  function zoomIn(p) {
    if (p.depth > 1) p = p.parent;
    if (!p.children) return;
    zoom(p, p);
  }

  function zoomOut(p) {
    if (!p.parent) return;
    zoom(p.parent, p);
  }

  // Zoom to the specified new root.
  function zoom(root, p) {
    if (document.documentElement.__transition__) return;

    // Rescale outside angles to match the new layout.
    var enterArc,
        exitArc,
        outsideAngle = d3.scale.linear().domain([0, 2 * Math.PI]);

    function insideArc(d) {
      return p.key > d.key
          ? {depth: d.depth - 1, x: 0, dx: 0} : p.key < d.key
          ? {depth: d.depth - 1, x: 2 * Math.PI, dx: 0}
          : {depth: 0, x: 0, dx: 2 * Math.PI};
    }

    function outsideArc(d) {
      return {depth: d.depth + 1, x: outsideAngle(d.x), dx: outsideAngle(d.x + d.dx) - outsideAngle(d.x)};
    }

    center.datum(root);

    // When zooming in, arcs enter from the outside and exit to the inside.
    // Entering outside arcs start from the old layout.
    if (root === p) enterArc = outsideArc, exitArc = insideArc, outsideAngle.range([p.x, p.x + p.dx]);

    path = path.data(partition.nodes(root).slice(1), function(d) { return d.key; });

    // When zooming out, arcs enter from the inside and exit to the outside.
    // Exiting outside arcs transition to the new layout.
    if (root !== p) enterArc = insideArc, exitArc = outsideArc, outsideAngle.range([p.x, p.x + p.dx]);

    d3.transition().duration(d3.event.altKey ? 7500 : 750).each(function() {
      path.exit().transition()
          .style("fill-opacity", function(d) { return d.depth === 1 + (root === p) ? 1 : 0; })
          .attrTween("d", function(d) { return arcTween.call(this, exitArc(d)); })
          .remove();

      path.enter().append("path")
          .style("fill-opacity", function(d) { return d.depth === 2 - (root === p) ? 1 : 0; })
          .style("fill", function(d) { return d.fill; })
          .on("click", zoomIn)
          .each(function(d) { this._current = enterArc(d); });

      path.transition()
          .style("fill-opacity", 1)
          .attrTween("d", function(d) { return arcTween.call(this, updateArc(d)); });
    });
  }
});

function key(d) {
  var k = [], p = d;
  while (p.depth) k.push(p.name), p = p.parent;
  return k.reverse().join(".");
}

function fill(d) {
  var p = d;
  while (p.depth > 1) p = p.parent;
  var c = d3.lab(hue(p.name));
  c.l = luminance(d.sum);
  return c;
}

function arcTween(b) {
  var i = d3.interpolate(this._current, b);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function updateArc(d) {
  return {depth: d.depth, x: d.x, dx: d.dx};
}

d3.select(self.frameElement).style("height", margin.top + margin.bottom + "px");
(function() {
  var tooltip = window.tooltip = {};
  tooltip.show = function(pos, content, gravity, dist, parentContainer, classes) {
    var container = d3.select('body').selectAll('.tooltip').data([1]);
        container.enter().append('div').attr('class', 'tooltip ' + (classes ? classes : 'xy-tooltip'));
        container.html(content);
    gravity = gravity || 'n';
    dist = dist || 20;
    var body = document.getElementsByTagName('body')[0];
    var height = parseInt(container[0][0].offsetHeight);
      var width = parseInt(container[0][0].offsetWidth);
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      var scrollTop = body.scrollTop;
      var scrollLeft = body.scrollLeft;
      var left = 0;
      var top = 0;
    
    switch (gravity) {
      case 'e':
        left = pos[0] - width - dist;
        top = pos[1] - (height / 2);
        if (left < scrollLeft) left = pos[0] + dist;
        if (top < scrollTop) top = scrollTop + 5;
        if (top + height > scrollTop + windowHeight) top = scrollTop - height - 5;
        break;
      case 'w':
        left = pos[0] + dist;
        top = pos[1] - (height / 2);
        if (left + width > windowWidth) left = pos[0] - width - dist;
        if (top < scrollTop) top = scrollTop + 5;
        if (top + height > scrollTop + windowHeight) top = scrollTop - height - 5;
        break;
      case 's':
        left = pos[0] - (width / 2);
        top = pos[1] + dist;
        if (left < scrollLeft) left = scrollLeft + 5;
        if (left + width > windowWidth) left = windowWidth - width - 5;
        if (top + height > scrollTop + windowHeight) top = pos[1] - height - dist;
        break;
      case 'n':
        left = pos[0] - (width / 2);
        top = pos[1] - height - dist;
        if (left < scrollLeft) left = scrollLeft + 5;
        if (left + width > windowWidth) left = windowWidth - width - 5;
        if (scrollTop > top) top = pos[1] + 20;
        break;
    }
    container.style('left', left+'px');
    container.style('top', top+'px');
    return container;
  };
  
  tooltip.cleanup = function() {
      // Find the tooltips, mark them for removal by this class (so other tooltip functions won't find it)
      var tooltips = d3.selectAll('.tooltip').attr('class','tooltip-pending-removal').transition().duration(250).style('opacity',0).remove();
	  var textMiddleClean = d3.selectAll('.textMiddle').transition().duration(250).style('opacity',0).remove();
  };
})();          		
		}
	});

})(jQuery);

