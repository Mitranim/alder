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
  if (isPrimitive(draft)) return draft

  const tag = draft[0].toLowerCase()
  let attrs = attrsToString(draft[1])
  const children = draft.slice(2)

  if (selfClosingTags[tag]) return `<${tag}${attrs ? ` ${attrs}` : ''}>`
  return `<${tag}${attrs ? ` ${attrs}` : ''}>${children.map(toString).join('')}</${tag}>`
}

function attrsToString (attrs) {
  if (!attrs) return ''
  return Object.keys(attrs).map(key => attrToString(key, attrs[key])).filter(Boolean).join(' ')
}

const booleanAttrs = {disabled: 1, hidden: 1, checked: 1}

const propsToAttrs = {
  className: 'class'
}

function attrToString (key, value) {
  if (!isPrimitive(value)) return
  if (value == null) value = ''
  if (propsToAttrs[key]) key = propsToAttrs[key]
  if (booleanAttrs[key]) return value ? key : ''
  return `${key}="${value}"`
}
