import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { LinkServerExample } from './server';

function LinkVariants() {
  return (
    <BentoGroup>
      <LinkServerExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Link',
  variantsComponent: LinkVariants,
});
