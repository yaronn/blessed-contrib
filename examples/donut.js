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
  	spacing: 2,
  	yPadding: 2,
    data: [
      {perent: 80, label: 'web1', color: 'green'}
    ]
  });
    
screen.append(donut)

setInterval(updateDonuts, 5);

var pct = 0.00;

function updateDonuts(){
	if (pct > 0.99) pct = 0.00;
	donut.update([
		{percent: parseFloat((pct+0.00) % 1).toFixed(2), label: 'rcp','color': 'green'},
		{percent: parseFloat((pct+0.25) % 1).toFixed(2), label: 'rcp','color': 'cyan'},
		{percent: parseFloat((pct+0.50) % 1).toFixed(2), label: 'rcp','color': 'yellow'},
		{percent: parseFloat((pct+0.75) % 1).toFixed(2), label: 'web1', color: 'red'}
	]);
	screen.render();
	pct += 0.01;
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0);
});
