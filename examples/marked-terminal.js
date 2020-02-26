const blessed = require("blessed")
const contrib = require("../")

const screen = blessed.screen()
const markdown = contrib.markdown()
screen.append(markdown)
markdown.setMarkdown("- [x] Checkbox")
screen.render()
