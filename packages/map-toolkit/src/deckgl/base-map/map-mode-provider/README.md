# `@accelint/map-toolkit/map-mode-provider`

A React context provider for managing map interaction modes with built-in ownership and authorization controls. This provider enables multiple features or components to coordinate map interactions through a centralized mode system.

## Features

- **Mode Management**: Centralized state management for map interaction modes (e.g., default, drawing, measuring, editing)
- **Ownership System**: Track which component/feature owns each mode to prevent conflicts
- **Authorization Flow**: Built-in authorization system when switching between modes owned by different components
- **Event-Based**: Uses `@accelint/bus` for decoupled event communication

## Core Concepts

### Modes
Modes represent different map interaction states. Common examples:
- `default` - Standard pan/zoom navigation
- `drawing` - Drawing shapes on the map
- `measuring` - Measuring distances/areas
- `editing` - Editing existing features

### Ownership
Each mode can be "owned" by a component or feature, identified by a unique owner ID. Once a mode is owned and entered into, other owners need authorization to change modes. Only the current mode owner can return to `default` mode without authorization - non-owners must request authorization.

### Authorization Flow
When a component requests to change from a mode owned by another component, an authorization request is triggered. The current mode's owner must approve or reject the request. This applies to all mode changes, including switching to the `default` mode, unless the requester is the current mode owner.

## Basic Usage

### 1. Wrap your app with MapModeProvider

```tsx
import { MapModeProvider } from '@accelint/map-toolkit/deckgl';
import { BaseMap } from '@accelint/map-toolkit/deckgl';

export function App() {
  return (
    <MapModeProvider defaultMode="default">
      <BaseMap className="w-full h-full">
        {/* Your map layers and UI components */}
      </BaseMap>
    </MapModeProvider>
  );
}
```

### 2. Use the mode in your components

```tsx
import { useMapMode } from '@accelint/map-toolkit/deckgl';

function DrawingToolbar() {
  const { mode, requestModeChange } = useMapMode();

  const handleDrawingMode = () => {
    requestModeChange('drawing', 'drawing-toolbar-id');
  };

  return (
    <div>
      <p>Current mode: {mode}</p>
      <button onClick={handleDrawingMode}>
        Enter Drawing Mode
      </button>
    </div>
  );
}
```

### 3. Multiple components consuming the same mode

```tsx
function ModeIndicator() {
  const { mode } = useMapMode();

  return <div>Current mode: {mode}</div>;
}

function MapControls() {
  const { requestModeChange } = useMapMode();

  return (
    <div>
      <button onClick={() => requestModeChange('default', 'controls')}>
        Default
      </button>
      <button onClick={() => requestModeChange('measuring', 'controls')}>
        Measure
      </button>
    </div>
  );
}
```

## Advanced Usage: Authorization Flow

When multiple components need to coordinate mode changes, use the authorization system:

```tsx
import { useEmit, useOn } from '@accelint/bus/react';
import { MapModeEvents } from '@accelint/map-toolkit/deckgl';
import type {
  ModeChangeAuthorizationEvent,
  ModeChangeDecisionEvent
} from '@accelint/map-toolkit/deckgl';

function AuthorizationHandler() {
  const [pendingRequest, setPendingRequest] = useState(null);
  const emitDecision = useEmit<ModeChangeDecisionEvent>(
    MapModeEvents.changeDecision
  );

  // Listen for authorization requests
  useOn<ModeChangeAuthorizationEvent>(
    MapModeEvents.changeAuthorization,
    (event) => {
      setPendingRequest({
        authId: event.payload.authId,
        desiredMode: event.payload.desiredMode,
      });
    }
  );

  const handleApprove = () => {
    if (pendingRequest) {
      emitDecision({
        authId: pendingRequest.authId,
        approved: true,
        owner: 'my-component-id',
      });
      setPendingRequest(null);
    }
  };

  const handleReject = () => {
    if (pendingRequest) {
      emitDecision({
        authId: pendingRequest.authId,
        approved: false,
        owner: 'my-component-id',
        reason: 'User rejected the mode change',
      });
      setPendingRequest(null);
    }
  };

  if (!pendingRequest) return null;

  return (
    <div className="authorization-dialog">
      <p>Another component wants to switch to {pendingRequest.desiredMode}</p>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={handleReject}>Reject</button>
    </div>
  );
}
```

## API Reference

### `MapModeProvider`

Context provider for map mode management.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Child components |
| `defaultMode` | `string` | `'default'` | Initial mode when provider mounts |

### `useMapMode()`

Hook to access map mode context. Must be used within a `MapModeProvider`.

#### Returns

```tsx
{
  mode: string;                    // Current mode
  requestModeChange: (             // Request a mode change
    desiredMode: string,
    requestOwner: string
  ) => void;
}
```

#### Throws

`Error` if used outside of `MapModeProvider`

### Events

The map mode system emits events through `@accelint/bus` that you can subscribe to:

#### `MapModeEvents.changed`

Emitted when the mode successfully changes.

**Payload:**
```tsx
{
  previousMode: string;  // The mode before the change
  currentMode: string;   // The new current mode
}
```

#### `MapModeEvents.changeRequest`

Emitted when a component requests a mode change.

**Payload:**
```tsx
{
  desiredMode: string;  // The requested mode
  owner: string;        // ID of the requesting component
}
```

#### `MapModeEvents.changeAuthorization`

Emitted when authorization is required for a mode change. Note: this event is emitted via internal logic of the map mode provider. You do not need to emit changeAuthorization events, only listen for them if your layer/feature is a mode owner to approve of mode changes (other than `default`).

**Payload:**
```tsx
{
  authId: string;       // Unique ID for this authorization request
  desiredMode: string;  // The requested mode
  currentMode: string;  // The current mode
}
```

#### `MapModeEvents.changeDecision`

Emitted when an authorization decision is made. If your layer is a mode owner, you need to listen for changeAuthorization events and emit changeDecision events to allow or disallow the mode from being changed to something other than `default` by other layers / features.

**Payload:**
```tsx
{
  authId: string;       // ID of the authorization request
  approved: boolean;    // Whether the request was approved
  owner: string;        // ID of the owner making the decision
  reason?: string;      // Optional reason for rejection
}
```

## Authorization Logic

The provider uses the following logic to determine if a mode change requires authorization:

**Auto-accept if:**
1. The desired mode is `default` (always accessible to everyone)
2. The requesting owner is the current mode's owner (you can always leave your own mode)
3. The desired mode has no owner (unowned modes are freely accessible)
4. There's no current mode owner AND the requester owns the desired mode (return to your own mode from default)

**Require authorization if:**
- The current mode is owned by someone else
- The desired mode is owned by a different owner than the requester

## Best Practices

### Owner IDs

Use descriptive, unique IDs for owners:

```tsx
// ✅ Good - Clear and unique
requestModeChange('drawing', 'drawing-toolbar-uuid-123');
requestModeChange('measuring', 'measurement-panel-uuid-456');

// ❌ Bad - Generic or empty
requestModeChange('drawing', 'component');
requestModeChange('drawing', '');
```

### Error Handling

Always wrap mode changes in try-catch blocks:

```tsx
try {
  requestModeChange('drawing', ownerId);
} catch (error) {
  console.error('Failed to request mode change:', error);
}
```

### Cleanup

The provider automatically cleans up:
- Pending authorization requests when modes change
- Stale authorization requests

### Default Mode

The `default` mode is special:
- It's always ownerless
- Only the current mode owner can switch to it without authorization
- Non-owners must request authorization to switch to default mode
- Use it as a "neutral" state that mode owners can return to

## Examples

See the Storybook stories for complete examples:
- **BasicUsage**: Simple mode switching
- **MultipleConsumers**: Multiple components reacting to mode changes
- **AuthorizationFlow**: Full authorization flow with multiple owners

## Type Definitions

```tsx
// Mode change events
type ModeChangedPayload = {
  previousMode: string;
  currentMode: string;
};

type ModeChangeRequestPayload = {
  desiredMode: string;
  owner: string;
};

type ModeChangeAuthorizationPayload = {
  authId: string;
  desiredMode: string;
  currentMode: string;
};

type ModeChangeDecisionPayload = {
  authId: string;
  approved: boolean;
  owner: string;
  reason?: string;
};
```

## Troubleshooting

### "useMapMode must be used within a MapModeProvider"

**Cause**: Using `useMapMode()` outside of a `MapModeProvider`.

**Solution**: Wrap your component tree with `MapModeProvider`:

```tsx
<MapModeProvider>
  <YourComponent />
</MapModeProvider>
```

### Mode changes not working

**Causes**:
1. Empty `desiredMode` or `requestOwner` - throws an error
2. Authorization required but not handled - request times out after 30s
3. Authorization decision from wrong owner - silently ignored

**Solutions**:
1. Ensure both parameters are non-empty strings
2. Implement authorization handler (see "Advanced Usage" above)
3. Verify the decision is emitted by the current mode's owner

### Authorization requests pending indefinitely

**Cause**: No authorization handler responding to requests.

**Solution**: Implement an authorization handler to approve or reject requests, or ensure mode switching follows the ownership rules to avoid requiring authorization.
