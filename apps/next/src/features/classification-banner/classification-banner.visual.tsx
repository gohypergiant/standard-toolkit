import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { ClassificationBannerClientExample } from './client';

function ClassificationBadgeVariants() {
  return (
    <BentoGroup>
      <ClassificationBannerClientExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'ClassificationBadge',
  variantsComponent: ClassificationBadgeVariants,
});
