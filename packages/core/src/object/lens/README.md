## Spectacled Objects: Lenses

Functional object lenses provide a way to focus on and manipulate specific properties or substructures within complex data structures, such as objects or nested data, in a functional and composable manner. Functional lenses allow you to access, modify, and update data while maintaining immutability. A lens typically consists of two main operations:

  * **get**: This operation allows you to extract a specific property or substructure from the larger data structure, like an object. It returns the focused part of the data. The get operation is pure and doesn't modify the original data; it only provides a view into it.
  * **set**: This operation enables you to modify the focused property or substructure and produce a new data structure with the changes. It takes the new value and the original data, returning a modified copy of the data. Like get, the set operation doesn't mutate the original data; it creates an updated version.

Lenses work with immutable data, ensuring that the original data remains unchanged. This is crucial in functional programming, where immutability is a fundamental concept.

You can compose lenses to focus on nested properties or substructures of an object. This allows you to work with complex data structures by chaining lenses together, creating a path to the data you want to manipulate.

Lenses abstract away the details of accessing and modifying specific properties. Once you create a lens for a property, you can reuse it to read and update that property in different objects or data structures.

This lets you move away from having deep dives into the shape of a particular object. You can just import a lens. And if the structure of the data ever changes, you can change it in the lens, and none of the rest of the codebase needs to be updated.

Lenses also have laws, algebraic axioms, which ensure the correctness of the lens.

  * **Retention (SetGet)** - If you `set` a value and immediately `get` the value, through the lens, you get the value that was set.
    * `get(lens)(set(lens)(name)(person)) ≡ name`
    * `expect(lens.get(lens.set(person)(name))).toEqual(name);`

  * **Identity (GetSet)** - If you `get` the value and then immediately `set` that value back into the store, the object is unchanged.
    * `set(lens)(get(lens)(store))(store) ≡ store`
    * `expect(lens.set(person)(lens.get(person))).toStrictEqual(person);`

  * **Double Set (SetSet)** - If you `set` a lens value to `a` and then immediately set the lens value to `b`, it's the same as if you'd just set the value to `b`.
    * `set(lens)(b)(set(lens)(a)(store)) ≡ set(lens)(b)(store)`
    * `expect(lens.set(lens.set(person)(name1))(name2)).toEqual(lens.set(person)(name2));`
