# Choosing a Documentation Tool

We want to offer exemplary DevTK documentation for current and future users to learn and discover the functionalities contained.

## Goals

  1. Docblocks inside the codebase
      - These are inline comments documenting the structure, usage, and behavior of specific functions, classes, and modules.
      - Docblocks are helpful for users and maintainers as they provide information in close to where the code is being used.
  2. Markdown outside of the codebase
      - Markdown files outside the codebase can contain additional documentation such as high-level architectural decisions, design intentions, and contextual explanations.
  3. Easy maintenance
      - There are at least two aspects to maintenance: maintaining the documentation to keep it accurate, and generating the tool used to browse the documentation.
      - The Docblocks are helpful but including exhaustive documentation in the codebase will become burdensome and avoided.
      - Maintaining two (or more) sources of truth for any content will mean that it will become out of date very easily and quickly; the only thing worse than no documentation is bad/incorrect documentation.
      - We will have plenty of work building the modules we don't need the additional responsibility of keeping a whole other project - the documentation site - up to date and accurate.
  4. "No-setup" playgrounds
      - Where possible, for each module, there could be an interactive component that would allow users to experiment with the codebase from within the documentation site itself.
  5. Limits
      - dont want to replace training suite
      - dont want to replace code comments

## Tools

Tool         | Latest    | Releases  | Contributors | Build | Setup | Run | React
------------ | --------- | --------- | ------------ | ----- | ----- | --- | -----
[Docsify]    | 1 day     | 14        | 183          | None  | Easy  | Ext | Ext
[Docusaurus] | 2 hours   | 148       | 1175         | Yes   |       |     |
[Docz]       | 2 years   | 127       | 134          | Yes   |       |     |
[FumaDocs]   | 2 hours   | 673*      | 43           | Yes   |       |     |
[JSDoc]      | 2 days    | 12        | 83           | Gen   | Easy  | No  |
[RSPress]    | 2 days    | 115       | 97           | Yes   |       |     |
[Startlight] | 2 days    | 134       | 228          | Yes   |       |     |
[TS-Docs]    | 2 years   | 16        | 134          | Yes   | Hard  |     |
[TypeDoc]    | 2 days    | 224       | 227          | Yes   |       |     |
[Vocs]       | 2 months  | 468       | 21           | Yes   |       |     |
_            |           |           |              |       |       |     |
[Slate]      | 10 months | 28        | 126          | Yes   | Hard  |     |
[TSDoc]      | 2 weeks   | ???       | 1            | Yes   | Hard  | No? | No?

### Criteria

- __Build__ - requires a build step to generate the pages
  - Yes - will be an additional step in CI
  - Gen - will be an additional step in CI but very basic generation from docblocks
  - None - will not require a build or generation step
- __Contributors__ - number of people contributing
- __Latest__ - most recent change in github (_at time of collection_)
- __React__ - renders react components (e.g. from design system)
  - Yes - native support
  - Ext - will require an extension/plugin
- __Releases__ - number of "releases" or production deployments
- __Run__ - supports interactive code examples
  - Yes - native support
  - Ext - will require an extension/plugin
- __Setup__ - ease of getting it running: easy, or hard

[Docsify]: https://docsify.js.org/#/
[Docusaurus]: https://docusaurus.io/
[Docz]: https://www.docz.site/
[FumaDocs]: https://fumadocs.vercel.app/
[JSDoc]: https://jsdoc.app/
[RSPress]: https://rspress.dev/
[Slate]: https://slatedocs.github.io/slate/#introduction
[Startlight]: https://starlight.astro.build/
[TS-Docs]: https://ts-docs.github.io/ts-docs/
[TSDoc]: https://tsdoc.org/
[TypeDoc]: https://typedoc.org/
[Vocs]: https://vocs.dev/
