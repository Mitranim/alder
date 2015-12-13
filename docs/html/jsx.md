## Overview

Alder works with React's JSX. Useful if:
* You prefer JSX markup over plain JavaScript
* You want to be able to easily migrate to React
* You're migrating from React to Alder

## Usage

Alder has an extremely simple
<a href="https://github.com/Mitranim/alder/blob/master/lib/react.js" target="_blank">utility</a>
that emulates `React.createElement`. Import or copy it into your source, and
you can write JSX.

```javascript
const {React} = require('alder/react')

function Component (render, props) {
  render (
    <div className='greeting'>Hello world!</div>
  )
}

// Equivalent to:

function component (render, props) {
  render (
    ['div', {className: 'greeting'}, 'Hello world!']
  )
}
```

## Differences

Alder provides only `React.createElement` to enable JSX. It doesn't attempt to
emulate any other React API.

### Capitalisation

JSX relies on capitalisation to distinguish between tags and identifiers. When
using JSX, you'll need to capitalise component names.

Without JSX:

```javascript
const innerComponent = render => render(
  ['div', null, 'hello world']
)

const outerComponent = render => render(
  [innerComponent]
)
```

With JSX:

```javascript
const InnerComponent = render => render(
  <div>hello world</div>
)

const OuterComponent = render => render(
  <InnerComponent />
)
```

### Lifecycle

Alder doesn't have a concept of virtual component instances that can be mounted
or unmounted. The closest analogy is:

* component function + unsubscribe function
* link function + unlink function

(TODO expound)

### Events

Alder treats handlers like normal properties, assigning them to the element. See the event property
<a href="https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers" target="_blank">reference</a>
on MDN.

```javascript
['button', {onclick (event) {console.log('button clicked:', this)}}, 'click me']
```

React uses a fancy synthetic event system with custom property names:

```javascript
<button onClick={event => {console.log('button clicked:', event.target)}}>
  click me
</button>
```
