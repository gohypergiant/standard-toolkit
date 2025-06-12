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

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { containsExactChildren } from '@/lib/react';
import type { ReactNode } from 'react';

const TestParent = ({ children }: { children: ReactNode}) => {
  containsExactChildren({
    children,
    componentName: TestParent.displayName,
    restrictions: {
      [TestChild.displayName]: { min: 1, max: 1 },
    },
  });

  return ( <div>{ children }</div> );
};

TestParent.displayName = 'TestParent';

const TestChild = () => {
  return ( <p>Child Component</p> );
};

TestChild.displayName = 'TestChild';

describe('containsExactChildren', () => {
  it('should render when given proper structure', () => {
    render(
      <TestParent>
        <TestChild />
      </TestParent>
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('should not render when minimum children is not met', async () => {
    // biome-ignore lint/suspicious/useAwait: You must provide a Promise to expect() when using .rejects
    async function minNotMet() {
      render(
        <TestParent>
          <p>Incorrect Child Component</p>
        </TestParent>
      )
    }

    await expect(minNotMet()).rejects.toThrow(`Missing the following:\n\t\t1 of <${TestChild.displayName}>`);
  });

  it('should not render when maximum children is exceeded', async () => {
    // biome-ignore lint/suspicious/useAwait: You must provide a Promise to expect() when using .rejects
    async function maxExceeded() {
      render(
        <TestParent>
          <TestChild />
          <TestChild />
        </TestParent>
      )
    }

    await expect(maxExceeded()).rejects.toThrow(`Excess of the following:\n\t\t1 of <${TestChild.displayName}>`);
  });
});
