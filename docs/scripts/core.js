// Core utilities.
import {createAtom, createMb} from 'prax'
// Immutability utilities.
import {immute, replaceAtPath, mergeAtPath} from 'prax'

/**
 * State
 */

export const atom = createAtom(immute({
  stamp: null,
  key: null,
  persons: {},
  iterable: ['one', 'two', 'three']
}))

export const {read, watch, stop} = atom

/**
 * Message Bus
 */

const mb = createMb(
  {type: 'set', path: x => x instanceof Array}, ({value, path}) => {
    atom.write(replaceAtPath(read(), value, path))
  },

  {type: 'patch'}, ({value, path}) => {
    atom.write(mergeAtPath(read(), value, path || []))
  }
)

export const {send, match} = mb

// Shortcuts.

export function set (...path) {
  send({type: 'set', path, value: path.pop()})
}

export function patch (...path) {
  send({type: 'patch', path, value: path.pop()})
}

// Application logic.

require('./factors')

send('init')

/**
 * Utils
 */

if (window.developmentMode) {
  window.atom = atom
  window.read = read
  window.mb = mb
  window.send = send
}
