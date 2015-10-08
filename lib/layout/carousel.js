
var blessed = require('blessed')

function Carousel(pages, options) {
   
   this.currPage = 0
   this.pages = pages  
   this.options = options
   this.screen = this.options.screen      
}

Carousel.prototype.move = function() {   
   var i = this.screen.children.length
   while (i--) this.screen.children[i].detach()

   this.pages[this.currPage](this.screen)   
   this.screen.render()
}

Carousel.prototype.next = function() {   
   this.currPage++
   if (this.currPage==this.pages.length) this.currPage=0
   this.move()
}

Carousel.prototype.prev = function() {      
   this.currPage--
   if (this.currPage<0) this.currPage=this.pages.length-1
   this.move()
}

Carousel.prototype.start = function() {
   var self = this

   this.move()

   if (this.options.interval) {
      setInterval(this.next.bind(this), this.options.interval)
   }

   if (this.options.controlKeys) {
      this.screen.key(['right', 'left'], function(ch, key) {           
        if (key.name=='right') self.next()
        if (key.name=='left') self.prev()
      });
   }

}

module.exports = Carousel