// Faux `React.createElement` for use with JSX.
export const React = {
  createElement: (type, props, ...children) => [type, props, ...children]
}
