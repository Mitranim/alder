export function transduce (action, dispatch) {
  switch (action.type) {
    case 'personUpdate': {
      const attrs = action.value

      // This will execute as a sequence.
      return [
        // {
        //   type: 'patch',
        //   value: {
        //     persons: {[attrs.id]: {id: attrs.id, loading: true}}
        //   }
        // },
        new Promise(resolve => {
          setTimeout(() => {
            resolve({
              type: 'patch',
              value: {persons: {[attrs.id]: attrs}}
            })
          }, 1000)
        }),
        // // Will wait until the promise resolves.
        // {
        //   type: 'patch',
        //   value: {
        //     persons: {[attrs.id]: {loading: false}}
        //   }
        // }
      ]
    }

    /**
     * Mock
     */

    case 'init': {
      const persons = [
        {id: 1, name: 'Atlanta', age: 2700},
        {id: 1, name: 'Kara', age: 1000},
        {id: 1, name: 'Moira', age: 3100}
      ]
      let i = -1

      const mockUpdate = () => {
        dispatch({
          type: 'personUpdate',
          value: persons[++i % persons.length]
        })
      }

      mockUpdate()
      // setInterval(mockUpdate, 2000)

      break
    }
  }

  return action
}
