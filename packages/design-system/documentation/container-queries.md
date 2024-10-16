# Container Queries

## Anatomy

Components that implement a Vanilla Extract [container](https://vanilla-extract.style/documentation/api/create-container/), which are based on [CSS `@container` queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries), expose CSS variables reflecting their state. `State` is a type that describes the possible values for the `stateVars` contract. A contract is simply a record of CSS var lookups. These variables can be queried to apply condition-based styles, enabling flexible and context-sensitive styling without extensive predefined variations.

## Writing

While there are multiple utility functions throughout the code that utilize container queries, they are not all documented here. For consistency, they all use the same general pattern of accepting a type and contract pair, which provides a type safe query syntax.

#### Using `containerQueries()` for Multiple Rules

Combine multiple conditional styles within a single container block for comprehensive styling based on component states.

```typescript
style({
  '@container': containerQueries<State>(
    stateVars,
    {
      query: { foo: true },
      // Styles for specific conditions
    },
    {...}
  )
})
```

#### Using `containerQuery()` for a Single Rule

Apply specific condition-based styles using a single query.

```typescript
style({
  '@container': {
    [containerQuery<State>(stateVars, { foo: true })]: {
      // Styles for specific conditions
    },
  },
});
```

#### Writing Queries Manually

For more flexibility, manually write queries that allow for customized and granular control over the component's responsive behavior.

```typescript
style({
  '@container': {
    '(--foo: true)': {
      // Custom query styles
    },
  },
});
```

#### Nested Queries

Use nested structures to reference state from multiple containers, enhancing clarity and avoiding conflicts in scenarios where shared state property naming occurs.

For example, the partially nested approach may be desirable in scenarios where `AState` parameters are the majority of the queries and `BState` is a rare occurrence.

```typescript
type AState = { foo: boolean };
type BState = { foo: 'foo' | 'bar' };

style({
  '@container': {
    [containerQuery<{ A: AState; B: BState }>(
      { A: aStateVars, B: bStateVars },
      { A: { foo: true }, B: { foo: 'bar' } }
    )]: {
      // Combined container queries
    },
  },
});
```

## Order matters

When writing multiple container queries, it's best practice to start with the most generic, default state styles and work your way up to the most specific. This is because all of them apply to the same selector. Instead of battling selector specificity, we rely on layers and query order to provide a very clear order to how styles should cascade.

## Caveats

Containers cannot query themselves, queries are only capable of accessing CSS variables of an ancestor. This means that styles cannot be applied to a container based on its own state. Because of this limitation, you'll often times come across a component that is represented by a container to expose state variables and a presentational element that is styled based on that state.
