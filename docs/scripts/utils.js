import {renderAt} from 'alder'
import {watch, stop} from './core'

export function renderTo (selector: string, renderFunc: Function) {
  const component = auto(renderFunc)
  onload(() => {
    const elements = document.querySelectorAll(selector)
    ;[].forEach.call(elements, element => {
      renderAt(element, component)
    })
  })
}

export function auto (func) {
  return (render, props) => {
    const update = watch(() => {render(func(props))})
    return () => {stop(update)}
  }
}

export function onload (callback: Function) {
  if (/loaded|complete|interactive/.test(document.readyState)) {
    callback()
  } else {
    document.addEventListener('DOMContentLoaded', function cb () {
      document.removeEventListener('DOMContentLoaded', cb)
      callback()
    })
  }
}
