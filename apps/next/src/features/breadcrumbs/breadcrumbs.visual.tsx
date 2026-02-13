import { BentoGroup } from '~/components/bento';
import { createVisualTests } from '~/visual-regression/vitest';
import { BreadcrumbsExampleServer } from './server';

function BreadcrumbsVariants() {
  return (
    <BentoGroup>
      <BreadcrumbsExampleServer />
    </BentoGroup>
  );
}

createVisualTests({
  componentName: 'Breadcrumbs',
  variantsComponent: BreadcrumbsVariants,
});
