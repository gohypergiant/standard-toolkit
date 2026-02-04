import { Label } from '@accelint/design-toolkit';
import { BentoItem } from '~/components/bento';
import { PROP_COMBOS } from './variants';

function PropCombos() {
  return PROP_COMBOS.map((props, k) => (
    <BentoItem key={k}>
      <Label {...props}>This is an example label.</Label>
    </BentoItem>
  ));
}

export function LabelServerExample() {
  return <PropCombos />;
}
