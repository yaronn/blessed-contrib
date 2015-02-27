var blessed = require('blessed');
var contrib = require('../../index');

var screen = blessed.screen();

var rows = 3, cols = 3;
var grid = new contrib.grid({rows: rows, cols: cols});

grid.set(0, 0, 2, 2, blessed.box, {
    content: 'Hello {bold}world{/bold} (' + 0 + "," + 0 +') !',
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
});

grid.set(2, 0, 2, 1, blessed.box, {
    content: 'Hello {bold}world{/bold} (' + 2 + "," + 0 +') !',
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
});

grid.set(0, 2, 1, 2, blessed.box, {
    content: 'Hello {bold}world{/bold} (' + 1 + "," + 1 +') !',
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
});

grid.set(2, 2, 1, 1, blessed.box, {
    content: 'Hello {bold}world{/bold} (' + 2 + "," + 2 +') !',
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
});

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

grid.applyLayout(screen);
screen.render();
