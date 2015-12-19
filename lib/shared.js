/**
 * Validation
 */

export function validateDraft (value) {
  if (isPrimitive(value)) return
  if (value instanceof Array) return validateDraftArray(value)
  throw Error(`Draft must be an array or a primitive value, got: ${value}`)
}

// Shallow.
function validateDraftArray (value) {
  const first = value[0]
  const second = value[1]
  if (typeof first !== 'string' && typeof first !== 'function') {
    throw Error(`First draft value must be a string or a function, got: ${first}`)
  }
  if (typeof second !== 'object' && second !== undefined) {
    throw Error(`Second draft value must be null, undefined, or an object, got: ${second}`)
  }
}

/**
 * Draft utils
 */

export function cast (mysteryDraft) {
  if (isPrimitive(mysteryDraft)) {
    if (mysteryDraft || mysteryDraft === 0) return String(mysteryDraft)
    return null
  }
  return mysteryDraft
}

export function isDynamic (mysteryDraft) {
  return mysteryDraft instanceof Array && typeof mysteryDraft[0] === 'function'
}

// Will fail to detect arrays of primitive drafts that begin with a tagname,
// such as ['span', null, ['span', null, 'test']].
export function isArrayOfDrafts (value) {
  return value instanceof Array && typeof value[0] !== 'string' && value.every(isMaybeDraft)
}

function isMaybeDraft (value) {
  return isPrimitive(value) || value instanceof Array
}

/**
 * Misc
 */

export function isPrimitive (value) {
  return value === null || typeof value !== 'object' && typeof value !== 'function'
}

export function deepEqual (one, other) {
  if (one === other) return true
  if (isPrimitive(one) || isPrimitive(other)) return false
  if (one instanceof Array !== other instanceof Array) return false
  if (one instanceof Array) {
    if (one.length !== other.length) return false
    return one.every((value, index) => deepEqual(value, other[index]))
  }
  const keys = Object.keys(one)
  if (keys.length !== Object.keys(other).length) return false
  return keys.every(key => key in other && deepEqual(one[key], other[key]))
}
