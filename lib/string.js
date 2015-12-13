// Using `require` because Babel transpiles ES2015 imports into mysterious garbage.
const {cast, isDynamic, validateDraft, isPrimitive} = require('./shared')

export function renderToString (func, props) {
  return toString(expandDeep([func, props]))
}

function expandDeep (draft) {
  draft = expandShallow(draft)
  if (draft instanceof Array) {
    draft.push.apply(draft, draft.splice(2).map(expandDeep))
  }
  return draft
}

function expandShallow (draft) {
  let called = false

  function render (nextDraft) {
    validateDraft(nextDraft)
    draft = nextDraft
    called = true
  }

  while (isDynamic(draft)) {
    const func = draft[0]
    const children = draft.slice(2)
    const props = Object.freeze({...draft[1], children})
    func(render, props)
    if (!called) throw Error('The component must call the render function at least once')
    called = false
  }

  return cast(draft)
}

const selfClosingTags = {link: 1, meta: 1, base: 1, hr: 1, br: 1, img: 1, input: 1}

function toString (draft) {
  if (isPrimitive(draft)) return `<span>${draft}</span>`

  const tag = draft[0].toLowerCase()
  let attrs = attrsToString(draft[1])
  if (attrs) attrs = ' ' + attrs
  const children = draft.slice(2)

  if (selfClosingTags[tag]) return `<${tag}${attrs}>`
  return `<${tag}${attrs}>${children.map(toString).join('')}</${tag}>`
}

function attrsToString (attrs) {
  if (!attrs) return ''
  return Object.keys(attrs).map(key => attrToString(key, attrs[key])).filter(Boolean).join(' ')
}

const booleanAttrs = {disabled: 1, hidden: 1, checked: 1}

const propsToAttrs = {
  className: 'class',
  htmlFor: 'for'
}

function attrToString (key, value) {
  if (key === 'style') return styleToString(value)
  if (!isPrimitive(value)) return
  if (value == null) value = ''
  if (propsToAttrs[key]) key = propsToAttrs[key]
  if (booleanAttrs[key]) return value ? key : ''
  value = String(value).replace(/"/g, '\\"')
  return `${key}="${value}"`
}

function styleToString (style) {
  if (typeof style === 'string') return style
  if (!style || typeof style !== 'object') return
  const result = Object.keys(style).map(key => {
    let value = style[key]
    if (!isPrimitive(value)) return
    value = String(value).replace(/"/g, '\\"')
    return `${toKebabCase(key)}: ${value}`
  }).filter(Boolean).join('; ')
  return result ? `style="${result}"` : ''
}

function toKebabCase (string) {
  return string.replace(/[A-Z]/g, match => '-' + match.toLowerCase())
}
