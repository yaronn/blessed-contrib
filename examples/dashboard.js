var blessed = require('blessed')
var contrib = require('../index')
var map = require('../Widget/map')
var line = require('../Widget/Charts/line')


var map_opt = {
  top: 'center',
  left: 'center',
  width: '70%',
  height: '70%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  },
  
  canvas: {
    width: 140,
    height: 80
  }

};


var line_opt = {
  top: 'center',
  left: 'center',
  width: '70%',
  height: '70%',
  content: 'Hello {bold}world{/bold}!',
  tags: true,
  border: {
    type: 'line'
  },
  
  canvas: {
    width: 120,
    height: 80
  },

  chart_options: {
     responsive: false,
     animation: false,
     bezierCurve : false,
     scaleShowGridLines: false,
     scaleGridLineWidth: 0,
     showTooltips: false,
     scaleFontColor: "green",
     pointLabelFontColor: "green",
     scaleLineColor: "black",
     scaleBeginAtZero: true,
     showSmallBaseLines: false,
     minSpaceBetweenXLabels: 1,
     xLabelSpacing: 6,
     yLabelSpacing: 8,
     XLineOffset: 1,
     scaleFontSize: 6,
     datasetFill: false,
     yLineOffset: 2
  }

}



var grid = new contrib.Layout.Grid({rows: 1, cols: 2})
grid.set(0, 0, line, line_opt)
grid.set(0, 1, map, map_opt)

var screen = blessed.screen()
grid.applyLayout(screen)

var line = grid.get(0, 0)
var map = grid.get(0, 1)

map.addMarker({"lon" : "37.5000", "lat" : "-79.0000" })


var mockData = {
   x: ['00:00', '00:05', '00:10', '00:15', '00:20', '00:30', '00:40', '00:50', '01:00', '01:10', '01:20', '01:30', '01:40', '01:50', '02:00', '02:10', '02:20', '02:30', '02:40', '02:50', '03:00', '03:10', '03:20', '03:30', '03:40', '03:50', '04:00', '04:10', '04:20', '04:30'],
   y: [0, 10, 40, 45, 45, 50, 55, 70, 65, 58, 50, 55, 60, 65, 70, 80, 70, 50, 40, 50, 60, 70, 82, 88, 89, 89, 89, 80, 72, 70]
}

var lineChartData = {
     labels : mockData.x,
     datasets : [
       {
         label: "My First dataset",
         fillColor : "red",
         strokeColor : "yellow",
         pointColor : "black",
         pointStrokeColor : "black",
         pointHighlightFill : "green",
         pointHighlightStroke : "white",
         data : mockData.y
       }
     ]
   }

line.setData(lineChartData)

screen.render()



screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

setInterval(function() {
   //vusers.setData({'5', 6})
   //hits.setData({'5', 6})
   screen.render()
}, 500)