import {createAtom, watcher} from 'prax'

/**
 * State
 */

export const atom = createAtom({
  stamp: null,
  key: null,
  persons: {},
  iterable: ['one', 'two', 'three']
})

export const {read, set, patch, monitor} = atom

/**
 * Rendering
 */

export function auto (view) {
  return function component (render, props) {
    return monitor(watcher(read => {
      render(view(props, read))
    }))
  }
}

/**
 * App Logic
 */

require('./factors')

/**
 * Utils
 */

if (window.developmentMode) {
  window.atom = atom
}
