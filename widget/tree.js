var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box      

function Tree(options) {  

  if (!(this instanceof Node)) {
    return new Tree(options);
  }

  options = options || {};
  options.bold = true;
  self = this;
  this.options = options;
  this.data = {};
  this.nodeLines = [];
  this.lineNbr = 0;
  Box.call(this, options);
  options.extended = options.extended || true;
  options.keys = options.keys || ['+','space'];

  this.rows = blessed.list({
          height: 0,
          top: 1,
          width: 0,
          left: 1,    
          selectedFg: 'white',
          selectedBg: 'blue',
          fg: "green",
          keys: true          
        });
  
  this.rows.key(options.keys,function(){
    self.nodeLines[this.getItemIndex(this.selected)].extended = !self.nodeLines[this.getItemIndex(this.selected)].extended;
    self.setData(self.data);
    self.screen.render();
  });

  this.append(this.rows)  
}

Tree.prototype.walk = function (node,parentNode,depth) {

  var lines = [];
  
  
  node.parent = parentNode;

  if (depth == 0 && node.name) {
    this.lineNbr = 0;
    this.nodeLines[this.lineNbr++] = node;
    lines.push(Array(depth).join(' ')+node.name);
    depth++;
  }

  node.depth = depth;

  if (node.children && node.extended) {

    var i = 0;
    if (typeof node.children == 'function'){
      node.children = node.children();
    }
    
    for (var child in node.children) {
      
      if(!node.children[child].name)
        node.children[child].name = child;
      
      if(typeof node.children[child].extended == 'undefined')
        node.children[child].extended = this.options.extended;
      
      if(!node.children[child].children || Object.keys(node.children[child].children).length == 0)
        var sign = '-';
      else if(node.children[child].extended)
        var sign = '-';
      else
        var sign = '+'
      lines.push(Array(depth+1).join(' ') + sign + node.children[child].name);

      node.children[child].position = i++;

      this.nodeLines[this.lineNbr++] = node.children[child];
      lines = lines.concat(this.walk(node.children[child], node, depth+1));
    }
  }
  return lines;
}

Tree.prototype.render = function() {
  this.rows.focus();
  this.rows.width = this.width-3;
  this.rows.height = this.height-3;
  Box.prototype.render.call(this);
}

Tree.prototype.setData = function(data) {

  var formatted = [];
  formatted = this.walk(data,null,0)

  this.data = data;
  this.rows.setItems(formatted)
}

Tree.prototype.__proto__ = Box.prototype;

Tree.prototype.type = 'tree';

module.exports = Tree
