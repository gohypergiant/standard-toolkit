# Coverage Reporting

This workspace is configured to automatically generate and report test coverage on pull requests.

## How It Works

### Local Development

When running tests locally with `pnpm test`, coverage reports are automatically generated for each package in its `coverage/` directory. The coverage includes:

- **Lines**: Percentage of executable lines covered
- **Statements**: Percentage of statements executed
- **Functions**: Percentage of functions called
- **Branches**: Percentage of conditional branches taken

### Coverage Reports on PRs

When you open or update a pull request, the coverage workflow automatically:

1. Runs all tests and collects coverage data from all packages
2. Switches to the base branch (typically `main`) and runs tests there
3. Compares the coverage between your PR and the base branch
4. Posts a comment on the PR showing the coverage delta

The comment will show:
- Current coverage percentages for your PR
- Base branch coverage percentages
- Delta (change) for each metric

### Example PR Comment

```
## 📊 Coverage Report

| Metric     | Current | Base   | Delta    |
|------------|---------|--------|----------|
| Lines      | 85.50%  | 84.20% | +1.30%   |
| Statements | 86.10%  | 85.00% | +1.10%   |
| Functions  | 82.00%  | 82.00% | +0.00%   |
| Branches   | 78.50%  | 79.00% | -0.50%   |
```

## No Enforcement (Yet)

Currently, we are **not enforcing** any minimum coverage thresholds. The goal is to:

1. **Build awareness** of test coverage across the codebase
2. **Encourage** adding tests for new features
3. **Highlight** when changes significantly impact coverage

In the future, we may introduce minimum coverage requirements or fail PRs that significantly decrease coverage.

## Configuration

Coverage is configured in:
- `tooling/vitest-config/no-dom.js` - Base vitest configuration with Istanbul coverage provider
- `.github/workflows/coverage-comment.yml` - GitHub Action that posts coverage comments

The coverage workflow uses NYC to merge coverage reports from all packages in the monorepo into a single unified report.

## Tips for Developers

1. **Run tests locally** with `pnpm test` to see coverage before pushing
2. **Check your package's coverage** in `<package>/coverage/index.html` (when using `--coverage` flag)
3. **Aim to maintain or improve** coverage when adding new features
4. **Don't stress about small decreases** - focus on meaningful test coverage over hitting arbitrary numbers

## Viewing Detailed Coverage

To view detailed coverage for a specific package:

```bash
cd packages/<package-name>
pnpm test
# Open coverage/index.html in your browser
```

Or for the entire workspace:

```bash
pnpm test
# Each package will have its own coverage/ directory
```
