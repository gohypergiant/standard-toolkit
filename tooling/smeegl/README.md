# @accelint/smeegl

A small, `spreet` based spritesheet/texture package for use with Deck.gl.

## Installation

```sh
npm install @accelint/smeegl
```

## Use

```sh
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
