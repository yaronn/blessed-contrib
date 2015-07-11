var blessed = require('blessed')
  , contrib = require('../')
  , screen = blessed.screen()
  , markdown = contrib.markdown()
    
screen.append(markdown)
markdown.setMarkdown('# Hello \n This is **markdown** printed in the `terminal` 11')
screen.render()