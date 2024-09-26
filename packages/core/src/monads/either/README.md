## You Go Left, I'll Go Right: Either Monad [WIP]

Either lets you code against a possible failure without having to explicitly catch each time that it is accessed.

This also puts the control flow into a nice linear statement without having to jump around.

The `cata` function is like doing `try { g(value) } catch { f(value) }`
