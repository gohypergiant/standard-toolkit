# @accelint/biome-config

Shared [Biome](https://biomejs.dev/) configuration used across Accelint projects. Provides standardized linting, formatting, and analyzer settings for JavaScript and TypeScript codebases.

## Features

- **Linter Configuration**: Strict linting rules with cognitive complexity limits, naming conventions, and React hooks enforcement
- **Formatter Configuration**: Consistent code formatting settings
- **Analyzer Configuration**: Code analysis settings for better maintainability
- **Modular Design**: Import only the configurations you need

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @accelint/biome-config

# Using npm
npm install --save-dev @accelint/biome-config

# Using yarn
yarn add -D @accelint/biome-config
```

## Usage

### Complete Configuration

Create a `biome.json` file in your project root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.8/schema.json",
  "extends": [
    "@accelint/biome-config/linter",
    "@accelint/biome-config/formatter",
    "@accelint/biome-config/analyzer"
  ]
}
```

### Linter Only

For linting configuration only:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.8/schema.json",
  "extends": ["@accelint/biome-config/linter"]
}
```

### Formatter Only

For formatting configuration only:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.8/schema.json",
  "extends": ["@accelint/biome-config/formatter"]
}
```

### Analyzer Only

For code analysis configuration only:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.8/schema.json",
  "extends": ["@accelint/biome-config/analyzer"]
}
```

## Configuration Details

### Linter Rules

The linter configuration includes:

- **Complexity Rules**
  - Maximum cognitive complexity: 15
  - Simplified logic expressions required

- **Correctness Rules**
  - No undeclared variables
  - Exhaustive React hook dependencies (warning)
  - No unused imports or variables
  - React hooks must be at top level

- **Performance Rules**
  - No re-export all statements

- **Style Rules**
  - No negation in else clauses
  - Collapsed else-if statements
  - Block statements preferred
  - Shorthand array type syntax
  - No parameter reassignment
  - Naming conventions: camelCase/CONSTANT_CASE with ASCII-only

- **Suspicious Patterns**
  - Array index as React key (warning)
  - No empty block statements
  - Async functions must use await
  - Explicit `any` types (warning)
  - No duplicate else-if conditions

### Customization

You can override any rule in your project's `biome.json`:

```json
{
  "extends": ["@accelint/biome-config/linter"],
  "linter": {
    "rules": {
      "complexity": {
        "noExcessiveCognitiveComplexity": {
          "options": {
            "maxAllowedComplexity": 20
          }
        }
      }
    }
  }
}
```

## Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "biome lint .",
    "lint:fix": "biome lint --write .",
    "format": "biome format --write .",
    "format:check": "biome format .",
    "check": "biome check --write ."
  }
}
```

## Integration

### VSCode

Install the [Biome VSCode extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) and add to your `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit"
  }
}
```

### CI/CD

Example GitHub Actions workflow:

```yaml
- name: Run Biome
  run: |
    pnpm biome check .
```

## License

Apache-2.0
