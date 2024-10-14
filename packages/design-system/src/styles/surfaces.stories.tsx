import type { Story, StoryDefault } from '@ladle/react';
import { surfaces } from './surfaces.css';
import { genericColorVars } from './theme.css';

export default {
  title: 'Primitives',
} satisfies StoryDefault;

export const Surfaces: Story = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <header>Default</header>
    <div
      style={{
        width: '96px',
        height: '96px',
        position: 'relative',
        background: genericColorVars.neutral.v02,
      }}
    >
      <div
        className={surfaces.default.flush}
        title='surfaces.default.flush'
        style={{
          width: '32px',
          height: '32px',
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div className={surfaces.raised.flush} style={{ height: '4px' }} />
        <div className={surfaces.raised.flush} style={{ height: '4px' }} />
        <div className={surfaces.raised.flush} style={{ height: '4px' }} />
        <div className={surfaces.raised.flush} style={{ height: '4px' }} />
      </div>
      <div
        className={surfaces.raised.proud}
        title='surfaces.raised.proud'
        style={{
          width: '32px',
          height: '32px',
          position: 'absolute',
          top: '32px',
          left: '32px',
        }}
      />
      <div
        className={surfaces.overlay.proud}
        title='surfaces.overlay.proud'
        style={{
          width: '32px',
          height: '32px',
          position: 'absolute',
          top: '48px',
          left: '48px',
        }}
      />
    </div>
    <header>Over Map</header>
    <div
      style={{
        width: '96px',
        height: '96px',
        position: 'relative',
        background: genericColorVars.condition.affirmative.v2,
      }}
    >
      <div
        className={surfaces.default.proud}
        title='surfaces.default.proud'
        style={{
          width: '32px',
          height: '32px',
          position: 'absolute',
          top: '16px',
          left: '16px',
          padding: '4px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div className={surfaces.raised.flush} style={{ height: '4px' }} />
        <div className={surfaces.raised.flush} style={{ height: '4px' }} />
        <div className={surfaces.raised.flush} style={{ height: '4px' }} />
        <div className={surfaces.raised.flush} style={{ height: '4px' }} />
      </div>
      <div
        className={surfaces.raised.proud}
        title='surfaces.raised.proud'
        style={{
          width: '32px',
          height: '32px',
          position: 'absolute',
          top: '32px',
          left: '32px',
        }}
      />
      <div
        className={surfaces.overlay.proud}
        title='surfaces.overlay.proud'
        style={{
          width: '32px',
          height: '32px',
          position: 'absolute',
          top: '48px',
          left: '48px',
        }}
      />
    </div>
  </div>
);
