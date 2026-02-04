import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { LabelServerExample } from './server';

// divider visual
function LabelVariants() {
  return (
    <BentoGroup>
      <LabelServerExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Label',
  variantsComponent: LabelVariants,
});
