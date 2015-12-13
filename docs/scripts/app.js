import {renderTo, auto} from './utils'
import {read, send} from './core'
import './input'
import './jsx'

const displayState = auto(() => (
  ['pre', {className: 'flex-1 pad',
           onclick () {console.log('clicked:', this)},
           onLink () {console.log('-- linking:', this)},
           onUnlink () {console.log('-- unlinking:', this)}},
    JSON.stringify(read(), null, 2)]
))

const editState = auto(() => (
  ['div', {className: 'flex-1'},
    ['form', {className: 'wide', onsubmit: submitState},
      ['textarea', {name: 'text', rows: 16, className: 'wide text-monospace',
                    value: JSON.stringify(read(), null, 2)}],
      ['button', {type: 'submit'}, 'Save']]]
))

renderTo('[data-state]', state)
function state () {
  return (
    ['div', {className: 'row-between-stretch',
             onMount () {console.log('-- mounting node:', this)}},
      [displayState], [editState]]
  )
}

function submitState (event) {
  event.preventDefault()
  const text = event.target.text.value.trim()
  const value = JSON.parse(text)
  send({type: 'set', path: [], value})
}

renderTo('[data-unsafe]', () => (
  ['div', {innerHTML: '<strong>this is <em>unsafe</em> HTML</strong>'}]
))

renderTo('[data-safe]', () => (
  ['div', {textContent: '<strong>this is safe text content</strong>'}]
))
