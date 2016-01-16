import {renderAt, unlink} from 'alder'
import {auto} from './core'

export function renderTo (selector, renderFunc) {
  const component = auto(renderFunc)

  function init () {
    [].forEach.call(document.querySelectorAll(selector), element => {
      renderAt(element, component)
    })
  }

  onload(init)
}

document.addEventListener('simple-pjax-before-transition', () => {
  unlink(document.body)
})

export function onload (callback) {
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
