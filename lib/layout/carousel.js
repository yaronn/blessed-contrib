
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

   this.pages[this.currPage](this.screen, this.currPage);
   this.screen.render()
}

Carousel.prototype.next = function() {   
   this.currPage++
   if (this.currPage==this.pages.length){
     if (!this.options.rotate) {
       this.currPage--;
       return;
     } else {
       this.currPage=0
     }
   }
   this.move()
}

Carousel.prototype.prev = function() {      
   this.currPage--
   if (this.currPage<0) {
     if (!this.options.rotate) {
      this.currPage++;
      return;
     } else {
      this.currPage=this.pages.length-1
     }
   }
   this.move()
}

Carousel.prototype.home = function() {
  this.currPage = 0;
  this.move();
}

Carousel.prototype.end = function() {
  this.currPage = this.pages.length -1;
  this.move();
}

Carousel.prototype.start = function() {
   var self = this

   this.move()

   if (this.options.interval) {
      setInterval(this.next.bind(this), this.options.interval)
   }

   if (this.options.controlKeys) {
      this.screen.key(['right', 'left', 'home', 'end'], function(ch, key) {
        if (key.name=='right') self.next()
        if (key.name=='left') self.prev()
        if (key.name=='home') self.home()
        if (key.name=='end') self.end()
      });
   }

}

module.exports = Carousel
