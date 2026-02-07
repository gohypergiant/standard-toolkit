import 'server-only';
import { ErrorComponent } from './error';
import { LoadingComponent } from './loading';
import { BreadcrumbsServerExample } from './server';

export function LinkExample() {
  return (
    <ErrorComponent>
      <LoadingComponent>
        <BreadcrumbsServerExample />
      </LoadingComponent>
    </ErrorComponent>
  );
}
