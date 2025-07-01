# [Tailwind](https://tailwindcss.com/docs/styling-with-utility-classes)

The DesignTK heavily utilizes Tailwind (TW) as the core styling mechanism to maintain design consistency throughout. However, due to the extremely flexible implementation options that this affords us, the Core team has established opinionated patterns on how to keep code clean, readable and consistent.

## Best Practices

### Separate Concerns

To help keep components clear and concise, its best to keep the vast majority of styles (classNames) outside of the component file, in a separate file such as `styles.ts`. This allows the component to be free of conditional className logic and configuration of variants.

### Reusability

If a component is developed with all of its styles established externally rather than inline, its not just the component that becomes reusable. Having reusable styles makes it easier to build custom implementations of components or parts of components, if the need arises.

As code approaches the edges of app implementation, reusability is less of a concern. However, continuing to utilize the same patterns maintains code readability and consistency, and makes components easier to port into a reusable context, if the need arises.

## Supported

### [Tailwind Variants](https://www.tailwind-variants.org/docs/introduction)

The Core team has chosen Tailwind Variants (TV) to handle reusuable styles and styles for reusable components. It's ability to handle slots (multiple elements as part of a single component family), variants & compound variants, as well as TW class conflict resolution makes it the starting point for all styles.

Be sure to import the local instance of `tv` and not from `tailwind-variants` so your styles are configured to merge correctly with any overrides.

```jsx
// styles.ts
import { tv } from '@/lib/utils';

export const MyStyles = tv({
  slots: {
    foo: '...',
    bar: '...',
  },
  variants: {
    isDisabled: {
      true: {
        bar: '...',
      }
    }
  },
});

// my-component.tsx
import { MyStyles } from './styles';

const { foo, bar } = MyStyles();

function MyComponent({ children, className, isDisabled }: MyComponentProps) {
  return (
    <Foo className={foo({ className, isDisabled })}>
      <Bar className={bar({ isDisabled })}>{children}</Bar>
    </Foo>
  )
}
```

### [RAC State Classes](https://react-spectrum.adobe.com/react-aria/styling.html#plugin)

The Core team has implemented the RAC TW plugin with the prefix `dtk`. This means that RAC state based classes are available to utilize.

However, as a best practice, these should be used sparingly. They shouldn't be necessary in most cases and shouldn't be mixed with the primary approach of using TV. But for little one off things like rotating icons or something where implementing TV is overkill, it's acceptable so long as its only 1-2 classes.

Avoid using these classes when a CSS pseudo class alternative is available. Use `hover:bg-normal` instead of `dtk-hover:bg-normal`, or similar with `active`, `disabled`, `focus`, etc.

```jsx
function MyComponent() {
  return (
    <ToggleButton>
      <Icon>
        <MyIcon className="transform group-dtk-selected:rotate-180" />
      <Icon>
    </ToggleButton>
  )
}
```

### [CSS Modules](https://github.com/css-modules/css-modules)

If and when it becomes necessary to create a complex style or a style override that is not possible or practical with TW, implementation of CSS Modules is the preferred solution. Due to all TW classes being assigned a CSS layer, styles written in CSS Modules should not be in a CSS layer so they are gauranteed stylistic priority over TW.

Keep in mind that TW is very flexible and capable, so this should only be a last resort for extremely complex styling scenarios or when absolutely necessary due to integration of a 3rd party library where styles need to be targetted.

Also, when creating reusable styles that accompany a reusable component, make sure that those styles are contained within a CSS layer named "components". This will allow app level overrides to continue to take priority over the base styles.

```jsx
import styles from './styles.css';

function MyComponent({ children, className }: Props) {
  return <div className={clsx(styles.className, className)}>{children}</div>
}
```

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
<div className="[--icon-size:12px]" />

// Good
<div className="[--icon-size:--spacing-m]" />

// Better, keep an eye out for custom utilities
<div className="icon-size-m" />
```

Do not use arbitrary properties unless you're 100% certain (and double checked) that TW & DTK don't provide a utility class. If the styles are sufficiently complex (beyond 1-2 properties) use CSS Modules instead. Use of arbitrary properties for local CSS variables is supported.

```jsx
// Bad
<div className="[background:--color-default-light]" />

// Good
<div className="bg-default-light" />
```

Do not use arbitrary variants, instead use TV and / or RAC state classes.

```jsx
const styles = tv({
  variants: {
    isSelected: {
      true: 'foo'
    }
    size: {
      large: 'bar'
    }
  }
});

function MyComponent({ size }: Props) {
  // Bad
  return (
    <ToggleButton
      className="data-selected:foo data-[size=large]:bar"
      data-size={size}
    />
  );

  // Ok, but custom variants aren't available
  return <ToggleButton className="dtk-selected:foo" />

  // Good, if renderProps from RAC are available (props and internal state can be used too)
  return <ToggleButton className={({ isSelected }) => styles({ size, isSelected })} />

  // Good, if renderProps from RAC are not available
  const [isSelected, setIsSelected] = useState(false);

  return <button className={styles({ size, isSelected })} />
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
          className="[&:nth-child(3n)]:bg-default-dark"
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

Do not include inline logic in your component to determine which classes to add / remove. Instead rely on TV (primary) or `clsx` (fallback, mostly in conjunction with CSS Modules).

```jsx
const styles = tv({
  base: 'foo',
  variants: {
    isDisabled: {
      true: 'bar'
    }
  }
});

function MyComponent({ className, isDisabled }: Props) {
  // Bad
  return <div className={`foo ${isDisabled && 'bar'} ${className}`} />

  // Bad
  return <div className={['foo', isDisabled ? 'bar' : undefined, className].join(' ')} />

  // Bad
  return <div className={clsx(['foo', isDisabled && 'bar', className])} />

  // Ok, if classes are not TW, but will fail to properly merge TW classes
  return <div className={clsx('foo', { bar: isDisabled }, className)} />

  // Good
  return <div className={styles({ className, isDisabled })} />
}
```
