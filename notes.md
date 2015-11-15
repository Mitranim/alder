# Terms

## plan

    heisenplan
    expanded-plan

## expanded-plan

    string
    [string props children]

## heisenplan

    [func props children]

## squashed-heisenplan

    [func squashed-props]

## props

    {...}

## squashed-props

    {..., children: [...]}

## squash

    (props children) -> squashed-props

## expand

    (func props) -> [string props children]

## expansion

    [func props children] -> squash() -> [func props] -> expand() -> [string props children]


To set up prax autorun, we need to expand only when a DOM node is available, in
order to closure the element in the autoupdater function.
