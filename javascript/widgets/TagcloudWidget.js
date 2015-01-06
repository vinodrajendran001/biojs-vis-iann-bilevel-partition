(function ($) {
  AjaxSolr.TagcloudWidget = AjaxSolr.AbstractFacetWidget.extend({
    afterRequest: function () {
      if (this.manager.response.facet_counts === undefined || this.manager.response.facet_counts.facet_fields[this.field] === undefined) {
        $(this.target).html(AjaxSolr.theme('no_items_found'));
        return;
      }

      var maxCount = 0;
      var objectedItems = [];
      for (var facet in this.manager.response.facet_counts.facet_fields[this.field]) {
        var count = parseInt(this.manager.response.facet_counts.facet_fields[this.field][facet]);
        if (count > maxCount) {
          maxCount = count;
        }
        objectedItems.push({ facet: facet, count: count });

      }
      objectedItems.sort(function (a, b) {
        return a.facet < b.facet ? -1 : 1;
      });

      var self = this;
      $(this.target).empty();

      var jWord = [];
      var jCount = [];
      var category = [];
      category.push(this.target);

      var wordScale = d3.scale.linear().domain([0,80]).range([10,170]);

      for (var i = 1, l = objectedItems.length; i < l; i++) {
        var facet = objectedItems[i].facet;
        
        jWord.push(facet);

        /*Assigning the range */

        jCount.push(objectedItems[i].count);
                
      }

      


    var fill = d3.scale.category20();

      d3.layout.cloud().size([250, 250])
      
  .words(d3.zip(jWord, jCount).map(function(d) {
          return {text: d[0], size: 10 + d[1]};
        }))
  
      .padding(3)
     //.rotate(function() { return ~~(Math.random() * 2) * 90; })
   .rotate(function(){return 0})
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

function draw(words) {
    d3.select(category.toString()).append("svg")
        .attr("width", 250)
        .attr("height", 250)
      .append("g")
        .attr("transform", "translate(125,125)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; })
        .on("click", function(d,i) { 
          var fq = self.manager.store.values('fq');
          self.manager.store.addByValue('fq', d.text);
          self.manager.doRequest(0);
          return true;

         })
          .on("mouseover", function(d,i) { 
          d3.select(this)
          .style("font-size", function(d) { return d.size + 10 + "px"; })

         })
          .on("mouseout", function(d,i) { 
          d3.select(this)
          .style("font-size", function(d) { return d.size + "px"; })

         })

        ;
  }



   } 
  });
})(jQuery);
