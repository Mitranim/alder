<!-- {% extend('index.html', {title: 'Examples'}) %} } -->

(TODO)

A simple view looks like this:

```javascript
function hello (render, props) {
  render(
    ['div', {className: 'greeting'}, 'Hello world!']
  )
}
```

The `render` function must be called immediately, but you're also welcome to
call it later, asynchronously:

```javascript
function view (render, props) {
  render(
    ['div', {className: 'greeting'}, 'My name is Helen!']
  )

  setTimeout(() => {
    render(
      ['div', {className: 'greeting'}, 'My name is Miranda!']
    )
  }, 1000)
}
```

When setting up a recurring update, you must return an "unsubscribe" function
that stops the update. Alder will call it when the view's lifecycle is finished.
Without unsubscribing, you'll get warnings from Alder and leak memory!

```javascript
function recurring (render, props) {
  render(['div', {}, 'Just sit tight...'])

  const id = setInterval(() => {
    render(['div', {}, 'The current time is: ', Date.now()])
  }, 1000)

  return () => {clearInterval(id)}
}
```
