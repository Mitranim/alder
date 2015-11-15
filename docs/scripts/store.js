import {createStore, applyMiddleware} from 'redux'
import {immute, replaceAtPath, mergeAtPath, createReader, createMiddleware} from 'symphony'
import {transduce} from './mock'

const create = applyMiddleware(createMiddleware(transduce))(createStore)

/**
 * Store
 */

// This is the only place where the application state can be changed.
const store = create((state, action) => {
  switch (action.type) {
    case 'set': {
      state = replaceAtPath(state, action.value, action.path)
      break
    }
    case 'patch': {
      state = mergeAtPath(state, action.value, action.path || [])
      break
    }
  }
  return state
},
immute({
  // Initial state (may be empty).
  stamp: null,
  key: null,
  persons: null
}))

store.dispatch({type: 'init'})

export const dispatch = store.dispatch
export const read = createReader(store)

/**
 * Utils
 */

if (window.developmentMode) {
  window.store = store
  window.dispatch = store.dispatch
  window.read = read
}
