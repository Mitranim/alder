## Overview

Alder is a library for writing dynamic user interfaces in JavaScript. It's a
fresh reimplementation of ideas popularised by React, driven further in the
direction of functional programming, inspired by Reagent and Om.

It's around 20 times lighter than React (≈ 6 KB minified) and has a much
smaller API surface, but manages to solve most of the same problems.

Differences from React:
* components are functions
* no classes
* no local component state
  <sup class="tooltip-host">
    [<span class="counter"></span>] <span class="tooltip">see [state management](state/)</span>
  </sup>
* DOM is represented with plain JS objects; JSX is unnecessary
  <sup class="tooltip-host">
    [<span class="counter"></span>] <span class="tooltip">see [usage with jsx](jsx/)</span>
  </sup>
* native DOM events are not abstracted away

Separation of concerns without separation of technologies.

Supports IE9+.

## Examples (ToDo)

"Hello world" in Alder:

```javascript
import {renderAt} from 'alder'

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
