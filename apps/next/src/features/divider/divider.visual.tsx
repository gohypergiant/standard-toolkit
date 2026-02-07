import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { DividerServerExample } from './server';

// divider visual
function DividerVariants() {
  return (
    <BentoGroup>
      <DividerServerExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Divider',
  variantsComponent: DividerVariants,
});
