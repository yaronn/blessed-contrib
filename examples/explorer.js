var blessed = require('blessed')
  , contrib = require('../index')
  , fs = require('fs')
  , path = require('path')

var screen = blessed.screen()

//create layout and widgets
var grid = new contrib.grid({rows: 1, cols: 2})

grid.set(0, 0, 1, 1, contrib.tree, 
  { style: { text: "red" }
  , template: { lines: true }
  , label: 'Filesystem Tree'})

grid.set(0, 1, 1, 1, contrib.table, 
  { keys: true
  , fg: 'green'
  , label: 'Informations'
  , columnSpacing: [24, 10, 10]})

grid.applyLayout(screen);

var tree = grid.get(0, 0);
var table = grid.get(0, 1);

//file explorer
var explorer = { name: '/'
  , extended: true
  , getPath: function(self){
      if(! self.parent)
        return '';
      return self.parent.getPath(self.parent)+'/'+self.name;
    }
  , children: function(self){
      var result = {};
      var selfPath = self.getPath(self);
      try {
        var children = fs.readdirSync(selfPath+'/');
        if (!self.childrenContent) {
          for(var child in children){
            child = children[child];
            var completePath = selfPath+'/'+child;
            if( fs.lstatSync(completePath).isDirectory() ){
              result[child] = { name: child, children: self.children, getPath: self.getPath, extended: false };
            }else{
              result[child] = { name: child,getPath: self.getPath, extended: false };
            }
          }
        }else{
          result = self.childrenContent;
        }
      } catch (e){}
      return result;
    }
}

//set tree
tree.setData(explorer);
tree.on('select',function(node){
  var path = node.getPath(node);
  var data = [];

  if ( path == '')
    path = '/';
  
  data.push([path]);
  data.push(['']);
  try {
    data = data.concat(JSON.stringify(fs.lstatSync(path),null,2).split("\n").map(function(e){return [e]}));
    table.setData({headers: ['Info'], data: data});
  }catch(e){
    table.setData({headers: ['Info'], data: data});
  }
  
  screen.render();
});

//set default table
table.setData({headers: ['Info'], data: [[]]})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

screen.key(['tab'], function(ch, key) {
  if(screen.focused == tree.rows)
    table.focus();
  else
    tree.focus();
});

tree.focus()
screen.render()
