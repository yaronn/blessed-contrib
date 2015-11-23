var blessed = require('blessed')
   , Node = blessed.Node
   , Box = blessed.Box      

function Tree(options) {  

  if (!(this instanceof Node)) {
    return new Tree(options);
  }

  options = options || {};
  options.bold = true;
  var self = this;
  this.options = options;
  this.data = {};
  this.nodeLines = [];
  this.lineNbr = 0;
  Box.call(this, options);

  options.extended = options.extended || false;
  options.keys = options.keys || ['+','space','enter'];

  options.template = options.template || {};
  options.template.extend = options.template.extend || ' [+]';
  options.template.retract = options.template.retract || ' [-]';
  options.template.lines = options.template.lines || false;

  this.rows = blessed.list({
          // Do not set height, since this create a bug where the first line is not always displayed
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

    self.emit('select',self.nodeLines[this.getItemIndex(this.selected)]);
  });

  this.append(this.rows)  
}

Tree.prototype.walk = function (node,treeDepth) {

  var lines = [];

  if (!node.parent)
    node.parent = null;

  if (treeDepth == '' && node.name) {
    this.lineNbr = 0;
    this.nodeLines[this.lineNbr++] = node;
    lines.push(node.name);
    treeDepth = ' ';
  }

  node.depth = treeDepth.length-1;

  if (node.children && node.extended) {

    var i = 0;
    
    if (typeof node.children == 'function')
      node.childrenContent = node.children(node);
    
    if(!node.childrenContent)
      node.childrenContent = node.children;

    for (var child in node.childrenContent) {
      
      if(!node.childrenContent[child].name)
        node.childrenContent[child].name = child;

      var childIndex = child;
      child = node.childrenContent[child];
      child.parent = node;
      child.position = i++;
      
      if(typeof child.extended == 'undefined')
        child.extended = this.options.extended;
      
      if (typeof child.children == 'function')
        child.childrenContent = child.children(child);
      else
        child.childrenContent = child.children;
      
      var isLastChild = child.position == Object.keys(child.parent.childrenContent).length - 1;
      var tree;
      var suffix = '';
      if (isLastChild) {
        tree = '└';
      } else {
        tree = '├';
      }
      if (!child.childrenContent || Object.keys(child.childrenContent).length == 0){
        tree += '─';
      } else if(child.extended) {
        tree += '┬';
        suffix = this.options.template.retract;
      } else {
        tree += '─';
        suffix = this.options.template.extend;
      }

      if (!this.options.template.lines){
        tree = '|-';
      }

      lines.push(treeDepth + tree + child.name + suffix);

      this.nodeLines[this.lineNbr++] = child;

      var parentTree;
      if (isLastChild || !this.options.template.lines){
        parentTree = treeDepth+" ";
      } else {
        parentTree = treeDepth+"│";
      }
      lines = lines.concat(this.walk(child, parentTree));
    }
  }
  return lines;
}

Tree.prototype.focus = function(){
  this.rows.focus();
}

Tree.prototype.render = function() {
  if(this.screen.focused == this.rows)
    this.rows.focus()
  
  this.rows.width = this.width-3;
  this.rows.height = this.height-3;
  Box.prototype.render.call(this);
}

Tree.prototype.setData = function(data) {

  var formatted = [];
  formatted = this.walk(data,'');

  this.data = data;
  this.rows.setItems(formatted);
}

Tree.prototype.__proto__ = Box.prototype;

Tree.prototype.type = 'tree';

module.exports = Tree
