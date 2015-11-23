
var blessed = require('blessed')
  , contrib = require('../../')
  , screen = blessed.screen()
  , chalk = require('chalk')
  , markdown = contrib.markdown({markdown: '# Hello \n blessed-contrib renders markdown using `marked-terminal` '
                                , style: { firstHeading: 'chalk.green.italic' }})

screen.append(markdown)

screen.render()
