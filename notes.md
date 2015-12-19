## TODO

* Child tracking and matching by key (see below)
* Consider if linking should happen after the first props sync


## Tracking

Two use cases:
* omitting or including nodes in static positions (conditionally rendering null)
* mapping a collection to children

The "static" use case is supported automatically through placeholder comments.

The "dynamic" use case appears to require tracking with keys, which is currently
NYI.


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


## Setup / Teardown

                                (closures unsub)
                                      stop
    setup   update update update update   teardown
        render
                (in user callback)

    where:
      render provided by alder
      unsub provided by user
