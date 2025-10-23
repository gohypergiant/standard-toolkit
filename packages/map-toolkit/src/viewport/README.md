# `@accelint/map-toolkit/viewport`


## useViewportState
A react hook for syncing to viewport events.  A thin wrapper around `useSyncExternalStore`, it provides default `subscribe` and `getSnapshot` functions that listen to Bus for viewport events and signal react to re-render. 

## ViewportScale
A react component that consumes `useViewportState` and displays the current viewport scale for the selected scale unit (defaults to Nautical Miles, NMI) in a `<span>`

### Usage

`<ViewportScale>` updates by subscribing to viewport events from the Bus.  The easiest way to send those events with DeckGL is by initializing the `ViewportSyncWidget` in the BaseMap.

```typescript
import { BaseMap, ViewportScale } from '@accelint/map-toolkit/deckgl'
import { ViewportSyncWidget } from '@accelint/map-toolkit/deckgl/widgets/viewport-sync'

const WIDGETS = [new ViewportSyncWidget({ id: 'viewport-sync' })];

export function MapView() {
  return (
    <>
      <ViewportScale viewId="default" className='absolute right-4 bottom-4 bg-gray-400 p-4' />
      <BaseMap widgets={WIDGETS} className="w-full h-full">
    </>
  )
}
```

### Props

### unit
`'km' | 'm' | 'nmi' | 'mi' | 'ft'`
Takes an abbreviated unit string. Supports kilometers, meters, nautical miles, miles, and feet. Defaults to nautical miles.

### className
Passes the css class to the span. Unstyled by default.

