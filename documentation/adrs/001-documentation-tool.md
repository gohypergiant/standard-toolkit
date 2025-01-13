<!-- Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at https://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License. -->

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

## Recommendation

Based on the maturity of the tool, the track record of success, the developer experience, and customizability the tool(s) we are moving forward with will be TypeDoc + Docusaurus. TypeDoc will render the content from docblocks in code and Docusaurus will allow for better content organization and plugin options.

## Tools Considered

Tool         | Latest    | Releases  | Contributors | Build | Setup | React | Customization | Disqualifier
:----------- | --------- | --------- | ------------ | ----- | ----- | ----- | ------------: | ------------
[Docusaurus] | 2 hours   | 148       | 1175         | Yes   | easy  | Yes   | Moderate      |
[TypeDoc]    | 2 days    | 224       | 227          | Yes   | easy  | Yes   | Moderate      | Better options?
_            |           |           | Disqualified |       |       |       |               | _
[Docsify]    | 1 day     | 14        | 183          | None  | easy  | Ext   | Minimal       | Burden of extension
[Docz]       | 2 years   | 127       | 134          | Yes   | att0  | Yes   | Moderate      | Age without update
[FumaDocs]   | 2 hours   | 673*      | 43*          | Yes   | att0  | Yes   | Moderate      | One developer
[JSDoc]      | 2 days    | 12        | 83           | Gen   | easy  | No    | Extensive     | Burden of extension
[MkDocs]     | 1 month   | 15        | 244          | Yes   | att0  | Yes?  | Extensive     | Burden of extension
[Nextra]     | 9 hours   | 619*      | 169          | Yes   | hard  | Yes   | Moderate      | Poor dev experience
[Pandoc]     | 1 day     | 140       | 522          | Yes   | att0  | Ext   | Extensive     | Burden of extension
[RSPress]    | 2 days    | 115       | 97           | Yes   | easy  | Yes   | Moderate      | Maintained by Bytedance
[Slate]      | 10 months | 28        | 126          | Yes   | hard  | No?   | Extensive     | Burden of extension
[Startlight] | 2 days    | 134       | 228          | Yes   |       | Yes   | Moderate      | Versioning support
[TS-Docs]    | 2 years   | 16        | 1            | Yes   | att0  | No    | Extensive     | Burden of extension
[TSDoc]      | 2 weeks   | ???       | 36           | Yes   | hard  | No?   | Extensive     | Burden of extension
[Vocs]       | 2 months  | 468       | 21           | Yes   | hard  | Yes   | Moderate      | Integration with TypeDoc

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
- __Setup__ - ease of getting it running: easy, or hard, att0 (no attempt)

_All considered tools offer comparable search options._

### Notes

There is strong convergent evolution of all tools evaluated. Similarities in: structure, routing, search, content authoring and display, etc.

Similarly there are the same limitations, when considering the "playground" feature in that if they support it they support a JS-only version and largely only for React components; meaning that for a TS solution or one for non-React code we will need to build a solution with the help of something like [Sandpack](https://sandpack.codesandbox.io/), [Monaco](https://microsoft.github.io/monaco-editor/), or similar. This is very accomplishable but not something that is required for launch.

#### Docsify

This tool was the easiest to get running and extend; less than a day to start and extend. The biggest limitation to this as a solution is that all execution is done at runtime in the users/viewers browser; this would likely limit the potential integrations we would have available for development.

#### Fumadocs

The offering is impressive and uses tooling that would be aligned with our own. However, one major drawback is it is offered by basically a single developer; the next 2 closest contributors are bots and everyone else that contributes has done so with very low rates. Additionally, the trend of contributions is downward.

#### Nextra

A very appealing option on the surface. However, the most stable version - 3 - is not as stable as it should be and the newest version - 4 - is not ready for use. The search feature in version 3 throws application errors when searching. The setup instructions for version 4 aren't correct; getting a working "Getting Started" site up wasn't accomplishable. Version 4 was only released a day or two before this work was attempted.

- Search was inconsistent and error prone in initial testing
- Documentation of newest version was not up-to-date

#### RSPress

The tool is robust and fairly mature. Getting up and running with the basics is straightforward.

However, it is maintained by Bytedance and given our current avoidance of products from that company we can not move forward with this tool at this time.

#### Starlight

Docusaurus' support of versioning the docs site content won out over Starlight's burden of development required to support this feature.

#### ts-docs

An interesting feature of ts-docs is native support for unit testing the code examples in the documentation to ensure consistency with the codebase.

#### TypeDoc

An interesting divergent pattern of this tool is explicit linking to external documentation in the docblock comment in code.

A positive ergonomics pattern that exists with TypeDoc is that the linking between docblocks and additional content is explicit and intuitive/obvious potentially making it more ergonomic and natural to keep up to date. Additionally, this would allow for easier adoption moving forward as additional content can be incrementally added as needed while allowing modules that don't need additional content to be included with zero additional effort as they would simply be represented by docblock generated pages.

In general, using the output from TypeDoc as a source for content for another framework - Docusaurus, Nextra, Vocs, etc. - is a good plan.

##### Vocs

The tool is robust and fairly mature. Getting up and running with the basics is straightforward.

The tooling looks to be great and there are a lot of features available that are very attractive. However, the integration with the output from TypeDoc requires manual changes either as a plugin to remap links to be compatible with Vocs and the structure of the docs site, or the links need to be authored in-place in a non-intuitive way.

[Docsify]: https://docsify.js.org/#/
[Docusaurus]: https://docusaurus.io/
[Docz]: https://www.docz.site/
[FumaDocs]: https://fumadocs.vercel.app/
[JSDoc]: https://jsdoc.app/
[MkDocs]: https://www.mkdocs.org/getting-started/
[Nextra]: https://nextra.site/
[Pandoc]: https://pandoc.org/
[RSPress]: https://rspress.dev/
[Slate]: https://slatedocs.github.io/slate/#introduction
[Startlight]: https://starlight.astro.build/
[TS-Docs]: https://ts-docs.github.io/ts-docs/
[TSDoc]: https://tsdoc.org/
[TypeDoc]: https://typedoc.org/
[Vocs]: https://vocs.dev/
