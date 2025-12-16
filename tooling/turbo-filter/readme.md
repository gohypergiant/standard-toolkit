# @accelint/turbo-filter

A utility for more easily filtering turbo tasks.

## install
```bash
pnpm add -Dw @accelint/turbo-filter
```

## how to use

```bash
# before - need to type out (and remember 🙀) full package names
turbo dev --filter=packageA --filter=packageD

# after
turbo-filter dev
...
Select packages to run "dev" ›  
◉   packageA
◯   packageB
◯   packageC
◉   packageD
◯   packageE
```

## how it works

1. parses pnpm-workspace.yaml to determine paths for all workspace package.json files
1. finds all workspace packages that have the task (e.g. 'dev' in 'turbo-filter dev')
1. provides a multi-select prompt to the user with all of the packages that have the given task
    - utilizes the [prompts package](https://www.npmjs.com/package/prompts)
1. passes the selected apps as filters to the turbo command 

## potential future improvements

- Support other types of workspaces
