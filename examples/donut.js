var blessed = require('blessed')
  , contrib = require('../index')
  , screen = blessed.screen();

/**
 * Donut Options
  self.options.stroke = options.stroke || "magenta"
  self.options.radius = options.radius || 14;
  self.options.arcWidth = options.arcWidth || 4;
  self.options.spacing = options.spacing || 2;
  self.options.yPadding = options.yPadding || 2;
 */

var donut = contrib.donut({
  	label: 'Test',
  	radius: 8,
  	arcWidth: 3,
  	yPadding: 2,
    data: [
      {percent: 80, label: 'web1', color: 'green'}
    ]
  });
    
screen.append(donut)

setInterval(updateDonuts, 5);

var pct = 0.00;

function updateDonuts(){
	if (pct > 0.99) pct = 0.00;
	donut.update([
		{percent: parseFloat((pct+0.00) % 1).toFixed(2), label: 'rcp','color':[100,200,170]},
		{percent: parseFloat((pct+0.25) % 1).toFixed(2), label: 'rcp','color':[128,128,128]},
		{percent: parseFloat((pct+0.50) % 1).toFixed(2), label: 'rcp','color':[255,0,0]},
		{percent: parseFloat((pct+0.75) % 1).toFixed(2), label: 'web1', 'color': [255,128,0]}
	]);
	screen.render();
	pct += 0.01;
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
});
