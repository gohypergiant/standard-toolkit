/*
 * Copyright 2025 Hypergiant Galactic Systems Inc. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import { surfaces } from './surfaces.css';
import { genericColorVars } from './theme.css';
import type { Story, StoryDefault } from '@ladle/react';

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
