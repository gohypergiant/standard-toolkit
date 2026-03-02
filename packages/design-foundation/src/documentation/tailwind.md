# [Tailwind](https://tailwindcss.com/docs/styling-with-utility-classes)

The DesignTK heavily utilizes Tailwind (TW) as the core styling mechanism to maintain design consistency throughout. However, due to the extremely flexible implementation options that this affords us, the Core team has established opinionated patterns on how to keep code clean, readable and consistent.

## Best Practices

### Separate Concerns

To help keep components clear and concise, its best to keep the vast majority of styles (classNames) outside of the component file, in a separate file such as `styles.module.css`. This allows the component to be free of style based clutter while remaining focused on the critical business logic.

### Reusability

If a component is developed with all of its styles established externally rather than inline, its not just the component that becomes reusable. Having reusable styles makes it easier to build custom implementations of components or parts of components, if the need arises.

As code approaches the edges of app implementation, reusability is less of a concern. However, continuing to utilize the same patterns maintains code readability and consistency, and makes components easier to port into a reusable context, if the need arises.

## Supported

### [CSS Modules](https://github.com/css-modules/css-modules)

Implementation of CSS Modules is the preferred solution despite the stance taken by Tailwind. When creating styles for a reusable component, we opt to implement styles outside of React components to minimize runtime overhead. By using CSS modules we avoid class collisions with any other component or library. And by using CSS layers we guarantee styling hierarchy that allows Tailwind's utility classes to easily override styles for one off implementations.

```jsx
import styles from './styles.module.css';

export function MyReusableComponent({ children, className, variant }: Props) {
  return <div className={clsx(styles.myComponent, styles[variant], className)}>{children}</div>
}
```

```css
// styles.module.css
@reference '@accelint/design-foundation/styles';

@layer components.l1 {
  .myComponent {
    @apply p-s fg-primary-bold;

    @variant disabled {
      @apply cursor-not-allowed fg-disabled;
    }
  }
}
```

Notice the use of layer `components.l1`, this is the lowest level layer in the `components` layer group. This is the layer that should be used for first level components, which do not override any other components. If styles are being applied to a higher level component that implements a lower level component, the styles should be applied at the next level up. There are currently 5 levels within the components layer group which should provide plenty of override layers for reusable components throughout the design system as well as components within an app.

When applying inline utility classes from Tailwind, those are already scoped to the `utilities` layer which has higher precedence than all of the `components` layers. So these utility classes should only be used for one off styling within an app feature implementation, never in a reusable component.

```jsx
import { MyReusableComponent } from '../components/my-reusable-component';

export function MyBespokeFeature() {
  // A bunch of custom business logic, other components, etc

  return <MyReusableComponent className="empty:none">{dynamicContent}</MyReusableComponent>
}
```

### [RAC State Classes](https://react-spectrum.adobe.com/react-aria/styling.html#plugin)

The Core team has chosen not to implement the RAC TW plugin directly. Instead we've implemented a modified version that follows the same patterns without being locked into RAC selectors or using a prefix that separates selector types. This means that RAC state based classes are available to utilize, they're just merged with CSS pseudo selectors and will work with any component that implements the corresponding data attributes (when CSS pseudo selectors don't work).

Because we have a custom implementation, there may be additional variants available than what is documented in RAC. Check out [variants.css](../variants/variants.css) to see the custom variants defined and the selectors associated with each.

Any reusable component that is being developed without RAC underpinning or has additional internal state which would be useful to expose to styling should implement data attributes and a custom variant. However, consider how generic the implementation is before proceeding. If the state is unique to the component being developed, using dynamically rendered classNames with `clsx` is likely the way to go.

```jsx
function MyComponent() {
  return (
    <ToggleButton>
      <Icon>
        <MyIcon className="transform group-selected:rotate-180" />
      <Icon>
    </ToggleButton>
  )
}
```

When using these variants in CSS modules (like in the example in the CSS modules section) be sure to utilize the `@variant` approach. When you use variant selectors inline you have no control over the order in which the styles apply, it's entirely up the Tailwind's build output. But if you use the `@variant` approach in CSS modules, the order of the styles written is the order they are applied, just like normal CSS. This means you have complete control over peer style precedence.

### Semantics

In the overwhelming majority of cases, developers should adhere strictly to the design system. Design systems exist to ensure consistency, accessibility, scalability, and efficiency across products. By using semantic color and spacing tokens—rather than raw primitives or arbitrary values—teams create interfaces that are cohesive, themeable, and resilient to change. Semantic tokens communicate intent (e.g., `bg-surface-default`, `fg-hover`, `p-m`) instead of hard-coded values, making the UI easier to maintain, update, and evolve over time.

Relying on primitives or one-off values fragments the experience, introduces visual inconsistencies, and increases long-term maintenance costs. Exceptions should be rare and deliberate: early-stage prototypes where speed of exploration matters more than polish, or truly bespoke features that push beyond the current boundaries of the design system. Even in those cases, deviations should be treated as signals—either to formalize a new pattern within the system or to confirm that the exception is justified. Default to the system first; extend it thoughtfully when necessary.

```jsx
// Ok, if prototyping or in rare edge cases
<div className="gap-10" />

// Good
<div className="gap-m" />
```

```jsx
// Ok, if prototyping or in rare edge cases
<div className="bg-neutral-300" />

// Good
<div className="bg-surface-raised" />
```

```jsx
// Ok, if prototyping or in rare edge cases
<div className="icon-primary-bold/50" />

// Good
<div className="icon-primary-bold" />
```

While most product experiences should comfortably live within the boundaries of the design system, any mature application will inevitably include bespoke features that stretch beyond what the system has explicitly accounted for. Complex workflows, novel interactions, and domain-specific requirements can introduce edge cases that require thoughtful extension rather than rigid adherence. These moments are not failures of the system—they are signals that the product is evolving.

It is the responsibility of design to ensure the design system is robust, flexible, and extensible enough to accommodate the vast majority of real-world scenarios. Patterns, components, and tokens should be built with adaptability in mind, anticipating variation without sacrificing coherence.

At the same time, developers play a critical role in maintaining the system’s integrity. When implementation challenges arise—whether due to technical constraints, missing tokens, unclear guidelines, or component limitations—it’s the developer’s responsibility to surface those gaps early. Transparent feedback loops between design and engineering ensure that bespoke solutions don’t become one-off exceptions, but instead inform thoughtful improvements to the system. In this way, the design system remains a living, evolving foundation rather than a static rulebook.

## Unsupported

### [Arbitrary Values, Properties & Variants](https://tailwindcss.com/docs/adding-custom-styles#using-arbitrary-values)

Do not use arbitrary values, instead use values established within the theme.

```jsx
// Bad
<div className="gap-[11px]" />

// Ok, if utility class doesn't already exist
<div className="gap-(--spacing-xxl)" />

// Good, if utility class exists
<div className="gap-xxl" />
```

Do not hardcode values that match the theme, instead reference theme values.

```jsx
// Bad
<div className="[--my-font-size:12px]" />

// Good
<div className="[--my-font-size:var(--body-m-size)]" />
```

Do not use arbitrary properties unless you're 100% certain (and double checked) that TW & DTK don't provide a utility class. If the styles are sufficiently complex (beyond 1-2 properties) use CSS Modules instead. Use of arbitrary properties for local CSS variables is supported.

```jsx
// Bad
<div className="[background:--bg-interactive-disabled]" />

// Good
<div className="bg-interactive-disabled" />
```

Do not use arbitrary variants, instead use RAC state classes or conditional class rendering with `clsx`.

```jsx
function MyComponent({ size }: Props) {
  // Bad
  return (
    <ToggleButton
      className="data-selected:foo data-[size=large]:bar"
      data-size={size}
    />
  );

  // Ok, but custom variants aren't available
  return <ToggleButton className="selected:foo" />

  // Good, if renderProps from RAC are available (props and internal state can be used too)
  return <ToggleButton className={({ isSelected }) => clsx(styles[size], isSelected && styles.selected)} />

  // Good, if renderProps from RAC are not available
  const [isSelected, setIsSelected] = useState(false);

  return <button className={clsx(styles[size], isSelected && styles.selected)} />
}
```

Do not create inline selectors, unless it's impossible to target the desired element directly. Passing classes directly to the target element is the preferred solution. Do not target elements outside of the scope of the current component being rendered. That means if the element is a sub element of a child component, you shouldn't be trying to override the style from this level.

Larger scope selectors such as `@media` and `@supports` should be contained within CSS Modules if there isn't already a TW shorthand version.

```jsx
function Parent() {
  return (
    // Bad
    <div className="[&_span]:pl-s">
      {options.map(() => (
        <Child
          // Ok
          className="[&:nth-child(3n)]:bg-info-bold"
        />
      ))}
    </div>
  )
}

function Child({ children, className }: Props) {
  return (
    <div className={className}>
      <Icon><MyIcon /></Icon>
      <span>{children}</span>
    </div>
  )
}
```

### Inline Dynamic Classes

Use `clsx` for any dynamic class application logic.

```jsx
function MyComponent({ className, isDisabled }: Props) {
  // Bad
  return <div className={`foo ${isDisabled && 'bar'} ${className}`} />

  // Bad
  return <div className={['foo', isDisabled ? 'bar' : undefined, className].join(' ')} />

  // Bad
  return <div className={clsx(['foo', isDisabled && 'bar', className])} />

  // Good
  return <div className={clsx('foo', { bar: isDisabled }, className)} />
}
```

## Implementation Specifics

### Border vs Outline

DesignTK chooses to implement outlines instead of borders to make it so that the style doesn't impact box model dimensions. This way elements with or without a "border" are consistently sized based on content and padding alone. This also helps with sibling components rendering at the same size when their border styles may not match.

Do not implement borders, do implement outlines
