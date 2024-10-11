import type { Story, StoryDefault } from '@ladle/react';
import { headings, bodies } from './typography.css';

export default {
  title: 'Primitives',
} satisfies StoryDefault;

export const Headings: Story = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <header>Headings</header>
    {Object.entries(headings).map(([key, value]) => (
      <div key={key} className={value} title={`headings.${key}`}>
        Heading {key}
      </div>
    ))}
  </div>
);

Headings.storyName = 'Typography / Headings';

export const Bodies: Story = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <header>Bodies</header>
    {Object.entries(bodies).map(([key, value]) => (
      <div key={key} className={value} title={`bodies.${key}`}>
        Body {key}
      </div>
    ))}
  </div>
);

Bodies.storyName = 'Typography / Bodies';
