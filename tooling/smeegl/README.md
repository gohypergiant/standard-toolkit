# @accelint/smeegl

A small, `spreet` based spritesheet/texture package for use with Deck.gl.

You will need to install [spreet](https://github.com/flother/spreet?tab=readme-ov-file#installation) (`cargo install spreet`) or use the `--spreet` flag to point to a stand-alone binary.

## Installation

```sh
npm install @accelint/smeegl
```

## Use

```sh
smeegl --help


Usage: smeegl [options] <GLOB> [OUTPUT]

CLI tool to create spritesheets from an SVG glob pattern

Arguments:
  GLOB             SVG glob pattern
  OUTPUT           The atlas output path, CWD if none given

Options:
  --spreet <path>  Bath to pre-built spreet binary, unneeded if installed
  -h, --help       display help for command


smeegl "**/*.svg" "tooling/smeegl/atlas"
```

### TODO

- [ ] Allow using a config file
- [ ] Allow multiple svg globs
- [ ] Allow searching in npm packages for svg's
