/* global Text, Element */

import {autorun, stop} from 'symphony'

export function render (elem, func, props) {
  if (!(elem instanceof Element)) {
    throw TypeError(`Expected an element, got: ${inspect(elem)}`)
  }
  if (!elem.parentNode) {
    throw Error(`Can't render to a parentless element: ${inspect(elem)}`)
  }
  if (typeof func !== 'function') {
    throw TypeError(`Expected a render function, got: ${inspect(func)}`)
  }
  props = Object.freeze({...props})
  link(elem, func, props)
}

function link (node, func, props) {
  function updater () {
    const plan = expand(func(props))
    try {
      node = sync(node, plan)
    } catch (err) {
      if (typeof console !== 'undefined') {
        console.error('Failure while rendering plan:', plan)
        console.error('Error was:', err)
      }
      throw err
    }
  }
  autorun(updater)
  setUpdater(node, updater)
  return node
}

function sync (node, plan) {
  if (typeof plan[0] === 'function') {
    throw TypeError(`[Internal] Expected an expanded plan, got: ${plan}`)
  }

  const alt = nodeForPlan(node, plan)
  if (node && alt !== node) insert(node.parentNode, alt, node)

  if (typeof plan === 'string') {
    if (alt.textContent !== plan) alt.textContent = plan
    return alt
  }

  const [, props, ...children] = plan
  if (props) syncProps(alt, props)
  const prune = !props || !('textContent' in props || 'innerHTML' in props)
  syncChildren(alt, children, prune)

  return alt
}

function syncProps (elem, props) {
  Object.keys(props).forEach(key => {
    // `children` may be inadvertently passed as properties from components
    // to inner "normal" elements. Ignore them.
    if (key === 'children') return

    const prop = props[key]

    if (key in knownEvents) {
      setListener(elem, key, prop)
      return
    }

    if (key === 'style') {
      syncStyles(elem.style, prop)
      return
    }

    if (/^data-|^aria-/.test(key)) {
      elem.setAttribute(key, prop)
      return
    }

    // Be careful with input fields. TODO check contenteditable.
    if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
      if (elem[key] === prop) return
    }

    elem[key] = prop
  })

  // If the plan doesn't specify classes, wipe any existing ones.
  if (!props.className) elem.className = ''

  // If the plan doesn't specify inline styles, wipe any existing ones.
  if (!props.style) elem.removeAttribute('style')
}

function syncChildren (elem, children, prune) {
  children = flatten(children)
  let i = -1
  while (++i < children.length) {
    const plan = vet(children[i])
    const node = elem.childNodes[i]
    const alt = typeof plan[0] === 'function' ?
                link(node, plan[0], squash(plan)) : sync(node, plan)
    if (!node && alt) insert(elem, alt)
  }
  if (prune) while (elem.childNodes[i]) remove(elem.childNodes[i])
}

/**
 * Planning
 */

function vet (plan) {
  // Falsy value: no render.
  if (!plan && plan !== 0) return ''

  // Primitive: coerce to string.
  if (typeof plan !== 'object' && typeof plan !== 'function') return String(plan)

  // Array: vet first two values.
  if (plan instanceof Array) {
    const [type, props] = plan
    if (typeof type !== 'string' && typeof type !== 'function' ||
        typeof type === 'string' && !/^[a-z0-9_-]+$/.test(type)) {
      throw TypeError(`The first element in an array version of DOM representation ` +
                      `must a lowercase tagname or a function. Received: ${inspect(type)}`)
    }
    if (props != null && typeof props !== 'object') {
      throw TypeError(`The second element in an array version of DOM representation ` +
                      `must be a plain object, null, or undefined. Received: ${inspect(props)}`)
    }
    return plan
  }

  throw TypeError(`A DOM representation must be either a primitive or an array. Received: ${inspect(plan)}`)
}

function expand (plan) {
  plan = vet(plan)
  if (typeof plan === 'string' || typeof plan[0] === 'string') return plan
  return expand(plan[0](squash(plan)))
}

// Combines the tail of a plan into a single props object.
//   ['div', {...}, 'child', 'child']
//    ^ type    ^ ... tail ... ^
function squash (plan) {
  return Object.freeze({...plan[1], children: plan.slice(2)})
}

function nodeForPlan (node, plan) {
  if (typeof plan === 'string') {
    return node instanceof Text ? node : document.createTextNode(plan)
  }
  if (typeof plan[0] === 'string') {
    return node instanceof Element && node.tagName.toLowerCase() === plan[0] ?
           node : document.createElement(plan[0])
  }
  throw TypeError(`[Internal] Expected text or tagname, got: ${plan}`)
}

/**
 * Eventing
 */

var knownEvents = {
  // Internal Alder events.
  onMount: true,
  onUnmount: true
}

// Copied from https://facebook.github.io/react/docs/events.html
;[
// Clipboard.
'onCopy', 'onCut', 'onPaste',
// Composition.
'onCompositionEnd', 'onCompositionStart', 'onCompositionUpdate',
// Keyboard.
'onKeyDown', 'onKeyPress', 'onKeyUp',
// Focus.
'onFocus', 'onBlur',
// Form.
'onChange', 'onInput', 'onSubmit',
// Mouse.
'onClick', 'onContextMenu', 'onDoubleClick', 'onDrag', 'onDragEnd',
'onDragEnter', 'onDragExit', 'onDragLeave', 'onDragOver', 'onDragStart',
'onDrop', 'onMouseDown', 'onMouseEnter', 'onMouseLeave', 'onMouseMove',
'onMouseOut', 'onMouseOver', 'onMouseUp',
// Selection.
'onSelect',
// Touch.
'onTouchCancel', 'onTouchEnd', 'onTouchMove', 'onTouchStart',
// Scroll.
'onScroll', 'onWheel',
// Media.
'onAbort', 'onCanPlay', 'onCanPlayThrough', 'onDurationChange', 'onEmptied',
'onEncrypted', 'onEnded', 'onError', 'onLoadedData', 'onLoadedMetadata',
'onLoadStart', 'onPause', 'onPlay', 'onPlaying', 'onProgress', 'onRateChange',
'onSeeked', 'onSeeking', 'onStalled', 'onSuspend', 'onTimeUpdate',
'onVolumeChange', 'onWaiting',
// Image.
'onLoad', 'onError'
].forEach(name => {
  knownEvents[name] = name.slice(2).toLowerCase()
})

// Allow user-defined events.
export function registerEvent (key, name) {
  if (!knownEvents[key]) knownEvents[key] = name
}

const eventKey = uuid()

function getListeners (node) {
  return node[eventKey] || (node[eventKey] = {})
}

function setListener (node, key, listener) {
  const eventName = knownEvents[key]
  const listeners = getListeners(node)
  const prev = listeners[key]
  if (prev && prev !== listener) {
    node.removeEventListener(eventName, prev)
  }
  if (typeof listener === 'function') {
    node.addEventListener(eventName, listeners[key] = listener)
  }
}

const updaterKey = uuid()

function setUpdater (node, updater) {
  const listeners = getListeners(node)
  const prev = listeners[updaterKey]
  if (prev && prev !== updater) stop(prev)
  listeners[updaterKey] = updater
}

/**
 * Lifecycle
 */

function insert (parent, node, oldNode) {
  parent.insertBefore(node, oldNode || null)
  if (oldNode) remove(oldNode)
  // Alder lifecycle event: onMount.
  const listeners = getListeners(node)
  if (listeners && listeners.onMount) listeners.onMount.call(node)
  return node
}

// Recursively cancels updaters on all elements in the tree and calls their
// onUnmount callbacks.
export function unlink (node) {
  if (node[eventKey]) {
    const listeners = node[eventKey]
    // Alder lifecycle event: onUnmount.
    if (listeners.onUnmount) listeners.onUnmount.call(node)
    // Stop auto-updating.
    if (listeners[updaterKey]) stop(listeners[updaterKey])
    node[eventKey] = null
  }
  let i = -1
  while (++i < node.childNodes.length) unlink(node.childNodes[i])
}

function remove (node) {
  if (!node) return
  unlink(node)
  if (node.parentNode) node.parentNode.removeChild(node)
}

/**
 * Misc
 */

function uuid () {
  return typeof Symbol === 'function' ? Symbol() : (Math.random() * Math.pow(10, 16)).toString(16)
}

function syncStyles (elemStyles, styles) {
  if (!styles || typeof styles !== 'object') {
    throw TypeError(`style declaration must be a plain object, got: ${inspect(styles)}`)
  }

  Object.keys(styles).forEach(key => {elemStyles[key] = styles[key]})

  // Remove any unspecified styles.
  Object.keys(elemStyles).forEach(key => {
    if (elemStyles[key] && !styles[key]) elemStyles[key] = ''
  })
}

function inspect (value) {
  if (value instanceof Array) return JSON.stringify(value.map(inspect))
  if (value && typeof value === 'object') {
    const buffer = {}
    Object.keys(value).forEach(key => {buffer[key] = inspect(value[key])})
    return JSON.stringify(buffer)
  }
  if (typeof value === 'function') {
    return value.name ? `function ${value.name}` : 'anonymous function'
  }
  return value
}

// Flattens the given array of arrays of plans (with unknown depth) into a one-
// dimensional array of plans.
function flatten (plan) {
  if (!(plan instanceof Array)) {
    throw TypeError(`[Internal] Expected plan to be an array, got: ${inspect(plan)}`)
  }
  // This includes normal plans and completely empty child lists.
  if (!(plan[0] instanceof Array)) return plan

  const buffer = []
  plan.forEach(value => {
    if (!(value instanceof Array)) buffer.push(value)
    else {
      const next = flatten(value)
      if (next !== value && next.length) buffer.push(...next)
      else if (value.length) buffer.push(value)
    }
  })
  return buffer
}
