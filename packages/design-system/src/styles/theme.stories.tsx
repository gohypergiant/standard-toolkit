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

import { startCase } from 'lodash';
import {
  genericColorVars,
  radiusVars,
  semanticColorVars,
  sizeVars,
} from './theme.css';
import type { Story, StoryDefault } from '@ladle/react';
import type { ReactNode } from 'react';
import type { MapLeafNodes } from '../types/vanilla-extract';

export default {
  title: 'Tokens',
} satisfies StoryDefault;

type ContractMapProps<T, U extends MapLeafNodes<object, T>> = {
  contract: U;
  parents: string[];
  renderLeaf: (key: number | string, value: T, parents: string[]) => ReactNode;
};

function ContractMap<T, U extends MapLeafNodes<object, T>>({
  contract,
  parents,
  renderLeaf,
}: ContractMapProps<T, U>) {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        paddingLeft: '8px',
      }}
    >
      <header style={{ width: '100%' }}>{startCase(parents.at(-1))}</header>
      {Object.entries(contract).map(([key, value]) =>
        typeof value === 'object' ? (
          <ContractMap
            key={[...parents, key, value].join()}
            contract={value}
            parents={[...parents, key]}
            renderLeaf={renderLeaf}
          />
        ) : (
          renderLeaf(key, value, parents)
        ),
      )}
    </div>
  );
}

export const GenericColors: Story = () => (
  <ContractMap
    contract={genericColorVars}
    parents={['genericColorVars']}
    renderLeaf={(key, value, parents) => (
      <div
        key={[...parents, key, value].join()}
        style={{ width: '32px', height: '32px', background: `${value}` }}
        title={[...parents, key].join('.')}
      />
    )}
  />
);

export const SemanticColors: Story = () => (
  <ContractMap
    contract={semanticColorVars}
    parents={['semanticColorVars']}
    renderLeaf={(key, value, parents) => (
      <div
        key={[...parents, key, value].join()}
        style={{ width: '32px', height: '32px', background: `${value}` }}
        title={[...parents, key].join('.')}
      />
    )}
  />
);

export const Radii: Story = () => (
  <ContractMap
    contract={radiusVars}
    parents={['radiusVars']}
    renderLeaf={(key, value, parents) => (
      <div
        key={[...parents, key, value].join()}
        style={{
          width: '32px',
          height: '32px',
          background: 'red',
          borderRadius: `${value}`,
        }}
        title={[...parents, key].join('.')}
      />
    )}
  />
);

export const Sizes: Story = () => (
  <ContractMap
    contract={sizeVars}
    parents={['sizeVars']}
    renderLeaf={(key, value, parents) => (
      <div
        key={[...parents, key, value].join()}
        style={{ width: `${value}`, height: `${value}`, background: 'red' }}
        title={[...parents, key].join('.')}
      />
    )}
  />
);
