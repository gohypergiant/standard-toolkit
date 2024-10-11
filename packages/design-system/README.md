# Design System (C2DS)

Welcome to the C2 Design System (C2DS)! This library is a collection of UI components and tools for engineers to build specialized, precise user experiences for Command and Control (C2) systems.

## Why does this design system exist?

This design system, which we've designated C2DS for simplicity, was born of three essential business priorities:

- We want to improve runtime performance of our applications.
- We require more flexible tools for building specialized UI than was available in traditional "out of the box" libraries.
- We want to invest in a solid foundation for growth across our many domains to increase velocity, stability and quality.

From an engineering perspective, we also want to future-proof our investment by switching to an approach more natively compatible with React Server Components. This is the future of React and getting out ahead of that transition is valuable before it becomes a significant pain point inhibiting rapid feature development.

Developed by the Core team, C2DS is a shared platform that all engineers can -- and are encouraged -- to contribute to. Eventually, this system will be published as open source to invite collaboration across our partners and the engineering community in general.

### Performance

The runtime performance of our applications is an enduring central concern. Our applications place a high performance demand on the browser client, primarily due to the sheer data throughput and intensive rendering requirements. Therefore, it makes sense to move away from a runtime CSS-in-JS solution in favor of a build/compile time styling solution.

[Advantages >](./documentation/concepts.md#build-&-runtime)

### Flexibility and control

The highly bespoke nature of some of our feature implementation is a constant source of friction when using other design systems. We want to move towards a solution that provides us with better tooling to craft features without locking us into existing UI/UX paradigms or irrelevant constraints.

We also want to establish a common platform for multiple similar, but stylistically and functionally unique, applications to be built on a consistent design language with fewer established opinions. The intent here is to provide all the power and flexibility of a custom solution while maintaining a common foundation for interoperability with different digital properties.

## What does C2DS consist of?

C2DS is a semi-headless, themeless collection of components that express minimal opinions about layout and baked-in styles with an API of props for each component that strives to suit many common use cases. The design guidelines are established within [Figma](https://www.figma.com/design/CoNlAMPL0u5DCVYRPQKhki/N2X-Design-System?node-id=30742-76715&m=dev).

While C2DS is based on theme of the Jeric2o application, the vast majority of spacing and color theming to left up to the implementer to define. For every element of this system, the priority has been flexibility over rigid requirements and an "escape hatch" for overriding style and behavior if necessary.

## Why isn't there a theme or icons?

While the exported modules of this package do not include a theme, the Ladle stories for each component utilize a theme established within the `./.ladle/theme` folder for documentation purposes. You can feel free to use this as a starting point for your app's implementation and customize it to suit your needs.

The icons are also missing because we're trying to avoid locking this design system into a specific design language -- they are considered a part of the theming and an application-level concern. Each component that supports icons expects them to be implemented through composition. This enables maximum flexibility and freedom for the implementing app.

## Concepts

This design system is built on a number of concepts with which you may not be familiar. [Learn](./documentation/concepts.md) about the technologies, packages, abstractions and patterns that power this design system.

## Getting started

Check out what exists:

```bash
npm i

npm run preview -w @hypergiant/design-system
```

### Implementation

[Learn](./documentation/implementation.md) how to get your app up and running.

<!-- TODO - documentation around build systems -->

### Contribution

[Learn](./documentation/contribution.md) how to craft components for this design system.
