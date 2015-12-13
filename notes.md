## TODO glossary


## Updating

    func            \
    props            |-> draft
    external state  /

    func  | in tree
    props |
    external state | provided sideways by user

    func + props + external state -> render
     === +  ===  +      ===       -> noop
      X  +  ===  +      ===       -> teardown, setup
     === +   X   +      ===       -> teardown, setup
     === +  ===  +       ?        -> ???


## Misc

Don't put DOM manipulation in setup and teardown functions. They're not related
to the lifetimes of DOM nodes. Between setup and teardown, a render function can
produce different DOM nodes that replace each other. Instead, include `onLink`
and `onUnlink` functions into the props of the DOM nodes you wish to manipulate.
Contrived example:

    const component = {
      render: () => (
        ['div', {onLink () {this.classList.add('visible')},
                 onUnlink () {this.classList.remove('visible')}}, '...']
      ),
      setup () {/* ... */},
      teardown () {/* ... */}
    }


## Setup / Teardown

                                (closures unsub)
                                      stop
    setup   update update update update   teardown
        render
                (in user callback)

    where:
      render provided by alder
      unsub provided by user
