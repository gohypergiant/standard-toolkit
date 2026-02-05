import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { BreadcrumbsServerExample } from './server';

function BreadcrumbsVariants() {
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
