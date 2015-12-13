## Overview

Alder is a library for writing dynamic user interfaces in JavaScript. It's a
fresh reimplementation of ideas popularised by React, driven further in the
direction of functional programming. It's also inspired by ideas from
Reagent/Om/Clojure.

It's around 20 times lighter than React (≈ 5 KB minified) and has a much
smaller API surface, but manages to solve most of the same problems.

Differences from React:
* components are functions
* no classes
* no local component state
* DOM is represented with plain JS objects; JSX is unnecessary, but optionally [available](jsx/)
* native DOM events are not abstracted away

Separation of concerns without separation of technologies.

Supports IE9+.

## Examples (ToDo)

"Hello world" in Alder:

```javascript
const {renderAt} = require('alder')

function component (render, props) {
  render(
    ['div', {className: 'container'},
      ['h1', {}, 'Hello ', props.name, '!']]
  )
}

const root = document.getElementById('app')

renderAt(root, component, {name: 'world'})
```

<div data-hello></div>
<div data-state></div>
<div data-input></div>
<div data-unsafe></div>
<div data-safe></div>
<div data-stamp></div>
<div data-key></div>
<div data-person></div>
<div data-modal></div>
