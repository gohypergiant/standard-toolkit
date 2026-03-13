## Module Structure

<!-- A map of every file in the capability with a one-line description.
     Group by subdirectory. Include file paths relative to the capability root. -->

## Data Flow

<!-- How data moves through the system at runtime.
     Cover: what triggers a render cycle, how viewport state becomes grid geometry,
     how selection state reaches the overlay layer.
     Use ASCII diagrams where helpful. -->

## Rendering Pipeline

<!-- How Deck.gl layers are constructed and returned.
     For each layer class:
     - What triggers re-render (shouldUpdateState)
     - What sub-layers are produced (renderLayers)
     - How data is shaped before passing to sub-layers -->

## Key Algorithms

<!-- Non-obvious logic documented in enough detail to reimplement correctly.
     Cover viewport bounds calculation, zoom range filtering, draw order,
     and any other logic that would be easy to get wrong. -->
