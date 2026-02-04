import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { BreadcrumbsServerExample } from './server';

function BreadcrumbsVariants() {
  // ?: No variants, should probably rename?
  return (
    <BentoGroup>
      <BreadcrumbsServerExample />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Breadcrumbs',
  variantsComponent: BreadcrumbsVariants,
});
