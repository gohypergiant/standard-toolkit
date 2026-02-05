import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { ClassificationBadgeServerExample } from './server';

function ClassificationBadgeVariants() {
  return (
    <BentoGroup>
      <ClassificationBadgeServerExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'ClassificationBadge',
  variantsComponent: ClassificationBadgeVariants,
});
