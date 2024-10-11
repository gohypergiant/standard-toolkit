import type { Story, StoryDefault } from '@ladle/react';
import { startCase } from 'lodash';
import type { ReactNode } from 'react';
import type { MapLeafNodes } from '../types';
import {
  genericColorVars,
  semanticColorVars,
  radiusVars,
  sizeVars,
} from './theme.css';

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
