var blessed = require('blessed');
var contrib = require('../index');

var screen = blessed.screen();

var rows = 4, cols = 4;
var grid = new contrib.grid({rows: rows, cols: cols});

grid.set(0, 0, 2, 2, blessed.box, {
    content: 'Hello {bold}world{/bold} (0,0), Size (2,2) !',
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
    content: 'Hello {bold}world{/bold} (2,0), Size (2,1) !',
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
    content: 'Hello {bold}world{/bold} (0,2), Size (1,2) !',
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
    content: 'Hello {bold}world{/bold} (2,2), Size (1,1) !',
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

grid.set(0, 3, 1, 3, blessed.box, {
    content: 'Hello {bold}world{/bold} (0,3), Size (1,3) !',
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

grid.set(3, 0, 4, 1, blessed.box, {
    content: 'Hello {bold}world{/bold} (3,0), Size (4,1) !',
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
