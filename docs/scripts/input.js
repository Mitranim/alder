import {set} from './core'
import {renderTo} from './utils'

renderTo('[data-input]', (props, read) => (
  ['div', {className: 'col-start-stretch space-out'},
    ['p', {className: 'pad text-blue shadow'}, read('text')],
    ['input', {type: 'text', placeholder: 'type something...',
               ...bindValue(read, 'text')}]]
))

// two-way binding
function bindValue (read, ...path) {
  return {
    value: read(...path),
    oninput ({target: {value}}) {
      set(path, value)
    }
  }
}
