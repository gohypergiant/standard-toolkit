import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { ClassificationBannerClientExample } from './client';

function ClassificationBannerVariants() {
  return (
    <BentoGroup>
      <ClassificationBannerClientExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'ClassificationBanner',
  variantsComponent: ClassificationBannerVariants,
});
