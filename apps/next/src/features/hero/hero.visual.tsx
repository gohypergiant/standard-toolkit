import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { HeroClientExample } from './client';

function HeroVariants() {
  return (
    <BentoGroup>
      <HeroClientExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Hero',
  variantsComponent: HeroVariants,
});
