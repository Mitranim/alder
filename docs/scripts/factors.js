import {send, match, set, patch} from './core'

match({type: 'person/update'}, ({value}) => {
  const {id} = value

  patch(['persons', id], {id, loading: true})

  setTimeout(() => {
    patch(['persons', id], {...value, loading: false})
  }, 1000)
})

/**
 * Mock
 */

match('init', () => {
  const persons = [
    {name: 'Atlanta', age: 1000},
    {name: 'Kara', age: 2000},
    {name: 'Moira', age: 3000}
  ]

  let i = -1

  function mockUpdate () {
    send({
      type: 'person/update',
      value: {
        id: 1,
        ...persons[++i % persons.length]
      }
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
})
