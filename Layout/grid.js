
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

Grid.prototype.set = function(row, col, func, opts) {
   this.matrix[row][col] = {func: func, opts: opts}
}

Grid.prototype.get = function(row, col, func, opts) {
   return this.matrix[row][col].instance
}

Grid.prototype.applyLayout = function(screen) {

   var margin = 5
   var space = 0
   var width = (100-margin*2) / this.options.cols - space
   var height = (100-margin*2) / this.options.rows - space

   for (var i=0; i<this.options.rows; i++) {
      for (var j=0; j<this.options.cols; j++) {

         this.matrix[i][j].opts.top = margin + i * (height + space) + "%"
         this.matrix[i][j].opts.left = margin + j * (width + space) + "%"
         this.matrix[i][j].opts.width = width + "%"
         this.matrix[i][j].opts.height = height + "%"
         this.matrix[i][j].opts.border = {type: "line"}

         this.matrix[i][j].instance = this.matrix[i][j].func(this.matrix[i][j].opts)
         screen.append(this.matrix[i][j].instance)
      }
   }
}

module.exports = Grid