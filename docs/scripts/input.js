import {read, dispatch} from './store'
import {renderTo} from './utils'

renderTo('[data-input]', () => (
  ['div', {className: 'col-start-stretch space-out'},
    ['p', {className: 'pad theme-text-primary shadow'}, read('text') || '—'],
    ['input', {type: 'text', placeholder: 'type something...',
               value: read('text') || '', onInput}]]
))

function onInput (event) {
  dispatch({type: 'set', path: ['text'], value: event.target.value})
}
