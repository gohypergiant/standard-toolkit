## Functor

A functor is a **map** between categories. Or, put simpler, a way to apply a function or transformation to elements within a specific context. The module must match the $Functor$ signature for some type $A$, and obey the following laws:

  _**Identity:**_ If `F` is a functor, then calling `F.map(x => x)` must be equivalent to `F`.

  _**Composition:**_ If `F` is a functor, and `f` and `g` are functions, then calling `F.map(x => f(g(x)))` is equivalent to calling `F.map(g).map(f)`.

$F: A \rightarrow B$

where $F$ is our functor and $A$ and $B$ are our categories.

$map: (a \to b) \to F a \to F b$

$F a \xrightarrow{a \to b} F b$

`Functor<A>.map<R>(f: (x: A) => R): Functor<R>;`

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://belsrc.github.io/gist-images/category/functor-1-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://belsrc.github.io/gist-images/category/functor-1.png">
  <img alt="Basic functor" src="https://belsrc.github.io/gist-images/category/functor-1.png">
</picture>

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://belsrc.github.io/gist-images/category/functor-2-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://belsrc.github.io/gist-images/category/functor-2.png">
  <img alt="Functor map explanation" src="https://belsrc.github.io/gist-images/category/functor-2.png">
</picture>
