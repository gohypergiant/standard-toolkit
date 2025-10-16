# Constellation Tracker

Constellation Tracker is a CLI tool designed to automatically maintain and update your project's `catalog-info.yaml` file for use with Constellation (Backstage). It analyzes your project's dependencies and updates the catalog file with the correct dependency information, ensuring your project's metadata is always accurate and up-to-date.

## Purpose

When working with Constellation (a Backstage-based developer portal), each project requires a `catalog-info.yaml` file that describes the project and its dependencies. Manually maintaining this file can be tedious and error-prone, especially as dependencies change over time.

Constellation Tracker solves this by:

1. Automatically generating a `catalog-info.yaml` file if one doesn't exist
2. Scanning your project's dependencies for their own `catalog-info.yaml` files
3. Updating your project's `catalog-info.yaml` with the correct dependency information
4. Maintaining proper formatting and structure of the catalog file

## Installation

```bash
# From the root of the standard-toolkit repository
pnpm install

# Or install globally
npm install -g @accelint/constellation-tracker
```

## Integration with Git Workflow

Constellation Tracker is designed to be integrated into your Git workflow, typically using tools like lefthook. This ensures your `catalog-info.yaml` file is always up-to-date before commits are made.

Example lefthook configuration in your project's `.lefthook.yml`:

```yaml
pre-commit:
  commands:
    constellation-tracker:
      run: constellation-tracker
```

## Usage

```bash
# Run with default options (uses current directory)
constellation-tracker

# Specify custom paths
constellation-tracker --node-modules "./custom/node_modules" --catalog-info "./path/to/catalog-info.yaml"

# Regenerate the catalog-info.yaml file completely
constellation-tracker --regenerate
```

### Command Options

- `--node-modules <path>`: Specify a custom path to the node_modules directory
- `--catalog-info <path>`: Specify a custom path to the catalog-info.yaml file
- `--regenerate`: Completely regenerate the catalog-info.yaml file

## Development

```bash
# Build the project
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format

# Run tests
pnpm test
```

## Important package.json Fields

Constellation Tracker relies on specific fields in your project's `package.json` file:

### Standard Fields Used

- `name`: Used as the component name in the catalog-info.yaml
- `title`: Used as the component title
- `version`: Used in the package/version annotation
- `description`: Used as the component description
- `repository`: Used to generate links and references
- `keywords`: Used as tags in the catalog-info.yaml

### Custom Fields Used

- `owner`: Specifies the owner of the component (format: `default/team-name`)
- `subPath`: Specifies the path to the component within the repository

Example of these custom fields in package.json:

```json
{
  "name": "my-package",
  "owner": "default/my-team",
  "subPath": "packages/my-package"
}
```

## How It Works

1. Reads your project's package.json to extract metadata
2. Creates or updates the catalog-info.yaml file with this metadata
3. Scans your node_modules for dependencies that have their own catalog-info.yaml files
4. Updates your catalog-info.yaml with the dependency information
5. Saves the updated catalog-info.yaml file

This ensures your project's dependencies are correctly tracked in Constellation, making it easier to visualize and manage dependencies across your organization.
