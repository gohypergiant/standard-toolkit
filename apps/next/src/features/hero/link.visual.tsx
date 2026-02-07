import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { HeroServerExample } from './server';

function HeroVariants() {
  return (
    <BentoGroup>
      <HeroServerExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Hero',
  variantsComponent: HeroVariants,
});
