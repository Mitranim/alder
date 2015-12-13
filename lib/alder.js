/* global Comment, Element */

const {validateDraft, cast, isDynamic, isPrimitive, deepEqual} = require('./shared')

/**
 * Public
 */

export function renderAt (node, func, props) {
  return renderDynamicDraft(node, [func, props])
}

export function unlink (node) {
  const cell = node.alderCell
  if (cell) {
    if (cell.units) each(cell.units, destroyUnit)
    if (typeof cell.onUnlink === 'function') cell.onUnlink.call(node)
  }
  each(node.childNodes, unlink)
  node.alderCell = null
}

/**
 * Rendering
 */

function renderDynamicDraft (node, dynamicDraft) {
  const units = node && node.alderCell && node.alderCell.units || []
  function proxyRender (draft, index) {
    node = proxyRenderStatic(node, units, proxyRender, draft, index) || node
  }
  proxyRender(dynamicDraft, 0)
  if (!node.alderCell.units) node.alderCell.units = units
  return node
}

function proxyRenderStatic (node, units, proxyRender, draft, index) {
  if (node && !node.parentNode) {
    if (typeof console !== 'undefined') {
      console.warn('Invalid attempt to render at a parentless node; received draft:', draft)
    }
    return unlink(node)
  }

  if (!isDynamic(draft)) {
    each(units.splice(index + 1), destroyUnit)
    return syncAndReplace(node, draft)
  }

  const func = draft[0]
  const props = Object.freeze({...draft[1], children: draft.slice(2)})
  if (units[index]) {
    if (unitMatches(units[index], func, props)) return
    each(units.splice(index), destroyUnit)
  }
  const unit = {func, props, unsub: null}
  units.push(unit)
  unit.unsub = deepRender(proxyRender, func, props, units, index)
}

function deepRender (proxyRender, func, props, units, index) {
  let called = false
  function render (draft) {
    validateDraft(draft)
    validateUnit(units[index], func, props)
    proxyRender(draft, index + 1)
    called = true
  }
  const unsub = func(render, props)
  if (!called) throw Error('The component must call the render function at least once')
  return unsub
}

/**
 * Syncing
 */

// Assumes plain draft.
function syncAndReplace (node, plainDraft) {
  node = replaceIfNecessary(node, plainDraft)
  if (plainDraft) mutate(node, plainDraft)
  return node
}

// Assumes plain draft and matching node type.
function mutate (node, plainDraft) {
  if (!node.alderCell) node.alderCell = createCell()

  if (isPrimitive(plainDraft)) {
    clearAttributes(node)
    if (node.textContent !== plainDraft) node.textContent = plainDraft
    return
  }

  const props = plainDraft[1]
  const children = plainDraft.slice(2)
  syncProps(node, props)
  refreshOnUnlink(node, plainDraft)
  if (props && ('textContent' in props || 'innerHTML' in props)) return
  syncChildren(node, children)
}

function syncChildren (node, drafts) {
  let i = -1
  while (++i < drafts.length) {
    const draft = cast(drafts[i])
    const sync = isDynamic(draft) ? renderDynamicDraft : syncAndReplace
    const child = sync(node.childNodes[i], draft)
    if (!node.childNodes[i]) node.appendChild(child)
  }
  while (node.childNodes[i]) node.removeChild(node.childNodes[i])
}

/**
 * Matching
 */

function replaceIfNecessary (prevNode, plainDraft) {
  const node = matchDraftType(prevNode, plainDraft)
  if (node !== prevNode) {
    if (prevNode) replaceNode(prevNode, node)
    link(node, plainDraft)
  }
  return node
}

function matchDraftType (node, plainDraft) {
  if (!shouldReplace(node, plainDraft)) return node
  if (!plainDraft) return document.createComment('alder.placeholder')
  if (isPrimitive(plainDraft)) return document.createElement('span')
  return document.createElement(plainDraft[0])
}

function shouldReplace (node, plainDraft) {
  if (!plainDraft) return !(node instanceof Comment)
  if (!(node instanceof Element)) return true
  if (isPrimitive(plainDraft)) return node.tagName !== 'SPAN'
  return node.tagName !== plainDraft[0].toUpperCase()
}

/**
 * Swapping
 */

function replaceNode (prevNode, node) {
  unlink(prevNode)
  moveCell(prevNode, node)
  swapNode(prevNode, node)
}

function moveCell (prevNode, node) {
  node.alderCell = prevNode.alderCell
  prevNode.alderCell = null
}

function swapNode (prevNode, node) {
  prevNode.parentNode.insertBefore(node, prevNode)
  prevNode.parentNode.removeChild(prevNode)
}

/**
 * Linking
 */

function link (node, plainDraft) {
  if (plainDraft && plainDraft[1] && typeof plainDraft[1].onLink === 'function') {
    plainDraft[1].onLink.call(node)
  }
}

function refreshOnUnlink (node, plainDraft) {
  const onUnlink = plainDraft && plainDraft[1] && plainDraft[1].onUnlink || null
  const cell = node.alderCell || (node.alderCell = {})
  cell.onUnlink = onUnlink
}

/**
 * Props
 */

function syncProps (elem, props) {
  props = Object(props)
  const prevProps = Object(elem.alderCell.props)
  const {style, children: _, ...other} = props

  if ('style' in props) {
    if (typeof style === 'string') elem.setAttribute('style', style)
    else {
      elem.setAttribute('style', '')
      for (const key in style) setProperty(elem.style, key, style[key])
    }
  }

  for (const key in other) {
    const value = other[key]
    if (isAttribute(key, value)) setAttribute(elem, key, value)
    else setProperty(elem, key, value)
  }

  // Remove obsolete props.
  for (const key in prevProps) {
    if (key in props) continue
    const value = prevProps[key]
    if (isAttribute(key, value)) elem.removeAttribute(key)
    else setProperty(elem, key, null)
  }

  elem.alderCell.props = props
}

function isAttribute (key, value) {
  if (/^data-[\S]+$/.test(key) || /^aria-[\S]+$/.test(key)) return true
  return isPrimitive(value) && /^on[a-z]+$/i.test(key)
}

function setAttribute (elem, key, value) {
  if (value === false) return elem.removeAttribute(key)
  if (value === true) value = ''
  elem.setAttribute(key, value)
}

function setProperty (target, key, value) {
  const current = target[key]
  if (!value) value = typeof current === 'string' ? '' : null
  if (value !== current) target[key] = value
}

function clearAttributes (elem) {
  while (elem.attributes[0]) elem.removeAttribute(elem.attributes[0].name)
}

/**
 * Validation
 */

function validateUnit (unit, func, props, draft) {
  if (!unit || unit.func !== func || unit.props !== props) {
    throw Error(`Attempted to call render after the component or the props have changed.\nComponent:\n${func}\nProps:\n${JSON.stringify(props)}`)
  }
}

/**
 * Misc
 */

function each (value, func) {
  for (let i = -1; ++i < value.length;) func(value[i], i)
}

function destroyUnit (unit) {
  if (typeof unit.unsub === 'function') unit.unsub()
}

function unitMatches (unit, func, props) {
  if (unit.func !== func) return false
  return unit.func === func && deepEqual(unit.props, props)
}

function createCell () {
  return {units: null, props: null, onUnlink: null}
}
