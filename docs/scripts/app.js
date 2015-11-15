import 'stylific'
import 'simple-pjax'
import {renderTo} from './utils'
import {read, dispatch} from './store'
import './input'

renderTo('[data-state]', () => (
  ['div', {className: 'row-between-stretch'},
    [displayState],
    [editState]]
))

renderTo('[data-unsafe]', () => (
  // ['div', {innerHTML: '<script>alert("pwnd!")</script>'}]
  ['div', {innerHTML: '<strong>this is <em>unsafe</em> HTML</strong>'}]
  // ['div', {textContent: '<strong>this is safe text content</strong>'}]
))

function displayState () {
  return (
    ['pre', {className: 'flex-1 pad',
             onClick () {console.log('clicked:', this)},
             onMount () {console.log('mounted:', this)},
             onUnmount () {console.log('unmounting:', this)}},
      JSON.stringify(read(), null, 2)]
  )
}

function editState () {
  return (
    ['div', {className: 'flex-1'},
      ['form', {className: 'wide', onSubmit: submitState},
        ['textarea', {name: 'text', rows: 0x10, className: 'wide text-monospace',
                      value: JSON.stringify(read(), null, 2)}],
        ['button', {type: 'submit'}, 'Save']]]
  )
}

function submitState (event) {
  event.preventDefault()
  const text = event.target.text.value.trim()
  const value = JSON.parse(text)
  dispatch({type: 'set', path: [], value})
}

renderTo('[data-stamp]', () => (
  ['div', null,
    ['p', null,
      'ms elapsed since page load: ', read('stamp')]]
))

// renderTo('[data-key]', () => (
//   ['div', null,
//     ['p', null,
//       `last pressed key's code: `, read('key')]]
// ))

renderTo('[data-person]', person)

function person () {
  // console.log('-- rendering person')
  return (
    ['div', null, [personName], [personAge]]
  )
}

function personName () {
  // console.log('-- rendering person name')
  return (
    ['p', null, 'name: ', read('persons', 1, 'name')]
  )
}

function personAge () {
  // console.log('-- rendering person age')
  return (
    ['p', null, 'age: ', read('persons', 1, 'age')]
  )
}

// renderTo('[data-person]', () => (
//   ['div', null,
//     ['p', null,
//       'person: ', JSON.stringify(read('persons', 1))],
//       personNameLength()]
// ))

// renderTo('[data-person-name-length]', () => (
//   ['div', null,
//     ['p', null,
//       'person name length: ', nameLength(1)]]
// ))

// function person () {
//   return (
//     ['div', null,
//       ['p', null,
//         'person: ', JSON.stringify(read('persons', 1))]]
//   )
// }

// function personNameLength () {
//   return (
//     ['div', null,
//       ['p', null,
//         'person name length: ', nameLength(1)]]
//   )
// }

renderTo('[data-modal]', () => (
  ['div', null,
    ['div', {id: 'modal', className: 'sf-modal sf-modal-narrow'},
      ['div', {className: 'sf-modal-body'},
        ['h1', null, 'Hello world!']]],
    ['button', {'data-sf-toggle-id': 'modal'}, 'show modal']]
))

/**
 * Automatic updates
 */

// setInterval(() => {
setTimeout(() => {
  dispatch({
    type: 'patch',
    value: {stamp: window.performance.now() | 0}
  })
}, 1000)

// document.addEventListener('keypress', event => {
//   dispatch({
//     type: 'set',
//     path: ['key'],
//     value: event.keyCode
//   })
// })

/**
 * Reactive computed data
 */

function nameLength (id) {
  const name = read('persons', id, 'name')
  return (name && name.length) | 0
}
