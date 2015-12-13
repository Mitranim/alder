import {match, multimatch, pipe} from 'prax'

export default (read, send) => pipe(
  match(isArray, msgs => {
    let step
    msgs.forEach(msg => {
      if (step) step = step.then(() => {send(msg)})
      else if (isPromise(msg)) step = msg.then(send)
      else send(msg)
    })
  }),

  match({type: 'personUpdate'}, ({value}) => {
    // This will execute as a sequence.
    send([
      {
        type: 'patch',
        value: {
          persons: {[value.id]: {id: value.id, loading: true}}
        }
      },
      new Promise(resolve => {
        setTimeout(() => {
          resolve({
            type: 'patch',
            value: {persons: {[value.id]: value}}
          })
        }, 1000)
      }),
      // Will wait until the promise is resolved.
      {
        type: 'patch',
        value: {
          persons: {[value.id]: {loading: false}}
        }
      }
    ])
  }),

  /**
   * Mock
   */

  multimatch('init', next => msg => {
    next(msg)

    const persons = [
      {name: 'Atlanta', age: 1000},
      {name: 'Kara', age: 2000},
      {name: 'Moira', age: 3000}
    ]

    let i = -1

    function mockUpdate () {
      send({
        type: 'personUpdate',
        value: {
          id: 1,
          ...persons[++i % persons.length]
        }
      })
    }

    mockUpdate()
    setInterval(mockUpdate, 2000)

    setInterval(() => {
      send({
        type: 'patch',
        value: {stamp: window.performance.now() | 0}
      })
    }, 1000)

    document.addEventListener('keypress', event => {
      send({
        type: 'set',
        path: ['key'],
        value: event.keyCode
      })
    })
  })
)

/**
 * Utils
 */

function isArray (value) {
  return value instanceof Array
}

function isPromise (value) {
  return value && typeof value.then === 'function' && typeof value.catch === 'function'
}
