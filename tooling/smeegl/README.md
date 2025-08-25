# @accelint/smeegl

A small, `spreet` based spritesheet/texture package for use with Deck.gl.

## Prerequisites

The [spreet](https://github.com/flother/spreet?tab=readme-ov-file#installation) utility is required for this tool.

A few options for install include:

### Homebrew

```shell
brew install flother/taps/spreet
```

### crates.io

```shell
cargo install spreet
```

### Other methods

If those two methods aren't available, check the [official instructions](https://github.com/flother/spreet?tab=readme-ov-file#installation) for more help.

### Standalone binary

Use the `--spreet` flag to point to a stand-alone binary.

## Installation

Here are a few options:

- For global installation: `npm install -g @accelint/smeegl`
- For local installation using npm: `npm install @accelint/smeegl`
- For local installation using pnpm: `pnpm install @accelint/smeegl`

## Usage

```shell
smeegl --help


Usage: smeegl [options] <GLOB> [OUTPUT]

CLI tool to create spritesheets from an SVG glob pattern

Arguments:
  GLOB             SVG glob pattern
  OUTPUT           The atlas output path, CWD/atlas if none given

Options:
  --spreet <path>  Path to pre-built spreet binary, unneeded if installed
  --crc <MODE>     Sprite names will be converted to crc32. Valid modes are 'DEC' or 'HEX'
  -h, --help       display help for command


smeegl "**/*.svg" "tooling/smeegl/atlas"
```

### File Output

On successful completion, three files will be generated (assume the default name `atlas` is used):

- `atlas.json` - The sprite's index file
- `atlas.png` - The sprite's image file
- `atlas.ts` - A file of exported constants that are available for the application

## Source SVG Directory structure

The GLOB root path will be used as a base point for prefix information for the exported constant definitions. If there are no folders inside the GLOB path, then the names will be simply the names of the file. Otherwise, a common path will be determined, and the prefix will be prepended in order to guarantee uniqueness in the file.  

### Character replacements and name normalization

- The generated sprite's definition file should export all of the constants using [CONSTANT_CASE](https://stringcase.org/cases/constant/).
- The generated sprite's index file should use [SNAKE_CASE](https://stringcase.org/cases/snake/) for each of the JSON properties.
- The following rules are applied to the directory and file names in order to achieve the desired casing:
  - The directory separator and any spaces in the folder names will be replaced with a single underscore `_`.
  - Parentheses are removed.

For example:

```shell
> tree ./icons

icons
├── group1
│   ├── a.svg
│   ├── b.svg
│   ├── c.svg
│   ├── d.svg
│   └── e.svg
└── group2
    ├── x
    │   ├── a2_2112.svg
    │   ├── b2_2112.svg
    │   └── c2_2112.svg
    └── y
        ├── b2_2112.svg
        ├── c2_2112.svg
        ├── d2_2112.svg
        └── e2_2112.svg

# Build the two sets of sprite files
> smeegl "./tree/group1/**/*.svg" "group1"
> smeegl "./tree/group2/**/*.svg" "group2"
```

This will generate the two sprite constants files.  Obviously, the svg names should be something more substantial.

```ts
/*
  group1.ts

  The most common folder is `icons/group1`.
  Since group1 has no sub-folders. the exported constants are simply the filename roots.
  
*/
export const A = 'a';
export const B = 'b';
export const C = 'c';
export const D = 'd';
export const E = 'e';
```

```ts
/*
  group2.ts

  The most common folder is `icons/group2`.
  Since group2 does have sub-folders, the sub-folders will be used as part of the file prefix. 
*/

export const X_A2_2112 = 'x_a2_2112';
export const X_B2_2112 = 'x_b2_2112';
export const X_C2_2112 = 'x_c2_2112';
export const Y_B2_2112 = 'y_b2_2112';
export const Y_C2_2112 = 'y_c2_2112';
export const Y_D2_2112 = 'y_d2_2112';
export const Y_E2_2112 = 'y_e2_2112';
```

### TODO

- [ ] Allow using a config file
- [ ] Allow multiple svg globs
- [ ] Allow searching in npm packages for svg's
