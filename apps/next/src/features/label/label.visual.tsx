import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { LabelClientExample } from './client';

function LabelVariants() {
  return (
    <BentoGroup>
      <LabelClientExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Label',
  variantsComponent: LabelVariants,
});
