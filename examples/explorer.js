var blessed = require('blessed')
  , contrib = require('../index')
  , fs = require('fs')
  , path = require('path')

var screen = blessed.screen()

//create layout and widgets
var grid = new contrib.grid({rows: 1, cols: 2})

grid.set(0, 0, 1, 1, contrib.tree, 
  { style: { text: "red" }
  , label: 'Filesystem Tree'})

grid.set(0, 1, 1, 1, contrib.table, 
  { keys: true
  , fg: 'green'
  , label: 'Informations'
  , columnSpacing: [24, 10, 10]})

grid.applyLayout(screen);

var tree = grid.get(0, 0);
var table = grid.get(0, 1);

var explorer = { extended: true
  , name: 'Init (0)'
  , children:
    {
      'pid823':
      { name: 'sshd (823)'
      , children:
        { 'pid25094': { name: 'bash (25094)' }
        , 'pid987': { name: 'bash (987)' }
        , 'pid9283': { name: 'bash (9283)'}
        , 'pid9282':
          {  name: 'bash (9282)'
          ,  children: function(){
              return { 'pid902': { name: 'htop (902)' }
              , 'pid1082': { name: 'vim (1082)' }
              , 'pid509': { name: 'nodejs (509)' }
            }}}
        , 'pid292': { name: 'git (292)' }}}
    , 'pid292':
      { name: 'apache2 (292)'
      , children:
        { 'pid33820': { name: 'apache2 (33820)'}
        , 'pid34204': { name: 'apache2 (34204)'}
        , 'pid34095': { name: 'apache2 (34095)'}}}}};

//set tree
tree.setData(explorer);

//set default table
table.setData({headers: ['Info'], data: [['test']]})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.render()

