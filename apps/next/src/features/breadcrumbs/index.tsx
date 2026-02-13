import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { BreadcrumbsExampleServer } from './server';

export function BreadcrumbsExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <BreadcrumbsExampleServer />
      </LoadingComponent>
    </ErrorComponent>
  );
}
