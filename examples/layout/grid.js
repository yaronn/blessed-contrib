var blessed = require('blessed')
var contrib = require('../../index')

var screen = blessed.screen()

var rows = 3, cols = 3
var grid = new contrib.Layout.Grid({rows: rows, cols: cols})
for (var i=0; i<rows; i++) {
   for (var j=0; j<cols; j++)
   {
      var opts = {
        top: 'center',
        left: 'center',
        width: '50%',
        height: '50%',
        content: 'Hello {bold}world{/bold} (' + i + "," + j +') !',
        tags: true,
        border: {
          type: 'line'
        },
        style: {
          fg: 'white',
          bg: 'magenta',
          border: {
            fg: '#f0f0f0'
          },    
        }
      }

      grid.set(i, j, blessed.box, opts)
   }
}

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

grid.applyLayout(screen)
screen.render()
