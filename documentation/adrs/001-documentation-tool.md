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

### Recommendation

>[!IMPORTANT]
>The best option at this time is [RSPress].
>
> - Active development
> - Future focused tech stack
> - Tech stack alignment (with our own)

## Tools

Tool         | Latest    | Releases  | Contributors | Build | Setup | React | Customization | Disqualifier
:----------- | --------- | --------- | ------------ | ----- | ----- | ----- | ------------: | ------------
[Docusaurus] | 2 hours   | 148       | 1175         | Yes   |       | Yes   | Moderate      |
[FumaDocs]   | 2 hours   | 673*      | 43           | Yes   |       | Yes   | Moderate      |
[RSPress]    | 2 days    | 115       | 97           | Yes   | Easy  | Yes   | Moderate      |
[Startlight] | 2 days    | 134       | 228          | Yes   |       | Yes   | Moderate      |
[Vocs]       | 2 months  | 468       | 21           | Yes   |       | Yes   | Moderate      |
_            |           |           | Disqualified |       |       |       |               | _
[Docsify]    | 1 day     | 14        | 183          | None  | Easy  | Ext   | Minimal       | Burden of extension
[Docz]       | 2 years   | 127       | 134          | Yes   |       | Yes   | Moderate      | Age without update
[JSDoc]      | 2 days    | 12        | 83           | Gen   | Easy  | No    | Extensive     | Burden of extension
[MkDocs]     | 1 month   | 15        | 244          | Yes   |       |       | Extensive     | Burden of extension
[Pandoc]     | 1 day     | 140       | 522          | Yes   | Hard  | Ext   | Extensive     | Burden of extension
[Slate]      | 10 months | 28        | 126          | Yes   | Hard  | No?   | Extensive     | Burden of extension
[TS-Docs]    | 2 years   | 16        | 1            | Yes   | Hard  | No    | Extensive     | Burden of extension
[TSDoc]      | 2 weeks   | ???       | 36           | Yes   | Hard  | No?   | Extensive     | Burden of extension
[TypeDoc]    | 2 days    | 224       | 227          | Yes   |       | No?   | Moderate      | Additional guides support

_Many of the listed tools are quite comparable so choosing one over the other has a narrow margin. However, some are clearly less capable or are less aligned with the goals and desired development practices than others._

### Criteria

- __Build__ - requires a build step to generate the pages
  - Yes - will be an additional step in CI
  - Gen - will be an additional step in CI but very basic generation from docblocks
  - None - will not require a build or generation step
- __Contributors__ - number of people contributing
- __Customization__ - the level needed to accomplish our goals
  - Minimal
  - Moderate
  - Extensive
- __Latest__ - most recent change in github (_at time of collection_)
- __React__ - renders react components (e.g. from design system)
  - Yes - native support
  - Ext - will require an extension/plugin
- __Releases__ - number of "releases" or production deployments
- __Setup__ - ease of getting it running: easy, or hard

### Notes

#### Docsify

This tool was the easiest to get running and extend; less than a day to start and extend. The biggest limitation to this as a solution is that all execution is done at runtime in the users/viewers browser; this would likely limit the potential integrations we would have available for development.

#### RSPress / Vocs

These tools are robust and fairly mature. Getting up and running with the basics is straightforward. Their offerings are very similar and their limitations are also similar.

RSPress lacks the ability to display a sandbox for a typescript module (and its dependencies) natively; however, there is support for displaying an interactive React.js component preview. A typescript solution is not too far off, with some work, using something like StackBlitz or Sandpack SDKs; it will take a fair amount of effort to get up and running and then long-term maintenance.

#### ts-docs

An interesting feature of ts-docs is native support for unit testing the code examples in the documentation to ensure consistency with the codebase.

#### TypeDoc

An interesting divergent pattern of this tool is explicit linking to external documentation in the docblock comment in code. Also, TypeDoc doesn't seem to support React components; at least I wasn't able to quickly find a reference to what I would expect.

The limitation that excludes TypeDoc from further consideration is that it does not support the desire for additional content outside of the structure of a code file. Meaning that if we want pages in the documentation site that aren't generated as a result of a code file there is some work required to accomplish this.

[Docsify]: https://docsify.js.org/#/
[Docusaurus]: https://docusaurus.io/
[Docz]: https://www.docz.site/
[FumaDocs]: https://fumadocs.vercel.app/
[JSDoc]: https://jsdoc.app/
[MkDocs]: https://www.mkdocs.org/getting-started/
[Pandoc]: https://pandoc.org/
[RSPress]: https://rspress.dev/
[Slate]: https://slatedocs.github.io/slate/#introduction
[Startlight]: https://starlight.astro.build/
[TS-Docs]: https://ts-docs.github.io/ts-docs/
[TSDoc]: https://tsdoc.org/
[TypeDoc]: https://typedoc.org/
[Vocs]: https://vocs.dev/
