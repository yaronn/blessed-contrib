
var blessed = require('blessed')
  , contrib = require('../../')
  , screen = blessed.screen()
  , markdown = contrib.markdown({markdown: '# Hello \n blessed-contrib renders markdown using `marked-terminal` '})

screen.append(markdown)

screen.render()
