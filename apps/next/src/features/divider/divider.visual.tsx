import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { DividerClientExample } from './client';

// divider visual
function DividerVariants() {
  return (
    <BentoGroup>
      <DividerClientExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Divider',
  variantsComponent: DividerVariants,
});
