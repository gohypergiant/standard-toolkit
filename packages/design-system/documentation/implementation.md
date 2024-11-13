# Using the C2 Design System

## Overview

Welcome to the C2 Design System (C2DS) implementation guide. If you haven't already read [why we built this system](../README.md#why-does-this-design-system-exist) or looked over the [concept docs](./concepts.md), you might want to familiarize yourself with those first before digging into the implementation. Having a good grounding in the architecture and foundational libraries will smooth the process of building and integrating this system into an application.

This guide has four sections:

[1. Previewing and exploring components](#components)

[2. Building and applying styles](#styles)

[3. Theming an application](#theming)

[4. Advanced Customization and Reuse](#advanced-customization-and-reuse)

## Components

For the most part, once theming has been established in an application, using the C2DS components should be comparable to any other component library -- import the component and provide props, styling and behavior. The most notable difference is that C2DS favors component composition over complex, specialized components with a million props. Ideally, the C2DS library provides enough atomic granularity and flexibility that any UI can be composed of the component parts.

### Previewing components with stories

The simplest way to familiarize yourself with the available components and their usage is to review the [C2DS Stories](https://gohypergiant.github.io/standard-toolkit). You can also [run the stories locally](../README.md#getting-started) in [Ladle](https://ladle.dev/), which is similar to Storybook. It uses mocked props to demonstrate how to theme, compose and use C2DS components. It serves as a way to explore functionality and to document capabilities.

To run the stories from the command line, run the following to start the preview:

```
npm run preview -w @cbc2/c2-design-system
```

### Props and source code spelunking

The ladle stories render a story in the main stage and a menu to the right for navigation. The stories demonstrate and catalog design tokens, primitives (like typography), hooks and components. These sections will grow as resources are added to C2DS.

Clicking on any child in the
`Components` list and hovering over the icons at the bottom of your screen will show additional tools. The left-most icon opens a control panel demonstrating some characteristic properties a component can receive. Editing the props in the control panel will change the props passed into the components.

There are often props available for the C2DS components that are not represented in the story. However, the [React Aria Component (RAC) documentation](https://react-spectrum.adobe.com/react-aria/Button.html) is an additional, valuable source of information about what props the component can receive (among other information). It is highly recommended that you make use of this resource to research more specific or targeted questions.

Reviewing the source code for the story will also provide a handy example for common use cases. From a component's story in Ladle, you can click on the
`</>` icon to see the source code. If you prefer, you can open the story source in an editor. All of the source code for the C2DS is located in
`packages/c2-design-system`.

Components and the source for their stories are in their own folders in the [
`packages/design-system/src/components`](../src/components). Stories will have a
`.stories.tsx` extension.

### Import and Composition

The import for the components will be from
`@cbc2/c2-design-system`. This is important to notice because there might be overlap in naming from other component systems like MUI.

Another important detail is that, because this design system favors composition over "mega-component" behavior, you might find yourself looking for a prop when the component is expecting a child component composed in. You will see examples of composition throughout the C2DS stories. The [
`<Checkbox/>` component story file](../src/components/checkbox/checkbox.stories.tsx) is one example that uses a combination of the C2DS
`<Checkbox/>`, `<CheckboxGroup/>` and `<Icon/>` components while relying on `<AriaText/>`and
`<AriaLabel/>` components for the group label and individual checkbox label text. This pattern is typical and will be how you organize your components as well.

The stories will be your best source of information about how to build. You can also look at examples on the [React Aria components documentation](https://react-spectrum.adobe.com/react-aria/components.html). If you try and use a child component that is not supported by the C2DS component, you may get unexpected results -- however, experimentation and creative composition are encouraged.

## Styles

### Style Objects

We are using [Vanilla Extract](https://vanilla-extract.style/) as the style engine, which provides type-safe and scoped classes at compile time. To define a style in VE, it is expressed as a style object passed into the
`style()` function exported by VE. The simplest syntax looks like this:

```tsx
// styles.css.ts
const shout = style({
  color: 'red',
  textTransform: 'uppercase',
});
```

Styles are defined in typescript files that have a
`css.ts` extension -- those will be recognized and compiled into classes for use in the application. The
`style` function, and most everything else from VE, can only be used inside a
`*.css.ts` file and will cause an error otherwise. To use the style objects in a component or a div, import it as you would any other object. Note that like other imports, the
`ts` gets dropped so the file will look like a `css` file in the import.

```tsx
// component.tsx
import {shout} from './styles.css';

export function Component() {
  return <div className={shout}>Foo! Bar!</div>;
}
```

To understand more of the functionality and features that Vanilla Extract can provide -- for example pseudo-selectors or more complex selectors, [use their documentation](https://vanilla-extract.style/documentation/api/style/). For more complex behavior, you can use [container-style queries](https://developer.mozilla.org/en-US/docs/Web/CSS/@container#container_style_queries) and [layers](#controlling-precedence-and-css-cascade), but it will most likely not be required for day to day use unless you are building reusable components for use throughout the application.

### Styles in C2DS Components

C2DS components will already have the default styling that is provided for them through the theming. However, if you need to adjust styles for instances of C2DS components, you can define styles in the same way as above, with the advantage of those styles being typed. The components in our design system all have a
`classNames` prop rather than `className` -- note the `s` on the end.

You can also reuse css vars that have been defined in the theme to apply to specific elements.

For example, the `Menu` component exports a
`MenuClassNames` type that includes properties to style elements of the menu. You might define a stylesheet similar to the following, and the style you define will be applied to the correct DOM elements:

```tsx
// exampleMenu.css.ts
import {style} from '@vanilla-extract/css';
import {menuColorVars} from '@cbc2/c2-design-system';

export const menuClassNames = {
  item: {
    item: {
      background: menuColorVars.item.background,
    },
    description: style({
      textTransform: 'uppercase',
    }),
  },
};
```

```tsx
// menu.tsx
import {Button, Menu, MenuItem, MenuList} from '@cbc2/c2-design-system';
import {MenuTrigger} from 'react-aria-components';
import {menuClassNames} from './exampleMenu.css';

export function Menu() {
  return (
    <MenuTrigger>
      <Button>Menu </Button>
      <Menu classNames={menuClassNames}>
        <MenuList>
          <MenuItem>COP </MenuItem>
        </MenuList>
      </Menu>
    </MenuTrigger>
  );
}
```

As a debugging tool, the inspector from Chrome dev tools can show you exactly what styles are being applied to each element in the component.

### Colors / Palette

Colors and palette are established within your application theme but we've provided values in alignment with the N2X Figma designs that you can use to get started. See the
`semanticColorVars`, `genericColorVars`, and `elevationVars` within [
`src/styles/theme.css.ts`](../src/styles/theme.css.ts) and in the Ladle preview `Tokens` and`Primitives` sections.

### Size / Spacing

Sizing and spacing is also aided by C2DS `sizeVars` and `spaceVars`. Check out [
`src/styles/theme.css.ts`](../src/styles/theme.css.ts) for more specific information on `sizeVars` and
`spaceVars` and see how space vars are applied globally in [`src/styles/space.css.ts`](../src/styles/space.css.ts).

### Icons

C2DS does not provide any icons and is explicitly icon library agnostic, meaning you can use whichever icon library your application requires. The C2DS
`<Icon/>` component wraps an
`SVG` in an easy to size, themed wrapper that makes it easy to compose into other patterns as needed.

## Theming

### Overview

At it's simplest, theming is the process of "skinning" specific brand, design and behavior requirements onto the C2DS for application use. This includes establishing design tokens such as color and typography as well as standards for spacing, border radius and other shared primitives. Theming also involves crafting the style and state-based behavior for the C2DS components (for example, defining what
`onSelect()` or `isDisabled`, etc. means visually). As another example, the
`<Button/>` component would need to define styles for each of the different variants -- `solid`, `icon`,
`floating`, etc.

It is important to recognize that, in an effort to be flexible and unopinionated, the C2DS system does not ship with most theming defaults. The tradeoff of this flexibility is slightly more set up for initial integration.

### Theming model

In the interest of speeding up the theming process and demonstrating usage, a complete theme has been provided by the Ladle stories. This theme is crafted following the Jeric2o design standards in the [N2X Design System documentation in Figma](https://www.figma.com/design/CoNlAMPL0u5DCVYRPQKhki/N2X-Design-System?node-id=30747-218609&t=E2bpJjsEDp7NwjyF-0). While this theme may not apply for your specific application use case, it can serve as a template or model to avoid starting from scratch.

Check out the [
`.ladle/components.tsx`](../.ladle/components.tsx) file for an example of how to setup the root of your application theme.

Additionally, basic defaults for a CSS reset, spacing, and typography can be imported directly if no customization is required. The [
`.ladle/components.css.ts`](../.ladle/components.css.ts) file demonstrates how those can be used and global styles established. Any of these defaults can also be overridden.

### Defining styles

C2DS requires you to provide a theme for each component used within your application written in the style of [Vanilla Extract (VE)](https://vanilla-extract.style/). The theme for each component is typed, which will let you know what classNames are available for that particular component. For example, the
`<Button/>` component [defines two classNames](../src/components/button/types.ts): `container` and `button`. None of the
`classNames` are required, but without styles the component may not be visible.

For C2DS, we rarely assign a one-off style like this unless it is required by a specialized use case. Instead, we use the style object to assign CSS vars to the theme contract as defined for that component using helper utilities designed to keep that assignment type safe.

```tsx
exampleClassName: style(
  applyThemeVars<ExampleState>(ExampleStateVars, [
    {
      query: {isSelected: true},
      vars: assignPartialVars(exampleColorVars, {
        border: genericColorVars.neutral.v01,
        background: genericColorVars.neutral.v10,
      }),
    },
  ])
);
```

Here, we are building a style object via the [
`applyThemeVars()`](../src/utils/css.ts#L387) utility that takes a theme contract and an array of styles to be built. The styles can either assign CSS vars globally or build a container query to assign vars under specific conditions. The [
`assignPartialVars()`](../src/utils/css.ts#L143) utility takes a theme contract and a collection of CSS vars and reduces them into VE-friendly var assignments.

### Design Tokens

Notice that the previous example, the CSS vars are referencing a globally defined theme contract
`genericColorVars`. These can be imported with the defaults provided by C2DS or overriden with your own theming colors.

The contract and the default values are available for reference in the [
`theme.css.ts`](../src/styles/theme.css.ts) file. They are also able to be reviewed in the Ladle Tokens section.

In addition to default colors, C2DS also exports contracts and defaults for global typography, spacing, surfaces, border radius and sizing. The application can choose to use these defaults (or a portion of them) or to replace them entirely using different values. The contracts themselves cannot be changed, but they can be extended if necessary.

### Fonts / Typography

By default, C2DS is font family agnostic. You will set the font family in your application theme.

See [../.ladle/components.css.ts](../.ladle/components.css.ts) where the Ladle theme establishes mono and sans vars like so:

```tsx
export const vars: ThemeVars = {
  typography: createTheme(typographyVars, {
    ...defaultTypographyVarValues,
    mono: `'Roboto MonoVariable', monospace`,
    sans: `'Roboto FlexVariable', sans-serif`,
  }),
};
```

Notice that `createTheme()` takes in the `typographyVars` contract as a first argument. Head over to [
`src/styles/theme.css.ts`](../src/styles/theme.css.ts) to see how the theme contract is created and then populated with default values, and then the defaults gain more specificity in [
`typography.css.ts`](../src/styles/typography.css.ts)

You can see a few examples of the typography styles in the `Primitives` section of the Ladle preview.

### Controlling precedence and CSS cascade

C2DS relies on the [
`@layer` CSS rule](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) to declare cascading layers and provide durable and consistent style overrides. The system provides a hierarchical ranking of layers that styles are assigned to which allows for two identical selectors to have a deterministic cascade.

[Learn](./concepts.md#layers) more about layers.

It's important to understand how the components are implemented in C2DS to know how to provide the correct overrides for your particular theme. Most of the time you should only need to apply a level 1 style to your component, but in more complex components, you might need to override default styles for the lower level components that compose the parent.

For example, take a look at the `<SearchField/>` component by booting up the Ladle preview
`npm run preview -w @cbc2/c2-design-system` and opening the following files:

- [.ladle/theme/search-field.css](../.ladle/theme/search-field.css.ts)
- [src/components/search-field/search-field.css](../src/components/search-field/search-field.css.ts)
- [src/components/search-field/search-field.stories.tsx](../src/components/search-field/search-field.stories.tsx)

> **Note:** You can also see the source code of the
> `.stories` file for any component from the Ladle preview by clicking on the
> `</>` icon at the bottom of that component's preview page.

In the Ladle theme CSS file
`.ladle/theme/search-field.css` (some version of which you will need to create to integrate each C2DS component into your app, notice that the
`input.sizer` style rule provides an optional final argument `layers.variables.l2` to `applyThemeVars()`.

Now take a look at the component CSS and stories files (`src/components/search-field/search-field.css` and
`src/components/search-field/search-field.stories.tsx`), and notice a few things:

1. Each element in the story examples is a C2DS component and has a corresponding CSS className style. The top-level
   `<SearchField/>` component corresponds to the `container` className, `<Group/>` gets
   `group`, etc. You can see how these are applied via React Context Providers within `search-field.tsx`.

2. Each className style declares the `@layer` rule and provides a key that corresponds to a level of specificity.

3. The `container` and `group` classNames have the lowest specificity value of
   `l1`. Because this is the default, you don't need to provide that optional final argument in your theme when styling level 1 classNames (see the
   `group` style in [`.ladle/theme/search-field`](../.ladle/theme/search-field.css.ts)).

4. The `icon`, `input`, and `clear` classNames have a nested structure which corresponds to the setup of the lower level
   `<Icon/>`, `<Input/>` and `<Button/>` components. They also have the higher specificity key of `l2`.

Now take a look at how the `<Icon/>`, `<Input/>`, and `<Button/>` components are themed and styled. In the
`src/components/search-field.css` classNames, we're specifically targeting the pieces of the `<Icon/>`, `<Input/>`, and
`<Button/>` classNames that need to be overridden to match the Figma component requirements. Because the
`input.sizer` and `input.input` classNames used the specificity key of `l2` in `src/components/search-field.css`, the
`theme/search-field.css` also has to use a higher specificity for any overrides.

## Advanced Customization and Reuse

### Building specialized application components

If the existing components don't meet your needs, it is also possible to compose and theme using the React Aria components directly or to use the [extensive collection of hooks](https://react-spectrum.adobe.com/react-aria/hooks.html) for more granular control. If you find that you are building a component that might be useful to other applications, consider [adding it to the C2DS system](./contribution.md).

### Setting library component defaults

It is possible to set component defaults that will apply globally to that component in your application (if there are no other props that take precedence) by setting context values into the
`<DefaultsProvider/>`. These will later be incorporated into the props of the components via the
`useDefaults()` hook. You can find an example of this in the example Ladle theme here: [
`components.tsx`](../.ladle/components.tsx).

[Learn](./concepts.md#default-props) more about prop merging and context.

### Slots

Slots are a way to provide different context values to multiple instances of a component composed into a larger design. Slots are essentially named children that can then receive divergent props, despite being the same component. An example of this can be seen in the [
`<Dialog/>`](../src/components/dialog/dialog.tsx) component that composes multiple
`<Element/>` instances as a part of the design, named `header`, `content`, `footer`. Even though these are all
`<Element/>` components, they are matched with their slot name and receive different context props.

[Learn](./concepts.md#slots) more about how slots work.

### useTheme Hook

If you need to access the globally defined theme, you can use the [
`useTheme()`](../src/hooks/use-theme/use-theme.tsx) hook. This hook, which delivers the theme
`classNames` for use in corresponding components, also allows for the reuse of CSS contracts to gain access to tokens within React.

There are other utility hooks but they are geared primarily towards contributing components to C2DS.

## Reporting Bugs and Getting Help

As you are building, if you find yourself with a question that hasn't been answered in this guide or a suggestion on how to improve things, post it to the [JERIC2O Dev Design System](https://gov.teams.microsoft.us/l/channel/19%3Agcch%3A639df438635f4987be31f238d9a19a77%40thread.tacv2/Design%20System%20Help?groupId=9415d95c-3bfb-4c60-96c0-31befc938bcc) channel.
