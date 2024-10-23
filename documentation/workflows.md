# Working on the Project

Better the be explicit/specific on topics than to wait for avoidable confusion due to ambiguity.

## Principles

1. No work is ever done directly on `main`; ALWAYS branch off of the target receiving branch (i.e. `main` for the majority of work)
2. All changes must be reviewed and approved, and pass all quality gates

## Development Workflows

- [Starting Work](#starting-work)
- [Pipelines](#pipelines)
- [Changesets](#changesets)
- [Approvals](#approvals)
- [Local Testing](#local-testing)

### Starting Work

1. Pick a task from the issues/project
    - Ask the team if anyone is working on the task
    - Assign yourself to the taks
2. Create a branch off of the target receiving branch (i.e. `main`)
    - `feat/#-___` - for feature work
    - `fix/#-___` - for hotfix work
    - Relace "#" with the task number
    - Replace "___" with a hyphenated breif title of the task
3. Commit changes and push the branch
    - If changes are being made to `src/*` files or "config" for artifact output a [Changesets](#changesets) is required.
        - `pnpm changeset`
        - Follow the prompts to create the changeset file for your changes.
    - Follow the conventions of [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for final (hopefully single) commit of the branch.
    - Keep the branch current:
        - Click the "Upudate Branch" button in the GitHub UI, *or*
        - *(alternatively/optional) Use Rebase*
            - `git checkout main`
            - `git pull --rebase upstream main`
            - `git checkout <branch>`
            - `git rebase main`
            - Resolve any conflicts that occur
4. Open a Pull Request to the [central repository](github.com/gohypergiant/standard-toolkit) for review
    - Add "close|closed|closes|fixed|fixes #12345" to the optional footers of a commit message; e.g. the example would close issue #12345.
5. Merge
    - Authors merge PRs when all quality gates are met, reviewers have approved, and the author is ready to merge.
    - The [Pipelines](#pipelines) will take over from here.

### Pipelines

See the [GitHub Actions](../.github/workflows/).

### Changesets

> [IMPORTANT]
> Is there more to say here?

### Approvals

Approvals should focus on:

- Business logic
- Established modules or patterns
- Performance

*As often as possible style should be left to the linter and the author.*

### Local Testing

Testing your changes before pushing a branch is important. Testing only what you are working on will help with feedback cycles; but keep in mind that changes in one area may have effects in other areas. During fast feedback cycles it is helpful to use "filtering" to only test the area you are working in:

```$ pnpm --filter=@accelint/module test -- --watch```

Once you reach milestones it is also a good idea to test more broadly to make sure your changes aren't having negative affects on the broader project:

```$ pnpm test```
