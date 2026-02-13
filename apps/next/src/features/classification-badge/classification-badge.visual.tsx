import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { ClassificationBadgeClientExample } from './client';

function ClassificationBadgeVariants() {
  return (
    <BentoGroup>
      <ClassificationBadgeClientExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'ClassificationBadge',
  variantsComponent: ClassificationBadgeVariants,
});
