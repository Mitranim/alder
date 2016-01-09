/**
 * Alder can be used with JSX!
 */

import {renderTo} from './utils'
import {auto} from './core'
import './input'
import {React} from 'alder/react'

renderTo('[data-stamp]', (props, read) => (
  <div>
    <p>ms elapsed since page load: {read('stamp')}</p>
  </div>
))

renderTo('[data-key]', (props, read) => (
  <div>
    <p>last pressed key's code: {read('key')}</p>
  </div>
))

const personName = auto((props, read) => (
  <p>name: {read('persons', props.id, 'name')}</p>
))

const personAge = auto((props, read) => (
  <p>age: {read('persons', props.id, 'age')}</p>
))

// Normal and JSX styles are fully interoperable.
renderTo('[data-person]', person)
function person () {
  return (
    ['div', null, [personName, {id: 1}], [personAge, {id: 1}]]
  )
}
