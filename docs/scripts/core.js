import {createAtom, createMb} from 'prax'
import {asyncStrategy} from 'prax/async'

/**
 * State
 */

export const atom = createAtom({
  stamp: null,
  key: null,
  persons: {},
  iterable: ['one', 'two', 'three']
}, asyncStrategy)

export const {read, set, patch, watch, stop} = atom

/**
 * Message Bus
 */

const mb = createMb()

export const {send, match} = mb

/**
 * App Logic
 */

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
