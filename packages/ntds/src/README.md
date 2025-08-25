# NTDS Masked icons

## Background

This folder represents the output of any conversions of svg files to spritesheets using the [smeegl](../../../tooling/smeegl) tool, part of the [tooling](../../../tooling) section of this repo.

For NTDS, the only spritesheet needed is the set of icons for the COP, used on the map. This takes the exported list of svg icons from figma which have been saved to a directory not part of this repo. From there, the following command is run:

```shell
node ../../tooling/smeegl/dist/main.js "./icons/masked/**/*.svg" ./src/masked --crc DEC
```
