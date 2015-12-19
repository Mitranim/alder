## Overview

Unlike most libraries and frameworks that deal with rendering, Alder doesn't
allow you to keep
<dfn id="state" data-sf-tooltip="Persistent data that changes over time">state</dfn>
in the view layer. It's inspired by functional programming techniques, one of
which is to _isolate state_ to as few places as possible.

This means you need some place to store your application data, and some way to
notify views about changes.

The recommended way to manage state in Alder is with
<a href="https://github.com/Mitranim/prax" target="_blank">Prax</a>.
It's a library for managing immutable state that provides change detection for
extremely efficient view updates. It also helps you organise app events in a
message-passing style. Alternatively, you can use any data library with some
kind of event system, such as Redux or JSData. These examples will use Prax.

## Setup

(See the Prax quickstart to learn about atoms.)

```javascript
const {createAtom} = require('prax')

const atom = createAtom()
const {watch, stop} = atom

const auto = component => (render, props) => {
  function update () {render(component(props))}

  // This also immediately calls `update`.
  watch(update)

  // Unsubscribe function. Will be called by Alder when needed.
  return () => {stop(update)}
}
```

Now use this `auto` function to create auto-updating views with minimal noise.

## Usage

```javascript
const {renderAt} = require('alder')

// Using `read` implicitly establishes a subscription.
const hello = auto(props => (
  ['div', {className: 'greeting'}, 'Hello ', read('name'), '!']
))

renderAt(document.getElementById('app'), hello)

// Update the view twice.
atom.write({name: 'world'})
atom.write({name: 'me heartie'})
```

That's all you need. Prax will call the update function only when the data read
by the view _really_ has changed.
