import 'server-only';

import { BreadcrumbItem, Breadcrumbs } from '@accelint/design-toolkit';
import { BentoItem } from '~/components/bento';

export function BreadcrumbsServerExample() {
  return (
    <BentoItem>
      <Breadcrumbs>
        <BreadcrumbItem>This is an item.</BreadcrumbItem>
        <BreadcrumbItem>This is another item.</BreadcrumbItem>
      </Breadcrumbs>
    </BentoItem>
  );
}
