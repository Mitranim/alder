import {renderTo, auto} from './utils'
import {set} from './core'
import './input'
import './jsx'

const displayState = auto((props, read) => (
  ['pre', {className: 'flex-1 pad',
           onclick () {console.log('clicked:', this)},
           onLink () {console.log('-- linking state elem:', this)},
           onUnlink () {console.log('-- unlinking:', this)}},
    JSON.stringify(read(), null, 2)]
))

const editState = auto((props, read) => (
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
             onLink () {console.log('-- linking root elem:', this)}},
      [displayState], [editState]]
  )
}

function submitState (event) {
  event.preventDefault()
  const text = event.target.text.value.trim()
  const value = JSON.parse(text)
  set([], value)
}

renderTo('[data-unsafe]', () => (
  ['div', {innerHTML: '<strong>this is <em>potentially unsafe</em> HTML</strong>'}]
))

renderTo('[data-safe]', () => (
  ['div', {textContent: '<strong>this is safe text content</strong>'}]
))

renderTo('[data-iterable]', (props, read) => (
  ['div', null,
    (read('iterable') || []).map((item, index) => (
      index ?
      ['p', {'data-key': item, onLink, onUnlink}, item]
      : null))]
))

function onLink () {console.log('-- linking:', this)}
function onUnlink () {console.log('-- unlinking:', this)}
