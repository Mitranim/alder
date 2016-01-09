{% extend('index.html', {title: 'Server Rendering'}) %}

## Overview

Alder has an optional module for rendering components to string. This can be
used to implement server-side rendering and isomorphic applications.

## Usage

```javascript
import {renderToString} from 'alder/string'

function component (render, props) {
  render(
    ['div', {className: 'greeting'}, 'Hello ', props.name, '!']
  )
}

console.log(renderToString(component, {name: 'world'}))
```

This will print:

```html
<div class="greeting"><span>Hello </span><span>world</span><span>!</span></div>
```

Some properties, such as `className`, are automatically converted into
corresponding attributes, such as `class`. Non-primitive properties are ignored.
