import 'server-only';

import { Link } from '@accelint/design-toolkit';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((props, k) => (
    <BentoItem key={k}>
      <Link {...props}>This is an example link.</Link>
    </BentoItem>
  ));
}

export function LinkServerExample() {
  return <PropCombos />;
}
