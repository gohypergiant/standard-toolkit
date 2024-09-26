## Apply

An $Apply$ type allows us to merge contexts where as, a $Semigroup$ type allows us to merge values. An $Apply$ type functor is an extension of the basic functor concept (`map`). It has an additional operation, often called `ap`. This operation allows you to apply functions that are themselves wrapped in a functor to data that is also wrapped in a functor. Difference between unwrapped (`map`) and wrapped (`ap`).

The module must match the $Apply$ signature for some type $A$, support $Functor$ algebra for the same $A$, and obey following laws:

  _**Composition:**_ `A(a).ap(A(g).ap(A(f).map(f => g => x => f(g(x))))) ≡ A(a).ap(A(g)).ap(A(f))`

$ap: A (a \to b) \to A a \to A b$

$A a \xrightarrow{A (a \to b)} A b$

`Apply<A>.ap<B, R>(other: Apply<B>): Apply<R>;`

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://belsrc.github.io/gist-images/category/apply-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://belsrc.github.io/gist-images/category/apply1.png">
  <img alt="Basic apply" src="https://belsrc.github.io/gist-images/category/apply.png">
</picture>
