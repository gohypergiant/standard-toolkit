import 'server-only';

import { Breadcrumbs } from '@accelint/design-toolkit/components/breadcrumbs';
import { BreadcrumbItem } from '@accelint/design-toolkit/components/breadcrumbs/item';
import { BentoItem } from '~/components/bento';

export function BreadcrumbsExampleServer() {
  return (
    <BentoItem>
      <Breadcrumbs>
        <BreadcrumbItem>This is an item.</BreadcrumbItem>
        <BreadcrumbItem>This is another item.</BreadcrumbItem>
      </Breadcrumbs>
    </BentoItem>
  );
}
