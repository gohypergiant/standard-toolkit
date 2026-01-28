# @accelint/vitest-config

Shared [Vitest](https://vitest.dev/) configuration used across Accelint projects. Provides standardized testing setup with coverage, TypeScript path support, and React integration.

## Features

- **DOM and No-DOM Variants**: Separate configs for browser and Node.js testing
- **React Support**: Pre-configured React plugin for component testing
- **TypeScript Paths**: Automatic tsconfig path resolution
- **Coverage Built-in**: Istanbul coverage provider pre-configured
- **Mock Utilities**: Includes BroadcastChannel mock for testing
- **Zero Configuration**: Works out of the box with sensible defaults

## Installation

```bash
# Using pnpm (recommended)
pnpm add -D @accelint/vitest-config

# Using npm
npm install --save-dev @accelint/vitest-config

# Using yarn
yarn add -D @accelint/vitest-config
```

## Available Configurations

### DOM Configuration

For testing browser/React components:

- `@accelint/vitest-config/dom` - Includes React plugin and DOM environment

### No-DOM Configuration

For testing Node.js code:

- `@accelint/vitest-config/no-dom` - Pure Node.js environment without React

### Mocks

- `@accelint/vitest-config/mocks/broadcast-channel` - Mock for BroadcastChannel API

## Usage

### React Component Testing

Create a `vitest.config.ts` in your project root:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@accelint/vitest-config/dom';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
    },
  }),
);
```

### Node.js/Library Testing

For non-React code:

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@accelint/vitest-config/no-dom';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // Your custom test config
    },
  }),
);
```

### Simple Setup (Re-export)

If you don't need custom configuration:

```typescript
export { default } from '@accelint/vitest-config/dom';
```

## Configuration Details

### Base Configuration (no-dom)

```javascript
{
  plugins: [tsconfigPaths()],
  test: {
    watch: false,
    coverage: {
      provider: 'istanbul',
      reporter: ['json', 'json-summary', 'lcov', 'text'],
      reportsDirectory: './coverage',
      enabled: true,
      clean: true,
      passWithNoTests: true,
    },
    clearMocks: true,
    restoreMocks: true,
    passWithNoTests: true,
  },
}
```

### DOM Configuration Details

Extends `no-dom` configuration and adds:

```javascript
{
  plugins: [react(), tsconfigPaths()],
  // ... other settings from no-dom
}
```

## TypeScript Path Support

The configuration automatically resolves TypeScript path aliases defined in your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"]
    }
  }
}
```

These paths will work automatically in your tests:

```typescript
import { Button } from '@components/Button';
import { helper } from '@/utils/helper';
```

## Coverage Configuration

Coverage is enabled by default with Istanbul provider:

- **Reporters**: JSON, JSON Summary, LCOV, and Text
- **Directory**: `./coverage`
- **Clean**: Clears previous coverage on each run
- **Pass with no tests**: Prevents failures when no tests exist

### Customizing Coverage

```typescript
import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '@accelint/vitest-config/dom';

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      coverage: {
        exclude: ['**/*.config.*', '**/mocks/**'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
          statements: 80,
        },
      },
    },
  }),
);
```

## Using Mocks

### BroadcastChannel Mock

For testing code that uses BroadcastChannel:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { BroadcastChannelMock } from '@accelint/vitest-config/mocks/broadcast-channel';

describe('BroadcastChannel tests', () => {
  it('should mock BroadcastChannel', () => {
    global.BroadcastChannel = BroadcastChannelMock as any;

    const channel = new BroadcastChannel('test');
    const handler = vi.fn();

    channel.addEventListener('message', handler);
    channel.postMessage({ data: 'test' });

    expect(handler).toHaveBeenCalled();
  });
});
```

## Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## Common Overrides

### Enable Globals

To use `describe`, `it`, `expect` without imports:

```typescript
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      globals: true,
    },
  }),
);
```

Then update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

### Configure Test Environment

```typescript
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      environment: 'jsdom', // or 'node', 'happy-dom'
    },
  }),
);
```

### Add Setup Files

```typescript
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      setupFiles: ['./tests/setup.ts'],
    },
  }),
);
```

## Integration

### VSCode

Install the [Vitest VSCode extension](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) for inline test results and debugging.

### CI/CD

Example GitHub Actions workflow:

```yaml
- name: Run Tests
  run: pnpm test

- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Best Practices

1. **Choose the right config**: Use `dom` for React/browser tests, `no-dom` for Node.js
2. **Keep tests fast**: Avoid unnecessary DOM operations in unit tests
3. **Use coverage thresholds**: Set minimum coverage requirements
4. **Mock external dependencies**: Use `vi.mock()` for network calls, file system, etc.
5. **Clean up after tests**: The config auto-clears and restores mocks between tests

## Troubleshooting

### TypeScript Path Resolution

If paths aren't resolving, ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### React Component Rendering Issues

For React 18+ testing:

```typescript
import { render } from '@testing-library/react';

// Ensure you're using the correct testing library version
```

## License

Apache-2.0
