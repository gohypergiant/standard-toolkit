import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { ClassificationBannerServerExample } from './server';

function ClassificationBadgeVariants() {
  return (
    <BentoGroup>
      <ClassificationBannerServerExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'ClassificationBadge',
  variantsComponent: ClassificationBadgeVariants,
});
