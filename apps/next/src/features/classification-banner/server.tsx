import 'server-only';

import { ClassificationBanner } from '@accelint/design-toolkit';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((props, k) => (
    <BentoItem key={k}>
      <ClassificationBanner {...props} />
    </BentoItem>
  ));
}

export function ClassificationBannerServerExample() {
  return <PropCombos />;
}
