(function ($) {
        
	AjaxSolr.TreeMapWidget = AjaxSolr.AbstractFacetWidget.extend({
		

				  
		afterRequest: function () 
		{
				//$(this.target).empty();
				//default values
				var width= 960;
				var height= 500;
				var margin= {top: 40,right: 10,bottom: 10,left: 10};
				var env = this;
				
				
		if (Manager.currentTab==undefined || Manager.currentTab!='TreeMap Partition')
				return;
			

			var self = this;
			$(this.target).empty();
			var innerhtml='';
			for (var i in this.field){
				innerhtml+='					<div id="iann_partition_'+this.field[i]+'"></div>';
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
var w = 960,
    h = 600,
    x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([0, h]);

var vis = d3.select(this.target).append("div")
    .attr("class", "chart")
    .style("width", w + "px")
    .style("height", h + "px")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h);

var partition = d3.layout.partition()
    .value(function(d) { return d.size; });

d3.json("flare.json", function(root) {
  var g = vis.selectAll("g")
      .data(partition.nodes(root))
    .enter().append("svg:g")
      .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; })
      .on("click", click);

  var kx = w / root.dx,
      ky = h / 1;

  g.append("svg:rect")
      .attr("width", root.dy * kx)
      .attr("height", function(d) { return d.dx * ky; })
      .attr("class", function(d) { return d.children ? "parent" : "child"; });

  g.append("svg:text")
      .attr("transform", transform)
      .attr("dy", ".35em")
      .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; })
      .text(function(d) { return d.name; })

  d3.select(window)
      .on("click", function() { click(root); })

  function click(d) {
    if (!d.children) return;

    kx = (d.y ? w - 40 : w) / (1 - d.y);
    ky = h / d.dx;
    x.domain([d.y, 1]).range([d.y ? 40 : 0, w]);
    y.domain([d.x, d.x + d.dx]);

    var t = g.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .attr("transform", function(d) { return "translate(" + x(d.y) + "," + y(d.x) + ")"; });

    t.select("rect")
        .attr("width", d.dy * kx)
        .attr("height", function(d) { return d.dx * ky; });

    t.select("text")
        .attr("transform", transform)
        .style("opacity", function(d) { return d.dx * ky > 12 ? 1 : 0; });

    d3.event.stopPropagation();
  }

  function transform(d) {
    return "translate(8," + d.dx * ky / 2 + ")";
  }
});
          		
		}
	});

})(jQuery);

