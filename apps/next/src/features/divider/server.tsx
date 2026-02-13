'use client';

import { Divider } from '@accelint/design-toolkit';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((props, k) => (
    <BentoItem key={k}>
      <Divider {...props} />
    </BentoItem>
  ));
}

export function DividerClientExample() {
  return <PropCombos />;
}
