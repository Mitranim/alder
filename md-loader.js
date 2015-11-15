'use strict'

const Remarkable = require('remarkable')
const hjs = require('highlight.js')

const md = new Remarkable({
  preset: 'commonmark',
  html: true,
  typographer: true,
  highlight (text, lang) {
    const result = lang ? hjs.highlight(lang, text) : hjs.highlightAuto(text)
    return `<pre class="hljs">${result.value}</pre>`
  }
})

module.exports = function (source) {
  if (this.cacheable) this.cacheable()
  return `module.exports = ${JSON.stringify(md.render(source))}`
}
