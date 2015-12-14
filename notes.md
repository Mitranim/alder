## TODO

* Tracking of children by key
* Consider if linking should happen after the first props sync


## Tracking

For plain drafts, child nodes can be found by pattern matching. We only consider
shifts and not swaps. The primary use case to support is when nodes are omitted
or inserted on the fly. In Alder, this use case is supported automatically by
the virtue of replacing null nodes with placeholder comments.


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
