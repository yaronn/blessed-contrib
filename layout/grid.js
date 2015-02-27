
function Grid(options) {
   this.options = options
   this.matrix = []

   for (var i=0; i<options.rows; i++) {
      this.matrix[i]=[]
      for (var j=0; j<options.cols; j++) {
         this.matrix[i][j] = {}
      }
   }   
}

Grid.prototype.set = function(row, col, sizeWidth, sizeHeight, obj, opts) {
   this.matrix[row][col] = {obj: obj, sizeWidth: sizeWidth, sizeHeight: sizeHeight, opts: opts || {}}
}

Grid.prototype.get = function(row, col) {
   return this.matrix[row][col].instance
}


//spacing is applyed normally regardless of offsets
//margin need to apply only in the final positioning
Grid.prototype.applyLayout = function(screen, offsetPct) {

   var dashboardMargin = 0
   offsetPct = offsetPct || {x: dashboardMargin, y: dashboardMargin, width: 100-dashboardMargin, height: 100-dashboardMargin}
   
   var widgetSpacing = 0
   var width = (100 / this.options.cols - widgetSpacing)*(offsetPct.width/100)
   var height = (100 / this.options.rows - widgetSpacing)*(offsetPct.height/100)

   for (var i=0; i<this.options.rows; i++) {
      for (var j=0; j<this.options.cols; j++) {

         if(this.matrix[i][j].obj == null)
            continue;

         var top = offsetPct.y + i * (height + widgetSpacing)
         var left = offsetPct.x + j * (width + widgetSpacing)

         if (this.matrix[i][j].obj instanceof Grid) {
            var grid = this.matrix[i][j].obj
            grid.applyLayout(screen, {x: left, y: top, width: (width * this.matrix[i][j].sizeWidth), height: (height * this.matrix[i][j].sizeHeight)})            
         }
         else {
            this.matrix[i][j].opts.top = top + "%"
            this.matrix[i][j].opts.left = left + "%"
            this.matrix[i][j].opts.width = (width * this.matrix[i][j].sizeWidth) + "%"
            this.matrix[i][j].opts.height = (height * this.matrix[i][j].sizeHeight) + "%"

            this.matrix[i][j].opts.border = {type: "line", fg: "cyan"}
            this.matrix[i][j].instance = this.matrix[i][j].obj(this.matrix[i][j].opts)
            screen.append(this.matrix[i][j].instance)
         }         
      }
   }
}

module.exports = Grid