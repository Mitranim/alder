import {set, patch} from './core'

/**
 * Mock
 */

const persons = [
  {name: 'Atlanta', age: 1000},
  {name: 'Kara', age: 2000},
  {name: 'Moira', age: 3000}
]

let i = -1

function mockUpdate () {
  patch(['persons', 1], {
    id: 1,
    ...persons[++i % persons.length]
  })
}

mockUpdate()

setInterval(mockUpdate, 2000)

setInterval(() => {
  set(['stamp'], window.performance.now() | 0)
}, 1000)

document.addEventListener('keypress', event => {
  set(['key'], event.keyCode)
})
