# @accelint/temporal

A lightweight JavaScript library offering a collection of simple temporal functions for parsing, formatting, manipulating dates and times, and specialty timers.

## Installation

```sh
npm install @accelint/temporal
```

## Features

### Clock-Aligned Timers

Clock-aligned timers synchronize callback execution with the system clock, ensuring callbacks fire precisely at second boundaries. This is useful for:

- Digital clocks and time displays
- Synchronized animations
- Periodic polling aligned to specific times
- Time-based data sampling

## Usage

### setClockInterval

Works like `setInterval` but synchronizes the first execution to the next clock second, then continues at the specified interval.

```typescript
import { setClockInterval } from '@accelint/temporal/timers';

// Update clock display every second, starting on the next second boundary
const cleanup = setClockInterval(() => {
  const now = new Date();
  console.log(now.toLocaleTimeString());
}, 1000);

// Cleanup when done
cleanup();
```

**Key Features:**

- Waits for the next second boundary before first execution
- Automatically corrects for drift on subsequent executions
- Returns a cleanup function to clear the timer

### setClockTimeout

Works like `setTimeout` but waits for the next clock second before starting the countdown.

```typescript
import { setClockTimeout } from '@accelint/temporal/timers';

// Execute callback 500ms after the next second boundary
const cleanup = setClockTimeout(() => {
  console.log('Executed 500ms after clock second');
}, 500);

// Cleanup if needed
cleanup();
```

**Key Features:**

- Waits for the next second boundary before starting timer
- Returns a cleanup function to clear the timeout

## Advanced Usage

### Utils

The package exports utility functions for advanced clock-aligned timing needs.

#### remainder

Calculates the remaining time until the next interval boundary.

```typescript
import { remainder } from '@accelint/temporal/timers/utils';

// Get milliseconds until next second
const msUntilNextSecond = remainder(1000);
console.log(msUntilNextSecond); // e.g., 347

// Get milliseconds until next 5-second boundary
const msUntilNext5Seconds = remainder(5000);
console.log(msUntilNext5Seconds); // e.g., 2347
```

#### callNextSecond

Executes a callback precisely at the start of the next clock second.

```typescript
import { callNextSecond } from '@accelint/temporal/timers/utils';

callNextSecond(() => {
  console.log('Executed at second boundary');
});
```

## Use Cases

### Digital Clock Display

```typescript
import { setClockInterval } from '@accelint/temporal/timers';

function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}

// Update immediately on next second, then every second
const cleanup = setClockInterval(updateClock, 1000);
```

### Synchronized Data Polling

```typescript
import { setClockInterval } from '@accelint/temporal/timers';

// Poll API every 5 seconds, synchronized to clock
const cleanup = setClockInterval(async () => {
  const data = await fetch('/api/status').then(r => r.json());
  updateUI(data);
}, 5000);
```

### Time-Based Animation

```typescript
import { setClockInterval } from '@accelint/temporal/timers';

// Update animation frame every 100ms, starting on second boundary
const cleanup = setClockInterval(() => {
  animationFrame++;
  renderFrame(animationFrame);
}, 100);
```

## API Reference

### `setClockInterval(callback: () => void, ms: number): () => void`

Creates a repeating timer that synchronizes to clock seconds.

**Parameters:**

- `callback` - Function to execute on each interval
- `ms` - Interval duration in milliseconds

**Returns:** Cleanup function to clear the interval

### `setClockTimeout(callback: () => void, ms: number): () => void`

Creates a one-time timer that waits for the next clock second before starting.

**Parameters:**

- `callback` - Function to execute after delay
- `ms` - Delay duration in milliseconds

**Returns:** Cleanup function to clear the timeout

### `remainder(interval: number): number`

Calculates remaining time until next interval boundary.

**Parameters:**

- `interval` - Interval duration in milliseconds

**Returns:** Remaining milliseconds

### `callNextSecond(callback: () => void): void`

Executes callback at the start of the next clock second.

**Parameters:**

- `callback` - Function to execute at next second boundary

## TypeScript Support

All functions are fully typed and written in TypeScript. Type definitions are included in the package.

## License

Apache-2.0
