## Overview

Alder is a library for writing dynamic user interfaces in JavaScript. It's a
fresh reimplementation of ideas from React and Om. Alder is much lighter,
faster, and simpler. It's about 4% the size of React, and its API surface is
much smaller.

Differences from React:
* components are pure functions
* no persistent virtual DOM
* no local component state
* no JSX; DOM is represented with plain data
* no internal event system
* lightweight change detection system (peer dependency)


## Examples (ToDo)

```javascript
import {render} from 'alder'

const main = document.getElementById('app')

render(main, function () {
  return (
    ['div', {className: 'container'},
      ['h1', {}, 'Hello world!']]
  )
})
```

<div data-input></div>
<div data-state></div>
<!-- <div data-unsafe></div> -->
<!-- <div data-stamp></div> -->
<!-- <div data-key></div> -->
<div data-person></div>
<div data-person-name-length></div>
<!-- <div data-modal></div> -->
