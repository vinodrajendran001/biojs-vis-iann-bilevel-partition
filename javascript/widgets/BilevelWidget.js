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
var width = 960,
    height = 700,
    radius = Math.min(width, height) / 2;

var x = d3.scale.linear()
    .range([0, 2 * Math.PI]);

var y = d3.scale.sqrt()
    .range([0, radius]);

var color = d3.scale.category20c();

var svg = d3.select(this.target).append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

var arc = d3.svg.arc()
    .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
    .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
    .innerRadius(function(d) { return Math.max(0, y(d.y)); })
    .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
// var tooltip = d3.select(this.target)
//     .append("div")
//     .attr("class", "tooltip")
//     .style("position", "absolute")
//     .style("z-index", "10")
//     .style("opacity", 0);

  function format_number(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  function format_name(d) {
    var name = d.name;
        return  '<b>' + name;
  }
  
d3.json("flare.json", function(error, root) {
  var path = svg.selectAll("path")
      .data(partition.nodes(root))
    .enter().append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
      .on("click", click)
	  .on("mouseover", function(d) {
         //  tooltip.html(function() {
         //      var name = format_name(d);
         //      return name;
         // });
	  		tooltip.show([d3.event.clientX,d3.event.clientY],'<div>'+d.name+'</div><div>'+d.value+'</div>');
         
        })
        .on("mousemove", function(d) {
           // return container
           //   .style("top", (d3.event.pageY-10)+"px")
           //   .style("left", (d3.event.pageX+10)+"px");
        })
        .on("mouseout", function(){return tooltip.cleanup();}); 
	 

  function click(d) {
    path.transition()
      .duration(750)
      .attrTween("d", arcTween(d));
  }
});

d3.select(self.frameElement).style("height", height + "px");


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



// Interpolate the scales!
function arcTween(d) {
  var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
      yd = d3.interpolate(y.domain(), [d.y, 1]),
      yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
  return function(d, i) {
    return i
        ? function(t) { return arc(d); }
        : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
  };
}
          		
		}
	});

})(jQuery);

