'use client';

import { ClassificationBadge } from '@accelint/design-toolkit';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((props, k) => (
    <BentoItem key={k}>
      <ClassificationBadge {...props} />
    </BentoItem>
  ));
}

export function ClassificationBadgeClientExample() {
  return <PropCombos />;
}
