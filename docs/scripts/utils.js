import {render, unlink} from 'alder'
// import hljs from 'highlight.js'
// import Remarkable from 'remarkable'

const unmountQueue = []

export function renderTo (selector: string, renderFunc: Function) {
  onload(() => {
    const elements = document.querySelectorAll(selector)
    ;[].slice.call(elements).forEach(element => {
      unmountQueue.push(element)
      render(element, renderFunc)
    })
  })
}

document.addEventListener('simple-pjax-before-transition', () => {
  while (unmountQueue.length) unlink(unmountQueue.shift())
})

export function onload (callback: Function) {
  if (/loaded|complete|interactive/.test(document.readyState)) {
    callback()
  } else {
    document.addEventListener('DOMContentLoaded', function cb () {
      document.removeEventListener('DOMContentLoaded', cb)
      callback()
    })
  }
  document.addEventListener('simple-pjax-after-transition', callback)
}

// function highlight (text, lang) {
//   const result = lang ? hljs.highlight(lang, text) : hljs.highlightAuto(text)
//   return `<pre class="hljs">${result.value}</pre>`
// }

// export const md = new Remarkable({
//   preset: 'commonmark',
//   html: true,
//   typographer: true,
//   highlight
// })
