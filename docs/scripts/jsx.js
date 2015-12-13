/**
 * Alder can be used with JSX!
 */

import {renderTo, auto} from './utils'
import {read} from './core'
import './input'
import {React} from 'alder/react'

renderTo('[data-stamp]', () => (
  <div>
    <p>ms elapsed since page load: {read('stamp')}</p>
  </div>
))

renderTo('[data-key]', () => (
  <div>
    <p>last pressed key's code: {read('key')}</p>
  </div>
))

const personName = auto(props => (
  <p>name: {read('persons', props.id, 'name')}</p>
))

const personAge = auto(props => (
  <p>age: {read('persons', props.id, 'age')}</p>
))

// Normal and JSX styles are fully interoperable.
renderTo('[data-person]', person)
function person () {
  return (
    ['div', null, [personName, {id: 1}], [personAge, {id: 1}]]
  )
}
