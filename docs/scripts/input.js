import {read, send} from './core'
import {renderTo} from './utils'

renderTo('[data-input]', () => (
  ['div', {className: 'col-start-stretch space-out'},
    ['p', {className: 'pad theme-text-primary shadow'}, read('text')],
    ['input', {type: 'text', placeholder: 'type something...',
               value: read('text'), oninput}]]
))

function oninput ({target: {value}}) {
  value = value.trim()
  send({type: 'set', path: ['text'], value})
}
